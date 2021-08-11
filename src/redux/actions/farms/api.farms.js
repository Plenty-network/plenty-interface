import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
const axios = require('axios');
const CONFIG = require('../../../config/config');


const fetchStorageOfStakingContract = async (identifier, address, priceOfStakeTokenInUsd, priceOfPlentyInUSD) => {
  try {
      console.log({priceOfStakeTokenInUsd, priceOfPlentyInUSD});
      //const url = `https://tezos-prod.cryptonomic-infra.tech/chains/main/blocks/head/context/contracts/${address}/storage`;
      const url = `${CONFIG.RPC_NODES[CONFIG.NETWORK]}chains/main/blocks/head/context/contracts/${address}/storage`;
      const response = await axios.get(url);
      
      let totalSupply = response.data.args[3].int;
      totalSupply = (totalSupply / Math.pow(10, 18)).toFixed(2);
      totalSupply = parseFloat(totalSupply);

      let rewardRate = response.data.args[1].args[1].int;
      rewardRate = (rewardRate / Math.pow(10, 18)).toFixed(18);
      rewardRate = parseFloat(rewardRate);

      let DPY = (rewardRate * 2880 * priceOfPlentyInUSD) / (totalSupply * priceOfStakeTokenInUsd);
      DPY = DPY * 100;

      let intervalList = [1, 7, 30, 365];
      let roiTable = [];

      for (let interval of intervalList) {
        roiTable.push({
          roi: DPY * interval,
          PlentyPer1000dollar:
            (10 * DPY * interval) / priceOfPlentyInUSD,
        });
      }

      let APR = (rewardRate * 1051200 * priceOfPlentyInUSD) / (totalSupply * priceOfStakeTokenInUsd);
      APR = APR * 100;

      let totalLiquidty = totalSupply * priceOfStakeTokenInUsd;      
      return {
          success : true,
          identifier,
          APR,
          totalLiquidty,
          roiTable,
          totalSupply,
          address,
          rewardRate
          
      }
  }
  catch(error)
  {   
      return {
          success : false,
          error
      }
  }
}

const getLpPriceFromDex = async (identifier , dexAddress) => {
  console.log(identifier)
  try {
      //const response = await axios.get(`https://tezos-prod.cryptonomic-infra.tech/chains/main/blocks/head/context/contracts/${dexAddress}/storage`)
      const response = await axios.get(`${CONFIG.RPC_NODES[CONFIG.NETWORK]}chains/main/blocks/head/context/contracts/${dexAddress}/storage`)
      //let token_pool = response.data.args[1].args[0].args[3];
      console.log(response.data);
      let tez_pool = parseInt(response.data.args[1].args[0].args[1].args[2].int);
      console.log({tez_pool});
      let total_Supply = null;
      if(identifier === 'PLENTY - XTZ')
      {
          total_Supply = parseInt(response.data.args[1].args[0].args[4].int);
      }
      else
      {
          total_Supply = parseInt(response.data.args[1].args[1].args[0].args[0].int);
      }
      //let total_Supply = parseInt(response.data.args[1].args[1].args[0].args[0].int);
      console.log({total_Supply});
      let lpPriceInXtz = (tez_pool*2)/total_Supply;
      return {
          success : true,
          identifier,
          lpPriceInXtz,
          tez_pool,
          total_Supply,
          dexAddress
      }
  }   
  catch(error)
  {
      console.log(error);
      return {
          
          success : false,
          identifier,
          lpPriceInXtz : 0,
      }
  }
}

