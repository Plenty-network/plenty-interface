import axios from 'axios';
import { TezosParameterFormat, TezosMessageUtils } from 'conseiljs';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, OpKind } from '@taquito/taquito';
import * as actions from '../index.action';
import * as homeApis from './api.home';
import { getUserStakes } from '../user/user.action';
import CONFIG from '../../../config/config';

export const getHomeStatsData = () => {
  return async (dispatch) => {
    dispatch({ type: actions.HOME_STATS_FETCH });
    const res = await axios.get(
      'https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/homestats'
    );
    if (res.data.success) {
      dispatch({ type: actions.HOME_STATS_FETCH_SUCCESS, data: res.data.body });
    } else {
      dispatch({ type: actions.HOME_STATS_FETCH_FAILED });
    }
  };
};

export const getTVL = () => {
  return async (dispatch) => {
    dispatch({ type: actions.TVL_FETCH });
    const res = await axios.get(
      'https://mf29fdthuf.execute-api.us-east-2.amazonaws.com/v1/tvl'
    );
    if (res.data.success) {
      dispatch({ type: actions.TVL_FETCH_SUCCESS, data: res.data.body });
    } else {
      dispatch({ type: actions.TVL_FETCH_FAILED });
    }
  };
};

export const getPlentyToHarvest = (addressOfUser) => {
  let plentyToHarvest = 0;
  return async (dispatch) => {
    dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH });
    let promises = [
      homeApis.getHarvestValue(addressOfUser, 'FARMS', true),
      homeApis.getHarvestValue(addressOfUser, 'FARMS', false),
      homeApis.getHarvestValue(addressOfUser, 'POOLS', true),
      homeApis.getHarvestValue(addressOfUser, 'POOLS', false),
      // homeApis.getHarvestValue(addressOfUser, "PONDS", "active"),
      // homeApis.getHarvestValue(addressOfUser, "PONDS", "inactive"),
    ];
    const response = await Promise.all(promises);
    response.forEach((item) => {
      if (item.success) {
        for (const key in item.response) {
          plentyToHarvest += item.response[key].totalRewards;
        }
      } else {
        dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH_FAILED });
        return;
      }
    });
    dispatch({
      type: actions.PLENTY_TO_HARVEST_FETCH_SUCCESS,
      data: plentyToHarvest,
    });
  };
};

export const getPlentyBalanceOfUser = (userAddress) => {
  return async (dispatch) => {
    dispatch({ type: actions.PLENTY_BALANCE_FETCH });
    const packedKey = homeApis.getPackedKey(0, userAddress, 'FA1.2');
    const connectedNetwork = CONFIG.NETWORK;
    const res = await homeApis.getBalanceAmount(
      CONFIG.TOKEN_CONTRACTS[connectedNetwork]['PLENTY'].mapId,
      packedKey,
      'PLENTY',
      CONFIG.TOKEN_CONTRACTS[connectedNetwork]['PLENTY'].decimal
    );
    if (res.success) {
      dispatch({
        type: actions.PLENTY_BALANCE_FETCH_SUCCESS,
        data: res.balance,
      });
    } else {
      dispatch({ type: actions.PLENTY_BALANCE_FETCH_FAILED });
    }
  };
};

const getCurrentBlockLevel = async () => {
  const response = await axios.get('https://api.better-call.dev/v1/head');
  if (response.data[0].network != 'mainnet') {
    throw 'Invalid Network';
  }
  return response.data[0].level;
};

export const harvestAll = async (userAddress) => {
  const allActiveContracts = await homeApis.getAllActiveContractAddresses();
  const blockLevel = await getCurrentBlockLevel();
  try {
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    const wallet = new BeaconWallet(options);
    const connectedNetwork = CONFIG.NETWORK;
    const WALLET_RESP = await homeApis.CheckIfWalletConnected(
      wallet,
      network.type
    );
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setWalletProvider(wallet);
      let promises = [];
      const packedKey = await homeApis.getPackedKey(0, userAddress, 'FA1.2');
      for (let key in allActiveContracts) {
        const output = await homeApis.calculateHarvestValue(
          allActiveContracts[key].contract,
          18,
          blockLevel,
          allActiveContracts[key].mapId,
          packedKey
        );
        if (output.totalRewards > 0) {
          promises.push(
            await Tezos.wallet.at(allActiveContracts[key].contract)
          );
        }
      }
      if (promises.length > 0) {
        const response = await Promise.all(promises);
        let harvestBatch = [];

        for (let key1 in response) {
          harvestBatch.push({
            kind: OpKind.TRANSACTION,
            ...response[key1].methods.GetReward(1).toTransferParams(),
          });
        }
        let batch = await Tezos.wallet.batch(harvestBatch);
        let batchOperation = await batch.send();
        await batchOperation
          .confirmation()
          .then(() => console.log(batchOperation.hash));
      } else {
        console.log('Nothing to harvest');
      }
    }
  } catch (error) {
    console.log(error);
  }
};
