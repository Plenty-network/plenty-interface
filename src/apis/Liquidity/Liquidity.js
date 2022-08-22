import axios from 'axios';
import CONFIG from '../../config/config';
import { getUserBalanceByRpc } from '../swap/swap';
import { getUserBalanceByRpcStable } from '../stableswap/stableswap';
import { tokens } from '../../constants/swapPage';
import { stableSwapTokens } from '../../constants/stableSwapPage';
import { RPC_NODE } from '../../constants/localStorage';

/**
 * Function to order(swap if required) the token pair based on the pool in contract.
 */
const swapBasedOnPool = (tokenA, tokenB) => {
  let finalTokenA, finalTokenB;
  const connectedNetwork = CONFIG.NETWORK;
  if (CONFIG.AMM[connectedNetwork][tokenA.name].DEX_PAIRS[tokenB.name].property === 'token2_pool') {
    finalTokenA = tokenA;
    finalTokenB = tokenB;
  } else {
    finalTokenA = tokenB;
    finalTokenB = tokenA;
  }
  return { finalTokenA, finalTokenB };
};

/**
 * Function to order(swap if required) the token pair based on the pool in contract for tez and ctez.
 */
const swapBasedOnPoolXtz = (tokenA, tokenB) => {
  let finalTokenA, finalTokenB;
  const connectedNetwork = CONFIG.NETWORK;
  if (CONFIG.AMM[connectedNetwork][tokenA.name].DEX_PAIRS[tokenB.name].property === 'ctezPool') {
    finalTokenA = tokenA;
    finalTokenB = tokenB;
  } else {
    finalTokenA = tokenB;
    finalTokenB = tokenA;
  }
  return { finalTokenA, finalTokenB };
};

/**
 * Iterates through all the tokens in config and returns list of token pairs for which liquidity is available for the connected wallet.
 * @param {*} tokenList - List of tokens from config file.
 * @param {boolean} isStable - If the list from config is stable or not.
 * @param {string} walletAddress - Address of the wallet connected.
 * @returns - Array of token pairs for which liquidity is available.
 */
const getListOfPositions = async (tokenList, isStable, walletAddress) => {
  const tempLPTokenObj = {};
  const listOfAvailablePostions = [];
  const tokensPromiseList = [];

  // Parse all the tokens and then their dex pairs to get the lpTokens.
  for (const [token, tokenValue] of Object.entries(tokenList)) {
    if (
      Object.prototype.hasOwnProperty.call(tokenValue, 'DEX_PAIRS') &&
      Object.keys(tokenValue.DEX_PAIRS).length !== 0
    ) {
      for (const [pairedtToken, pairedtTokenValue] of Object.entries(tokenValue.DEX_PAIRS)) {
        const liquidityToken = pairedtTokenValue.liquidityToken;
        // Check if the lp token is not already parsed and proceed only if not.
        if (!tempLPTokenObj[liquidityToken]) {
          /* The below if condition is to avoid the stable pairs that are present in non-stable(AMM) config list 
          to eliminate duplicates. Any stable pair present in non-stable config(AMM) for routing purpose should 
          be added to stable swap config list as well for this whole function to work properly. This is a 
          workaround till a common config with appropriate identifier is created. */
          if (!isStable && isTokenPairStable(token, pairedtToken)) {
            continue;
          }
          /* Special workaround if ends */
          const tokenA = isStable
            ? stableSwapTokens.find((stableToken) => stableToken.name === token)
            : tokens.find((normalToken) => normalToken.name === token);
          const tokenB = isStable
            ? stableSwapTokens.find((stableToken) => stableToken.name === pairedtToken)
            : tokens.find((normalToken) => normalToken.name === pairedtToken);
          const { finalTokenA, finalTokenB } =
            isStable &&
            CONFIG.AMM[CONFIG.NETWORK][tokenA.name].DEX_PAIRS[tokenB.name]?.type === 'xtz'
              ? swapBasedOnPoolXtz(tokenA, tokenB)
              : swapBasedOnPool(tokenA, tokenB);

          tokensPromiseList.push({
            tokenA: { name: finalTokenA.name, image: finalTokenA.image },
            tokenB: { name: finalTokenB.name, image: finalTokenB.image },
            isStable,
            func:
              isStable &&
              CONFIG.AMM[CONFIG.NETWORK][finalTokenA.name].DEX_PAIRS[finalTokenB.name]?.type ===
                'xtz'
                ? getUserBalanceByRpcStable
                : getUserBalanceByRpc,
            argOne: liquidityToken,
            argTwo: walletAddress,
          });
        }
        tempLPTokenObj[liquidityToken] = true;
      }
    }
  }
  const promiseResults = await Promise.allSettled(
    tokensPromiseList.map((promise) => promise.func(promise.argOne, promise.argTwo)),
  );

  promiseResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success && result.value.balance > 0) {
      listOfAvailablePostions.push({
        tokenA: tokensPromiseList[index].tokenA,
        tokenB: tokensPromiseList[index].tokenB,
        isStable: tokensPromiseList[index].isStable,
        lpBalance: result.value.balance,
      });
    }
  });
  return listOfAvailablePostions;
};

