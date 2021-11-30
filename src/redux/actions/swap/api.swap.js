import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CheckIfWalletConnected } from '../wallet/wallet';
import CONFIG from '../../config/config';
import axios from 'axios';
import { RPC_NODE } from '../../../constants/localStorage';

export const swapTokens = async (
  tokenIn,
  tokenOut,
  minimumTokenOut,
  recipent,
  tokenInAmount,
  caller,
) => {
  try {
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    const dexContractAddress = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const tokenInAddress = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_CONTRACT;
    const tokenOutAddress = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_CONTRACT;
    const tokenOutId = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_ID;
    const tokenInInstance = await Tezos.wallet.at(tokenInAddress);

    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);
    tokenInAmount =
      tokenInAmount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL);
    minimumTokenOut =
      minimumTokenOut * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL);
    minimumTokenOut = Math.floor(minimumTokenOut);
    let batch = null;
    if (CONFIG.AMM[connectedNetwork][tokenIn].CALL_TYPE === 'FA1.2') {
      batch = Tezos.wallet
        .batch()
        .withContractCall(tokenInInstance.methods.approve(dexContractAddress, tokenInAmount))
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut,
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount,
          ),
        );
    } else {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenOutId,
              },
            },
          ]),
        )
        .withContractCall(
          dexContractInstance.methods.Swap(
            minimumTokenOut,
            recipent,
            tokenOutAddress,
            tokenOutId,
            tokenInAmount,
          ),
        )
        .withContractCall(
          tokenInInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenOutId,
              },
            },
          ]),
        );
    }
    const batchOperation = await batch.send();
    await batchOperation.confirmation().then(() => batchOperation.opHash);
    return {
      success: true,
      operationId: batchOperation.hash,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const loadSwapData = async (tokenIn, tokenOut) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const dexContractAddress = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].contract;
    const Tezos = new TezosToolkit(rpcNode);
    const dexContractInstance = await Tezos.contract.at(dexContractAddress);
    const dexStorage = await dexContractInstance.storage();
    let systemFee = await dexStorage.systemFee;
    systemFee = systemFee.toNumber();
    let lpFee = await dexStorage.lpFee;
    lpFee = lpFee.toNumber();
    let token1_pool = await dexStorage.token1_pool;
    token1_pool = token1_pool.toNumber();
    let token2_pool = await dexStorage.token2_pool;
    token2_pool = token2_pool.toNumber();
    let lpTokenSupply = await dexStorage.totalSupply;
    lpTokenSupply = lpTokenSupply.toNumber();
    const lpToken = CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken;
    let tokenIn_supply = 0;
    let tokenOut_supply = 0;
    if (CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].property === 'token2_pool') {
      tokenOut_supply = token2_pool;
      tokenIn_supply = token1_pool;
    } else {
      tokenOut_supply = token1_pool;
      tokenIn_supply = token2_pool;
    }
    const tokenIn_Decimal = CONFIG.AMM[connectedNetwork][tokenIn].TOKEN_DECIMAL;
    const tokenOut_Decimal = CONFIG.AMM[connectedNetwork][tokenOut].TOKEN_DECIMAL;
    const liquidityToken_Decimal =
      CONFIG.AMM[connectedNetwork][
        CONFIG.AMM[connectedNetwork][tokenIn].DEX_PAIRS[tokenOut].liquidityToken
      ].TOKEN_DECIMAL;
    tokenIn_supply = tokenIn_supply / Math.pow(10, tokenIn_Decimal);
    tokenOut_supply = tokenOut_supply / Math.pow(10, tokenOut_Decimal);
    lpTokenSupply = lpTokenSupply / Math.pow(10, liquidityToken_Decimal);
    const exchangeFee = 1 / lpFee + 1 / systemFee;
    const tokenOutPerTokenIn = tokenOut_supply / tokenIn_supply;
    return {
      success: true,
      tokenIn,
      tokenIn_supply,
      tokenOut,
      tokenOut_supply,
      exchangeFee,
      tokenOutPerTokenIn,
      lpTokenSupply,
      lpToken,
    };
  } catch (error) {
    return {
      success: true,
      tokenIn,
      tokenIn_supply: 0,
      tokenOut,
      tokenOut_supply: 0,
      exchangeFee: 0,
      tokenOutPerTokenIn: 0,
      lpTokenSupply: 0,
      lpToken: null,
    };
  }
};

