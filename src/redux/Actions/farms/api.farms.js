const axios = require('axios');
const CONFIG = require('../../../CONFIG/config2');
export const getFarmsData = async (isActive) => {
    try {
        let url = null;
        if(isActive)
        {
            url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['FARMS-ACTIVE'];
        }
        else
        {
            url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['FARMS-INACTIVE'];
        }
        const response = axios.get(url);
        return {
            success : true,
            response : response.data
        }
    }
    catch(error)
    {
        return {
            success : false,
            response : {}
        }
    }
    
}

export const stakeFarm = async (amount, farmIdentifier , isActive, position) => {
    try {
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
      const options = {
        name: CONFIG.NAME,
      };
      const network = {
        type: CONFIG.WALLET_NETWORK,
      };
      const wallet = new BeaconWallet(options);
      await wallet.client.requestPermissions({
        network,
      });
      const connectedNetwork = CONFIG.NETWORK;
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
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  };