/**
 * Fetch the list of all the pair of tokens including stable pairs, for which the connected wallet has liquidity available.
 * @param {string} walletAddress - Address of the wallet connected.
 * @returns List of pair of tokens or an error message.
 */
export const getLiquidityPositionsForUser = async (walletAddress) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const tokenList = CONFIG.AMM[connectedNetwork];
    const stableTokenList = CONFIG.STABLESWAP[connectedNetwork];
    const stableTokenResult = await getListOfPositions(stableTokenList, true, walletAddress);
    const tokenResult = await getListOfPositions(tokenList, false, walletAddress);
    const finalResult = [...tokenResult, ...stableTokenResult];

    return {
      success: true,
      data: finalResult,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Check if the entered pair of tokens is stable or not.
 * @param {string} tokenA - First token from the pair selected.
 * @param {string} tokenB - Second token from the pair selected.
 * @returns Whether the pair of tokens is stable or not.
 */
export const isTokenPairStable = (tokenA, tokenB) => {
  const connectedNetwork = CONFIG.NETWORK;
  return CONFIG.STABLESWAP[connectedNetwork][tokenA] &&
    CONFIG.STABLESWAP[connectedNetwork][tokenA].DEX_PAIRS[tokenB]
    ? true
    : false;
};

/**
 * Check if liquidity position exists for a pair of tokens.
 * @param {string} tokenA - First token from the pair selected.
 * @param {string} tokenB - Second token from the pair selected.
 * @param {string} walletAddress - Address of the wallet connected.
 * @returns Basic details of liquidity if pair exists else a no; or an error message.
 */
export const getLpTokenBalanceForPair = async (tokenA, tokenB, walletAddress) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const isPairStable = isTokenPairStable(tokenA, tokenB);
    const liquidityToken = isPairStable
      ? CONFIG.STABLESWAP[connectedNetwork][tokenA].DEX_PAIRS[tokenB].liquidityToken
      : CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].liquidityToken;
    const result = isPairStable
      ? await getUserBalanceByRpcStable(liquidityToken, walletAddress)
      : await getUserBalanceByRpc(liquidityToken, walletAddress);
    return result.success && result.balance > 0
      ? { success: true, isLiquidityAvailable: true, lpBalance: result.balance, isPairStable }
      : { success: true, isLiquidityAvailable: false, lpBalance: 0, isPairStable };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Get the required details of liquidity position for seleted pair of tokens.
 * @param {string} tokenA - First token from the pair selected.
 * @param {string} tokenB - Second token from the pair selected.
 * @param {string} walletAddress - Address of the wallet connected.
 * @returns Details of liquidity position or an error message.
 */
