/* eslint-disable no-unused-vars */

//
import Web3 from 'web3';
import axios from 'axios';
import { TezosToolkit, OpKind } from '@taquito/taquito';
import CONFIG from '../../config/config';
import { BridgeConfiguration } from '../Config/BridgeConfig';
import ERC20_ABI from '../../abi/erc20.ts';
import CUSTODIAN_ABI from '../../abi/custodianContract.ts';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
/* eslint-enable no-unused-vars */

const getUserAddress = async () => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    const data = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return {
      success: true,
      address: data[0],
    };
  } else {
    console.log('Need to install MetaMask');
    alert('Please install MetaMask browser extension to interact');
    return {
      success: false,
      error: 'Need to install MetaMask',
    };
  }
};

/* use to get balance of a token, returns balance without decimals
tokenAddress: address of the token
userAddress: address of the user ETHEREUM */
export const getBalance = async (tokenAddress, userAddress) => {
  const web3 = Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
  const balance = await tokenContract.methods.balanceOf(userAddress).call();
  return balance;
};

/* Approve a token for wrapping, first step of wrapping
tokenIn: tokenIn Object
{
    name:name,
    image:image,
    tokenData:{
        address:
        ...
        ...
    },
}
chain:chain selected
amount: Amount to wrap
  */
export const approveToken = async (tokenIn, chain, amount) => {
  const web3 = new Web3(window.ethereum);
  const userData = await getUserAddress();
  if (userData.success && userData.address) {
    const userAddress = userData.address;
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenIn.tokenData.CONTRACT_ADDRESS);
    const amountToAprove = amount * 10 ** tokenIn.tokenData.DECIMALS;
    let result;
    await tokenContract.methods
      .approve(wrapContractAddress, amountToAprove.toString())
      .send({
        from: userAddress,
      })
      .on('receipt', function (receipt) {
        console.log('receipt', receipt);
        result = {
          success: true,
          transactionHash: receipt.transactionHash,
          amount: amount,
        };
      })
      .on('error', function (error) {
        result = {
          success: false,
          error: error,
        };
      });
    return result;
  } else {
    return {
      success: false,
      error: userData.error,
    };
  }
};

/* Wrap a token, second step of wrapping
tokenIn: tokenIn Object
{
    name:name,
    image:image,
    tokenData:{
        address:
        ...
        ...
    },
}
chain:chain selected
amount: Amount to wrap
tzAddress: users's tezos address
  */
export const wrap = async (tokenIn, chain, amount, tzAddress) => {
  console.log(tzAddress);
  const web3 = new Web3(window.ethereum);
  const userData = await getUserAddress();
  if (userData.success && userData.address) {
    const userAddress = userData.address;
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    console.log(wrapContractAddress);
    const tokenContractAddress = tokenIn.tokenData.CONTRACT_ADDRESS;
    console.log(tokenContractAddress);
    const amountToWrap = amount * 10 ** tokenIn.tokenData.DECIMALS;
    const wrapContract = new web3.eth.Contract(CUSTODIAN_ABI, wrapContractAddress);
    let result;
    await wrapContract.methods
      .wrapERC20(tokenContractAddress, amountToWrap.toString(), tzAddress)
      .send({
        from: userAddress,
      })
      .on('receipt', function (receipt) {
        console.log('receipt', receipt);
        result = {
          success: true,
          transactionHash: receipt.transactionHash,
        };
      })
      .on('error', function (error) {
        result = {
          success: false,
          error: error,
        };
      });
    return result;
  } else {
    return {
      success: false,
      error: userData.error,
    };
  }
};

/* Get mint status of a token, third step of wrapping
takes in txHash of the wrap call & chain and returns the status of the mint (Awating Signatures, awaating confirmation thersold, readyToMint), if ready to mint will return signatures.
  */
export const getMintStatus = async (txHash, chain) => {
  const networkSelected = CONFIG.NETWORK;
  const availableChainsObject = CONFIG.BRIDGES_INDEXER_LINKS[networkSelected];
  const wrapSignReq = BridgeConfiguration.getWrapSignReq(chain);
  const indexerLink = availableChainsObject[chain].slice(0, -13);
  const data = await axios.get(indexerLink + 'wraps', {
    params: {
      hash: txHash,
      type: 'ERC20',
    },
  });
  if (data.data.result.length === 0) {
    return {
      data: null,
      signaturesCount: 0,
      awaitingSig: true,
      awaitingConfirmation: true,
      readyToMint: false,
    };
  } else {
    const wrapData = data.data.result[0];
    const signaturesCount = Object.keys(wrapData.signatures).length;
    return {
      data: wrapData,
      signaturesCount: signaturesCount,
      signaturesReq: wrapSignReq,
      confirmations: wrapData.confirmations,
      confirmationsRequired: wrapData.confirmationsThreshold,
      awaitingSig: signaturesCount < wrapSignReq,
      awaitingConfirmation: wrapData.confirmations < wrapData.confirmationsThreshold,
      readyToMint:
        !(wrapData.confirmations < wrapData.confirmationsThreshold) &&
        !(signaturesCount < wrapSignReq),
    };
  }
};

/* mint tokens on tezos side
takes in data from getMintStatus and mints the tokens
  */

export const mintTokens = async (wrapData, chain) => {
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
    const minterContractAddress = BridgeConfiguration.getTezosMinterContract(chain);
    const quorumContractAddress = BridgeConfiguration.getTezosQourumContract(chain);
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(quorumContractAddress);
    const [blockHash, logIndex] = wrapData.id.split(':');
    console.log(
      'mint_erc20',
      wrapData.token.toLowerCase().substring(2),
      blockHash.substring(2),
      logIndex,
      wrapData.destination,
      wrapData.amount,
      minterContractAddress,
      Object.entries(wrapData.signatures),
    );
    const batch = Tezos.wallet.batch([
      {
        kind: OpKind.TRANSACTION,
        ...contract.methods
          .minter(
            'mint_erc20',
            wrapData.token.toLowerCase().substring(2),
            blockHash.substring(2),
            logIndex,
            wrapData.destination,
            wrapData.amount,
            minterContractAddress,
            Object.entries(wrapData.signatures),
          )
          .toTransferParams({}),
      },
    ]);
    const batchOp = await batch.send();
    await batchOp.confirmation();
    console.log('batchOp', batchOp.opHash);
    return {
      success: true,
      transactionHash: batchOp.opHash,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: e,
    };
  }
};
