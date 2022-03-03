import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';
import { referenceTokens } from '../../constants/wrappedAssets';

/**
 * Swaps the selected wrapped token with it's reference token for the input amount.
 * @param {string} tokenIn - The name of the wrapped token.
 * @param {number} tokenAmount - The amount that needs to be swapped for the selected wrapped token.
 * @param {string} owner - Wallet address of the caller.
 *
 */
export const swapWrappedAssets = async (tokenIn, tokenAmount, owner) => {
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

    const oldTokenAddress = CONFIG.WRAPPED_ASSETS[connectedNetwork][tokenIn].TOKEN_CONTRACT;
    const swapTokenAddress = CONFIG.WRAPPED_ASSETS_SWAP_CONTRACT[connectedNetwork];
    const tokenInId = CONFIG.WRAPPED_ASSETS[connectedNetwork][tokenIn].TOKEN_ID;
    const tokenInDecimal = CONFIG.WRAPPED_ASSETS[connectedNetwork][tokenIn].TOKEN_DECIMAL;
    const tokenAmountFinal = Number(tokenAmount * 10 ** tokenInDecimal);

    const oldTokenContractInstance = await Tezos.wallet.at(oldTokenAddress);
    const swapTokenContractInstance = await Tezos.wallet.at(swapTokenAddress);

    const batch = Tezos.wallet
      .batch()
      .withContractCall(
        oldTokenContractInstance.methods.update_operators([
          {
            add_operator: {
              owner: owner,
              operator: swapTokenAddress,
              token_id: tokenInId,
            },
          },
        ]),
      )
      .withContractCall(swapTokenContractInstance.methods.swapTokens(tokenAmountFinal, tokenInId))
      .withContractCall(
        oldTokenContractInstance.methods.update_operators([
          {
            remove_operator: {
              owner: owner,
              operator: swapTokenAddress,
              token_id: tokenInId,
            },
          },
        ]),
      );

    const batchOp = await batch.send();

    {
      batchOp.opHash === null
        ? console.log('operation getting injected')
        : console.log('operation injected');
    }

    await batchOp.confirmation();

    return {
      success: true,
      operationId: batchOp.hash,
    };
  } catch (error) {
    //console.log(error.message);
    return {
      success: false,
      error,
    };
  }
};

//export const getReferenceToken = (tokenIn) => CONFIG.WRAPPED_ASSETS[CONFIG.NETWORK][tokenIn].REF_TOKEN;
/**
 * Get the reference token object for given wrapped token.
 * @param tokenIn - The wrapped token name for which reference token is needed.
 * @returns Reference token object or undefined.
 */
export const getReferenceToken = (tokenIn) =>
  referenceTokens.find(
    (token) => token.name === CONFIG.WRAPPED_ASSETS[CONFIG.NETWORK][tokenIn].REF_TOKEN,
  );