// export const computeTokenOutput = (
//   tokenIn_amount,
//   tokenIn_supply,
//   tokenOut_supply,
//   exchangeFee
// ) => {
//   try {
//     let tokenOut_amount = 0;
//     tokenOut_amount = (1 - exchangeFee) * tokenOut_supply * tokenIn_amount;
//     tokenOut_amount /= tokenIn_supply + (1 - exchangeFee) * tokenIn_amount;
//     let fees = tokenIn_amount * exchangeFee;
//     return {
//       tokenOut_amount,
//       fees,
//     };
//   } catch (error) {
//     return {
//       tokenOut_amount: 0,
//       fees: 0,
//     };
//   }
// };

export const computeTokenOutput = (
  tokenIn_amount,
  tokenIn_supply,
  tokenOut_supply,
  exchangeFee,
  slippage,
) => {
  try {
    let tokenOut_amount = 0;
    tokenOut_amount = (1 - exchangeFee) * tokenOut_supply * tokenIn_amount;
    tokenOut_amount /= tokenIn_supply + (1 - exchangeFee) * tokenIn_amount;
    const fees = tokenIn_amount * exchangeFee;
    const minimum_Out = tokenOut_amount - (slippage * tokenOut_amount) / 100;
    // let priceImpact =
    //   Math.abs(
    //     tokenIn_amount / tokenOut_amount - tokenIn_supply / tokenOut_supply
    //   ) /
    //   tokenIn_supply /
    //   tokenOut_supply;
    // priceImpact = priceImpact * 100;
    // priceImpact = Math.max(priceImpact, 0.01);

    const updated_TokenIn_Supply = tokenIn_supply - tokenIn_amount;
    const updated_TokenOut_Supply = tokenOut_supply - tokenOut_amount;
    let next_tokenOut_Amount = (1 - exchangeFee) * updated_TokenOut_Supply * tokenIn_amount;
    next_tokenOut_Amount /= updated_TokenIn_Supply + (1 - exchangeFee) * tokenIn_amount;
    let priceImpact = (tokenOut_amount - next_tokenOut_Amount) / tokenOut_amount;
    priceImpact = priceImpact * 100;
    priceImpact = priceImpact.toFixed(5);
    priceImpact = Math.abs(priceImpact);

    return {
      tokenOut_amount,
      fees,
      minimum_Out,
      priceImpact,
    };
  } catch (error) {
    return {
      tokenOut_amount: 0,
      fees: 0,
      minimum_Out: 0,
      priceImpact: 0,
    };
  }
};
export const estimateOtherToken = (tokenIn_amount, tokenIn_supply, tokenOut_supply) => {
  try {
    const otherTokenAmount = (tokenIn_amount * tokenOut_supply) / tokenIn_supply;
    return {
      otherTokenAmount,
    };
  } catch (err) {
    return {
      otherTokenAmount: 0,
    };
  }
};

