import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, OpKind } from '@taquito/taquito';
import axios from 'axios';
import CONFIG from '../../../config/config';
import { CheckIfWalletConnected } from '../../../apis/wallet/wallet';
import {
  stakingOnPoolProcessing,
  unstakingOnPoolProcessing,
} from './pools.actions';
import store from '../../store/store';

const fetchStorage = async (
  identifier,
  address,
  decimal,
  priceOfTokenInUsd,
  priceOfPlentyInUSD
) => {
  try {
    const url = `https://mainnet.smartpy.io/chains/main/blocks/head/context/contracts/${address}/storage`;
    const response = await axios.get(url);

    let totalSupply = response.data.args[3].int;
    totalSupply = (totalSupply / Math.pow(10, decimal)).toFixed(6);
    totalSupply = parseInt(totalSupply);

    let rewardRate = response.data.args[1].args[1].int;
    rewardRate = (rewardRate / Math.pow(10, decimal)).toFixed(18);
    rewardRate = parseFloat(rewardRate);

    let DPY =
      (rewardRate * 2880 * priceOfPlentyInUSD) /
      (totalSupply * priceOfTokenInUsd);
    DPY = DPY * 100;

    let intervalList = [1, 7, 30, 365];
    let roiTable = [];

    for (let interval of intervalList) {
      roiTable.push({
        roi: DPY * interval,
        PlentyPer1000dollar: (10 * DPY * interval) / priceOfPlentyInUSD,
      });
    }

    let APR =
      (rewardRate * 1051200 * priceOfPlentyInUSD) /
      (totalSupply * priceOfTokenInUsd);
    APR = APR * 100;

    let totalLiquidty = totalSupply * priceOfTokenInUsd;

    return {
      success: true,
      identifier,
      APR,
      totalLiquidty,
      address,
      roiTable,
      rewardRate,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const getPoolsData = async (isActive) => {
  try {
    let promises = [];
    // let dexPromises = [];
    // const xtzPriceResponse = await axios.get('https://api.coingecko.com/api/v3/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false');
    // const xtzPriceInUsd = xtzPriceResponse.data.market_data.current_price.usd;
    const tokenPrices = await axios.get('https://api.teztools.io/token/prices');
    const tokenPricesData = tokenPrices.data.contracts;
    let priceOfPlenty = 0;
    let priceOfToken = [];
    let tokenData = {};

    for (let i in tokenPricesData) {
      if (
        tokenPricesData[i].symbol === 'PLENTY' &&
        tokenPricesData[i].tokenAddress ===
          'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b'
      ) {
        priceOfPlenty = tokenPricesData[i].usdValue;
        tokenData['PLENTY'] = {
          tokenName: tokenPricesData[i].symbol,
          tokenAddress: tokenPricesData[i].tokenAddress,
          tokenValue: tokenPricesData[i].usdValue,
        };
      } else if (
        tokenPricesData[i].tokenAddress !==
        'KT1CU9BhZZ7zXJKwZ264xhzNx2eMNoUGVyCy'
      ) {
        tokenData[tokenPricesData[i].symbol] = {
          tokenName: tokenPricesData[i].symbol,
          tokenAddress: tokenPricesData[i].tokenAddress,
          tokenValue: tokenPricesData[i].usdValue,
        };
      }
    }

    for (let key in CONFIG.POOLS[CONFIG.NETWORK]) {
      for (let key1 in CONFIG.POOLS[CONFIG.NETWORK][key][
        isActive === true ? 'active' : 'inactive'
      ]) {
        if (
          tokenData[key].tokenName === key &&
          tokenData[key].tokenAddress ===
            CONFIG.POOLS[CONFIG.NETWORK][key][
              isActive === true ? 'active' : 'inactive'
            ][key1].TOKEN
        ) {
          priceOfToken[key] = tokenData[key].tokenValue;
        }
        promises.push(
          fetchStorage(
            key,
            CONFIG.POOLS[CONFIG.NETWORK][key][
              isActive === true ? 'active' : 'inactive'
            ][key1].CONTRACT,
            CONFIG.POOLS[CONFIG.NETWORK][key][
              isActive === true ? 'active' : 'inactive'
            ][key1].DECIMAL,
            priceOfToken[key],
            priceOfPlenty
          )
        );
      }
    }

    const poolResponse = await Promise.all(promises);
    console.log({ poolResponse });
    let poolsData = {};
    for (let i in poolResponse) {
      poolsData[poolResponse[i].address] = {
        APR: poolResponse[i].APR,
        totalLiquidty: poolResponse[i].totalLiquidty,
        roiTable: poolResponse[i].roiTable,
        rewardRate: poolResponse[i].rewardRate,
      };

      // identifier,
      //     APR,
      //     totalLiquidty,
      //     address,
      //     roiTable,
      //     rewardRate
    }
    return {
      success: true,
      response: poolsData,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      response: {},
    };
  }
  // try {
  //     let url = null;
  //     if(isActive)
  //     {
  //         url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['POOLS-ACTIVE'];
  //     }
  //     else
  //     {
  //         url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['POOLS-INACTIVE'];
  //     }
  //     const response = axios.get(url);
  //     return {
  //         success : true,
  //         response : response.data
  //     }
  // }
  // catch(error)
  // {
  //     return {
  //         success : false,
  //         response : {}
  //     }
  // }
};

export const stake = async (amount, poolIdentifier, isActive, position) => {
  try {
    console.log(amount, poolIdentifier, isActive, position);
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    const connectedNetwork = CONFIG.NETWORK;
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    if (WALLET_RESP.success) {
      const account = await wallet.client.getActiveAccount();
      const userAddress = account.address;
      const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setWalletProvider(wallet);
      const poolContractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].CONTRACT
        CONFIG.POOLS[connectedNetwork][poolIdentifier][
          isActive === true ? 'active' : 'inactive'
        ][position].CONTRACT
      );
      const tokenContractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].LP_TOKEN
        CONFIG.POOLS[connectedNetwork][poolIdentifier][
          isActive === true ? 'active' : 'inactive'
        ][position].TOKEN
      );
      let tokenAmount =
        amount *
        Math.pow(
          10,
          //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].TOKEN_DECIMAL
          CONFIG.POOLS[connectedNetwork][poolIdentifier][
            isActive === true ? 'active' : 'inactive'
          ][position].TOKEN_DECIMAL
        );
      let batch = null;
      if (
        //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].TYPE === 'FA1.2'
        CONFIG.POOLS[connectedNetwork][poolIdentifier][
          isActive === true ? 'active' : 'inactive'
        ][position].TYPE === 'FA1.2'
      ) {
        batch = await Tezos.wallet
          .batch()
          .withContractCall(
            tokenContractInstance.methods.approve(
              //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].CONTRACT,
              CONFIG.POOLS[connectedNetwork][poolIdentifier][
                isActive === true ? 'active' : 'inactive'
              ][position].CONTRACT,
              tokenAmount
            )
          )
          .withContractCall(poolContractInstance.methods.stake(tokenAmount));
      } else {
        batch = Tezos.wallet
          .batch()
          .withContractCall(
            tokenContractInstance.methods.update_operators([
              {
                add_operator: {
                  owner: userAddress,
                  operator:
                    //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].CONTRACT,
                    CONFIG.POOLS[connectedNetwork][poolIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].CONTRACT,
                  token_id:
                    //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].TOKEN_ID,
                    CONFIG.POOLS[connectedNetwork][poolIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].TOKEN_ID,
                },
              },
            ])
          )
          .withContractCall(poolContractInstance.methods.stake(tokenAmount))
          .withContractCall(
            tokenContractInstance.methods.update_operators([
              {
                remove_operator: {
                  owner: userAddress,
                  operator:
                    //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].CONTRACT,
                    CONFIG.POOLS[connectedNetwork][poolIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].CONTRACT,
                  token_id:
                    //CONFIG.CONTRACT[connectedNetwork].POOLS[poolIdentifier].TOKEN_ID,
                    CONFIG.POOLS[connectedNetwork][poolIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].TOKEN_ID,
                },
              },
            ])
          );
      }
      const batchOperation = await batch.send();
      store.dispatch(stakingOnPoolProcessing(batchOperation));
      await batchOperation.confirmation().then(() => batchOperation.opHash);
      return {
        success: true,
        operationId: batchOperation.opHash,
      };
    } else {
      return {
        success: true,
        error: WALLET_RESP.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const unstake = async (
  stakesToUnstake,
  poolIdentifier,
  isActive,
  position
) => {
  try {
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    const wallet = new BeaconWallet(options);
    const connectedNetwork = CONFIG.NETWORK;
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setWalletProvider(wallet);

      const contractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].PLENTY_POOLS_CONTRACT
        CONFIG.POOLS[connectedNetwork][poolIdentifier][
          isActive === true ? 'active' : 'inactive'
        ][position].CONTRACT
      );
      let unstakeBatch = [];
      let amount;
      stakesToUnstake.map((stake) => {
        amount =
          stake.amount *
          Math.pow(
            10,
            CONFIG.POOLS[connectedNetwork][poolIdentifier][
              isActive === true ? 'active' : 'inactive'
            ][position].TOKEN_DECIMAL
          );
        unstakeBatch.push({
          kind: OpKind.TRANSACTION,
          ...contractInstance.methods
            .unstake(amount, stake.mapId)
            .toTransferParams(),
        });
      });
      let batch = await Tezos.wallet.batch(unstakeBatch);
      let batchOperation = await batch.send();
      store.dispatch(unstakingOnPoolProcessing(batchOperation));
      await batchOperation.confirmation().then(() => batchOperation.hash);
      return {
        success: true,
        operationId: batchOperation.opHash,
      };
    } else {
      return {
        success: false,
        error: WALLET_RESP.error,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error,
    };
  }
};

export const harvest = async (poolIdentifier, isActive, position) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const wallet = new BeaconWallet(options);
    const connectedNetwork = CONFIG.NETWORK;
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
    if (WALLET_RESP.success) {
      Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
      Tezos.setWalletProvider(wallet);
      const contractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].PLENTY_POOLS_CONTRACT
        CONFIG.POOLS[connectedNetwork][poolIdentifier][
          isActive === true ? 'active' : 'inactive'
        ][position].CONTRACT
      );
      const operation = await contractInstance.methods.GetReward(1).send();
      await operation.confirmation().then(() => operation.opHash);
      return {
        success: true,
        operationId: operation.opHash,
      };
    } else {
      return {
        success: false,
        error: WALLET_RESP.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
