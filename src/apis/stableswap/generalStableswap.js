import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';


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
// export const getExchangeRate = (tezSupply, ctezSupply, target) => {
//   const dy1 = newton_dx_to_dy(target * ctezSupply, tezSupply * 2 ** 48, 1 * target, 5) / 2 ** 48;
//   const fee1 = dy1 / 1000;
//   const tokenOut1 = dy1 - fee1;
//   const tezexchangeRate = tokenOut1 / 1;

//   const dy2 = newton_dx_to_dy(tezSupply * 2 ** 48, target * ctezSupply, 1 * 2 ** 48, 5) / target;
//   const fee2 = dy2 / 1000;
//   const tokenOut2 = dy2 - fee2;

//   const ctezexchangeRate = tokenOut2 / 1;

//   return {
//     tezexchangeRate,
//     ctezexchangeRate,
//   };
// };
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
export const calculateTokensOutGeneralStable = async (
  tokenIn_supply,
  tokenOut_supply,
  tokenIn_amount,
  Exchangefee,
  slippage,
  tokenIn,
  tokenOut,
  tokenIn_precision,
  tokenOut_precision
) => {
    const connectedNetwork = CONFIG.NETWORK;
  tokenIn_amount = tokenIn_amount * (10 ** CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL);
  try {
        // Ask aniket why div by 2**48
        tokenIn_supply *= tokenIn_precision;
        tokenOut_supply *= tokenOut_precision;

        console.log(Exchangefee);

        const dy = newton_dx_to_dy(tokenIn_supply , tokenOut_supply , tokenIn_amount * tokenIn_precision , 5);
        let fee  = dy / Exchangefee;
        let tokenOut_amt = (dy - fee) / tokenOut_precision;
        let minimumOut = tokenOut_amt - (slippage * tokenOut_amt) / 100;
        minimumOut = minimumOut / (10 ** CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL);
        const exchangeRate = tokenOut_amt / tokenIn_amount;

        const updated_tokenIn_pool = tokenIn_supply + tokenIn_amount;
        const updated_tokenOut_pool = tokenOut_supply - tokenOut_amt;

        const next_dy = newton_dx_to_dy(updated_tokenIn_pool , updated_tokenOut_pool , tokenIn_amount * tokenIn_precision , 5);
        const next_fee = next_dy / Exchangefee;
        const next_tokenOut = (next_dy - next_fee) / tokenOut_precision;
        let priceImpact = (tokenOut_amt - next_tokenOut) / tokenOut_amt;
        priceImpact = priceImpact * 100;
        priceImpact = priceImpact.toFixed(5);
        priceImpact = Math.abs(priceImpact);

        tokenOut_amt = tokenOut_amt / (10 ** CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL);
        fee = fee/ (10 ** CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL);

        return {
            tokenOut_amt,
            fee,
            minimumOut,
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
  const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
  // const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
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
    const dexContractAddress = CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const tokenInId = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_ID;
    const tokenOutAddress = CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_CONTRACT;
    const tokenOutId = CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_ID;
    const tokenInAddress = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_CONTRACT;
    const tokenInInstance = await Tezos.contract.at(tokenInAddress);
    const dexContractInstance = await Tezos.contract.at(dexContractAddress);

    tokenInAmount =
      tokenInAmount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL);
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
      const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
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
      if (CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].property === 'token2_pool') {
        tokenOut_supply = token2_pool;
        tokenIn_supply = token1_pool;
      } else {
        tokenOut_supply = token1_pool;
        tokenIn_supply = token2_pool;
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
        token1_precision,
        token2_precision
      };
    // const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    // const dexContractAddress =
    //   CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    // const Tezos = new TezosToolkit(rpcNode);
    // const dexContractInstance = await Tezos.contract.at(dexContractAddress);
    // const dexStorage = await dexContractInstance.storage();

    // let token1_pool = await dexStorage.token1Pool;
    // let token1_precision = await dexStorage.token1Precision;

    // let token2_pool = await dexStorage.token2Pool;
    // let token2_precision = await dexStorage.token2Precision;
    // let lpTokenSupply = await dexStorage.lqtTotal;
    // const lpToken = CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
    // return {
    //   success: true,
    //   token1_pool,
    //   token1_precision,
    //   token2_pool,
    //   token2_precision,
    //   tokenIn,
    //   tokenOut,
    //   lpTokenSupply,
    //   lpToken,
    //   dexContractInstance,
    // };
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

// export const liqCalc = (xtzAmount, tezpool, ctezpool, lqtTotal) => {
//   const ctez = (Number(xtzAmount) * 10 ** 6 * ctezpool) / tezpool;
//   const lpToken = Number((Number(xtzAmount) * 10 ** 6 * lqtTotal) / tezpool);
//   const poolPercent = Number((lpToken / (lpToken + lqtTotal)) * 100);

//   return {
//     ctez,
//     lpToken,
//     poolPercent,
//   };
// };

// export const liqCalcRev = (ctezAmount, tezpool, ctezpool, lqtTotal) => {
//   const tez = (Number(ctezAmount) * 10 ** 6 * tezpool) / ctezpool;
//   const lpToken = Number((Number(tez) * lqtTotal) / tezpool);
//   const poolPercent = Number((lpToken / (lpToken + lqtTotal)) * 100);

//   return {
//     tez,
//     lpToken,
//     poolPercent,
//   };
// };

// export async function add_liquidity(
//   tokenIn,
//   tokenOut,
//   ctezAmount,
//   tezAmount,
//   recepient,
//   transactionSubmitModal,
//   setShowConfirmAddSupply,
//   resetAllValues,
//   setShowConfirmTransaction,
// ) {
//   try {
//     const connectedNetwork = CONFIG.NETWORK;
//     const rpcNode = CONFIG.RPC_NODES[connectedNetwork];

//     const network = {
//       type: CONFIG.WALLET_NETWORK,
//     };
//     const options = {
//       name: CONFIG.NAME,
//     };
//     const wallet = new BeaconWallet(options);
//     const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
//     if (!WALLET_RESP.success) {
//       throw new Error('Wallet connection failed');
//     }
//     const Tezos = new TezosToolkit(rpcNode);
//     Tezos.setRpcProvider(rpcNode);
//     Tezos.setWalletProvider(wallet);
//     const contractAddress =
//       CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
//     const CTEZ = CONFIG.AMM[connectedNetwork]['ctez'].TOKEN_CONTRACT;
//     const contract = await Tezos.wallet.at(contractAddress);
//     const ctez_contract = await Tezos.wallet.at(CTEZ);
//     const batch = Tezos.wallet.batch([
//       {
//         kind: OpKind.TRANSACTION,
//         ...ctez_contract.methods
//           .approve(contractAddress, Math.round(Number(ctezAmount * 10 ** 6)))
//           .toTransferParams(),
//       },
//       {
//         kind: OpKind.TRANSACTION,
//         ...contract.methods
//           .add_liquidity(Math.round(Number(ctezAmount * 10 ** 6)), 0, recepient)
//           .toTransferParams({ amount: Number(tezAmount * 10 ** 6), mutez: true }),
//       },
//       {
//         kind: OpKind.TRANSACTION,
//         ...ctez_contract.methods.approve(contractAddress, 0).toTransferParams(),
//       },
//     ]);

//     const batchOp = await batch.send();
//     // eslint-disable-next-line no-lone-blocks
//     {
//       batchOp.opHash === null
//         ? console.log('operation getting injected')
//         : console.log('operation injected');
//     }
//     setShowConfirmAddSupply(false);
//     setShowConfirmTransaction(false);
//     resetAllValues();
//     transactionSubmitModal(batchOp.opHash);

//     await batchOp.confirmation();
//     return {
//       success: true,
//       operationId: batchOp.opHash,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       success: false,
//       error,
//     };
//   }
// }

// export const liqCalcRemove = (liqAmountInput, tezPool, ctezPool, lqtTotal) => {
//   let tokenFirst_Out = (liqAmountInput * tezPool) / lqtTotal;
//   let tokenSecond_Out = (liqAmountInput * ctezPool) / lqtTotal;
//   tokenFirst_Out = parseFloat(tokenFirst_Out.toFixed(6));
//   tokenSecond_Out = parseFloat(tokenSecond_Out.toFixed(6));
//   return {
//     tokenFirst_Out,
//     tokenSecond_Out,
//   };
// };

// export async function remove_liquidity(
//   tokenIn,
//   tokenOut,
//   amount,
//   transactionSubmitModal,
//   setShowConfirmSwap,
//   resetAllValues,
//   setShowConfirmTransaction,
// ) {
//   try {
//     const connectedNetwork = CONFIG.NETWORK;
//     const rpcNode = CONFIG.RPC_NODES[connectedNetwork];

//     const network = {
//       type: CONFIG.WALLET_NETWORK,
//     };
//     const options = {
//       name: CONFIG.NAME,
//     };
//     const wallet = new BeaconWallet(options);
//     const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
//     if (!WALLET_RESP.success) {
//       throw new Error('Wallet connection failed');
//     }
//     const Tezos = new TezosToolkit(rpcNode);
//     Tezos.setRpcProvider(rpcNode);
//     Tezos.setWalletProvider(wallet);
//     const contractAddress =
//       CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;

//     const contract = await Tezos.wallet.at(contractAddress);
//     const op = await contract.methods.remove_liquidity(Number(amount * 10 ** 6), 0, 0).send();
//     // eslint-disable-next-line no-lone-blocks
//     {
//       op.opHash === null
//         ? console.log('operation getting injected')
//         : console.log('operation injected');
//     }
//     setShowConfirmSwap(false);
//     setShowConfirmTransaction(true);
//     resetAllValues();
//     transactionSubmitModal(op.opHash);
//     await op.confirmation();

//     return {
//       success: true,
//       operationId: op.opHash,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       success: false,
//       error,
//     };
//   }
// }
