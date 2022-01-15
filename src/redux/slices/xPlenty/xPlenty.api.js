import Axios from 'axios';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import CONFIG from '../../../config/config';
import { RPC_NODE } from '../../../constants/localStorage';

import store from '../../store/store';
import {
  closetransactionInjectionModal,
  openToastOnFail,
  openToastOnSuccess,
  opentransactionInjectionModal,
} from './xPlenty.slice';

/**
 * Gets price of plenty from TezTools API
 * @param tokenPriceData - Response from TezTools API
 * @returns {{plentyPrice: number}}
 */
const getPlentyPrice = (tokenPriceData) => {
  try {
    let plentyPrice = 0;
    for (const i in tokenPriceData.contracts) {
      if (
        tokenPriceData.contracts[i].symbol === 'PLENTY' &&
        tokenPriceData.contracts[i].tokenAddress === 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b'
      ) {
        plentyPrice = tokenPriceData.contracts[i].usdValue;
      }
    }
    return {
      plentyPrice,
    };
  } catch (e) {
    console.log(e);
    return {
      plentyPrice: 0,
    };
  }
};
/**
 *
 * @returns {Promise<{xPlentyPerPlenty: number, xPlentySupplyToShow: number, APR: number, totalSupply: number, plentyStakedToShow: number, plentyPerXplenty: number, plentyBalance: number, ValueLockedToShow: number}>}
 */
export const xPlentyComputations = async () => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];

    const axiosPromises = [];

    // Getting Plenty Curve Balance
    axiosPromises.push(
      Axios.get(
        `${rpcNode}chains/main/blocks/head/context/big_maps/${CONFIG.xPlenty[connectedNetwork].plentyTokenContract.balancesMapId}/${CONFIG.xPlenty[connectedNetwork].xPlentyCurve.bigMapExpression}`,
      ),
    );

    // Getting Current Block
    axiosPromises.push(Axios.get('https://api.mainnet.tzkt.io/v1/blocks/count'));

    // Getting Reward Manager Storage
    axiosPromises.push(
      Axios.get(
        `${rpcNode}chains/main/blocks/head/context/contracts/${CONFIG.xPlenty[connectedNetwork].rewardManager.address}/storage`,
      ),
    );

    // Getting Plenty Curve Storage
    axiosPromises.push(
      Axios.get(
        `${rpcNode}chains/main/blocks/head/context/contracts/${CONFIG.xPlenty[connectedNetwork].xPlentyCurve.address}/storage`,
      ),
    );

    // Teztools
    axiosPromises.push(Axios.get('https://api.teztools.io/token/prices'));

    const axiosResponse = await Promise.all(axiosPromises);
    const xPlentyPlentyBalanceResponse = axiosResponse[0];
    const currentBlockLevel = axiosResponse[1];
    const rewardManagerStorageResponse = axiosResponse[2];
    const xPlentyCurveStorageResponse = axiosResponse[3];
    const tokenPricesData = axiosResponse[4].data;

    let plentyBalance = parseInt(xPlentyPlentyBalanceResponse.data.args[1].int);

    const rewardManagerStorage = {};
    rewardManagerStorage['periodFinish'] = parseInt(
      rewardManagerStorageResponse.data.args[1].args[1].int,
    );
    rewardManagerStorage['lastUpdate'] = parseInt(
      rewardManagerStorageResponse.data.args[0].args[2].int,
    );
    rewardManagerStorage['rewardRate'] = parseInt(rewardManagerStorageResponse.data.args[3].int);

    const xPlentyCurveStorage = {};
    xPlentyCurveStorage['totalSupply'] = parseInt(xPlentyCurveStorageResponse.data.args[3].int);

    const balanceUpdate =
      Math.min(currentBlockLevel, rewardManagerStorage.periodFinish) -
      rewardManagerStorage.lastUpdate;

    if (balanceUpdate > 0) {
      plentyBalance += balanceUpdate * rewardManagerStorage.rewardRate;
    }
    const plentyPerXplenty = xPlentyCurveStorage.totalSupply / plentyBalance;
    const xplentyPerPlenty = 1 / plentyPerXplenty;
    let APR = (rewardManagerStorage.rewardRate * 1051200) / xPlentyCurveStorage.totalSupply;

    APR = APR * 100;

    const xPlentySupplyToShow = xPlentyCurveStorage.totalSupply / Math.pow(10, 18);
    const plentyStakedToShow = plentyBalance / Math.pow(10, 18);
    const plentyPrice = getPlentyPrice(tokenPricesData);

    const ValueLockedToShow = (plentyBalance / Math.pow(10, 18)) * plentyPrice.plentyPrice;
    return {
      plentyBalance,
      totalSupply: xPlentyCurveStorage.totalSupply,
      plentyPerXplenty: plentyPerXplenty,
      xPlentyPerPlenty: xplentyPerPlenty,
      APR,
      xPlentySupplyToShow,
      plentyStakedToShow,
      ValueLockedToShow,
    };
  } catch (error) {
    console.log(error);
    return {
      plentyBalance: 0,
      totalSupply: 0,
      plentyPerXplenty: 0,
      xPlentyPerPlenty: 0,
      APR: 0,
      xPlentySupplyToShow: 0,
      plentyStakedToShow: 0,
      ValueLockedToShow: 0,
    };
  }
};
/**
 * Returns the plenty user will get on trading given amount of xPlenty
 * @param plentyBalance - Plenty held with the curve contract
 * @param totalSupply - total supply of xPlenty
 * @param xplentyAmount - Amount of xPlenty user wants to trade
 * @returns {number}
 */