export const getLiquidityPositionDetails = async (tokenA, tokenB, walletAddress) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const liquidityToken = CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].liquidityToken;
    const lpTokenDecimal = CONFIG.AMM[connectedNetwork][liquidityToken].TOKEN_DECIMAL;
    const tokenPairContract = CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].contract;
    const amm_type = CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].type;
    const tokenAContractAddress = CONFIG.AMM[connectedNetwork][tokenA].TOKEN_CONTRACT;
    const tokenAID = CONFIG.AMM[connectedNetwork][tokenA].TOKEN_ID;
    const tokenADecimal = CONFIG.AMM[connectedNetwork][tokenA].TOKEN_DECIMAL;
    const tokenBContractAddress = CONFIG.AMM[connectedNetwork][tokenB].TOKEN_CONTRACT;
    const tokenBID = CONFIG.AMM[connectedNetwork][tokenB].TOKEN_ID;
    const tokenBDecimal = CONFIG.AMM[connectedNetwork][tokenB].TOKEN_DECIMAL;
    const poolBalances = {};
    let lpBalance = 0;

    const result = await getUserBalanceByRpc(liquidityToken, walletAddress);
    if (result.success && result.balance > 0) {
      lpBalance = result.balance;
    } else {
      throw new Error('Liquidity not available for the selected pair.');
    }
    // Convert the balance to actual value stored in storage, for calculation.
    const lpTokenBalance = lpBalance * 10 ** lpTokenDecimal;

    const storageResponse = await axios.get(
      `${rpcNode}chains/main/blocks/head/context/contracts/${tokenPairContract}/storage`,
    );

    if (amm_type === 'veAMM') {
      const tokenOneAddress = storageResponse.data.args[0].args[2].string;
      const tokenOneID = Number(storageResponse.data.args[0].args[4].int);
      const tokenOnePool = Number(storageResponse.data.args[1].args[0].args[1].int);

      const tokenTwoAddress = storageResponse.data.args[1].args[1].string;
      const tokenTwoID = Number(storageResponse.data.args[2].args[0].int);
      const tokenTwoPool = Number(storageResponse.data.args[3].int);
      const lpTokenSupply = Number(storageResponse.data.args[4].int);

      // Token pool share percentage.
      const lpTokenShare = (lpTokenBalance * 100) / lpTokenSupply;

      // Check if the order of pair sent in arguments is same as order of pair stored in contract storage and calculate balance accordingly[Swap or No Swap].
      if (
        tokenAContractAddress === tokenOneAddress &&
        tokenAID === tokenOneID &&
        tokenBContractAddress === tokenTwoAddress &&
        tokenBID === tokenTwoID
      ) {
        // No swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else if (
        tokenAContractAddress === tokenTwoAddress &&
        tokenAID === tokenTwoID &&
        tokenBContractAddress === tokenOneAddress &&
        tokenBID === tokenOneID
      ) {
        // Swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else {
        throw new Error('Invalid Token Pairs');
      }

      return {
        success: true,
        data: {
          tokenA,
          tokenB,
          tokenAPoolBalance: poolBalances.tokenAPoolBalance,
          tokenBPoolBalance: poolBalances.tokenBPoolBalance,
          lpBalance,
          lpTokenShare,
        },
      };
    } else if (amm_type === 'veStableAMM') {
      const tokenOneAddress = storageResponse.data.args[0].args[2].string;
      const tokenOneID = Number(storageResponse.data.args[1].args[0].args[0].int);
      const tokenTwoAddress = storageResponse.data.args[1].args[2].string;
      const tokenTwoID = Number(storageResponse.data.args[2].args[1].int);

      const tokenOnePool = Number(storageResponse.data.args[1].args[0].args[1].int);
      const tokenTwoPool = Number(storageResponse.data.args[3].int);
      const lpTokenSupply = Number(storageResponse.data.args[0].args[0].args[2].int);

      // Token pool share percentage.
      const lpTokenShare = (lpTokenBalance * 100) / lpTokenSupply;

      // Check if the order of pair sent in arguments is same as order of pair stored in contract storage and calculate balance accordingly[Swap or No Swap].
      if (
        tokenAContractAddress === tokenOneAddress &&
        tokenAID === tokenOneID &&
        tokenBContractAddress === tokenTwoAddress &&
        tokenBID === tokenTwoID
      ) {
        // No swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else if (
        tokenAContractAddress === tokenTwoAddress &&
        tokenAID === tokenTwoID &&
        tokenBContractAddress === tokenOneAddress &&
        tokenBID === tokenOneID
      ) {
        // Swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else {
        throw new Error('Invalid Token Pairs');
      }

      return {
        success: true,
        data: {
          tokenA,
          tokenB,
          tokenAPoolBalance: poolBalances.tokenAPoolBalance,
          tokenBPoolBalance: poolBalances.tokenBPoolBalance,
          lpBalance,
          lpTokenShare,
        },
      };
    } else {
      const tokenOneAddress = storageResponse.data.args[0].args[2].string;
      const tokenOneID = Number(storageResponse.data.args[1].args[0].args[0].int);
      const tokenOnePool = Number(storageResponse.data.args[1].args[1].int);
      const tokenTwoAddress = storageResponse.data.args[1].args[2].string;
      const tokenTwoID = Number(storageResponse.data.args[2].args[1].int);
      const tokenTwoPool = Number(storageResponse.data.args[4].int);
      const lpTokenSupply = Number(storageResponse.data.args[5].int);

      // Token pool share percentage.
      const lpTokenShare = (lpTokenBalance * 100) / lpTokenSupply;

      // Check if the order of pair sent in arguments is same as order of pair stored in contract storage and calculate balance accordingly[Swap or No Swap].
      if (
        tokenAContractAddress === tokenOneAddress &&
        tokenAID === tokenOneID &&
        tokenBContractAddress === tokenTwoAddress &&
        tokenBID === tokenTwoID
      ) {
        // No swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else if (
        tokenAContractAddress === tokenTwoAddress &&
        tokenAID === tokenTwoID &&
        tokenBContractAddress === tokenOneAddress &&
        tokenBID === tokenOneID
      ) {
        // Swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else {
        throw new Error('Invalid Token Pairs');
      }

      return {
        success: true,
        data: {
          tokenA,
          tokenB,
          tokenAPoolBalance: poolBalances.tokenAPoolBalance,
          tokenBPoolBalance: poolBalances.tokenBPoolBalance,
          lpBalance,
          lpTokenShare,
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Get the required details of liquidity position for selected stable pair of tokens.
 * @param {string} tokenA - First token from the stable pair selected.
 * @param {string} tokenB - Second token from the stable pair selected.
 * @param {string} walletAddress - Address of the wallet connected.
 * @returns Details of liquidity position for the stable pair or an error message.
 */
export const getLiquidityPositionDetailsStable = async (tokenA, tokenB, walletAddress) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    // const rpcNode = CONFIG.RPC_NODES[connectedNetwork];
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const liquidityToken =
      CONFIG.STABLESWAP[connectedNetwork][tokenA].DEX_PAIRS[tokenB].liquidityToken;
    const lpTokenDecimal = CONFIG.STABLESWAP[connectedNetwork][liquidityToken].TOKEN_DECIMAL;
    const tokenPairContract =
      CONFIG.STABLESWAP[connectedNetwork][tokenA].DEX_PAIRS[tokenB].contract;
    const tokenAContractAddress = CONFIG.STABLESWAP[connectedNetwork][tokenA].TOKEN_CONTRACT;
    const tokenADecimal = CONFIG.STABLESWAP[connectedNetwork][tokenA].TOKEN_DECIMAL;
    const tokenAID = CONFIG.AMM[connectedNetwork][tokenA].TOKEN_ID;
    const tokenBContractAddress = CONFIG.STABLESWAP[connectedNetwork][tokenB].TOKEN_CONTRACT;
    const tokenBDecimal = CONFIG.STABLESWAP[connectedNetwork][tokenB].TOKEN_DECIMAL;
    const tokenBID = CONFIG.AMM[connectedNetwork][tokenB].TOKEN_ID;
    const poolBalances = {};
    let lpBalance = 0;

    const amm_type = CONFIG.AMM[connectedNetwork][tokenA].DEX_PAIRS[tokenB].type;
    if (amm_type === 'veStableAMM') {
      const result = await getUserBalanceByRpc(liquidityToken, walletAddress);
      if (result.success && result.balance > 0) {
        lpBalance = result.balance;
      } else {
        throw new Error('Liquidity not available for the selected pair.');
      }
      // Convert the balance to actual value stored in storage, for calculation.
      const lpTokenBalance = lpBalance * 10 ** lpTokenDecimal;

      const storageResponse = await axios.get(
        `${rpcNode}chains/main/blocks/head/context/contracts/${tokenPairContract}/storage`,
      );

      const tokenOneAddress = storageResponse.data.args[0].args[2].string;
      const tokenOneID = Number(storageResponse.data.args[0].args[4].int);

      const tokenTwoAddress = storageResponse.data.args[1].args[2].string;
      const tokenTwoID = Number(storageResponse.data.args[2].args[1].int);

      const tokenOnePool = Number(storageResponse.data.args[1].args[0].args[1].int);
      const tokenTwoPool = Number(storageResponse.data.args[3].int);
      const lpTokenSupply = Number(storageResponse.data.args[0].args[0].args[2].int);

      // Token pool share percentage.
      const lpTokenShare = (lpTokenBalance * 100) / lpTokenSupply;

      // Check if the order of pair sent in arguments is same as order of pair stored in contract storage and calculate balance accordingly[Swap or No Swap].
      if (
        tokenAContractAddress === tokenOneAddress &&
        tokenAID === tokenOneID &&
        tokenBContractAddress === tokenTwoAddress &&
        tokenBID === tokenTwoID
      ) {
        // No swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else if (
        tokenAContractAddress === tokenTwoAddress &&
        tokenAID === tokenTwoID &&
        tokenBContractAddress === tokenOneAddress &&
        tokenBID === tokenOneID
      ) {
        // Swap.
        poolBalances['tokenAPoolBalance'] =
          (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenADecimal;
        poolBalances['tokenBPoolBalance'] =
          (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenBDecimal;
      } else {
        throw new Error('Invalid Token Pairs');
      }

      return {
        success: true,
        data: {
          tokenA,
          tokenB,
          tokenAPoolBalance: poolBalances.tokenAPoolBalance,
          tokenBPoolBalance: poolBalances.tokenBPoolBalance,
          lpBalance,
          lpTokenShare,
        },
      };
    }

    const result = await getUserBalanceByRpcStable(liquidityToken, walletAddress);

    if (result.success && result.balance > 0) {
      lpBalance = result.balance;
    } else {
      throw new Error('Liquidity not available for the selected pair.');
    }
    // Convert the balance to actual value stored in storage, for calculation.
    const lpTokenBalance = lpBalance * 10 ** lpTokenDecimal;

    const storageResponse = await axios.get(
      `${rpcNode}chains/main/blocks/head/context/contracts/${tokenPairContract}/storage`,
    );
    const tokenOneAddress = 'KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4';
    const tokenOnePool = Number(storageResponse.data.args[2].args[1].int);
    const tokenTwoAddress = '';
    const tokenTwoPool = Number(storageResponse.data.args[0].args[1].args[0].int);
    const lpTokenSupply = Number(storageResponse.data.args[0].args[4].int);

    // Token pool share percentage.
    const lpTokenShare = (lpTokenBalance * 100) / lpTokenSupply;

    // Check if the order of pair sent in arguments is same as order of pair stored in contract storage and calculate balance accordingly[Swap or No Swap].
    if (tokenAContractAddress === tokenOneAddress && tokenBContractAddress === tokenTwoAddress) {
      // No swap.
      poolBalances['tokenAPoolBalance'] =
        (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenADecimal;
      poolBalances['tokenBPoolBalance'] =
        (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenBDecimal;
    } else if (
      tokenAContractAddress === tokenTwoAddress &&
      tokenBContractAddress === tokenOneAddress
    ) {
      // Swap.
      poolBalances['tokenAPoolBalance'] =
        (lpTokenBalance * tokenTwoPool) / lpTokenSupply / 10 ** tokenADecimal;
      poolBalances['tokenBPoolBalance'] =
        (lpTokenBalance * tokenOnePool) / lpTokenSupply / 10 ** tokenBDecimal;
    } else {
      throw new Error('Invalid Token Pairs');
    }

    return {
      success: true,
      data: {
        tokenA,
        tokenB,
        tokenAPoolBalance: poolBalances.tokenAPoolBalance,
        tokenBPoolBalance: poolBalances.tokenBPoolBalance,
        lpBalance,
        lpTokenShare,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
