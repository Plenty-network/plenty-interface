import axios from 'axios';
import { TezosToolkit, OpKind, MichelsonMap } from '@taquito/taquito';
import CONFIG from '../../config/config';
import { BridgeConfiguration } from '../Config/BridgeConfig';
import ERC20_ABI from '../../abi/erc20.ts';
import CUSTODIAN_ABI from '../../abi/custodianContract.ts';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import { ethers } from 'ethers';
import { networks } from '../Config/networks';
import { connectWallet } from './ethereumWalletConnect';
import { BigNumber as BigNum } from 'bignumber.js';
import { RPC_NODE } from '../../constants/localStorage';

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
  // eslint-disable-next-line
  sign(op, magicByte) {
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
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];

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
  try {
    const provider = await connectWallet();
    const web3 = provider.web3;

    const userAddress = provider.address;
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenIn.tokenData.CONTRACT_ADDRESS);
    const amountToApproveBig = new BigNum(amount);
    const amountToAprove = new BigNum(
      amountToApproveBig.multipliedBy(new BigNum(10).pow(tokenIn.tokenData.DECIMALS)),
    );
    let gasEstimate = undefined;
    let gasPrice = undefined;
    if(chain === 'POLYGON'){
      await tokenContract.methods
      .approve(wrapContractAddress, amountToAprove.toFixed(0)).estimateGas({from: userAddress},function(error, gasAmount){
        if(!error) {
          gasEstimate = gasAmount;
        } else {
          console.log(error);
        }
      });
      gasPrice = await web3.eth.getGasPrice();
    }
    let result;
    await tokenContract.methods
      .approve(wrapContractAddress, amountToAprove.toFixed(0))
      .send(gasEstimate && gasPrice && chain==='POLYGON'? {
        from: userAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)
        .mul(web3.utils.toBN(11))
        .div(web3.utils.toBN(10))),
        gas: Number(gasEstimate),
        // value: web3.utils.toWei(amountToAprove.toFixed(0), 'matic'),
      } : {
        from: userAddress,
      })
      .on('receipt', function (receipt) {
        result = {
          success: true,
          transactionHash: receipt.transactionHash,
          amount: amount,
        };
      })
      .on('error', function (error) {
        console.log(error);
        result = {
          success: false,
          error: error,
        };
      });

    return result;
  } catch (e) {
    console.log(e);
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
    const provider = await connectWallet();
    const web3 = provider.web3;
    const userAddress = provider.address;
    const wrapContractAddress = BridgeConfiguration.getWrapContract(chain);
    const tokenContractAddress = tokenIn.tokenData.CONTRACT_ADDRESS;
    const amountBig = new BigNum(amount);
    const amountToWrap = new BigNum(
      amountBig.multipliedBy(new BigNum(10).pow(tokenIn.tokenData.DECIMALS)),
    );
    const wrapContract = new web3.eth.Contract(CUSTODIAN_ABI, wrapContractAddress);
    let gasEstimate = undefined;
    let gasPrice = undefined;
    if(chain === 'POLYGON'){
      await wrapContract.methods
      .wrapERC20(tokenContractAddress, amountToWrap.toFixed(0), tzAddress).estimateGas({from: userAddress},function(error, gasAmount){
        if(!error) {
          gasEstimate = gasAmount;
        } else {
          console.log(error);
        }
      });
      gasPrice = await web3.eth.getGasPrice();
    }
    let result;
    await wrapContract.methods
      .wrapERC20(tokenContractAddress, amountToWrap.toFixed(0), tzAddress)
      .send(gasEstimate && gasPrice && chain==='POLYGON'? {
        from: userAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)
        .mul(web3.utils.toBN(11))
        .div(web3.utils.toBN(10))),
        gas: Number(gasEstimate),
        // value: amountToWrap.toFixed(0),
      } : {
        from: userAddress,
      })
      .on('receipt', function (receipt) {
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
    const customHttpProvider = new ethers.providers.JsonRpcProvider(networks[chain].rpcUrls[0]);
    const tx = await customHttpProvider.getTransaction(result.transactionHash);
    const block = await customHttpProvider.getBlock(tx.blockNumber);
    const timeStamp = new Date(block.timestamp * 1000);
    return {
      ...result,
      timeStamp: timeStamp,
    };
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
};

/* mint tokens on tezos side
takes in data from getMintStatus and mints the tokens
*/
export const mintTokens = async (wrapData, chain, setMintReleaseSubmitted) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];

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
            MichelsonMap.fromLiteral(wrapData.signatures),
          )
          .toTransferParams({}),
      },
    ]);

    const batchOp = await batch.send();
    setMintReleaseSubmitted(true);
    await batchOp.confirmation(1);

    const status = await batchOp.status();
    if (status === 'applied') {
      return {
        success: true,
        transactionHash: batchOp.opHash,
      };
    } else {
      throw new Error(status);
    }
  } catch (e) {
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
    const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];

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
    const fee = new BigNum(BridgeConfiguration.getFeesForChain(chain).UNWRAP_FEES);
    const tokenOut = BridgeConfiguration.getOutTokenUnbridgingWhole(chain, tokenIn.name);
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    const contract = await Tezos.wallet.at(minterContractAddress);
    const amountBig = new BigNum(amount);
    const amountToUnwrap = new BigNum(
      amountBig.multipliedBy(new BigNum(10).pow(tokenOut.DECIMALS)),
    );
    const userData = await getUserAddress();
    const fees = new BigNum(amountToUnwrap.div(new BigNum(10000))).multipliedBy(fee);
    const amountToUnwrapMinusFees = new BigNum(amountToUnwrap).minus(fees);

    const op = await contract.methods
      .unwrap_erc20(
        tokenOut.CONTRACT.toLowerCase().substring(2),
        amountToUnwrapMinusFees.toFixed(0),
        fees.toFixed(0),
        userData.address.toLowerCase().substring(2),
      )
      .send();
    await op.confirmation(1);

    const status = await op.status();
    if (status === 'applied') {
      const networkSelected = CONFIG.NETWORK;
      const tzkt = CONFIG.TZKT_NODES[networkSelected];
      const data = await axios.get(tzkt + '/v1/operations/' + op.opHash);
      const timeStamp = new Date(data.data[0].timestamp);
      return {
        success: true,
        txHash: op.opHash,
        timeStamp,
      };
    } else {
      throw new Error(status);
    }
    
  } catch (e) {
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
    let gasEstimate = undefined;
    let gasPrice = undefined;
    if(chain === 'POLYGON'){
      await wrapContract.methods
      .execTransaction(
        unwrapData.token,
        0,
        data,
        unwrapData.id,
        buildFullSignature(unwrapData.signatures),
      ).estimateGas({from: userAddress},function(error, gasAmount){
        if(!error) {
          gasEstimate = gasAmount;
        } else {
          console.log(error);
        }
      });
      gasPrice = await web3.eth.getGasPrice();
    }
    let result;

    await wrapContract.methods
      .execTransaction(
        unwrapData.token,
        0,
        data,
        unwrapData.id,
        buildFullSignature(unwrapData.signatures),
      )
      .send(gasEstimate && gasPrice && chain==='POLYGON'? {
        from: userAddress,
        gasPrice: web3.utils.toHex(web3.utils.toBN(gasPrice)
        .mul(web3.utils.toBN(11))
        .div(web3.utils.toBN(10))),
        gas: Number(gasEstimate),
        // value: amountToWrap.toFixed(0),
      } : {
        from: userAddress,
      })
      // eslint-disable-next-line
      .on('transactionHash', (hash) => {
        setMintReleaseSubmitted(true);
      })
      .on('receipt', function (receipt) {
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
        if (
          obj.status === 'asked' &&
          obj.operationHash === localStorage.getItem('recentTransHash')
        ) {
          obj['status'] = 'finalized';
        }
        return {
          ...obj,
          isWrap: false,
          isUnwrap: true,
          operation: 'UNBRIDGE',
          token: BridgeConfiguration.getToken(chain, obj.token),
          tokenIn: BridgeConfiguration.getToken(chain, obj.token).WRAPPED_TOKEN.NAME,
          tokenOut: BridgeConfiguration.getToken(chain, obj.token).SYMBOL,
          firstTokenAmount: inputTokenAmount.toString(),
          secondTokenAmount: outputAmount.toString(),
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
          if (
            obj.status === 'asked' &&
            obj.transactionHash === localStorage.getItem('recentTransHash')
          ) {
            obj['status'] = 'finalized';
          }
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
    return {
      history: [],
      success: false,
      error: e,
    };
  }
};

export const changeNetwork = async ({ networkName }) => {
  try {
    const providerData = await connectWallet();
    const provider = providerData.provider;
    if (!provider) throw new Error('No crypto wallet found');
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networks[networkName].chainId }],
      });
    } catch (switchError) {
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
        throw new Error(addError.message);
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getCurrentNetwork = async () => {
  const providerData = await connectWallet();
  const web3 = providerData.web3;
  const provider = providerData.provider;
  const address = await web3.eth.getAccounts();
  if (address.length !== 0) {
    try {
      if (!provider) throw new Error('No crypto wallet found');
      const chainId = await provider.request({ method: 'eth_chainId' });
      let networkName;
      if (provider.isMetaMask || provider.isWalletLink)
        networkName = Object.keys(networks).find((key) => networks[key].chainId === chainId);
      else
        networkName = Object.keys(networks).find(
          (key) => networks[key].chainId === `0x${Number(chainId).toString(16)}`,
        );
      return networkName;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  } else {
    return 'ETHEREUM';
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
      allowance: new BigNum(allowance)
        .div(new BigNum(10).pow(tokenIn.tokenData.DECIMALS))
        .toString(),
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
          obj.source.toLowerCase() === tzAddress.toLowerCase() &&
          obj.operationHash !== localStorage.getItem('recentTransHash'),
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
          obj.source.toLowerCase() === ethereumAddress.toLowerCase() &&
          obj.transactionHash !== localStorage.getItem('recentTransHash'),
      );
      const wrapsCount = wrapsMain.length;
      count = count + unwrapsCount + wrapsCount;
    }

    return {
      count: count,
    };
  } catch (e) {
    return {
      count: 0,
    };
  }
};
