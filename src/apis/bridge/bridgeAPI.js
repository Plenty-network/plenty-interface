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
import { BigNumber, ethers } from 'ethers';
/* eslint-enable no-unused-vars */

const fakeSigner = (account, publicKey) => ({
  publicKey() {
    return Promise.resolve(publicKey);
  },
  publicKeyHash() {
    return Promise.resolve(account);
  },
  secretKey() {
    return Promise.reject('Noop signer');
  },
  sign(op, magicByte) {
    console.log(op, magicByte);
    return Promise.reject('Noop signer');
  },
});

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
  try {
    const web3 = new Web3(window.ethereum);
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    const balance = await tokenContract.methods.balanceOf(userAddress).call();
    return {
      success: true,
      balance: balance,
    };
  } catch (error) {
    return {
      success: false,
      balance: 0,
      error: error.message,
    };
  }
};

/* use to get balance of a token, returns balance without decimals
tokenAddress: address of the token
userAddress: address of the user Tezos
tokenId: tokenId of the token
tokenDecimals: decimals of the token 
*/
export const getBalanceTez = async (tokenContract, tokenId, userAddress, tokenDecimals) => {
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
    const Tezos = new TezosToolkit(rpcNode);

    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    const account = await wallet.client.getActiveAccount();
    Tezos.setSignerProvider(fakeSigner(account.address, account.publicKey));
    const contract = await Tezos.contract.at(tokenContract);
    const [{ balance }] = await contract.views
      .balance_of([{ owner: userAddress, token_id: tokenId }])
      .read();
    console.log(
      'balance of token',
      balance.div(10 ** tokenDecimals).toString(),
      tokenId,
      tokenContract,
    );
    return {
      success: true,
      balance: balance.div(10 ** tokenDecimals).toString(),
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
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

returns a transaction hash which will be used to call getMintStatus
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

  //Awaiting confirtmation 3/10
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

/* initialte unwrap on tezos side
Pass the chain, amoun to unwrap, and the token user wants to unwrap (Tezos side)
return a tx hash which will be used to fetch unwrap status
*/
export const unwrap = async (chain, amount, tokenIn) => {
  try {
    console.log(tokenIn);
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
    const fee = BridgeConfiguration.getFeesForChain(chain).UNWRAP_FEES;
    const tokenOut = BridgeConfiguration.getOutTokenUnbridgingWhole(chain, tokenIn.name);
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(minterContractAddress);
    const amountToUnwrap = amount * 10 ** tokenOut.DECIMALS;
    const userData = await getUserAddress();
    const fees = (amountToUnwrap / 10000) * fee;
    console.log(
      tokenIn,
      tokenOut.CONTRACT.toLowerCase().substring(2),
      amountToUnwrap.toString(10),
      fees.toString(10),
      userData.address.toLowerCase().substring(2),
    );
    const op = await contract.methods
      .unwrap_erc20(
        tokenOut.CONTRACT.toLowerCase().substring(2),
        amountToUnwrap.toString(10),
        fees.toString(10),
        userData.address.toLowerCase().substring(2),
      )
      .send();
    await op.confirmation();
    return {
      success: true,
      txHash: op.opHash,
    };
  } catch (e) {
    console.log(e);
    return {
      error: e,
      successs: false,
    };
  }
};

/* Get release status of a token, second step of unwrap
takes in txHash of the unwrap call & chain and returns the status of the release (Awating Signatures, awaating confirmation thersold, readyToMint), if ready to mint will return signatures.
  */
export const getReleaseStatus = async (txHash, chain) => {
  const networkSelected = CONFIG.NETWORK;
  const availableChainsObject = CONFIG.BRIDGES_INDEXER_LINKS[networkSelected];
  const wrapSignReq = BridgeConfiguration.getUnwrapSignReq(chain);
  const indexerLink = availableChainsObject[chain].slice(0, -13);
  const data = await axios.get(indexerLink + 'unwraps', {
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
      readyToRelease: false,
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
      readyToRelease:
        !(wrapData.confirmations < wrapData.confirmationsThreshold) &&
        !(signaturesCount < wrapSignReq),
    };
  }
};

const buildFullSignature = (signatures) => {
  const orderedSigners = Object.keys(signatures).sort();
  return orderedSigners.reduce(
    (previousValue, currentValue) => previousValue + signatures[currentValue].replace('0x', ''),
    '0x',
  );
};

/* Releases the token, to be called when awaiting signatures and awaiting confirmation is false and the tokens are ready to be released.
Call with the data received from the release status api, chain
  */
export const releaseTokens = async (unwrapData, chain) => {
  try {
    const web3 = new Web3(window.ethereum);
    const userData = await getUserAddress();
    if (userData.success && userData.address) {
      const userAddress = userData.address;
      const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
      const wrapContract = new web3.eth.Contract(CUSTODIAN_ABI, wrapContractAddress);
      const erc20Interface = new ethers.utils.Interface(ERC20_ABI);
      const data = erc20Interface.encodeFunctionData('transfer', [
        unwrapData.destination,
        unwrapData.amount,
      ]);
      let result;
      console.log(
        unwrapData.token,
        0,
        data,
        unwrapData.id,
        buildFullSignature(unwrapData.signatures),
      );
      await wrapContract.methods
        .execTransaction(
          unwrapData.token,
          0,
          data,
          unwrapData.id,
          buildFullSignature(unwrapData.signatures),
        )
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
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
};

/* this function returns tx history (array of objects). Pass the ethereum, tz address, Pass only one if one is connected and the chain*/
export const getHistory = async ({ ethereumAddress, tzAddress }) => {
  try {
    const web3 = new Web3(window.ethereum);
    const networkSelected = CONFIG.NETWORK;
    const tzkt = CONFIG.TZKT_NODES[networkSelected];
    const availableChainsObject = CONFIG.BRIDGES_INDEXER_LINKS[networkSelected];
    let allHistory = [];
    for (const chain of Object.keys(BridgeConfiguration.getConfig())) {
      const indexerLink = availableChainsObject[chain].slice(0, -13);
      const unwraps = await axios.get(indexerLink + 'unwraps', {
        params: {
          tezosAddress: tzAddress ? tzAddress : '',
          ethereumAddress: ethereumAddress ? ethereumAddress : '',
          type: 'ERC20',
        },
      });

      const unwrapsArrPromise = unwraps.data.result.map(async (obj) => {
        const data = await axios.get(tzkt + '/v1/operations/' + obj.operationHash);
        const timeStamp = new Date(data.data[0].timestamp);
        return {
          ...obj,
          isWrap: false,
          isUnwrap: true,
          token: BridgeConfiguration.getToken(chain, obj.token),
          txHash: obj.operationHash,
          timestamp: timeStamp,
          actionRequired: obj.status === 'finalized' ? false : true,
          currentProgress: 2,
          fromBridge: 'TEZOS',
          toBridge: chain,
        };
      });
      const unwrapsArr = await Promise.all(unwrapsArrPromise);

      const wraps = await axios.get(indexerLink + 'wraps', {
        params: {
          tezosAddress: tzAddress ? tzAddress : '',
          ethereumAddress: ethereumAddress ? ethereumAddress : '',
          type: 'ERC20',
        },
      });

      const wrapsArrPromise = wraps.data.result.map(async (obj) => {
        const tx = await web3.eth.getTransaction(obj.transactionHash);
        const block = await web3.eth.getBlock(tx.blockHash);
        const timeStamp = new Date(block.timestamp * 1000);
        return {
          ...obj,
          isWrap: true,
          isUnwrap: false,
          token: BridgeConfiguration.getToken(chain, obj.token),
          txHash: obj.transactionHash,
          timestamp: timeStamp,
          actionRequired: obj.status === 'finalized' ? false : true,
          currentProgress: 2,
          fromBridge: chain,
          toBridge: 'TEZOS',
        };
      });
      const wrapsArr = await Promise.all(wrapsArrPromise);

      const history = wrapsArr.concat(unwrapsArr);
      allHistory = allHistory.concat(history);
    }

    return {
      history: allHistory,

      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      history: [],
      success: false,
      error: e,
    };
  }
};

export const getApproveTxCost = async (tokenIn, chain, amount) => {
  const web3 = new Web3(window.ethereum);
  const userData = await getUserAddress();
  if (userData.success && userData.address) {
    const userAddress = userData.address;
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenIn.tokenData.CONTRACT_ADDRESS);
    const amountToAprove = amount * 10 ** tokenIn.tokenData.DECIMALS;
    const gas = BigNumber.from(
      (
        await tokenContract.methods
          .approve(wrapContractAddress, amountToAprove.toString())
          .estimateGas({ from: userAddress })
      ).toString(),
    );
    const gasPrice = BigNumber.from((await web3.eth.getGasPrice()).toString());
    console.log(gasPrice.toString());
    console.log(gas.toString());
    const txCost = ethers.utils.formatEther(gas.mul(gasPrice));
    return {
      success: true,
      txCost: txCost,
    };
  } else {
    return {
      success: false,
      txCost: 0,
      error: userData.error,
    };
  }
};
