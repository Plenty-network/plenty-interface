import CONFIG from '../../config/config';
import axios from 'axios';
import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import { RPC_NODE } from '../../constants/localStorage';

/**
 * Loads swap related data to perform calculation using RPC
 * @param tokenIn - token which user wants to sell, case-sensitive to CONFIG
 * @param tokenOut - token which user wants to get, case-sensitive to CONFIG
 */
export const loadSwapData = async (tokenIn, tokenOut) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
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
    };
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
      tokenOutPerTokenIn =
        tokenOutPerTokenIn * (responses[i].tokenOut_supply / responses[i].tokenIn_supply);
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
    const paths = [];
    const path = [];
    const vis = {};
    const routeDataPromises = [];
    const bestRoute = {
      path: [],
      swapData: [],
      tokenOutPerTokenIn: 0,
    };

    allPathsUtil(tokenIn, tokenOut, paths, vis, path);
    paths.forEach((path) => {
      if (path.length <= 4) {
        routeDataPromises.push(getRouteSwapData(path));
      }
    });
    const routeDataResponses = await Promise.all(routeDataPromises);

    for (const i in routeDataResponses) {
      if (routeDataResponses[i].tokenOutPerTokenIn > bestRoute.tokenOutPerTokenIn) {
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
) => {
  try {
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
    bestRoute.computations = computeResponses[0].computations;
    bestRoute.path = computeResponses[0].path;
    computeResponses.forEach((route) => {
      if (route.computations.tokenOutAmount > bestRoute.computations.tokenOutAmount) {
        bestRoute.computations = route.computations;
        bestRoute.path = route.path;
      }
    });
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
    );
    for (let i = swapData.length - 2; i >= 0; i--) {
      swapCompute = computeTokenOutputV2(
        swapCompute.tokenOut_amount,
        swapData[i].tokenOut_supply,
        swapData[i].tokenIn_supply,
        swapData[i].exchangeFee,
        slippage,
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
    bestRoute.computations = computeResponses[0].computations;
    bestRoute.path = computeResponses[0].path;
    computeResponses.forEach((route) => {
      if (route.computations.tokenInAmount < bestRoute.computations.tokenInAmount) {
        bestRoute.computations = route.computations;
        bestRoute.path = route.path;
      }
    });
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

export const swapTokenUsingRouteV3 = async (
  path,
  minimum_Out_All,
  caller,
  amount,
  transactionSubmitModal,
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
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
    const tokenInAddress = CONFIG.AMM[connectedNetwork][path[0]].TOKEN_CONTRACT;
    const tokenInCallType = CONFIG.AMM[connectedNetwork][path[0]].CALL_TYPE;
    const tokenInId = CONFIG.AMM[connectedNetwork][path[0]].TOKEN_ID;
    const tokenInInstance = await Tezos.contract.at(tokenInAddress);
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
    const swapAmount = Math.floor(
      amount * Math.pow(10, CONFIG.AMM[connectedNetwork][path[0]].TOKEN_DECIMAL),
    );

    let batch;
    if (tokenInCallType === 'FA1.2') {
      batch = Tezos.wallet
        .batch()
        .withContractCall(tokenInInstance.methods.transfer(caller, routerAddress, swapAmount))
        .withContractCall(routerInstance.methods.routerSwap(DataMap, swapAmount, caller));
    } else {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.transfer([
            {
              from_: caller,
              txs: [{ to_: routerAddress, token_id: tokenInId, amount: swapAmount }],
            },
          ]),
        )
        .withContractCall(routerInstance.methods.routerSwap(DataMap, swapAmount, caller));
    }
    const batchOp = await batch.send();
    transactionSubmitModal(batchOp.opHash);
    await batchOp.confirmation();
    return {
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
};
