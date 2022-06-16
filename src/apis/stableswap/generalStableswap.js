import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';
import BigNumber from 'bignumber.js';
import { getUserBalanceByRpcWithoutDecimal} from '../swap/swap';
import { RPC_NODE } from '../../constants/localStorage';

const util = (x, y) => {
  const plus = x + y;
  const minus = x - y;
  const plus_2 = plus * plus;
  const plus_4 = plus_2 * plus_2;
  const plus_8 = plus_4 * plus_4;
  const plus_7 = plus_4 * plus_2 * plus;
  const minus_2 = minus * minus;
  const minus_4 = minus_2 * minus_2;
  const minus_8 = minus_4 * minus_4;
  const minus_7 = minus_4 * minus_2 * minus;
  return {
    first: plus_8 - minus_8,
    second: 8 * (minus_7 + plus_7),
  };
};

const newton = (x, y, dx, dy, u, n) => {
  let dy1 = dy;
  let new_util = util(x + dx, y - dy);
  let new_u = new_util.first;
  let new_du_dy = new_util.second;
  while (n !== 0) {
    new_util = util(x + dx, y - dy1);
    new_u = new_util.first;
    new_du_dy = new_util.second;
    dy1 = dy1 + (new_u - u) / new_du_dy;
    n = n - 1;
  }
  return dy1;
};

export const newton_dx_to_dy = (x, y, dx, rounds) => {
  const utility = util(x, y);
  const u = utility.first;
  const dy = newton(x, y, dx, 0, u, rounds);
  return dy;
};
export const getGeneralExchangeRate = (tokenA_supply, tokenB_supply ) => {

  const tokenAexchangeRate = tokenA_supply / tokenB_supply;
  const tokenBexchangeRate = tokenB_supply / tokenA_supply;

  return {
    tokenAexchangeRate,
    tokenBexchangeRate,
  };
};
/**
 * Returns tokensOut from the given amountIn and pool values.
 * @param tokenIn_supply - Pool value of tokenIn
 * @param tokenOut_supply - Pool value of tokenOut
 * @param tokenIn_amount - Amount of tokenIn
 * @param pair_fee_denom - Denominator of pair fee (Ex: for 0.5% pass 2000)
 * @param slippage - Slippage which the user can tolerate in percentage
 * @param target- Target price of the pair in bitwise right 48
 * @param tokenIn- TokenIn
 */
export const calculateTokensOutGeneralStable  = async (
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
    fee /= (10 ** CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL);
    const tokenOut_amount = tokenOut_amt;
    const minimum_Out = minimumOut;
    const fees = fee;
    const exchangeRate = (tokenOut_amount) / (tokenIn_amount / 10 ** CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL);


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

export const swapTokens = async (
  tokenIn,
  tokenOut,
  minimumTokenOut,
  recipent,
  tokenInAmount,
  caller,
  transactionSubmitModal,
  setShowConfirmSwap,
  resetAllValues,
  setShowConfirmTransaction,
) => {
  const connectedNetwork = CONFIG.NETWORK;
  // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
  const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
  try {
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
    const dexContractAddress =
      CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const tokenInId = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_ID;
    const tokenOutAddress = CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_CONTRACT;
    const tokenOutId = CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_ID;
    const tokenInAddress = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_CONTRACT;
    const tokenInInstance = await Tezos.contract.at(tokenInAddress);
    const dexContractInstance = await Tezos.contract.at(dexContractAddress);

    // const balanceWithoutDecimal = await getUserBalanceByRpcWithoutDecimal(
    //   tokenIn,
    //   caller,
    // );
    // const balanceWithoutDecimalNumber = new BigNumber(balanceWithoutDecimal.balance);
    // const lpBal = new BigNumber(tokenInAmount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL));
    
    // if (lpBal > balanceWithoutDecimalNumber) {
    //   tokenInAmount = balanceWithoutDecimalNumber;
    // } else {
    //   tokenInAmount = tokenInAmount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL);
    // }

    // tokenInAmount =
    //   tokenInAmount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL);

      tokenInAmount = tokenInAmount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL);
      const balanceWithoutDecimal = await getUserBalanceByRpcWithoutDecimal([tokenIn], caller);
  
      const balanceWithoutDecimalNumber = new BigNumber(balanceWithoutDecimal.balance);
      const lpBal = new BigNumber(tokenInAmount);
  
      if (lpBal.isGreaterThan(balanceWithoutDecimalNumber)) {
        tokenInAmount = balanceWithoutDecimalNumber;
      } else {
        tokenInAmount = lpBal;
      }
    minimumTokenOut =
      minimumTokenOut * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL);
    minimumTokenOut = Math.floor(minimumTokenOut);
    let batch = null;
    // Approve call for FA1.2 type token
    if (CONFIG.AMM[connectedNetwork][tokenIn].CALL_TYPE === 'FA1.2') {
      batch = Tezos.wallet
        .batch()
        .withContractCall(tokenInInstance.methods.approve(dexContractAddress, tokenInAmount))
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut,
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount,
          ),
        );
    }
    // add_operator for FA2 type token
    else {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenInId,
              },
            },
          ]),
        )
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut,
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount,
          ),
        )
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenInId,
              },
            },
          ]),
        );
    }

    const batchOperation = await batch.send();
    setShowConfirmTransaction(false);

    setShowConfirmSwap(false);
    transactionSubmitModal(batchOperation.opHash);
    resetAllValues();

    await batchOperation.confirmation().then(() => batchOperation.opHash);
    return {
      success: true,
      operationId: batchOperation.hash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export const loadSwapDataGeneralStable = async (tokenIn, tokenOut) => {
  try { 
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
    let lpTokenSupply = await dexStorage.lqtTotal.toNumber();
    const lpToken = CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
    const lpTokenDecimal = CONFIG.AMM[connectedNetwork][lpToken].TOKEN_DECIMAL;
    const tokenIn_Decimal = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL;
    const tokenOut_Decimal = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    tokenIn_supply = tokenIn_supply / Math.pow(10, tokenIn_Decimal);
    tokenOut_supply = tokenOut_supply / Math.pow(10, tokenOut_Decimal);
    lpTokenSupply = lpTokenSupply / Math.pow(10, lpTokenDecimal);
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
      dexContractInstance,
    };
  } catch (error) {
    console.log({ message: 'swap data error', error });
    return {
      success: false,
      tezPool: 0,
      ctezPool: 0,
      tokenIn,
      tokenOut,
      lpTokenSupply: 0,
      lpToken: null,
      dexContractInstance: null,
    };
  }
};

export const loadSwapDataGeneralStableWithoutDecimal = async (tokenIn, tokenOut) => {
  try {
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
    const lpToken = CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
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
      dexContractInstance,
    };
  } catch (error) {
    console.log({ message: 'swap data error', error });
    return {
      success: false,
      tezPool: 0,
      ctezPool: 0,
      tokenIn,
      tokenOut,
      lpTokenSupply: 0,
      lpToken: null,
      dexContractInstance: null,
    };
  }
};
