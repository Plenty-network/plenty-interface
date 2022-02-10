import { TezosToolkit, OpKind } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';
import axios from 'axios';
import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';

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

/**
 * Returns tokensOut from the given amountIn and pool values.
 * @param tokenIn_supply - Pool value of tokenIn
 * @param tokenOut_supply - Pool value of tokenOut
 * @param tokenIn_amount - Amount of tokenIn
 * @param pair_fee_denom - Denominator of pair fee (Ex: for 0.5% pass 2000)
 * @param slippage - Slippage which the user can tolerate in percentage
 */
export const calculateTokensOutStable = async (
  tokenIn_supply,
  tokenOut_supply,
  tokenIn_amount,
  pair_fee_denom,
  slippage,
) => {
  try {
    const utility = util(tokenIn_supply, tokenOut_supply);
    const u = utility.first;
    const dy = newton(tokenIn_supply, tokenOut_supply, tokenIn_amount, 0, u, 5);
    const fee = dy / pair_fee_denom;
    const tokenOut = dy - fee;
    const minimumOut = tokenOut - (slippage * tokenOut) / 100;
    const exchangeRate = tokenIn_amount / tokenOut; // 1 tokenIn = x tokenOut

    const updated_TokenIn_Supply = tokenIn_supply + tokenIn_amount;
    const updated_TokenOut_Supply = tokenOut_supply - tokenOut;

    const next_utility = util(updated_TokenIn_Supply, updated_TokenOut_Supply);
    const next_u = next_utility.first;
    const next_dy = newton(
      updated_TokenIn_Supply,
      updated_TokenOut_Supply,
      tokenIn_amount,
      0,
      next_u,
      5,
    );
    const next_fee = next_dy / pair_fee_denom;
    const next_tokenOut = next_dy - next_fee;
    let priceImpact = (tokenOut - next_tokenOut) / tokenOut;
    priceImpact = priceImpact * 100;
    priceImpact = priceImpact.toFixed(5);
    priceImpact = Math.abs(priceImpact);
    priceImpact = priceImpact * 100;

    return {
      tokenOut,
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

export async function ctez_to_tez(
  tokenIn,
  tokenOut,
  minimumTokenOut,
  recipent,
  tokenInAmount,
  caller,
  transactionSubmitModal,
) {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = CONFIG.RPC_NODES[connectedNetwork];

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
    const contractAddress =
      CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const CTEZ = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_CONTRACT;
    const tokenInDecimals = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL;
    const tokenOutDecimals = CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    const contract = await Tezos.wallet.at(contractAddress);
    const ctez_contract = await Tezos.wallet.at(CTEZ);
    const batch = Tezos.wallet
      .batch()
      .withContractCall(
        ctez_contract.methods.approve(
          contractAddress,
          Number(tokenInAmount * 10 ** tokenInDecimals),
        ),
      )
      // .send();
      // await op1.confirmation();
      .withContractCall(
        contract.methods.ctez_to_tez(
          Number(tokenInAmount * 10 ** tokenInDecimals),
          minimumTokenOut * 10 ** tokenOutDecimals,
          recipent,
        ),
      )
      // .send();
      // await op2.confirmation();
      .withContractCall(ctez_contract.methods.approve(contractAddress, 0));
    // .send();
    const batchOp = await batch.send();
    // eslint-disable-next-line no-lone-blocks
    {
      batchOp.opHash === null
        ? console.log('operation getting injected')
        : console.log('operation injected');
    }
    console.log('Operation hash:', batchOp.opHash);
    transactionSubmitModal(batchOp.opHash);
    await batchOp.confirmation();
    return {
      success: true,
      operationId: batchOp.hash,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

export async function tez_to_ctez(
  tokenIn,
  tokenOut,
  minimumTokenOut,
  recipent,
  tokenInAmount,
  transactionSubmitModal,
) {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = CONFIG.RPC_NODES[connectedNetwork];

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
    const contractAddress =
      CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const contract = await Tezos.wallet.at(contractAddress);
    const tokenInDecimals = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_DECIMAL;
    const tokenOutDecimals = CONFIG.STABLESWAP[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    const batch = Tezos.wallet.batch([
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods
          .tez_to_ctez(minimumTokenOut * 10 ** tokenOutDecimals, recipent)
          .toTransferParams({ amount: Number(tokenInAmount * 10 ** tokenInDecimals) }),
      },
    ]);

    const batchOp = await batch.send();
    await batchOp.confirmation();
    transactionSubmitModal(batchOp.opHash);
    console.log(batchOp.opHash);
    return {
      success: true,
      operationId: batchOp.hash,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

const getPackedKey = (tokenId, address, type) => {
  const accountHex = `0x${TezosMessageUtils.writeAddress(address)}`;
  let packedKey = null;
  if (type === 'FA2') {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      // eslint-disable-next-line no-undef
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `(Pair ${accountHex} ${tokenId})`,
          '',
          TezosParameterFormat.Michelson,
        ),
        'hex',
      ),
    );
  } else {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      // eslint-disable-next-line no-undef
      Buffer.from(
        TezosMessageUtils.writePackedData(`${accountHex}`, '', TezosParameterFormat.Michelson),
        'hex',
      ),
    );
  }
  return packedKey;
};

/**
 * Gets balance of user of a particular token using RPC
 * @param identifier - Name of token, case-sensitive to CONFIG
 * @param address - tz1 address of user
 */
export const getUserBalanceByRpcStable = async (identifier, address) => {
  try {
    //let balance;

    const token = CONFIG.STABLESWAP[CONFIG.NETWORK][identifier];
    const mapId = token.mapId;
    const rpcNode = CONFIG.RPC_NODES[CONFIG.NETWORK];
    const type = token.READ_TYPE;
    const decimal = token.TOKEN_DECIMAL;
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
    if (type === 'XTZ') {
      const _balance = await Tezos.tz.getBalance(address);
      const balance = _balance / Math.pow(10, decimal);
      return {
        success: true,
        balance,
        identifier,
      };
    } else {
      const tokenId = token.TOKEN_ID;

      const packedKey = getPackedKey(tokenId, address, type);
      const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
      const response = await axios.get(url);

      const balance = (() => {
        // IIFE
        let _balance = response.data.int;

        _balance = parseInt(_balance);
        _balance = _balance / Math.pow(10, decimal);
        console.log(`${identifier} balance:`, _balance);
        return _balance;
      })();

      return {
        success: true,
        balance,
        identifier,
      };
    }
  } catch (error) {
    return {
      success: false,
      balance: 0,
      identifier,
      error: error,
    };
  }
};

export const loadSwapDataStable = async (tokenIn, tokenOut) => {
  console.log('loadSwapDataStable', tokenIn, tokenOut);
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const dexContractAddress =
      CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const Tezos = new TezosToolkit(rpcNode);
    const dexContractInstance = await Tezos.contract.at(dexContractAddress);
    const dexStorage = await dexContractInstance.storage();
    let tezPool = await dexStorage.tezPool;
    tezPool = tezPool.toNumber();
    let ctezPool = await dexStorage.ctezPool;
    ctezPool = ctezPool.toNumber();
    let lpTokenSupply = await dexStorage.lqtTotal;
    lpTokenSupply = lpTokenSupply.toNumber();
    const lpToken = CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
    return {
      success: true,
      tezPool,
      ctezPool,
      tokenIn,
      tokenOut,
      lpTokenSupply,
      lpToken,
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

export const liqCalc = (xtzAmount, ctezpool, tezpool) => {
  return (xtzAmount * 10 ** 6 * ctezpool) / tezpool;
};

export async function add_liquidity(
  tokenIn,
  tokenOut,
  ctezAmount,
  tezAmount,
  recepient,
  transactionSubmitModal,
) {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const contractAddress =
      CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const CTEZ = CONFIG.AMM[connectedNetwork]['ctez'].TOKEN_CONTRACT;
    const Tezos = new TezosToolkit(rpcNode);
    const contract = await Tezos.wallet.at(contractAddress);
    const ctez_contract = await Tezos.wallet.at(CTEZ);
    const batch = Tezos.wallet.batch([
      {
        kind: OpKind.TRANSACTION,
        ...ctez_contract.methods
          .approve(contractAddress, Math.round(Number(ctezAmount * 10 ** 6)))
          .toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods
          .add_liquidity(Math.round(Number(ctezAmount * 10 ** 6)), 0, recepient)
          .toTransferParams({ amount: Number(tezAmount * 10 ** 6), mutez: true }),
      },
      {
        kind: OpKind.TRANSACTION,
        ...ctez_contract.methods.approve(contractAddress, 0).toTransferParams(),
      },
    ]);

    const batchOp = await batch.send();
    // eslint-disable-next-line no-lone-blocks
    {
      batchOp.opHash === null
        ? console.log('operation getting injected')
        : console.log('operation injected');
    }
    transactionSubmitModal(batchOp.opHash);
    console.log('Operation hash:', batchOp.opHash);
    await batchOp.confirmation();
    return {
      success: true,
      operationId: batchOp.hash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

export async function remove_liquidity(tokenIn, tokenOut, amount, transactionSubmitModal) {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const contractAddress =
      CONFIG.STABLESWAP[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const Tezos = new TezosToolkit(rpcNode);
    const contract = await Tezos.wallet.at(contractAddress);
    const op = await contract.methods.remove_liquidity(Number(amount * 10 ** 6), 0, 0).send();
    await op.confirmation();

    transactionSubmitModal(op.opHash);
    console.log('Operation hash:', op.opHash);
    await op.confirmation();
    return {
      success: true,
      operationId: op.hash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}