export const addLiquidity = async (tokenA, tokenB, tokenA_Amount, tokenB_Amount, caller) => {
  try {
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
    let tokenFirst = null;
    let tokenSecond = null;
    let tokenFirst_Amount = 0;
    let tokenSecond_Amount = 0;
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    if (CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].property === 'token2_pool') {
      tokenFirst = tokenA;
      tokenFirst_Amount =
        tokenA_Amount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL);
      tokenSecond = tokenB;
      tokenSecond_Amount =
        tokenB_Amount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL);
    } else {
      tokenFirst = tokenB;
      tokenFirst_Amount =
        tokenB_Amount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenB].TOKEN_DECIMAL);
      tokenSecond = tokenA;
      tokenSecond_Amount =
        tokenA_Amount * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL);
    }
    const dexContractAddress =
      CONFIG.AMM[connectedNetwork][tokenFirst].DEX_PAIRS[tokenSecond].contract;
    const tokenFirstAddress = CONFIG.AMM[connectedNetwork][tokenFirst].TOKEN_CONTRACT;
    const tokenSecondAddress = CONFIG.AMM[connectedNetwork][tokenSecond].TOKEN_CONTRACT;
    const tokenFirstId = CONFIG.AMM[connectedNetwork][tokenFirst].TOKEN_ID;
    const tokenSecondId = CONFIG.AMM[connectedNetwork][tokenSecond].TOKEN_ID;

    const tokenFirstInstance = await Tezos.wallet.at(tokenFirstAddress);
    const tokenSecondInstance = await Tezos.wallet.at(tokenSecondAddress);
    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);
    let batch = null;
    if (
      CONFIG.AMM[connectedNetwork][tokenFirst].CALL_TYPE === 'FA1.2' &&
      CONFIG.AMM[connectedNetwork][tokenSecond].CALL_TYPE === 'FA2'
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(tokenFirstInstance.methods.approve(dexContractAddress, tokenFirst_Amount))
        .withContractCall(
          tokenSecondInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenSecondId,
              },
            },
          ]),
        )
        .withContractCall(
          dexContractInstance.methods.AddLiquidity(tokenFirst_Amount, tokenSecond_Amount),
        )
        .withContractCall(
          tokenSecondInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenSecondId,
              },
            },
          ]),
        );
    } else if (
      CONFIG.AMM[connectedNetwork][tokenFirst].CALL_TYPE === 'FA2' &&
      CONFIG.AMM[connectedNetwork][tokenSecond].CALL_TYPE === 'FA1.2'
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenFirstInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenFirstId,
              },
            },
          ]),
        )
        .withContractCall(tokenSecond.methods.approve(dexContractAddress, tokenSecond_Amount))
        .withContractCall(
          dexContractInstance.methods.AddLiquidity(tokenFirst_Amount, tokenSecond_Amount),
        )
        .withContractCall(
          tokenFirstInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenFirstId,
              },
            },
          ]),
        );
    } else if (
      CONFIG.AMM[connectedNetwork][tokenFirst].CALL_TYPE === 'FA2' &&
      CONFIG.AMM[connectedNetwork][tokenSecond].CALL_TYPE === 'FA2'
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(
          tokenFirstInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenFirstId,
              },
            },
          ]),
        )
        .withContractCall(
          tokenSecondInstance.methods.update_operators([
            {
              add_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenSecondId,
              },
            },
          ]),
        )
        .withContractCall(
          dexContractInstance.methods.AddLiquidity(tokenFirst_Amount, tokenSecond_Amount),
        )
        .withContractCall(
          tokenFirstInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenFirstId,
              },
            },
          ]),
        )
        .withContractCall(
          tokenSecondInstance.methods.update_operators([
            {
              remove_operator: {
                owner: caller,
                operator: dexContractAddress,
                token_id: tokenSecondId,
              },
            },
          ]),
        );
    } else if (
      CONFIG.AMM[connectedNetwork][tokenFirst].CALL_TYPE === 'FA1.2' &&
      CONFIG.AMM[connectedNetwork][tokenSecond].CALL_TYPE === 'FA1.2'
    ) {
      batch = Tezos.wallet
        .batch()
        .withContractCall(tokenFirstInstance.methods.approve(dexContractAddress, tokenFirst_Amount))
        .withContractCall(
          tokenSecondInstance.methods.approve(dexContractAddress, tokenSecond_Amount),
        )
        .withContractCall(
          dexContractInstance.methods.AddLiquidity(tokenFirst_Amount, tokenSecond_Amount),
        );
    }
    const batchOperation = await batch.send();
    await batchOperation.confirmation().then(() => batchOperation.opHash);
    return {
      success: true,
      operationId: batchOperation.hash,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
// export const computeRemoveTokens = (
//   burnAmount,
//   lpTotalSupply,
//   tokenFirst_Supply,
//   tokenSecond_Supply
// ) => {
//   try {
//     let tokenFirst_Out = (burnAmount * tokenFirst_Supply) / lpTotalSupply;
//     let tokenSecond_Out = (burnAmount * tokenSecond_Supply) / lpTotalSupply;
//     return {
//       tokenFirst_Out,
//       tokenSecond_Out,
//     };
//   } catch (e) {
//     return {
//       tokenFirst_Out: 0,
//       tokenSecond_Out: 0,
//     };
//   }
// };
export const computeRemoveTokens = (
  burnAmount,
  lpTotalSupply,
  tokenFirst_Supply,
  tokenSecond_Supply,
  slippage,
) => {
  try {
    let tokenFirst_Out = (burnAmount * tokenFirst_Supply) / lpTotalSupply;
    let tokenSecond_Out = (burnAmount * tokenSecond_Supply) / lpTotalSupply;
    tokenFirst_Out = tokenFirst_Out - (slippage * tokenFirst_Out) / 100;
    tokenSecond_Out = tokenSecond_Out - (slippage * tokenSecond_Out) / 100;
    return {
      tokenFirst_Out,
      tokenSecond_Out,
    };
  } catch (e) {
    return {
      tokenFirst_Out: 0,
      tokenSecond_Out: 0,
    };
  }
};
// export const removeLiquidity = async (
//   tokenA,
//   tokenB,
//   tokenA_MinimumRecieve,
//   tokenB_MinimumRecieve,
//   lpToken_Amount,
//   caller
// ) => {
//   try {
//     let tokenFirst = null;
//     let tokenSecond = null;
//     let tokenFirst_Amount = 0;
//     let tokenSecond_Amount = 0;
//     const network = {
//       type: CONFIG.WALLET_NETWORK,
//     };
//     const options = {
//       name: CONFIG.NAME,
//     };
//     let connectedNetwork = CONFIG.NETWORK;
//     const wallet = new BeaconWallet(options);
//     const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
//     if (!WALLET_RESP.success) {
//       throw new Error('Wallet connection failed');
//     }
//     const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
//     Tezos.setRpcProvider(CONFIG.RPC_NODES[connectedNetwork]);
//     Tezos.setWalletProvider(wallet);
//     let tokenFirst_MinimumRecieve;
//     let tokenSecond_MinimumRecieve;
//     if (
//       CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].property ===
//       'token2_pool'
//     ) {
//       tokenFirst = tokenA;
//       tokenFirst_MinimumRecieve =
//         tokenA_MinimumRecieve *
//         Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL);
//       tokenSecond = tokenB;
//       tokenSecond_MinimumRecieve =
//         tokenB_MinimumRecieve *
//         Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL);
//     } else {
//       tokenFirst = tokenB;
//       tokenFirst_MinimumRecieve =
//         tokenB_MinimumRecieve *
//         Math.pow(10, CONFIG.AMM[connectedNetwork][tokenB].TOKEN_DECIMAL);
//       tokenSecond = tokenA;
//       tokenSecond_MinimumRecieve =
//         tokenA_MinimumRecieve *
//         Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL);
//     }
//     let dexContractAddress =
//       CONFIG.AMM[connectedNetwork][tokenFirst].DEX_PAIRS[tokenSecond].contract;
//     let lpTokenDecimal =
//       CONFIG.AMM[connectedNetwork][
//         CONFIG.AMM[connectedNetwork][tokenFirst].DEX_PAIRS[tokenSecond]
//           .liquidityToken
//       ].TOKEN_DECIMAL;
//     lpToken_Amount = Math.floor(lpToken_Amount * Math.pow(10, lpTokenDecimal));
//     let dexContractInstance = await Tezos.wallet.at(dexContractAddress);
//
//       lpToken_Amount,
//     });
//     let batch = Tezos.wallet
//       .batch()
//       .withContractCall(
//         dexContractInstance.methods.RemoveLiquidity(lpToken_Amount, 0, 0)
//       );
//     const batchOperation = await batch.send();
//     await batchOperation.confirmation().then(() => batchOperation.opHash);
//
//     return {
//       success: true,
//       operationId: batchOperation.hash,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error,
//     };
//   }
// };

export const removeLiquidity = async (
  tokenA,
  tokenB,
  tokenA_MinimumRecieve,
  tokenB_MinimumRecieve,
  lpToken_Amount,
  // caller,
) => {
  try {
    let tokenFirst = null;
    let tokenSecond = null;
    let tokenFirst_Amount = 0;
    let tokenSecond_Amount = 0;
    const network = {
      type: CONFIG.WALLET_NETWORK,
    };
    const options = {
      name: CONFIG.NAME,
    };
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet, network.type);
    if (!WALLET_RESP.success) {
      throw new Error('Wallet connection failed');
    }
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setRpcProvider(rpcNode);
    Tezos.setWalletProvider(wallet);
    // let tokenFirst_MinimumRecieve;
    // let tokenSecond_MinimumRecieve;
    if (CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].property === 'token2_pool') {
      tokenFirst = tokenA;
      tokenFirst_Amount = Math.floor(
        tokenA_MinimumRecieve * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL),
      );

      tokenSecond = tokenB;
      tokenSecond_Amount = Math.floor(
        tokenB_MinimumRecieve * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenB].TOKEN_DECIMAL),
      );
    } else {
      tokenFirst = tokenB;
      tokenFirst_Amount = Math.floor(
        tokenB_MinimumRecieve * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenB].TOKEN_DECIMAL),
      );
      tokenSecond = tokenA;
      tokenSecond_Amount = Math.floor(
        tokenA_MinimumRecieve * Math.pow(10, CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL),
      );
    }
    const dexContractAddress =
      CONFIG.AMM[connectedNetwork][tokenFirst].DEX_PAIRS[tokenSecond].contract;
    const lpTokenDecimal =
      CONFIG.AMM[connectedNetwork][
        CONFIG.AMM[connectedNetwork][tokenFirst].DEX_PAIRS[tokenSecond].liquidityToken
      ].TOKEN_DECIMAL;
    lpToken_Amount = Math.floor(lpToken_Amount * Math.pow(10, lpTokenDecimal));
    const dexContractInstance = await Tezos.wallet.at(dexContractAddress);

    const batch = Tezos.wallet
      .batch()
      .withContractCall(
        dexContractInstance.methods.RemoveLiquidity(
          lpToken_Amount,
          tokenFirst_Amount,
          tokenSecond_Amount,
        ),
      );
    const batchOperation = await batch.send();
    await batchOperation.confirmation().then(() => batchOperation.opHash);

    return {
      success: true,
      operationId: batchOperation.hash,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
export const fetchWalletBalance = async (
  addressOfUser,
  tokenContractAddress,
  icon,
  type,
  token_id,
  token_decimal,
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const Tezos = new TezosToolkit(rpcNode);
    Tezos.setProvider(rpcNode);
    const contract = await Tezos.contract.at(tokenContractAddress);
    const storage = await contract.storage();
    let userBalance = 0;
    if (type === 'FA1.2') {
      if (icon === 'WRAP') {
        const userDetails = await storage.assets.ledger.get(addressOfUser);
        let userBalance = userDetails;
        userBalance = userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3);
        userBalance = parseFloat(userBalance);
        return {
          success: true,
          balance: userBalance,
          symbol: icon,
        };
      } else if (icon === 'KALAM') {
        const userDetails = await storage.ledger.get(addressOfUser);
        let userBalance = userDetails;
        userBalance = userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3);
        userBalance = parseFloat(userBalance);
        return {
          success: true,
          balance: userBalance,
          symbol: icon,
        };
      } else {
        const userDetails = await storage.balances.get(addressOfUser);
        let userBalance = userDetails.balance;
        userBalance = userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3);
        userBalance = parseFloat(userBalance);
        return {
          success: true,
          balance: userBalance,
          symbol: icon,
        };
      }
    } else {
      const userDetails = await storage.assets.ledger.get({
        0: addressOfUser,
        1: token_id,
      });
      userBalance = (userDetails.toNumber() / Math.pow(10, token_decimal)).toFixed(3);
      userBalance = parseFloat(userBalance);
      return {
        success: true,
        balance: userBalance,
        symbol: icon,
      };
    }
  } catch (e) {
    return {
      success: false,
      balance: 0,
      symbol: icon,
      error: e,
    };
  }
};
export const fetchAllWalletBalance = async (addressOfUser) => {
  try {
    const network = CONFIG.NETWORK;
    const promises = [];
    for (const identifier in CONFIG.AMM[network]) {
      promises.push(
        fetchWalletBalance(
          addressOfUser,
          CONFIG.AMM[network][identifier].TOKEN_CONTRACT,
          identifier,
          CONFIG.AMM[network][identifier].READ_TYPE,
          CONFIG.AMM[network][identifier].TOKEN_ID,
          CONFIG.AMM[network][identifier].TOKEN_DECIMAL,
        ),
      );
    }
    const response = await Promise.all(promises);
    const userBalances = {};
    for (const i in response) {
      userBalances[response[i].symbol] = response[i].balance;
    }
    return {
      success: true,
      userBalances,
    };
  } catch (error) {
    return {
      success: false,
      userBalances: {},
    };
  }
};
// const getTokenPrices = async () => {
//   try {
//     let tokenPriceResponse = await axios.get(
//       'https://api.teztools.io/token/prices'
//     );
//     let tokenPrice = {};
//     tokenPriceResponse = tokenPriceResponse.data;
//     const tokens = ['PLENTY', 'KALAM', 'wDAI', 'WRAP'];
//     for (let i in tokenPriceResponse.contracts) {
//
//       if (tokens.includes(tokenPriceResponse.contracts[i].symbol)) {
//         tokenPrice[tokenPriceResponse.contracts[i].symbol] =
//           tokenPriceResponse.contracts[i].usdValue;
//       }
//     }
//     return {
//       success: true,
//       tokenPrice,
//     };
//   } catch (error) {
//
//     return {
//       success: false,
//       tokenPrice: {},
//     };
//   }
// };
export const getTokenPrices = async () => {
  try {
    let tokenPriceResponse = await axios.get('https://api.teztools.io/token/prices');
    const tokenPrice = {};
    tokenPriceResponse = tokenPriceResponse.data;
    const tokens = ['PLENTY', 'KALAM', 'wDAI', 'WRAP'];
    for (const i in tokenPriceResponse.contracts) {
      if (tokens.includes(tokenPriceResponse.contracts[i].symbol)) {
        tokenPrice[tokenPriceResponse.contracts[i].symbol] =
          tokenPriceResponse.contracts[i].usdValue;
      }
    }
    return {
      success: true,
      tokenPrice,
    };
  } catch (error) {
    return {
      success: false,
      tokenPrice: {},
    };
  }
};
export const lpTokenOutput = (
  tokenIn_amount,
  tokenOut_amount,
  tokenIn_supply,
  tokenOut_supply,
  lpTokenSupply,
) => {
  try {
    const lpOutputBasedOnTokenIn = (tokenIn_amount * lpTokenSupply) / tokenIn_supply;
    const lpOutputBasedOnTokenOut = (tokenOut_amount * lpTokenSupply) / tokenOut_supply;
    let estimatedLpOutput = 0;
    estimatedLpOutput =
      lpOutputBasedOnTokenIn < lpOutputBasedOnTokenOut
        ? lpOutputBasedOnTokenIn
        : lpOutputBasedOnTokenOut;
    return {
      estimatedLpOutput,
    };
  } catch (error) {
    return {
      estimatedLpOutput: 0,
    };
  }
};
