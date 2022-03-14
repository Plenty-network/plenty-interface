import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';
import { referenceTokens } from '../../constants/wrappedAssets';
import axios from 'axios';
import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';
import {
  type1MapIds,
  type2MapIds,
  type3MapIds,
  type4MapIds,
  type5MapIds,
} from '../../constants/global';
/**
 * Returns packed key (expr...) which will help to fetch user specific data from bigmap directly using rpc.
 * @param tokenId - Id of map from where you want to fetch data
 * @param address - address of the user for whom you want to fetch the data
 * @param type - FA1.2 OR FA2
 */
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
export const getUserBalanceByRpc = async (identifier, address) => {
  try {
    //let balance;

    const token = CONFIG.WRAPPED_ASSETS[CONFIG.NETWORK][identifier];
    const mapId = token.mapId;
    const type = token.READ_TYPE;
    const decimal = token.TOKEN_DECIMAL;
    const tokenId = token.TOKEN_ID;
    const rpcNode = CONFIG.RPC_NODES[CONFIG.NETWORK];
    const packedKey = getPackedKey(tokenId, address, type);
    const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
    const response = await axios.get(url);
    const balance = (() => {
      // IIFE
      let _balance;
      if (type1MapIds.includes(mapId)) {
        _balance = response.data.args[0].args[1].int;
      } else if (type2MapIds.includes(mapId)) {
        _balance = response.data.args[1].int;
      } else if (type3MapIds.includes(mapId)) {
        _balance = response.data.args[0].int;
      } else if (type4MapIds.includes(mapId)) {
        _balance = response.data.int;
      } else if (type5MapIds.includes(mapId)) {
        _balance = response.data.args[0][0].args[1].int;
      } else {
        _balance = response.data.int;
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
  } catch (error) {
    return {
      success: false,
      balance: 0,
      identifier,
      error: error,
    };
  }
};
/**
 * Swaps the selected wrapped token with it's reference token for the input amount.
 * @param {string} tokenIn - The name of the wrapped token.
 * @param {number} tokenAmount - The amount that needs to be swapped for the selected wrapped token.
 * @param {string} owner - Wallet address of the caller.
 *
 */
export const swapWrappedAssets = async (
  tokenIn,
  tokenAmount,
  owner,
  transactionSubmitModal,
  setShowConfirmSwap,
  resetAllValues,
  setShowConfirmTransaction,
  setShowTransactionSubmitModal,
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
    console.log(batchOp);
    {
      batchOp.opHash === null
        ? console.log('operation getting injected')
        : console.log('operation injected');
    }
    setShowConfirmTransaction(false);
    resetAllValues();
    setShowConfirmSwap(false);
    transactionSubmitModal(batchOp.opHash);
    setTimeout(() => {
      setShowTransactionSubmitModal(false);
    }, 5000);
    await batchOp.confirmation();

    return {
      success: true,
      operationId: batchOp.opHash,
    };
  } catch (error) {
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
