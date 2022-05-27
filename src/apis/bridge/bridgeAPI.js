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
import { networks } from '../Config/networks';
import { connectWallet } from './ethereumWalletConnect';
import { BigNumber as BigNum } from 'bignumber.js';
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
  const data = await connectWallet();
  return {
    success: true,
    address: data.address,
  };
};

/* use to get balance of a token, returns balance without decimals
tokenAddress: address of the token
userAddress: address of the user ETHEREUM */
export const getBalance = async (tokenAddress, userAddress) => {
  try {
    const provider = await connectWallet();
    const web3 = provider.web3;
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

export const getWrapTxCost = async (tokenIn, chain, amount, tzAddress) => {
  const userData = await getUserAddress();
  if (userData.success && userData.address) {
    const web3 = new Web3(window.ethereum);
    const tokenContractAddress = tokenIn.tokenData.CONTRACT_ADDRESS;
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const wrapContract = new web3.eth.Contract(CUSTODIAN_ABI, wrapContractAddress);
    const amountToAprove = amount * 10 ** tokenIn.tokenData.DECIMALS;
    const gas = BigNumber.from(
      (
        await wrapContract.methods
          .wrapERC20(tokenContractAddress, amountToAprove.toString(), tzAddress)
          .estimateGas({ from: userData.address })
      ).toString(),
    );
    const gasPrice = BigNumber.from((await web3.eth.getGasPrice()).toString());
    console.log(gasPrice.toString());
    console.log(gas.toString());
    const txCost = ethers.utils.formatEther(gas.mul(gasPrice));
    return {
      success: true,
      txCost: txCost,
      unit: 'ETH',
    };
  } else {
    return {
      success: false,
      txCost: 0,
      error: userData.error,
    };
  }
};

export const getReleaseTxCost = async (unwrapData, chain) => {
  const web3 = new Web3(window.ethereum);
  const userData = await getUserAddress();
  if (userData.success && userData.address) {
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const wrapContract = new web3.eth.Contract(CUSTODIAN_ABI, wrapContractAddress);
    const erc20Interface = new ethers.utils.Interface(ERC20_ABI);
    const data = erc20Interface.encodeFunctionData('transfer', [
      unwrapData.destination,
      unwrapData.amount,
    ]);

    const gas = BigNumber.from(
      (
        await wrapContract.methods
          .execTransaction(
            unwrapData.token,
            0,
            data,
            unwrapData.id,
            buildFullSignature(unwrapData.signatures),
          )
          .estimateGas({ from: userData.address })
      ).toString(),
    );
    const gasPrice = BigNumber.from((await web3.eth.getGasPrice()).toString());
    console.log(gasPrice.toString());
    console.log(gas.toString());
    const txCost = ethers.utils.formatEther(gas.mul(gasPrice));
    return {
      success: true,
      txCost: txCost,
      unit: 'ETH',
    };
  } else {
    return {
      success: false,
      txCost: 0,
      error: userData.error,
    };
  }
};

export const getMintTxCost = async (wrapData, chain) => {
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

    const op = contract.methods
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
      .toTransferParams({});
    const estimate = await Tezos.estimate.transfer(op);
    const txCost = estimate.totalCost / 10 ** 6;
    return {
      txCost: txCost,
      success: true,
      unit: 'Tez',
    };
  } catch (e) {
    return {
      success: false,
      txCost: 0,
      error: e,
    };
  }
};

export const getUnwrapTxCost = async (chain, amount, tokenIn) => {
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
    const fee = BridgeConfiguration.getFeesForChain(chain).UNWRAP_FEES;
    const tokenOut = BridgeConfiguration.getOutTokenUnbridgingWhole(chain, tokenIn.name);
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(minterContractAddress);
    const amountToUnwrap = amount * 10 ** tokenOut.DECIMALS;
    const userData = await getUserAddress();
    const fees = (amountToUnwrap / 10000) * fee;
    const amountToUnwrapMinusFees = amountToUnwrap - fees;

    const op = contract.methods
      .unwrap_erc20(
        tokenOut.CONTRACT.toLowerCase().substring(2),
        amountToUnwrapMinusFees.toString(10),
        fees.toString(10),
        userData.address.toLowerCase().substring(2),
      )
      .toTransferParams({});

    const estimate = await Tezos.estimate.transfer(op);
    const txCost = estimate.totalCost / 10 ** 6;
    return {
      txCost: txCost,
      success: true,
      unit: 'Tez',
    };
  } catch (e) {
    return {
      success: false,
      txCost: 0,
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
  try {
    const provider = await connectWallet();
    const web3 = provider.web3;

    const userAddress = provider.address;
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
  } catch (e) {
    return {
      success: false,
      error: e,
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
  try {
    console.log(tzAddress);
    const provider = await connectWallet();
    const web3 = provider.web3;
    const userAddress = provider.address;
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
  } catch (e) {
    return {
      success: false,
      error: e,
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
export const mintTokens = async (wrapData, chain, setMintReleaseSubmitted) => {
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
    console.log('Accepted now temple');
    setMintReleaseSubmitted(true);
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
    const amountToUnwrapMinusFees = amountToUnwrap - fees;
    console.log(
      tokenIn,
      tokenOut.CONTRACT.toLowerCase().substring(2),
      amountToUnwrapMinusFees.toString(10),
      fees.toString(10),
      userData.address.toLowerCase().substring(2),
    );
    const op = await contract.methods
      .unwrap_erc20(
        tokenOut.CONTRACT.toLowerCase().substring(2),
        amountToUnwrapMinusFees.toString(10),
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
export const releaseTokens = async (unwrapData, chain, setMintReleaseSubmitted) => {
  try {
    const provider = await connectWallet();
    const web3 = provider.web3;

    const userAddress = provider.address;
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
      .on('transactionHash', (hash) => {
        console.log(hash);
        console.log('accept now metamask tx');
        setMintReleaseSubmitted(true);
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
      const unwrapsMain = unwraps.data.result.filter(
        (obj) =>
          obj.destination.toLowerCase() === ethereumAddress.toLowerCase() &&
          obj.source.toLowerCase() === tzAddress.toLowerCase(),
      );
      const unwrapsArrPromise = unwrapsMain.map(async (obj) => {
        const data = await axios.get(tzkt + '/v1/operations/' + obj.operationHash);
        const timeStamp = new Date(data.data[0].timestamp);
        const feePercentage = new BigNum(
          BridgeConfiguration.getFeesForChain(chain).UNWRAP_FEES,
        ).dividedBy(10000);
        const outputAmount = new BigNum(obj.amount).div(
          new BigNum(10).pow(BridgeConfiguration.getToken(chain, obj.token).DECIMALS),
        );
        const inputTokenAmount = outputAmount.div(new BigNum(1).minus(feePercentage));
        const transFee = inputTokenAmount.multipliedBy(feePercentage);
        // const feePercentage = BridgeConfiguration.getFeesForChain(chain).UNWRAP_FEES / 10000;
        // const outputAmount =
        //   obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS;
        // const inputTokenAmount = outputAmount / (1 - feePercentage);
        // const transFee = inputTokenAmount * feePercentage;
        // const transFee =
        //   (obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS) *
        //   (BridgeConfiguration.getFeesForChain(chain).UNWRAP_FEES / 10000);

        return {
          ...obj,
          isWrap: false,
          isUnwrap: true,
          operation: 'UNBRIDGE',
          token: BridgeConfiguration.getToken(chain, obj.token),
          tokenIn: BridgeConfiguration.getToken(chain, obj.token).WRAPPED_TOKEN.NAME,
          tokenOut: BridgeConfiguration.getToken(chain, obj.token).SYMBOL,
          firstTokenAmount: inputTokenAmount.toString(),
          // firstTokenAmount:
          //   obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS,
          secondTokenAmount: outputAmount.toString(),
          // secondTokenAmount:
          //   obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS - transFee,
          txHash: obj.operationHash,
          timestamp: timeStamp,
          actionRequired: obj.status === 'finalized' ? false : true,
          currentProgress: obj.status === 'finalized' ? 3 : 1,
          fromBridge: 'TEZOS',
          toBridge: chain,
          fee: transFee.toString(),
          chain,
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
      const wrapsMain = wraps.data.result.filter(
        (obj) =>
          obj.destination.toLowerCase() === tzAddress.toLowerCase() &&
          obj.source.toLowerCase() === ethereumAddress.toLowerCase(),
      );
      const wrapsArrPromise = wrapsMain.map(async (obj) => {
        if (
          obj.destination.toLowerCase() === tzAddress.toLowerCase() &&
          obj.source.toLowerCase() === ethereumAddress.toLowerCase()
        ) {
          const customHttpProvider = new ethers.providers.JsonRpcProvider(
            networks[chain].rpcUrls[0],
          );
          const tx = await customHttpProvider.getTransaction(obj.transactionHash);

          const block = await customHttpProvider.getBlock(tx.blockNumber);

          const timeStamp = new Date(block.timestamp * 1000);
          const transFee = new BigNum(obj.amount)
            .div(new BigNum(10).pow(BridgeConfiguration.getToken(chain, obj.token).DECIMALS))
            .multipliedBy(
              new BigNum(BridgeConfiguration.getFeesForChain(chain).WRAP_FEES).div(10000),
            );
          // const transFee =
          //   (obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS) *
          //   (BridgeConfiguration.getFeesForChain(chain).WRAP_FEES / 10000);
          return {
            ...obj,
            isWrap: true,
            isUnwrap: false,
            operation: 'BRIDGE',
            token: BridgeConfiguration.getToken(chain, obj.token),
            tokenIn: BridgeConfiguration.getToken(chain, obj.token).SYMBOL,
            tokenOut: BridgeConfiguration.getToken(chain, obj.token).WRAPPED_TOKEN.NAME,
            firstTokenAmount: new BigNum(obj.amount)
              .div(new BigNum(10).pow(BridgeConfiguration.getToken(chain, obj.token).DECIMALS))
              .toString(),
            secondTokenAmount: new BigNum(obj.amount)
              .div(new BigNum(10).pow(BridgeConfiguration.getToken(chain, obj.token).DECIMALS))
              .minus(transFee),
            // firstTokenAmount:
            //   obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS,
            // secondTokenAmount:
            //   obj.amount / 10 ** BridgeConfiguration.getToken(chain, obj.token).DECIMALS - transFee,
            txHash: obj.transactionHash,
            timestamp: timeStamp,
            actionRequired: obj.status === 'finalized' ? false : true,
            currentProgress: obj.status === 'finalized' ? 3 : 1,
            fromBridge: chain,
            toBridge: 'TEZOS',
            fee: transFee.toString(),
            chain,
          };
        }
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

export const changeNetwork = async ({ networkName }) => {
  try {
    console.log(networkName);
    const providerData = await connectWallet();
    const provider = providerData.provider;
    if (!provider) throw new Error('No crypto wallet found');
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networks[networkName].chainId }],
      });
    } catch (switchError) {
      console.log(switchError);
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networks[networkName],
            },
          ],
        });
      } catch (addError) {
        console.log(addError);
        throw new Error(addError.message);
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

// function delay(delayInms) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(2);
//     }, delayInms);
//   });
// }

export const getCurrentNetwork = async () => {
  const providerData = await connectWallet();
  const web3 = providerData.web3;
  const provider = providerData.provider;
  const address = await web3.eth.getAccounts();
  if (address.length !== 0) {
    // if (!window.ethereum.selectedProvider) {
    //   await delay(500);
    // }
    try {
      if (!provider) throw new Error('No crypto wallet found');
      // Set the provider to metamask to resolve the conflict between metamask and coinbase wallet.
      // Allow only metamask wallet to be set as provider before getting chain.
      // if (
      //   window.ethereum.isMetaMask &&
      //   window.ethereum.providers &&
      //   window.ethereum.providers.length > 1
      // ) {
      //   window.ethereum.selectedProvider = window.ethereum.providers.find(
      //     (provider) => provider.isMetaMask,
      //   );
      // }
      const chainId = await provider.request({ method: 'eth_chainId' });
      console.log(chainId);
      let networkName;
      if (provider.isMetaMask || provider.isWalletLink)
        networkName = Object.keys(networks).find((key) => networks[key].chainId === chainId);
      else
        networkName = Object.keys(networks).find(
          (key) => networks[key].chainId === `0x${chainId.toString(16)}`,
        );
      console.log(chainId);
      console.log(networkName);
      return networkName;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  } else {
    console.log('No crypto wallet found');
    return 'ETHEREUM'; //TODO: CHANGE IT LATER
  }
};

/* use to get allowance, returns amount without decimals
tokenAddress: address of the token
userAddress: address of the user ETHEREUM
chain */
export const getAllowance = async (tokenIn, userAddress, chain) => {
  try {
    const provider = await connectWallet();
    const web3 = provider.web3;
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenIn.tokenData.CONTRACT_ADDRESS);
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const allowance = await tokenContract.methods
      .allowance(userAddress, wrapContractAddress)
      .call();
    return {
      success: true,
      allowance: new BigNum(allowance).div(new BigNum(10).pow(tokenIn.tokenData.DECIMALS)).toString(),
    };
  } catch (error) {
    return {
      success: false,
      allowance: 0,
      error: error.message,
    };
  }
};

/* this function returns action required tx count */
export const getActionRequiredCount = async ({ ethereumAddress, tzAddress }) => {
  console.log(tzAddress, ethereumAddress);
  try {
    const networkSelected = CONFIG.NETWORK;
    const availableChainsObject = CONFIG.BRIDGES_INDEXER_LINKS[networkSelected];
    let count = 0;
    for (const chain of Object.keys(BridgeConfiguration.getConfig())) {
      const indexerLink = availableChainsObject[chain].slice(0, -13);
      const unwraps = await axios.get(indexerLink + 'unwraps', {
        params: {
          tezosAddress: tzAddress ? tzAddress : '',
          ethereumAddress: ethereumAddress ? ethereumAddress : '',
          type: 'ERC20',
          status: 'asked',
        },
      });
      const unwrapsMain = unwraps.data.result.filter(
        (obj) =>
          obj.destination.toLowerCase() === ethereumAddress.toLowerCase() &&
          obj.source.toLowerCase() === tzAddress.toLowerCase(),
      );
      const unwrapsCount = unwrapsMain.length;

      const wraps = await axios.get(indexerLink + 'wraps', {
        params: {
          tezosAddress: tzAddress ? tzAddress : '',
          ethereumAddress: ethereumAddress ? ethereumAddress : '',
          type: 'ERC20',
          status: 'asked',
        },
      });
      const wrapsMain = wraps.data.result.filter(
        (obj) =>
          obj.destination.toLowerCase() === tzAddress.toLowerCase() &&
          obj.source.toLowerCase() === ethereumAddress.toLowerCase(),
      );
      const wrapsCount = wrapsMain.length;
      count = count + unwrapsCount + wrapsCount;
    }

    return {
      count: count,
    };
  } catch (e) {
    console.log(e);
    return {
      count: 0,
    };
  }
};
