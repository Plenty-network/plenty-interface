import axios from 'axios';
import CONFIG from '../../../config/config';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { RPC_NODE } from '../../../constants/localStorage';

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
export const submitVote = async (voteNumber) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      const ContractAddress = CONFIG.governance.address;
      const results = await Tezos.contract.at(ContractAddress);
      const batch = Tezos.wallet.batch().withContractCall(results.methods.vote(voteNumber));
      const batchOperation = await batch.send();
      await batchOperation.confirmation();
      return {
        success: true,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
};
export const getVoteDataApi = async (status) => {
  if (status) {
    // const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    // const dexContractAddress = CONFIG.governance.address;

    // const response = await axios.get(
    //   `${rpcNode}chains/main/blocks/head/context/contracts/${dexContractAddress}/storage`,
    // );
    const response = await axios.get(
      'https://mainnet.smartpy.io/chains/main/blocks/head/context/contracts/KT1JkG8yMiV9XTTVH9GMoFXbB5LKFFSwfLju/storage',
    );

    let yayCount = parseInt(response.data.args[4].int);
    if (yayCount) {
      yayCount = yayCount * 1e-18;
      console.log(yayCount);
    }

    let nayCount = parseInt(response.data.args[0].args[0].args[1].int);
    if (nayCount) {
      nayCount = nayCount * 1e-18;
    }

    let abstainCount = parseInt(response.data.args[0].args[0].args[0].int);
    if (abstainCount) {
      abstainCount = abstainCount * 1e-18;
    }
    console.log(abstainCount);
    const totalVotes = yayCount + nayCount + abstainCount;
    const yayPer = (yayCount / totalVotes) * 100;
    const nayPer = (nayCount / totalVotes) * 100;
    const absPer = (abstainCount / totalVotes) * 100;

    const data = {
      yayCount: yayCount.toFixed(1),
      nayCount: nayCount.toFixed(1),
      absCount: abstainCount.toFixed(1),
      totalVotes: totalVotes.toFixed(),
      yayPercentage: yayPer.toFixed(1),
      nayPercentage: nayPer.toFixed(1),
      absPercentage: absPer.toFixed(1),
    };
    return {
      success: true,
      data,
    };
  }
};
