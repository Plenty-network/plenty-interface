import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit , OpKind } from '@taquito/taquito';
import axios from 'axios';
import CONFIG from '../../../config/config';
import { CheckIfWalletConnected } from "../../../apis/wallet/wallet";
import { stakingOnPondProcessing, unstakingOnPondProcessing } from "./ponds.action";
import store from "../../store/store";
import { RPC_NODE } from '../../../constants/localStorage';
import { beaconWallet } from '../../../utils/wallet';

export const getPondsData = async (isActive) => {
    try {
        let url = null;
        if(isActive)
        {
            url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['PONDS-ACTIVE'];
        }
        else
        {
            url = CONFIG.SERVERLESS_BASE_URL + CONFIG.SERVERLESS_REQUEST.mainnet['PONDS-INACTIVE'];
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

export const stake = async (amount, pondIdentifier , isActive, position) => {
    try {
      const network = {
        type: CONFIG.WALLET_NETWORK,
      };
      const options = {
        name: CONFIG.NAME,
      };
      const connectedNetwork = CONFIG.NETWORK;
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork]
      // const wallet = new BeaconWallet(options);
      const wallet = beaconWallet;
      const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
      if (WALLET_RESP.success) {
        const account = await wallet.client.getActiveAccount();
        const userAddress = account.address;
        const Tezos = new TezosToolkit(rpcNode);
        Tezos.setRpcProvider(rpcNode);
        Tezos.setWalletProvider(wallet);
        const pondContractInstance = await Tezos.wallet.at(
          //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].CONTRACT
          CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT
        );
        const tokenContractInstance = await Tezos.wallet.at(
          //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].LP_TOKEN
          CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].LP_TOKEN
        );
        let tokenAmount =
          amount *
          Math.pow(
            10,
            //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].TOKEN_DECIMAL
            CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].TOKEN_DECIMAL
          );
        let batch = null;
        if (
          //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].TYPE === 'FA1.2'
          CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].TYPE === 'FA1.2'
        ) {
          batch = await Tezos.wallet
            .batch()
            .withContractCall(
              tokenContractInstance.methods.approve(
                //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].CONTRACT,
                CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT,
                tokenAmount
              )
            )
            .withContractCall(pondContractInstance.methods.stake(tokenAmount));
        } else {
          batch = Tezos.wallet
            .batch()
            .withContractCall(
              tokenContractInstance.methods.update_operators([
                {
                  add_operator: {
                    owner: userAddress,
                    operator:
                      //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].CONTRACT,
                      CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT,
                    token_id:
                      //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].TOKEN_ID,
                      CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].TOKEN_ID
                  },
                },
              ])
            )
            .withContractCall(pondContractInstance.methods.stake(tokenAmount))
            .withContractCall(
              tokenContractInstance.methods.update_operators([
                {
                  remove_operator: {
                    owner: userAddress,
                    operator:
                      //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].CONTRACT,
                      CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT,
                    token_id:
                      //CONFIG.CONTRACT[connectedNetwork].PONDS[pondIdentifier].TOKEN_ID,
                      CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].TOKEN_ID
                  },
                },
              ])
            );
        }
        const batchOperation = await batch.send();
        store.dispatch(stakingOnPondProcessing(batchOperation))
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

  export const unstake = async (amount, mapKey, pondIdentifier, isActive, position) => {
    try {
      const network = {
        type: CONFIG.WALLET_NETWORK,
      };
      const options = {
        name: CONFIG.NAME,
      };
      // const wallet = new BeaconWallet(options);
      const wallet = beaconWallet;
      const connectedNetwork = CONFIG.NETWORK;
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork]
      const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
      if (WALLET_RESP.success) {
        const Tezos = new TezosToolkit(rpcNode);
        Tezos.setRpcProvider(rpcNode);
        Tezos.setWalletProvider(wallet);
  
        const contractInstance = await Tezos.wallet.at(
          //CONFIG.CONTRACT[connectedNetwork].PLENTY_PONDS_CONTRACT
          CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT
        );
        let tokenAmount = amount * Math.pow(10, CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].DECIMAL);
        const operation = await contractInstance.methods
          .unstake(tokenAmount, mapKey)
          .send();
        store.dispatch(unstakingOnPondProcessing(operation))
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

  export const harvest = async (pondIdentifier, isActive, position) => {
    try {
      const options = {
        name: CONFIG.NAME,
      };
      const network = {
        type: CONFIG.WALLET_NETWORK,
      };
      // const wallet = new BeaconWallet(options);
      const wallet = beaconWallet;
      await wallet.client.requestPermissions({
        network,
      });
      const connectedNetwork = CONFIG.NETWORK;
      const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork]
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      const contractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].PLENTY_PONDS_CONTRACT
        CONFIG.PONDS[connectedNetwork][pondIdentifier][isActive === true ? 'active' : 'inactive'][position].CONTRACT
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