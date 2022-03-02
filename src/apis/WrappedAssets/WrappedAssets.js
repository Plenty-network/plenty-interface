/* import { TezosToolkit, OpKind } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet'; */
import CONFIG from '../../config/config';
import { referenceTokens } from '../../constants/wrappedAssets';

/* export const swapWrappedAssets = async (
  tokenIn,
  tokenAmount,
  owner
) => {
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
    const tokenAmountFinal = Number(tokenAmount * (10 ** tokenInDecimal));

    const oldTokenContract = await Token.wallet.at(oldTokenAddress);
    const swapTokenContract = await Token.wallet.at(swapTokenAddress);

    
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}; */

//export const getReferenceToken = (tokenIn) => CONFIG.WRAPPED_ASSETS[CONFIG.NETWORK][tokenIn].REF_TOKEN;
export const getReferenceToken = (tokenIn) =>
  referenceTokens.find(
    (token) => token.name === CONFIG.WRAPPED_ASSETS[CONFIG.NETWORK][tokenIn].REF_TOKEN,
  );
