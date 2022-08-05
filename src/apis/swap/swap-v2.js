import CONFIG from '../../config/config';
import axios from 'axios';
import { MichelsonMap, TezosToolkit, OpKind } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import { newton_dx_to_dy } from '../stableswap/stableswap';
import { isTokenPairStable } from '../Liquidity/Liquidity';
import { getUserBalanceByRpcWithoutDecimal } from '../swap/swap';
import BigNumber from 'bignumber.js';
import { RPC_NODE } from '../../constants/localStorage';
/**
 * Loads swap related data to perform calculation using RPC
 * @param tokenIn - token which user wants to sell, case-sensitive to CONFIG
 * @param tokenOut - token which user wants to get, case-sensitive to CONFIG
 */
export const loadSwapData = async (tokenIn, tokenOut) => {
  const connectedNetwork = CONFIG.NETWORK;
  const amm_type = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].type;
  try {
    if (amm_type === 'xtz') {
      const connectedNetwork = CONFIG.NETWORK;
      // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
      const dexContractAddress =
        CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
      const ctez = CONFIG.CTEZ[connectedNetwork];
      const Tezos = new TezosToolkit(rpcNode);
      const dexContractInstance = await Tezos.contract.at(dexContractAddress);
      const dexStorage = await dexContractInstance.storage();
      let tezPool = await dexStorage.tezPool;
      let exchangeFee = await dexStorage.lpFee;
      exchangeFee = 1 / exchangeFee;
      tezPool = tezPool.toNumber();
      let ctezPool = await dexStorage.ctezPool;
      ctezPool = ctezPool.toNumber();
      let lpTokenSupply = await dexStorage.lqtTotal;
      lpTokenSupply = lpTokenSupply.toNumber() / 10 ** 6;
      const lpToken =
        CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
      const ctezStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/${ctez}/storage`;
      const ctezStorage = await axios.get(ctezStorageUrl);
      const target = ctezStorage.data.args[2].int;
      let tokenIn_supply = 0;
      let tokenOut_supply = 0;
      if (tokenIn === 'ctez') {
        tokenIn_supply = ctezPool / 10 ** 6;
        tokenOut_supply = tezPool / 10 ** 6;
      } else {
        tokenIn_supply = tezPool / 10 ** 6;
        tokenOut_supply = ctezPool / 10 ** 6;
      }
      return {
        success: true,
        tokenIn,
        tokenIn_supply,
        tokenOut,
        tokenOut_supply,
        exchangeFee,
        tokenOutPerTokenIn: 0,
        lpTokenSupply,
        lpToken,
        target,
        amm_type,
      };
    } else if (amm_type === 'veAMM') {
      const connectedNetwork = CONFIG.NETWORK;
      // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
      const dexContractAddress = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
      const Tezos = new TezosToolkit(rpcNode);
      const dexContractInstance = await Tezos.contract.at(dexContractAddress);
      const dexStorage = await dexContractInstance.storage();
      const lpFee = await dexStorage.lpFee;
      const token1_pool = await dexStorage.token1_pool;
      const token2_pool = await dexStorage.token2_pool;
      let lpTokenSupply = await dexStorage.totalSupply;
      const lpToken = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
      let tokenIn_supply = 0;
      let tokenOut_supply = 0;
      if (CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].property === 'token2_pool') {
        tokenOut_supply = token2_pool;
        tokenIn_supply = token1_pool;
      } else {
        tokenOut_supply = token1_pool;
        tokenIn_supply = token2_pool;
      }

      const tokenIn_Decimal = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL;
      const tokenOut_Decimal = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL;
      const liquidityToken_Decimal =
        CONFIG.AMM[connectedNetwork][
          CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken
        ].TOKEN_DECIMAL;

      tokenIn_supply = tokenIn_supply / Math.pow(10, tokenIn_Decimal);
      tokenOut_supply = tokenOut_supply / Math.pow(10, tokenOut_Decimal);
      lpTokenSupply = lpTokenSupply / Math.pow(10, liquidityToken_Decimal);
      const exchangeFee = 1 / lpFee;
      const tokenOutPerTokenIn = tokenOut_supply / tokenIn_supply;
      return {
        success: true,
        tokenIn,
        tokenIn_supply,
        tokenOut,
        tokenOut_supply,
        exchangeFee,
        tokenOutPerTokenIn,
        lpTokenSupply,
        lpToken,
        amm_type,
      };
    } else if (amm_type === 'veStableAMM') {
      const connectedNetwork = CONFIG.NETWORK;
      // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
      const dexContractAddress =
        CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
      const Tezos = new TezosToolkit(rpcNode);
      const dexContractInstance = await Tezos.contract.at(dexContractAddress);
      const dexStorage = await dexContractInstance.storage();

      const token1_pool = await dexStorage.token1Pool.toNumber();
      const token1_precision = await dexStorage.token1Precision.toNumber();

      const token2_pool = await dexStorage.token2Pool.toNumber();
      const token2_precision = await dexStorage.token2Precision.toNumber();

      let tokenIn_supply = 0;
      let tokenOut_supply = 0;
      let tokenIn_precision = 0;
      let tokenOut_precision = 0;
      if (CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].property === 'token2_pool') {
        tokenOut_supply = token2_pool;
        tokenOut_precision = token2_precision;
        tokenIn_supply = token1_pool;
        tokenIn_precision = token1_precision;
      } else {
        tokenOut_supply = token1_pool;
        tokenOut_precision = token1_precision;
        tokenIn_supply = token2_pool;
        tokenIn_precision = token2_precision;
      }
      const lpFee = await dexStorage.lpFee;
      const exchangeFee = lpFee.toNumber();
      const lpTokenSupply = await dexStorage.lqtTotal.toNumber();
      const lpToken =
        CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
      const tokenOutPerTokenIn = tokenOut_supply / tokenIn_supply;
      return {
        success: true,
        tokenIn,
        tokenIn_supply,
        tokenOut,
        tokenOut_supply,
        exchangeFee,
        tokenOutPerTokenIn,
        lpTokenSupply,
        lpToken,
        tokenIn_precision,
        tokenOut_precision,
        amm_type,
      };
    } else {
      const connectedNetwork = CONFIG.NETWORK;
      // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];

      const dexContractAddress = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;

      const storageResponse = await axios.get(
        `${rpcNode}chains/main/blocks/head/context/contracts/${dexContractAddress}/storage`,
      );

      const systemFee = storageResponse.data.args[0].args[1].args[1].int;
      const lpFee = storageResponse.data.args[0].args[0].args[0].args[1].int;
      const token1_pool = storageResponse.data.args[1].args[1].int;
      const token2_pool = storageResponse.data.args[4].int;
      let lpTokenSupply = storageResponse.data.args[5].int;
      const lpToken = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
      let tokenIn_supply = 0;
      let tokenOut_supply = 0;
      if (CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].property === 'token2_pool') {
        tokenOut_supply = token2_pool;
        tokenIn_supply = token1_pool;
      } else {
        tokenOut_supply = token1_pool;
        tokenIn_supply = token2_pool;
      }
      const tokenIn_Decimal = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL;
      const tokenOut_Decimal = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL;
      const liquidityToken_Decimal =
        CONFIG.AMM[connectedNetwork][
          CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken
        ].TOKEN_DECIMAL;
      tokenIn_supply = tokenIn_supply / Math.pow(10, tokenIn_Decimal);
      tokenOut_supply = tokenOut_supply / Math.pow(10, tokenOut_Decimal);
      lpTokenSupply = lpTokenSupply / Math.pow(10, liquidityToken_Decimal);
      const exchangeFee = 1 / lpFee + 1 / systemFee;
      const tokenOutPerTokenIn = tokenOut_supply / tokenIn_supply;
      return {
        success: true,
        tokenIn,
        tokenIn_supply,
        tokenOut,
        tokenOut_supply,
        exchangeFee,
        tokenOutPerTokenIn,
        lpTokenSupply,
        lpToken,
        amm_type,
      };
    }
  } catch (error) {
    console.error({ message: 'swap data error', error });
    return {
      success: true,
      tokenIn,
      tokenIn_supply: 0,
      tokenOut,
      tokenOut_supply: 0,
      exchangeFee: 0,
      tokenOutPerTokenIn: 0,
      lpTokenSupply: 0,
      lpToken: null,
    };
  }
};
const calculateTokensOutStable = (
  tezSupply,
  ctezSupply,
  tokenIn_amount,
  pair_fee_denom,
  slippage,
  target,
  tokenIn,
) => {
  tokenIn_amount = tokenIn_amount * 10 ** 6;
  try {
    if (tokenIn === 'ctez') {
      const dy =
        newton_dx_to_dy(target * ctezSupply, tezSupply * 2 ** 48, tokenIn_amount * target, 5) /
        2 ** 48;
      let fee = dy / pair_fee_denom;
      let tokenOut = dy - fee;
      let minimumOut = tokenOut - (slippage * tokenOut) / 100;
      minimumOut = minimumOut / 10 ** 6;

      const updated_Ctez_Supply = ctezSupply + tokenIn_amount;
      const updated_Tez_Supply = tezSupply - tokenOut;

      const next_dy =
        newton_dx_to_dy(
          target * updated_Ctez_Supply,
          updated_Tez_Supply * 2 ** 48,
          tokenIn_amount * target,
          5,
        ) /
        2 ** 48;
      const next_fee = next_dy / pair_fee_denom;
      const next_tokenOut = next_dy - next_fee;
      let priceImpact = (tokenOut - next_tokenOut) / tokenOut;
      priceImpact = priceImpact * 100;
      priceImpact = priceImpact.toFixed(5);
      priceImpact = Math.abs(priceImpact);
      tokenOut = tokenOut / 10 ** 6;
      fee = fee / 10 ** 6;

      return {
        tokenOut_amount: tokenOut.toFixed(6),
        fees: fee,
        minimum_Out: minimumOut.toFixed(6),
        priceImpact: priceImpact,
      };
    } else if (tokenIn === 'tez') {
      const dy =
        newton_dx_to_dy(tezSupply * 2 ** 48, target * ctezSupply, tokenIn_amount * 2 ** 48, 5) /
        target;
      let fee = dy / pair_fee_denom;
      let tokenOut = dy - fee;
      let minimumOut = tokenOut - (slippage * tokenOut) / 100;
      minimumOut = minimumOut / 10 ** 6;

      const updated_Ctez_Supply = ctezSupply - tokenOut;
      const updated_Tez_Supply = tezSupply + tokenIn_amount;

      const next_dy =
        newton_dx_to_dy(
          updated_Tez_Supply * 2 ** 48,
          target * updated_Ctez_Supply,
          tokenIn_amount * 2 ** 48,
          5,
        ) / target;
      const next_fee = next_dy / pair_fee_denom;
      const next_tokenOut = next_dy - next_fee;
      let priceImpact = (tokenOut - next_tokenOut) / tokenOut;
      priceImpact = priceImpact * 100;
      priceImpact = priceImpact.toFixed(5);
      priceImpact = Math.abs(priceImpact);
      tokenOut = tokenOut / 10 ** 6;
      fee = fee / 10 ** 6;
      return {
        tokenOut_amount: tokenOut.toFixed(6),
        fees: fee,
        minimum_Out: minimumOut.toFixed(6),
        priceImpact: priceImpact,
      };
    }
  } catch (error) {
    return {
      tokenOut_amount: 0,
      fees: 0,
      minimum_Out: 0,
      priceImpact: 0,
    };
  }
};
const calculateTokensOutGeneralStable = (
  tokenIn_supply,
  tokenOut_supply,
  tokenIn_amount,
  Exchangefee,
  slippage,
  tokenIn,
  tokenOut,
  tokenIn_precision,
  tokenOut_precision,
) => {
  const connectedNetwork = CONFIG.NETWORK;
  tokenIn_amount =
    tokenIn_amount * 10 ** CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL;
  try {
    tokenIn_supply *= tokenIn_precision;
    tokenOut_supply *= tokenOut_precision;

    const dy = newton_dx_to_dy(
      tokenIn_supply,
      tokenOut_supply,
      tokenIn_amount * tokenIn_precision,
      5,
    );
    let fee = dy / Exchangefee;
    let tokenOut_amt = (dy - fee) / tokenOut_precision;
    let minimumOut = tokenOut_amt - (slippage * tokenOut_amt) / 100;
    minimumOut = minimumOut / 10 ** CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL;

    const updated_tokenIn_pool = tokenIn_supply + tokenIn_amount;
    const updated_tokenOut_pool = tokenOut_supply - tokenOut_amt;

    const next_dy = newton_dx_to_dy(
      updated_tokenIn_pool,
      updated_tokenOut_pool,
      tokenIn_amount * tokenIn_precision,
      5,
    );
    const next_fee = next_dy / Exchangefee;
    const next_tokenOut = (next_dy - next_fee) / tokenOut_precision;
    let priceImpact = (tokenOut_amt - next_tokenOut) / tokenOut_amt;
    priceImpact = priceImpact * 100;
    priceImpact = priceImpact.toFixed(5);
    priceImpact = Math.abs(priceImpact);
    tokenOut_amt = tokenOut_amt / 10 ** CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    fee = fee / tokenOut_precision;
    fee /= 10 ** CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    const tokenOut_amount = tokenOut_amt;
    const minimum_Out = minimumOut;
    const fees = fee;
    const exchangeRate =
      tokenOut_amount /
      (tokenIn_amount / 10 ** CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL);

    return {
      tokenOut_amount,
      fees,
      minimum_Out,
      exchangeRate,
      priceImpact,
    };
  } catch (error) {
    return {
      tokenOut_amount: 0,
      fees: 0,
      minimum_Out: 0,
      priceImpact: 0,
      error,
    };
  }
};
/**
 * Utility function to get swap data for the complete route to get calculations
 * @param path - An array from tokenIn to tokenOut
 */
const getRouteSwapData = async (path) => {
  try {
    const swapDataPromises = [];
    let tokenOutPerTokenIn = 1;
    for (let i = 0; i < path.length - 1; i++) {
      swapDataPromises.push(loadSwapData(path[i], path[i + 1]));
    }

    const responses = await Promise.all(swapDataPromises);
    for (const i in responses) {
      if (responses[i].tokenIn === 'ctez' && responses[i].tokenOut === 'tez') {
        tokenOutPerTokenIn = calculateTokensOutStable(
          responses[i].tokenOut_supply * 10 ** 6,
          responses[i].tokenIn_supply * 10 ** 6,
          tokenOutPerTokenIn,
          1 / responses[i].exchangeFee,
          0,
          responses[i].target,
          responses[i].tokenIn,
        ).tokenOut_amount;
      } else if (responses[i].tokenIn === 'tez' && responses[i].tokenOut === 'ctez') {
        tokenOutPerTokenIn = calculateTokensOutStable(
          responses[i].tokenIn_supply * 10 ** 6,
          responses[i].tokenOut_supply * 10 ** 6,
          tokenOutPerTokenIn,
          1 / responses[i].exchangeFee,
          0,
          responses[i].target,
          responses[i].tokenIn,
        ).tokenOut_amount;
      } else if (responses[i].amm_type === 'veStableAMM') {
        tokenOutPerTokenIn = calculateTokensOutGeneralStable(
          responses[i].tokenIn_supply,
          responses[i].tokenOut_supply,
          tokenOutPerTokenIn,
          responses[i].exchangeFee,
          0,
          responses[i].tokenIn,
          responses[i].tokenOut,
          responses[i].tokenIn_precision,
          responses[i].tokenOut_precision,
        ).tokenOut_amount;
      } else {
        tokenOutPerTokenIn =
          tokenOutPerTokenIn * (responses[i].tokenOut_supply / responses[i].tokenIn_supply);
      }
    }
    return {
      success: true,
      intermediateAMMData: responses,
      path: path,
      tokenOutPerTokenIn: tokenOutPerTokenIn,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      intermediateAMMData: null,
      path: path,
      tokenOutPerTokenIn: 0,
    };
  }
};
/**
 * Utility function to get all path from tokenIn to tokenOut
 */
const allPathsUtil = (current, destination, paths, vis, path) => {
  vis[current] = true;
  path.push(current);
  if (current === destination) {
    paths.push([...path]);
  }
  // Traversing the AMM pairs (neighbours) of current token recursively
  for (const pairToken in CONFIG.AMM[CONFIG.NETWORK][current].DEX_PAIRS) {
    if (!Object.hasOwnProperty.call(vis, pairToken) || vis[pairToken] === false) {
      allPathsUtil(pairToken, destination, paths, vis, path);
    }
  }
  path.pop(current);
  vis[current] = false;
};

/**
 * Returns all the possible direct and indirect routes between two tokens
 * 
 
 */
export const getAllRoutes = async (tokenIn, tokenOut) => {
  try {
    const paths = []; // All possible routes between tokenIn and tokenOut will be stored in path
    const path = []; // Current path which is being iterated
    const vis = {}; // To keep track of visited tokens
    const routeDataPromises = []; // promises to get swap data for all routes will be pushed here
    const bestRoute = {
      // best route will be stored here (until no input)
      path: [],
      swapData: [],
      tokenOutPerTokenIn: 0,
      isStableList: [],
      feeList: [],
      maxFee: 0,
    };

    allPathsUtil(tokenIn, tokenOut, paths, vis, path);
    paths.forEach((path) => {
      // Filtering out routes whose length are greater than 4 for performance reasons.
      if (path.length <= 4) {
        routeDataPromises.push(getRouteSwapData(path));
      }
    });

    if(routeDataPromises.length === 0 ){
      paths.forEach((path) => {
        // Adding length 5 for accomodating cases where swap is impossible with 4
        if (path.length <= 5) {
          routeDataPromises.push(getRouteSwapData(path));
        }
      });
    }
    // Do not combine the above loops as changing path length to 5 for all pairs will yield exponential results
    const routeDataResponses = await Promise.all(routeDataPromises);
    /*
      When there is no input, but we need to show swap rate
      We select the best swapRate using tokenOutPerTokenIn method
     */
    for (const i in routeDataResponses) {
      if (Number(routeDataResponses[i].tokenOutPerTokenIn) > Number(bestRoute.tokenOutPerTokenIn)) {
        bestRoute.tokenOutPerTokenIn = routeDataResponses[i].tokenOutPerTokenIn;
        bestRoute.swapData = routeDataResponses[i].intermediateAMMData;
        bestRoute.path = routeDataResponses[i].path;
      }
    }

    return {
      success: true,
      bestRouteUntilNoInput: bestRoute,
      allRoutes: routeDataResponses,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      allRoutes: [],
      bestRouteUntilNoInput: {
        path: [],
        swapData: [],
        tokenOutPerTokenIn: 0,
      },
    };
  }
};

const computeTokenOutputV2 = (
  tokenIn_amount,
  tokenIn_supply,
  tokenOut_supply,
  exchangeFee,
  slippage,
  tokenIn,
  tokenOut,
  target,
  tokenIn_precision,
  tokenOut_precision,
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const amm_type = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].type;
    if (amm_type === 'xtz') {
      if (tokenIn === 'ctez') {
        return calculateTokensOutStable(
          tokenOut_supply * 10 ** 6,
          tokenIn_supply * 10 ** 6,
          tokenIn_amount,
          1 / exchangeFee,
          slippage,
          parseInt(target),
          tokenIn,
        );
      } else {
        return calculateTokensOutStable(
          tokenIn_supply * 10 ** 6,
          tokenOut_supply * 10 ** 6,
          tokenIn_amount,
          1 / exchangeFee,
          slippage,
          parseInt(target),
          tokenIn,
        );
      }
    } else if (amm_type === 'veStableAMM') {
      return calculateTokensOutGeneralStable(
        tokenIn_supply,
        tokenOut_supply,
        tokenIn_amount,
        exchangeFee,
        slippage,
        tokenIn,
        tokenOut,
        tokenIn_precision,
        tokenOut_precision,
      );
    } else {
      let tokenOut_amount = 0;
      tokenOut_amount = (1 - exchangeFee) * tokenOut_supply * tokenIn_amount;
      tokenOut_amount /= tokenIn_supply + (1 - exchangeFee) * tokenIn_amount;
      const fees = tokenIn_amount * exchangeFee;
      const minimum_Out = tokenOut_amount - (slippage * tokenOut_amount) / 100;

      const updated_TokenIn_Supply = tokenIn_supply - tokenIn_amount;
      const updated_TokenOut_Supply = tokenOut_supply - tokenOut_amount;
      let next_tokenOut_Amount = (1 - exchangeFee) * updated_TokenOut_Supply * tokenIn_amount;
      next_tokenOut_Amount /= updated_TokenIn_Supply + (1 - exchangeFee) * tokenIn_amount;
      let priceImpact = (tokenOut_amount - next_tokenOut_Amount) / tokenOut_amount;
      priceImpact = priceImpact * 100;
      priceImpact = priceImpact.toFixed(5);
      priceImpact = Math.abs(priceImpact);
      priceImpact = priceImpact * 100;

      return {
        tokenOut_amount,
        fees,
        minimum_Out,
        priceImpact,
      };
    }
  } catch (error) {
    return {
      tokenOut_amount: 0,
      fees: 0,
      minimum_Out: 0,
      priceImpact: 0,
    };
  }
};

const computeTokenOutForRouteBaseV2Base = (inputAmount, swapData, slippage) => {
  const initialData = {
    tokenOutAmount: inputAmount,
    fees: [],
    totalFees: 0,
    minimumOut: [],
    finalMinimumOut: 0,
    finalAmount: 0,
    priceImpact: 0,
  };

  try {
    const data = swapData.reduce(
      (acc, cur) => {
        const computed = computeTokenOutputV2(
          acc.tokenOutAmount,
          cur.tokenIn_supply,
          cur.tokenOut_supply,
          cur.exchangeFee,
          slippage,
          cur.tokenIn,
          cur.tokenOut,
          cur.target,
          cur.tokenIn_precision,
          cur.tokenOut_precision,
        );
        return {
          tokenOutAmount: computed.tokenOut_amount,
          fees: [...acc.fees, computed.fees],
          totalFees: acc.totalFees + computed.fees,
          minimumOut: [...acc.minimumOut, computed.minimum_Out],
          finalMinimumOut: computed.minimum_Out,
          priceImpact: acc.priceImpact + computed.priceImpact,
        };
      },
      {
        tokenOutAmount: inputAmount,
        fees: [],
        totalFees: 0,
        minimumOut: [],
        finalMinimumOut: 0,
        finalAmount: 0,
        priceImpact: 0,
      },
    );

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      data: initialData,
    };
  }
};

/**
 * Calculates tokenOut for tokenIn with best route 
 
 */
export const computeTokenOutForRouteBaseV2 = (input, allRoutes, slippage) => {
  try {
    const computeResponses = [];
    const bestRoute = {};
    allRoutes.forEach((route) => {
      const computedData = computeTokenOutForRouteBaseV2Base(
        input,
        route.intermediateAMMData,
        slippage,
      );
      computeResponses.push({
        computations: computedData.data,
        path: route.path,
      });
    });
    // Assuming first route is best route
    bestRoute.computations = computeResponses[0].computations;
    bestRoute.path = computeResponses[0].path;
    // Checking for best route among all routes based on maximum tokenOutAmount
    computeResponses.forEach((route) => {
      if (
        Number(route.computations.tokenOutAmount) > Number(bestRoute.computations.tokenOutAmount)
      ) {
        bestRoute.computations = route.computations;
        bestRoute.path = route.path;
      }
    });

    const isStable = [];
    const fee = [];
    let maxFee = 0;
    for (let i = 0; i < bestRoute.path.length - 1; i++) {
      isStable[i] = isTokenPairStable(bestRoute.path[i], bestRoute.path[i + 1]);
      fee[i] = isStable[i] ? 0.1 : 0.35;
      maxFee += fee[i];
    }
    maxFee = Math.round((maxFee + Number.EPSILON) * 100) / 100;
    bestRoute.isStableList = isStable;
    bestRoute.feeList = fee;
    bestRoute.maxFee = maxFee;
    return {
      success: true,
      bestRoute,
      computeResponses,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      bestRoute: {},
      computeResponses: [],
    };
  }
};

const computeTokenOutForRouteBaseByOutAmountV2Base = (outputAmount, swapData, slippage) => {
  try {
    let tokenIn_amount = 0;
    const minimum_Out_All = [];
    let minimum_Out = 0;
    let priceImpact = 0;
    const fees = [];
    let swapCompute = computeTokenOutputV2(
      outputAmount,
      swapData[swapData.length - 1].tokenOut_supply,
      swapData[swapData.length - 1].tokenIn_supply,
      swapData[swapData.length - 1].exchangeFee,
      slippage,
      swapData[swapData.length - 1].tokenIn,
      swapData[swapData.length - 1].tokenOut,
      swapData[swapData.length - 1].target,
    );
    for (let i = swapData.length - 2; i >= 0; i--) {
      swapCompute = computeTokenOutputV2(
        swapCompute.tokenOut_amount,
        swapData[i].tokenOut_supply,
        swapData[i].tokenIn_supply,
        swapData[i].exchangeFee,
        slippage,
        swapData[i].tokenIn,
        swapData[i].tokenOut,
        swapData[i].target,
      );
      if (i === 0) {
        tokenIn_amount = swapCompute.tokenOut_amount;
      }
    }
    swapCompute = computeTokenOutputV2(
      tokenIn_amount,
      swapData[0].tokenIn_supply,
      swapData[0].tokenOut_supply,
      swapData[0].exchangeFee,
      slippage,
      swapData[0].tokenIn,
      swapData[0].tokenOut,
      swapData[0].target,
    );
    minimum_Out_All.push(swapCompute.minimum_Out);
    fees.push(swapCompute.fees);
    priceImpact = priceImpact + swapCompute.priceImpact;
    for (let i = 1; i < swapData.length; i++) {
      swapCompute = computeTokenOutputV2(
        swapCompute.tokenOut_amount,
        swapData[i].tokenIn_supply,
        swapData[i].tokenOut_supply,
        swapData[i].exchangeFee,
        slippage,
        swapData[i].tokenIn,
        swapData[i].tokenOut,
        swapData[i].target,
      );
      minimum_Out_All.push(swapCompute.minimum_Out);
      fees.push(swapCompute.fees);
      priceImpact = priceImpact + swapCompute.priceImpact;
      if (i === swapData.length - 1) {
        minimum_Out = swapCompute.minimum_Out;
      }
    }
    return {
      success: true,
      data: {
        tokenInAmount: tokenIn_amount,
        tokenOutAmount: outputAmount,
        fees: fees,
        totalFees: fees.reduce((acc, cur) => acc + cur, 0),
        minimumOut: minimum_Out_All,
        finalMinimumOut: minimum_Out,
        finalAmount: tokenIn_amount,
        priceImpact: priceImpact,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      data: {
        tokenOutAmount: outputAmount,
        fees: [],
        totalFees: 0,
        minimumOut: [],
        finalMinimumOut: 0,
        finalAmount: 0,
        priceImpact: 0,
      },
    };
  }
};

/**
 * Function returns in tokenIn amount for the desired tokenOut amount

 */
export const computeTokenOutForRouteBaseByOutAmountV2 = (outputAmount, allRoutes, slippage) => {
  try {
    const bestRoute = {};
    const computeResponses = allRoutes.map((route) => {
      const computedData = computeTokenOutForRouteBaseByOutAmountV2Base(
        outputAmount,
        route.intermediateAMMData,
        slippage,
      );
      return {
        computations: computedData.data,
        path: route.path,
      };
    });
    // Assuming first route is best route
    bestRoute.computations = computeResponses[0].computations;
    bestRoute.path = computeResponses[0].path;
    // Checking for best route among all routes based on minimum tokenInAmount
    computeResponses.forEach((route) => {
      if (route.computations.tokenInAmount < bestRoute.computations.tokenInAmount) {
        bestRoute.computations = route.computations;
        bestRoute.path = route.path;
      }
    });

    const fee = [];
    let maxFee = 0;
    const isStable = [];
    for (let i = 0; i < bestRoute.path.length - 1; i++) {
      isStable[i] = isTokenPairStable(bestRoute.path[i], bestRoute.path[i + 1]);
      fee[i] = isStable[i] ? 0.1 : 0.35;
      maxFee += fee[i];
    }
    maxFee = Math.round((maxFee + Number.EPSILON) * 100) / 100;
    bestRoute.isStableList = isStable;
    bestRoute.feeList = fee;
    bestRoute.maxFee = maxFee;

    return {
      success: true,
      bestRoute,
      computeResponses,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      bestRoute: {},
      computeResponses: [],
    };
  }
};
/**
 *
 * @param path - Array of tokenNames from In to Out
 * @param minimum_Out_All - Array of minimum of for each swap
 * @param caller - recipient
 * @param amount - input token amount
 * @param transactionSubmitModal - Callback to open transaction submitted modal
 * @returns {Promise<{success: boolean}>}
 */
export const swapTokenUsingRouteV3 = async (
  path,
  minimum_Out_All,
  caller,
  amount,
  transactionSubmitModal,
  setShowConfirmSwap,
  resetAllValues,
  setShowConfirmTransaction,
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    Tezos.setProvider(wallet);

    const tokenInCallType = CONFIG.AMM[connectedNetwork][path[0]].CALL_TYPE;
    const tokenInAddress = CONFIG.AMM[connectedNetwork][path[0]].TOKEN_CONTRACT;
    const tokenInId = CONFIG.AMM[connectedNetwork][path[0]].TOKEN_ID;

    const routerAddress = CONFIG.ROUTER[CONFIG.NETWORK];
    const routerInstance = await Tezos.contract.at(routerAddress);

    const DataLiteral = {};
    for (let i = 0; i < path.length - 1; i++) {
      const dexAddress = CONFIG.AMM[connectedNetwork][path[i]].DEX_PAIRS[path[i + 1]].contract;
      const minOut = Math.floor(
        minimum_Out_All[i] * Math.pow(10, CONFIG.AMM[connectedNetwork][path[i + 1]].TOKEN_DECIMAL),
      );
      const tokenAddress = CONFIG.AMM[connectedNetwork][path[i + 1]].TOKEN_CONTRACT;
      const tokenId = CONFIG.AMM[connectedNetwork][path[i + 1]].TOKEN_ID;
      DataLiteral[i] = {
        exchangeAddress: dexAddress,
        minimumOutput: minOut,
        requiredTokenAddress: tokenAddress,
        requiredTokenId: tokenId,
      };
    }

    const DataMap = MichelsonMap.fromLiteral(DataLiteral);

    // const swapAmount = Math.floor(
    //   amount * Math.pow(10, CONFIG.AMM[connectedNetwork][path[0]].TOKEN_DECIMAL),
    // );
    let swapAmount = amount * Math.pow(10, CONFIG.AMM[connectedNetwork][path[0]].TOKEN_DECIMAL);
    const balanceWithoutDecimal = await getUserBalanceByRpcWithoutDecimal([path[0]], caller);

    const balanceWithoutDecimalNumber = new BigNumber(balanceWithoutDecimal.balance);
    const lpBal = new BigNumber(swapAmount);

    if (lpBal.isGreaterThan(balanceWithoutDecimalNumber) && (tokenInCallType !== 'XTZ') ) {
      swapAmount = balanceWithoutDecimalNumber;
    } else {
      swapAmount = lpBal;
    }
    // swapAmount = parseInt(swapAmount);
    //  else if call type == xtz then direct send no approve
    let batch;
    if (tokenInCallType === 'XTZ') {
      batch = Tezos.wallet.batch([
        {
          kind: OpKind.TRANSACTION,
          ...routerInstance.methods
            .routerSwap(DataMap, swapAmount, caller)
            .toTransferParams({ amount: swapAmount, mutez: true }),
        },
      ]);

      const batchOp = await batch.send();

      resetAllValues();
      setShowConfirmSwap(false);
      setShowConfirmTransaction(false);
      transactionSubmitModal(batchOp.opHash);
      await batchOp.confirmation();
      return {
        success: true,
      };
      // const hash = await routerInstance.methods.routerSwap(DataMap, swapAmount, caller).send({amount : swapAmount});
      // await hash.confirmation();
      // return {
      //   success: true,
      // };
    } else {
      const tokenInInstance = await Tezos.contract.at(tokenInAddress);
      if (tokenInCallType === 'FA1.2') {
        batch = Tezos.wallet
          .batch()
          .withContractCall(tokenInInstance.methods.transfer(caller, routerAddress, swapAmount))
          .withContractCall(routerInstance.methods.routerSwap(DataMap, swapAmount, caller));
      } else if (tokenInCallType === 'FA2') {
        batch = Tezos.wallet
          .batch()
          .withContractCall(
            tokenInInstance.methods.transfer([
              {
                from_: caller,
                txs: [
                  {
                    to_: routerAddress,
                    token_id: tokenInId,
                    amount: swapAmount,
                  },
                ],
              },
            ]),
          )
          .withContractCall(routerInstance.methods.routerSwap(DataMap, swapAmount, caller));
      }

      const batchOp = await batch.send();
      setShowConfirmTransaction(false);
      resetAllValues();
      setShowConfirmSwap(false);
      transactionSubmitModal(batchOp.opHash);

      await batchOp.confirmation();
      return {
        success: true,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
};

// function for getting xtz balance

export const getxtzBalance = async (identifier, address) => {
  const token = CONFIG.STABLESWAP[CONFIG.NETWORK][identifier];

  // const rpcNode = CONFIG.RPC_NODES[CONFIG.NETWORK];
  const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
  const type = token.READ_TYPE;
  const decimal = token.TOKEN_DECIMAL;
  const options = {
    name: CONFIG.NAME,
  };

  const network = {
    type: CONFIG.WALLET_NETWORK,
  };

  const wallet = new BeaconWallet(options);

  const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
  if (!WALLET_RESP.success) {
    throw new Error('Wallet connection failed');
  }
  const Tezos = new TezosToolkit(rpcNode);
  Tezos.setRpcProvider(rpcNode);
  Tezos.setWalletProvider(wallet);
  if (type === 'XTZ') {
    const _balance = await Tezos.tz.getBalance(address);
    const balance = _balance / Math.pow(10, decimal);
    return {
      success: true,
      balance,
      identifier,
    };
  }
};
