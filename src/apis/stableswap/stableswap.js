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

const newton_dx_to_dy = (x, y, dx, rounds) => {
  const utility = util(x, y);
  const u = utility.first;
  const dy = newton(x, y, dx, 0, u, rounds);
  return dy;
};
export const getExchangeRate = (tezSupply, ctezSupply, target) => {
  const dy1 = newton_dx_to_dy(target * ctezSupply, tezSupply * 2 ** 48, 1 * target, 5) / 2 ** 48;
  const fee1 = dy1 / 2000;
  const tokenOut1 = dy1 - fee1;
  const tezexchangeRate = tokenOut1 / 1;

  const dy2 = newton_dx_to_dy(tezSupply * 2 ** 48, target * ctezSupply, 1 * 2 ** 48, 5) / target;
  const fee2 = dy2 / 2000;
  const tokenOut2 = dy2 - fee2;

  const ctezexchangeRate = tokenOut2 / 1;

  return {
    tezexchangeRate,
    ctezexchangeRate,
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
export const calculateTokensOutStable = async (
  tezSupply,
  ctezSupply,
  tokenIn_amount,
  pair_fee_denom,
  slippage,
  target,
  tokenIn,
) => {
  try {
    if (tokenIn === 'ctez') {
      const dy =
        newton_dx_to_dy(target * ctezSupply, tezSupply * 2 ** 48, tokenIn_amount * target, 5) /
        2 ** 48;
      const fee = dy / pair_fee_denom;
      const tokenOut = dy - fee;
      const minimumOut = tokenOut - (slippage * tokenOut) / 100;
      const exchangeRate = tokenOut / tokenIn_amount; // 1 tokenIn = x tokenOut

      const updated_Ctez_Supply = tezSupply + tokenIn_amount;
      const updated_Tez_Supply = ctezSupply - tokenOut;

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
      priceImpact = priceImpact * 100;

      return {
        tokenOut,
        fee,
        minimumOut,
        exchangeRate,
        priceImpact,
      };
    } else if (tokenIn === 'xtz') {
      const dy =
        newton_dx_to_dy(tezSupply * 2 ** 48, target * ctezSupply, tokenIn_amount * 2 ** 48, 5) /
        target;
      const fee = dy / pair_fee_denom;
      const tokenOut = dy - fee;
      const minimumOut = tokenOut - (slippage * tokenOut) / 100;
      const exchangeRate = tokenOut / tokenIn_amount; // 1 tokenIn = x tokenOut

      const updated_Ctez_Supply = tezSupply + tokenIn_amount;
      const updated_Tez_Supply = ctezSupply - tokenOut;

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
      priceImpact = priceImpact * 100;

      return {
        tokenOut,
        fee,
        minimumOut,
        exchangeRate,
        priceImpact,
      };
    }
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
    const CTEZ = CONFIG.STABLESWAP[connectedNetwork][tokenIn].TOKEN_CONTRACT;
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

    transactionSubmitModal(batchOp.opHash);
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
          .toTransferParams({ amount: Number(tokenInAmount * 10 ** tokenInDecimals), mutez: true }),
      },
    ]);

    const batchOp = await batch.send();
    await batchOp.confirmation();
    transactionSubmitModal(batchOp.opHash);

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

export const getxtzBalance = async (identifier, address) => {
  const token = CONFIG.STABLESWAP[CONFIG.NETWORK][identifier];

  const rpcNode = CONFIG.RPC_NODES[CONFIG.NETWORK];
  const type = token.READ_TYPE;
  const decimal = token.TOKEN_DECIMAL;
  const options = {
    name: CONFIG.NAME,
  };
  const wallet = new BeaconWallet(options);
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
      return getxtzBalance(identifier, address);
      // const _balance = await Tezos.tz.getBalance(address);
      // const balance = _balance / Math.pow(10, decimal);
      // return {
      //   success: true,
      //   balance,
      //   identifier,
      // };
    } else {
      const tokenId = token.TOKEN_ID;

      const packedKey = getPackedKey(tokenId, address, type);
      const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
      const response = await axios.get(url);

      const balance = (() => {
        // IIFE
        let _balance;
        if (identifier === 'ctez') {
          _balance = response.data.int;
        } else {
          _balance = response.data.args[1].int;
        }

        _balance = parseInt(_balance);
        _balance = _balance / Math.pow(10, decimal);

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

    const ctezStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/KT1GWnsoFZVHGh7roXEER3qeCcgJgrXT3de2/storage`;
    const ctezStorage = await axios.get(ctezStorageUrl);
    const target = ctezStorage.data.args[2].int;
    return {
      success: true,
      tezPool,
      ctezPool,
      tokenIn,
      tokenOut,
      lpTokenSupply,
      lpToken,
      dexContractInstance,
      target,
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

export const liqCalc = (xtzAmount, tezpool, ctezpool, lqtTotal) => {
  const ctez = (Number(xtzAmount) * 10 ** 6 * ctezpool) / tezpool;
  const lpToken = Number((Number(xtzAmount) * 10 ** 6 * lqtTotal) / tezpool);
  const poolPercent = Number((lpToken / (lpToken + lqtTotal)) * 100);

  return {
    ctez,
    lpToken,
    poolPercent,
  };
};

export const getXtzDollarPrice = async () => {
  const xtzDollarValueUrl = CONFIG.API.url;
  const xtzDollarValue = await axios.get(xtzDollarValueUrl);
  const xtzPrice = xtzDollarValue.data.market_data.current_price.usd;
  return xtzPrice;
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
    const CTEZ = CONFIG.AMM[connectedNetwork]['ctez'].TOKEN_CONTRACT;
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

    await batchOp.confirmation();
    return {
      success: true,
      operationId: batchOp.opHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}

export const liqCalcRemove = (liqAmountInput, tezPool, ctezPool, lqtTotal) => {
  const tokenFirst_Out = (liqAmountInput * tezPool) / lqtTotal;
  const tokenSecond_Out = (liqAmountInput * ctezPool) / lqtTotal;
  return {
    tokenFirst_Out,
    tokenSecond_Out,
  };
};

export async function remove_liquidity(tokenIn, tokenOut, amount) {
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
    const op = await contract.methods.remove_liquidity(Number(amount * 10 ** 6), 0, 0).send();
    await op.confirmation();

    return {
      success: true,
      operationId: op.opHash,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
}