export const getExpectedPlenty = (plentyBalance, totalSupply, xplentyAmount) => {
  if (totalSupply < xplentyAmount) {
    return 0;
  }
  return ((xplentyAmount * plentyBalance) / totalSupply) * 0.995;
};
/**
 * Returns the xPlenty user will get on trading given amount of plenty
 * @param plentyBalance - Plenty held with the curve contract
 * @param totalSupply - total supply of xPlenty
 * @param plentyAmount - Amount of Plenty user wants to trade
 * @returns {number}
 */
export const getExpectedxPlenty = (plentyBalance, totalSupply, plentyAmount) => {
  return ((plentyAmount * totalSupply) / plentyBalance) * 0.995;
};

const CheckIfWalletConnected = async (wallet) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const network = {
      type: connectedNetwork,
    };
    const activeAccount = await wallet.client.getActiveAccount();
    if (!activeAccount) {
      await wallet.client.requestPermissions({
        network,
      });
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
/**
 * Operation to trade plenty for xPlenty
 * @param plentyAmount - amount of plenty user wants to trade
 * @param minimumExpected - minimum expected xPlenty below which transaction should fail
 * @param recipient - Address to which xPlenty should be transferred after the trade
 * @returns {Promise<{success: boolean, operationId}>}
 */
export const buyXPlenty = async (plentyAmount, minimumExpected, recipient) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    minimumExpected = minimumExpected * Math.pow(10, 18);
    minimumExpected = Math.floor(minimumExpected);
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      let batch = null;
      const plentyContractAddress = CONFIG.xPlenty[connectedNetwork].plentyTokenContract.address;
      const xPlentyBuySellContract = CONFIG.xPlenty[connectedNetwork].xPlentyCurve.address;
      const plentyContractInstance = await Tezos.wallet.at(plentyContractAddress);
      const xPlentyBuySellContractInstance = await Tezos.wallet.at(xPlentyBuySellContract);

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          plentyContractInstance.methods.approve(xPlentyBuySellContract, plentyAmount),
        )
        // 0 -> minimum
        .withContractCall(
          xPlentyBuySellContractInstance.methods.buy(minimumExpected, plentyAmount, recipient),
        )
        .withContractCall(plentyContractInstance.methods.approve(xPlentyBuySellContract, 0));
      const batchOperation = await batch.send();
      store.dispatch(opentransactionInjectionModal(batchOperation.opHash));
      await batchOperation.confirmation().then(() => batchOperation.opHash);
      store.dispatch(closetransactionInjectionModal());
      store.dispatch(openToastOnSuccess());
      return {
        success: true,
        operationId: batchOperation.hash,
      };
    }
  } catch (error) {
    store.dispatch(closetransactionInjectionModal());
    store.dispatch(openToastOnFail());
    console.log(error);
  }
};
/**
 * Operation to trade xPlenty for plenty
 * @param xPlentyAmount - amount of xPlenty user wants to trade
 * @param minimumExpected - minimum expected plenty below which transaction should fail
 * @param recipient - Address to which plenty should be transferred after the trade
 * @returns {Promise<{success: boolean, operationId}>}
 */
export const sellXPlenty = async (xPlentyAmount, minimumExpected, recipient) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    minimumExpected = minimumExpected * Math.pow(10, 18);
    minimumExpected = Math.floor(minimumExpected);
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      let batch = null;
      // const xPlentyContractAddress = CONFIG.xPlenty[connectedNetwork].xPlentyTokenContract.address;
      const xPlentyBuySellContract = CONFIG.xPlenty[connectedNetwork].xPlentyCurve.address;

      // const xPlentyContractInstance = await Tezos.wallet.at(xPlentyContractAddress);
      const xPlentyBuySellContractInstance = await Tezos.wallet.at(xPlentyBuySellContract);

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          xPlentyBuySellContractInstance.methods.sell(minimumExpected, recipient, xPlentyAmount),
        );
      const batchOperation = await batch.send();
      store.dispatch(opentransactionInjectionModal(batchOperation.opHash));
      await batchOperation.confirmation().then(() => batchOperation.opHash);
      store.dispatch(closetransactionInjectionModal());
      store.dispatch(openToastOnSuccess());
      return {
        success: true,
        operationId: batchOperation.hash,
      };
    }
  } catch (error) {
    console.log(error);
    store.dispatch(closetransactionInjectionModal());
    store.dispatch(openToastOnFail());
  }
};
