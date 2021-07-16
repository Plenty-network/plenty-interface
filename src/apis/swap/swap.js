import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';

export const swapTokens = async (
  tokenIn,
  tokenOut,
  minimumTokenOut,
  recipent,
  tokenInAmount,
  caller
) => {
  try {
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    let connectedNetwork = CONFIG.NETWORK;
    console.log('network=', network);
    const wallet = new BeaconWallet(options);
    console.log('wallet=', wallet);
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
    Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
    Tezos.setWalletProvider(wallet);
    let dexContractAddress =
      CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    let tokenInAddress = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_CONTRACT;
    let tokenOutAddress = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_CONTRACT;
    let tokenOutId = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_ID;
    let tokenInInstance = await Tezos.wallet.at(tokenInAddress);
    console.log('tokenInInstance', tokenInInstance);
    let dexContractInstance = await Tezos.wallet.at(dexContractAddress);
    tokenInAmount =
      tokenInAmount *
      Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL);
    let batch = null;
    if (CONFIG.AMM[connectedNetwork][tokenIn].CALL_TYPE === 'FA1.2') {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.approve(dexContractAddress, tokenInAmount)
        )
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut,
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount
          )
        );
    } else {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenOutId,
              },
            },
          ])
        )
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut,
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount
          )
        )
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenOutId,
              },
            },
          ])
        );
    }
    const batchOperation = await batch.send();
    await batchOperation.confirmation().then(() => batchOperation.opHash);
    console.log({ batchOperation });
    return {
      success: true,
      operationId: batchOperation.hash,
    };
  } catch (error) {
    console.log('error=', error);
    return {
      success: false,
      error,
    };
  }
};

export const loadSwapData = async (tokenIn, tokenOut) => {
  try {
    let connectedNetwork = CONFIG.NETWORK;
    let dexContractAddress =
      CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
    let dexContractInstance = await Tezos.contract.at(dexContractAddress);
    let dexStorage = await dexContractInstance.storage();
    let systemFee = await dexStorage.systemFee;
    systemFee = systemFee.toNumber();
    let lpFee = await dexStorage.lpFee;
    lpFee = lpFee.toNumber();
    let token1_pool = await dexStorage.token1_pool;
    token1_pool = token1_pool.toNumber();
    let token2_pool = await dexStorage.token2_pool;
    token2_pool = token2_pool.toNumber();
    let tokenIn_supply = 0;
    let tokenOut_supply = 0;
    if (
      CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].property ===
      'token2_pool'
    ) {
      tokenOut_supply = token2_pool;
      tokenIn_supply = token1_pool;
    } else {
      tokenOut_supply = token1_pool;
      tokenIn_supply = token2_pool;
    }
    let tokenIn_Decimal = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL;
    let tokenOut_Decimal = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    tokenIn_supply = tokenIn_supply / Math.pow(10, tokenIn_Decimal);
    tokenOut_supply = tokenOut_supply / Math.pow(10, tokenOut_Decimal);
    let exchangeFee = 1 / lpFee + 1 / systemFee;
    let tokenOutPerTokenIn = tokenOut_supply / tokenIn_supply;
    return {
      success: true,
      tokenIn,
      tokenIn_supply,
      tokenOut,
      tokenOut_supply,
      exchangeFee,
      tokenOutPerTokenIn,
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      tokenIn,
      tokenIn_supply: 0,
      tokenOut,
      tokenOut_supply: 0,
      exchangeFee: 0,
      tokenOutPerTokenIn: 0,
    };
  }
};

export const computeTokenOutput = (
  tokenIn_amount,
  tokenIn_supply,
  tokenOut_supply,
  exchangeFee
) => {
  try {
    let tokenOut_amount = 0;
    tokenOut_amount = (1 - exchangeFee) * tokenOut_supply * tokenIn_amount;
    tokenOut_amount /= tokenIn_supply + (1 - exchangeFee) * tokenIn_amount;
    let fees = tokenIn_amount * exchangeFee;
    return {
      tokenOut_amount,
      fees,
    };
  } catch (error) {
    return {
      tokenOut_amount: 0,
      fees: 0,
    };
  }
};
