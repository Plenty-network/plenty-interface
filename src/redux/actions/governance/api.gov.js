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
      const ContractAddress = CONFIG.GOVERNANCE.address;
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
      'https://mainnet.smartpy.io/chains/main/blocks/head/context/contracts/KT1HiQmDGiMxEmLdbTNpVZpxwnjgXNdkoyyP/storage',
    );

    const abstainTokensCount = parseInt(response.data.args[0].args[0].args[0].int) / 1e18;

    const absCount = parseInt(response.data.args[0].args[0].args[1].int);

    const nayTokensCount = parseInt(response.data.args[0].args[0].args[2].int) / 1e18;

    const nayCount = parseInt(response.data.args[0].args[1].args[0].int);

    const yayTokensCount = parseInt(response.data.args[3].int) / 1e18;

    const yayCount = parseInt(response.data.args[4].int);

    const totalVotes = yayCount + nayCount + absCount;
    const yayPer = (yayCount / totalVotes) * 100;
    const nayPer = (nayCount / totalVotes) * 100;
    const absPer = (absCount / totalVotes) * 100;

    const data = {
      yayCount: yayCount,
      nayCount: nayCount,
      absCount: absCount,
      totalVotes: totalVotes.toFixed(),
      yayPercentage: yayPer.toFixed(2),
      nayPercentage: nayPer.toFixed(2),
      absPercentage: absPer.toFixed(2),
      yayTokens: yayTokensCount.toFixed(2),
      nayTokens: nayTokensCount.toFixed(2),
      absTokens: abstainTokensCount.toFixed(2),
    };
    return {
      success: true,
      data,
    };
  }
};
