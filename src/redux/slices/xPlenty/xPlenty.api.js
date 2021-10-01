import Axios from 'axios';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { OpKind, TezosToolkit } from '@taquito/taquito';
import CONFIG from '../../../config/config';
import { RPC_NODE } from '../../../constants/localStorage';

import store from '../../store/store';
import {
  opentransactionInjectionModal,
  closetransactionInjectionModal,
  openToastOnFail,
  openToastOnSuccess,
  closeToast,
} from './xPlenty.slice';

const getPlentyPrice = (tokenPriceData) => {
  try {
    let plentyPrice = 0;
    for (let i in tokenPriceData.contracts) {
      if (
        tokenPriceData.contracts[i].symbol === 'PLENTY' &&
        tokenPriceData.contracts[i].tokenAddress ===
          'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b'
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

export const xPlentyComputations = async () => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode =
      localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];

    let axiosPromises = [];

    // Getting Plenty Curve Balance
    axiosPromises.push(
      Axios.get(
        `${rpcNode}chains/main/blocks/head/context/big_maps/${CONFIG.xPlenty[connectedNetwork].plentyTokenContract.balancesMapId}/${CONFIG.xPlenty[connectedNetwork].xPlentyCurve.bigMapExpression}`
      )
    );

    // Getting Current Block
    axiosPromises.push(
      Axios.get('https://api.mainnet.tzkt.io/v1/blocks/count')
    );

    // Getting Reward Manager Storage
    axiosPromises.push(
      Axios.get(
        `${rpcNode}chains/main/blocks/head/context/contracts/${CONFIG.xPlenty[connectedNetwork].rewardManager.address}/storage`
      )
    );

    // Getting Plenty Curve Storage
    axiosPromises.push(
      Axios.get(
        `${rpcNode}chains/main/blocks/head/context/contracts/${CONFIG.xPlenty[connectedNetwork].xPlentyCurve.address}/storage`
      )
    );

    // Teztools
    axiosPromises.push(Axios.get(`https://api.teztools.io/token/prices`));

    let axiosResponse = await Promise.all(axiosPromises);
    const xPlentyPlentyBalanceResponse = axiosResponse[0];
    let currentBlockLevel = axiosResponse[1];
    const rewardManagerStorageResponse = axiosResponse[2];
    const xPlentyCurveStorageResponse = axiosResponse[3];
    const tokenPricesData = axiosResponse[4].data;

    let plentyBalance = parseInt(xPlentyPlentyBalanceResponse.data.args[1].int);

    let rewardManagerStorage = {};
    rewardManagerStorage['periodFinish'] = parseInt(
      rewardManagerStorageResponse.data.args[1].args[1].int
    );
    rewardManagerStorage['lastUpdate'] = parseInt(
      rewardManagerStorageResponse.data.args[0].args[2].int
    );
    rewardManagerStorage['rewardRate'] = parseInt(
      rewardManagerStorageResponse.data.args[3].int
    );

    let xPlentyCurveStorage = {};
    xPlentyCurveStorage['totalSupply'] = parseInt(
      xPlentyCurveStorageResponse.data.args[3].int
    );

    let balanceUpdate =
      Math.min(currentBlockLevel, rewardManagerStorage.periodFinish) -
      rewardManagerStorage.lastUpdate;

    if (balanceUpdate > 0) {
      plentyBalance += balanceUpdate * rewardManagerStorage.rewardRate;
    }
    let plentyPerXplenty = xPlentyCurveStorage.totalSupply / plentyBalance;
    let APR =
      (rewardManagerStorage.rewardRate * 1051200) /
      xPlentyCurveStorage.totalSupply;

    let xPlentySupplyToShow =
      xPlentyCurveStorage.totalSupply / Math.pow(10, 18);
    let plentyStakedToShow = plentyBalance / Math.pow(10, 18);
    let plentyPrice = getPlentyPrice(tokenPricesData);
    console.log({ plentyPrice });
    let ValueLockedToShow =
      (plentyBalance / Math.pow(10, 18)) * plentyPrice.plentyPrice;
    return {
      plentyBalance,
      totalSupply: xPlentyCurveStorage.totalSupply,
      plentyPerXplenty: plentyPerXplenty,
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
      APR: 0,
      xPlentySupplyToShow: 0,
      plentyStakedToShow: 0,
      ValueLockedToShow: 0,
    };
  }
};

export const getExpectedPlenty = (
  plentyBalance,
  totalSupply,
  xplentyAmount
) => {
  if (totalSupply < xplentyAmount) {
    return 0;
  }
  return ((xplentyAmount * plentyBalance) / totalSupply) * 0.995;
};

export const getExpectedxPlenty = (
  plentyBalance,
  totalSupply,
  plentyAmount
) => {
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

export const buyXPlenty = async (plentyAmount, minimumExpected, recipient) => {
  console.log({ plentyAmount, minimumExpected, recipient });
  try {
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    minimumExpected = minimumExpected * Math.pow(10, 18);
    minimumExpected = Math.floor(minimumExpected);
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode =
      localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      let batch = null;
      let plentyContractAddress =
        CONFIG.xPlenty[connectedNetwork].plentyTokenContract.address;
      let xPlentyBuySellContract =
        CONFIG.xPlenty[connectedNetwork].xPlentyCurve.address;
      let plentyContractInstance = await Tezos.wallet.at(plentyContractAddress);
      let xPlentyBuySellContractInstance = await Tezos.wallet.at(
        xPlentyBuySellContract
      );

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          plentyContractInstance.methods.approve(
            xPlentyBuySellContract,
            plentyAmount
          )
        )
        // 0 -> minimum
        .withContractCall(
          xPlentyBuySellContractInstance.methods.buy(
            minimumExpected,
            plentyAmount,
            recipient
          )
        )
        .withContractCall(
          plentyContractInstance.methods.approve(xPlentyBuySellContract, 0)
        );
      const batchOperation = await batch.send();
      store.dispatch(opentransactionInjectionModal());
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

export const sellXPlenty = async (
  xPlentyAmount,
  minimumExpected,
  recipient
) => {
  try {
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    minimumExpected = minimumExpected * Math.pow(10, 18);
    minimumExpected = Math.floor(minimumExpected);
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode =
      localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      let batch = null;
      let xPlentyContractAddress =
        CONFIG.xPlenty[connectedNetwork].xPlentyTokenContract.address;
      let xPlentyBuySellContract =
        CONFIG.xPlenty[connectedNetwork].xPlentyCurve.address;

      let xPlentyContractInstance = await Tezos.wallet.at(
        xPlentyContractAddress
      );
      let xPlentyBuySellContractInstance = await Tezos.wallet.at(
        xPlentyBuySellContract
      );

      batch = Tezos.wallet
        .batch()
        .withContractCall(
          xPlentyContractInstance.methods.approve(
            xPlentyBuySellContract,
            xPlentyAmount
          )
        )
        .withContractCall(
          xPlentyBuySellContractInstance.methods.sell(
            minimumExpected,
            recipient,
            xPlentyAmount
          )
        )
        .withContractCall(
          xPlentyContractInstance.methods.approve(xPlentyBuySellContract, 0)
        );
      const batchOperation = await batch.send();
      store.dispatch(opentransactionInjectionModal());
      await batchOperation.confirmation().then(() => batchOperation.opHash);
      store.dispatch(closetransactionInjectionModal());
      store.dispatch(openToastOnSuccess());
      console.log({ batchOperation });
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