export const getFarmsData = async (isActive) => {
  try {
    let promises = [];
    let dexPromises = [];
    const xtzPriceResponse = await axios.get(CONFIG.API.url);
    const xtzPriceInUsd = xtzPriceResponse.data.market_data.current_price.usd;
    const tokenPrices = await axios.get(CONFIG.API.tezToolTokenPrice);
    const tokenPricesData = tokenPrices.data.contracts;
    let priceOfPlenty = 0;
    for(let i in tokenPricesData)
    {
        if(tokenPricesData[i].symbol === 'PLENTY' && tokenPricesData[i].tokenAddress === 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b')
        {
            priceOfPlenty = tokenPricesData[i].usdValue
        }
    }
    console.log({priceOfPlenty});
    console.log({xtzPriceInUsd});
    for(let key in CONFIG.FARMS[CONFIG.NETWORK])
    {
        for(let i in CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive']) {            
            dexPromises.push(getLpPriceFromDex(key, CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i].DEX));
        }
    }
    const response = await Promise.all(dexPromises);
    console.log(response);
    let lpPricesInUsd = {};
    for(let i in response)
    {
        lpPricesInUsd[response[i].identifier] = response[i].lpPriceInXtz * xtzPriceInUsd;
    }
    console.log({lpPricesInUsd})

    for(let key in CONFIG.FARMS[CONFIG.NETWORK])
    {
        for(let i in CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive']) {            
            console.log(lpPricesInUsd[key] , priceOfPlenty);
            promises.push(fetchStorageOfStakingContract(key, CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i].CONTRACT,lpPricesInUsd[key] , priceOfPlenty));
        }
    }
    let farmsData = {};
    const farmResponse = await Promise.all(promises);
    for(let i in farmResponse)
    {
      farmsData[farmResponse[i].address] = {identifier : farmResponse[i].identifier,
        APR : farmResponse[i].APR,
        totalLiquidty : farmResponse[i].totalLiquidty,
        roiTable : farmResponse[i].roiTable,
        totalSupply : farmResponse[i].totalSupply,
        rewardRate : farmResponse[i].rewardRate}
    }
    console.log({farmsData});
    return {
      success : true,
      response : farmsData,
    }
  }
  catch(error)
  {
    console.log(error);
    return {
      success : false,
      response : {}
    }
  }
    // try {
    //     let url = null;
    //     if(isActive)
    //     {
    //         url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['FARMS-ACTIVE'];
    //     }
    //     else
    //     {
    //         url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['FARMS-INACTIVE'];
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
    
}

const CheckIfWalletConnected = async (wallet, somenet) => {
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

export const stakeFarm = async (amount, farmIdentifier , isActive, position) => {
    try {
      console.log(amount);
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
        console.log(farmIdentifier);
        console.log(CONFIG.FARMS[connectedNetwork]);
        const farmContractInstance = await Tezos.wallet.at(
          //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT
          
          CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT
        );
        const tokenContractInstance = await Tezos.wallet.at(
          //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].LP_TOKEN
          CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].LP_TOKEN
        );
        let tokenAmount =
          amount *
          Math.pow(
            10,
            //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TOKEN_DECIMAL
            CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].TOKEN_DECIMAL
          );
        let batch = null;
        if (
          //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TYPE === 'FA1.2'
          CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].TYPE === 'FA1.2'
        ) {
          batch = await Tezos.wallet
            .batch()
            .withContractCall(
              tokenContractInstance.methods.approve(
                //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT,
                CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT,
                tokenAmount
              )
            )
            .withContractCall(farmContractInstance.methods.stake(tokenAmount));
        } else {
          batch = Tezos.wallet
            .batch()
            .withContractCall(
              tokenContractInstance.methods.update_operators([
                {
                  add_operator: {
                    owner: userAddress,
                    operator:
                      //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT,
                      CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT,
                    token_id:
                      //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TOKEN_ID,
                      CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].TOKEN_ID
                  },
                },
              ])
            )
            .withContractCall(farmContractInstance.methods.stake(tokenAmount))
            .withContractCall(
              tokenContractInstance.methods.update_operators([
                {
                  remove_operator: {
                    owner: userAddress,
                    operator:
                      //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT,
                      CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT,
                    token_id:
                      //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TOKEN_ID,
                      CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].TOKEN_ID
                  },
                },
              ])
            );
        }
        const batchOperation = await batch.send();
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
      console.log({error});
      return {
        success: false,
        error,
      };
    }
  };

  export const unstake = async (amount, mapKey, farmIdentifier, isActive, position) => {
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
          //CONFIG.CONTRACT[connectedNetwork].PLENTY_FARM_CONTRACT
          CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT
        );
        let tokenAmount = amount * Math.pow(10, CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].DECIMAL);
        const operation = await contractInstance.methods
          .unstake(tokenAmount, mapKey)
          .send();
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

  export const harvest = async (farmIdentifier, isActive, position) => {

    try {
      console.log({farmIdentifier, isActive, position});
      const options = {
        name: CONFIG.NAME,
      };
      const network = {
        type: CONFIG.WALLET_NETWORK,
      };
      // const wallet = new BeaconWallet(options);
      // await wallet.client.requestPermissions({
      //   network,
      // });
      const wallet = new BeaconWallet(options);
      const connectedNetwork = CONFIG.NETWORK;
      const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
      if (WALLET_RESP.success) {
        const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
        Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
        Tezos.setWalletProvider(wallet);
        const contractInstance = await Tezos.wallet.at(
          //CONFIG.CONTRACT[connectedNetwork].PLENTY_FARM_CONTRACT
          CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT
        );
        const operation = await contractInstance.methods.GetReward(1).send();
        await operation.confirmation().then(() => operation.opHash);
        return {
          success: true,
          operationId: operation.opHash,
        };
      }
      else {
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