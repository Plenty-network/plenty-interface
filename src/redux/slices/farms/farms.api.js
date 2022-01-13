import { BeaconWallet } from '@taquito/beacon-wallet';
import { OpKind, TezosToolkit } from '@taquito/taquito';
import { stakingOnFarmProcessing, unstakingOnFarmProcessing } from './farms.slice';
import store from '../../store/store';
import axios from 'axios';
import CONFIG from '../../../config/config';
import { RPC_NODE } from '../../../constants/localStorage';

/**
 * Fetches storage of farm contract which is Dual in nature to show farm specific data
 * @param identifier - Name to identify a farm type case-sensitive to CONFIG
 * @param address - Contract address of farm
 * @param dualInfo - Info of dual rewards, part of CONFIG
 * @param priceOfStakeTokenInUsd - Price of LP token
 * @param tokenPricesData - Data returned from TezTools API
 * @returns {Promise<{identifier, roiTable: *[], APR: number, totalLiquidty: number, address, rewardRate: number, success: boolean, totalSupply: number, error}|{identifier, roiTable: *[], APR: number, totalLiquidty: number, address, rewardRate: (string|string|T)[], success: boolean, totalSupply: string | string | T | undefined, tokens: (string)[]}>}
 */
const fetchStorageForDualStakingContract = async (
  identifier,
  address,
  dualInfo,
  priceOfStakeTokenInUsd,
  tokenPricesData,
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    let tokenFirstPrice = 0;
    let tokenSecondPrice = 0;
    for (const i in tokenPricesData) {
      if (
        tokenPricesData[i].symbol === dualInfo.tokenFirst.symbol &&
        tokenPricesData[i].tokenAddress === dualInfo.tokenFirst.tokenContract
      ) {
        tokenFirstPrice = tokenPricesData[i].usdValue;
      } else if (
        tokenPricesData[i].symbol === dualInfo.tokenSecond.symbol &&
        tokenPricesData[i].tokenAddress === dualInfo.tokenSecond.tokenContract
      ) {
        tokenSecondPrice = tokenPricesData[i].usdValue;
      }
    }
    const promises = [];
    const urlTokenFirst = `${rpcNode}chains/main/blocks/head/context/contracts/${dualInfo.tokenFirst.rewardContract}/storage`;
    const urlTokenSecond = `${rpcNode}chains/main/blocks/head/context/contracts/${dualInfo.tokenSecond.rewardContract}/storage`;

    promises.push(axios.get(urlTokenFirst));
    promises.push(axios.get(urlTokenSecond));

    const response = await Promise.all(promises);
    let totalSupply = response[0].data.args[4].int;
    totalSupply = (totalSupply / Math.pow(10, 18)).toFixed(2);

    let rewardRateFirst = response[0].data.args[1].args[2].int;
    rewardRateFirst = (rewardRateFirst / Math.pow(10, dualInfo.tokenFirst.tokenDecimal)).toFixed(3);
    let rewardRateSecond = response[1].data.args[1].args[2].int;
    rewardRateSecond = (rewardRateSecond / Math.pow(10, dualInfo.tokenSecond.tokenDecimal)).toFixed(
      3,
    );

    const APRFirst =
      (rewardRateFirst * 1051200 * tokenFirstPrice) / (totalSupply * priceOfStakeTokenInUsd);

    const APRSecond =
      (rewardRateSecond * 1051200 * tokenSecondPrice) / (totalSupply * priceOfStakeTokenInUsd);

    let APR = APRFirst + APRSecond;
    APR = APR * 100;

    const DPYFirst =
      (rewardRateFirst * 2880 * tokenFirstPrice) / (totalSupply * priceOfStakeTokenInUsd);

    const DPYSecond =
      (rewardRateSecond * 2880 * tokenSecondPrice) / (totalSupply * priceOfStakeTokenInUsd);

    let DPY = DPYFirst + DPYSecond;
    DPY = DPY * 100;

    const intervalList = [1, 7, 30, 365];
    const roiTable = [];

    for (const interval of intervalList) {
      roiTable.push({
        roi: DPY * interval,
        PlentyPer1000dollar: (10 * DPYFirst * interval * 100) / tokenFirstPrice,
        tokenSecondPer1000dollar: (10 * DPYSecond * interval * 100) / tokenSecondPrice,
      });
    }

    const totalLiquidty = totalSupply * priceOfStakeTokenInUsd;
    return {
      success: true,
      identifier,
      APR,
      totalLiquidty,
      roiTable,
      totalSupply,
      address,
      rewardRate: [rewardRateFirst, rewardRateSecond],
      tokens: [dualInfo.tokenFirst.symbol, dualInfo.tokenSecond.symbol],
    };
  } catch (error) {
    console.log({ message: 'Dual Storage error', error });
    return {
      success: false,
      error,
      identifier,
      APR: 0,
      totalLiquidty: 0,
      roiTable: [],
      totalSupply: 0,
      address,
      rewardRate: 0,
    };
  }
};
/**
 * Fetches storage of farm contract which is NOT Dual in nature to show farm specific data
 * @param identifier -  Name to identify a farm type case-sensitive to CONFIG
 * @param address - Contract address of farm
 * @param priceOfStakeTokenInUsd - Price of LP token
 * @param priceOfPlentyInUSD - Price of plenty as fetched from TezTools API
 * @returns {Promise<{success: boolean, error}|{identifier, roiTable: *[], APR: number, totalLiquidty: number, address, rewardRate: number | string | T | undefined | number, success: boolean, totalSupply: number | string | T | undefined | number}>}
 */
const fetchStorageOfStakingContract = async (
  identifier,
  address,
  priceOfStakeTokenInUsd,
  priceOfPlentyInUSD,
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const url = `${rpcNode}chains/main/blocks/head/context/contracts/${address}/storage`;
    const response = await axios.get(url);

    let totalSupply = response.data.args[3].int;
    if (
      identifier === 'uUSD - YOU' ||
      identifier === 'uUSD - wUSDC' ||
      identifier === 'uUSD - uDEFI'
    ) {
      totalSupply = (totalSupply / Math.pow(10, 12)).toFixed(2);
    } else {
      totalSupply = (totalSupply / Math.pow(10, 18)).toFixed(2);
    }
    totalSupply = parseFloat(totalSupply);

    let rewardRate = response.data.args[1].args[1].int;
    if (
      identifier === 'uUSD - YOU' ||
      identifier === 'uUSD - wUSDC' ||
      identifier === 'uUSD - uDEFI'
    ) {
      rewardRate = (rewardRate / Math.pow(10, 12)).toFixed(18);
    } else {
      rewardRate = (rewardRate / Math.pow(10, 18)).toFixed(18);
    }
    rewardRate = parseFloat(rewardRate);
    let DPY = (rewardRate * 2880 * priceOfPlentyInUSD) / (totalSupply * priceOfStakeTokenInUsd);
    DPY = DPY * 100;

    const intervalList = [1, 7, 30, 365];
    const roiTable = [];

    for (const interval of intervalList) {
      roiTable.push({
        roi: DPY * interval,
        PlentyPer1000dollar: (10 * DPY * interval) / priceOfPlentyInUSD,
      });
    }

    let APR = (rewardRate * 1051200 * priceOfPlentyInUSD) / (totalSupply * priceOfStakeTokenInUsd);
    APR = APR * 100;

    const totalLiquidty = totalSupply * priceOfStakeTokenInUsd;
    return {
      success: true,
      identifier,
      APR,
      totalLiquidty,
      roiTable,
      totalSupply,
      address,
      rewardRate,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
/**
 * Get the price of Quipuswap LP token
 * @param identifier -  Name to identify a farm type case-sensitive to CONFIG
 * @param dexAddress - Contract address of Dex
 * @returns {Promise<{dexAddress, identifier, success: boolean, lpPriceInXtz: number, tez_pool: number, total_Supply: number}|{identifier, success: boolean, lpPriceInXtz: number}>}
 */
const getLpPriceFromDex = async (identifier, dexAddress) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const response = await axios.get(
      `${rpcNode}chains/main/blocks/head/context/contracts/${dexAddress}/storage`,
    );

    const tez_pool = parseInt(response.data.args[1].args[0].args[1].args[2].int);

    let total_Supply;
    if (identifier === 'PLENTY - XTZ') {
      total_Supply = parseInt(response.data.args[1].args[0].args[4].int);
    } else {
      total_Supply = parseInt(response.data.args[1].args[1].args[0].args[0].int);
    }
    const lpPriceInXtz = (tez_pool * 2) / total_Supply;
    return {
      success: true,
      identifier,
      lpPriceInXtz,
      tez_pool,
      total_Supply,
      dexAddress,
    };
  } catch (error) {
    return {
      success: false,
      identifier,
      lpPriceInXtz: 0,
    };
  }
};
/**
 * @deprecated
 * @returns {Promise<{ctezPriceInUSD: number}>}
 */
const getCtezPrice = async () => {
  try {
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    const promises = [];
    const cfmmStorageUrl = `${rpcNode}chains/main/blocks/head/context/contracts/KT1H5b7LxEExkFd2Tng77TfuWbM5aPvHstPr/storage`;
    const xtzDollarValueUrl = CONFIG.API.url;
    promises.push(axios.get(cfmmStorageUrl));
    promises.push(axios.get(xtzDollarValueUrl));

    const promisesResponse = await Promise.all(promises);
    const tokenPool = parseFloat(promisesResponse[0].data.args[0].int);
    const cashPool = parseFloat(promisesResponse[0].data.args[1].int);
    const xtzPrice = promisesResponse[1].data.market_data.current_price.usd;
    const ctezPriceInUSD = (cashPool / tokenPool) * xtzPrice;
    return {
      ctezPriceInUSD: ctezPriceInUSD,
    };
    //xtzPriceResponse.data.market_data.current_price.usd;
  } catch (e) {
    console.log({ e });
    return {
      ctezPriceInUSD: 0,
    };
  }
};
/**
 * Calculates the price of any PLP token
 * @param identifier - Name to identify a farm type case-sensitive to CONFIG
 * @param lpTokenDecimal - Contract level decimal consideration
 * @param dexAddress - Contract address of AMM/DEX
 * @param tokenPricesData - Response from TezTools API
 * @returns {Promise<{identifier, totalAmount: string, success: boolean}|{success: boolean}>}
 */
const getPriceForPlentyLpTokens = async (
  identifier,
  lpTokenDecimal,
  dexAddress,
  tokenPricesData,
) => {
  try {
    const storageResponse = await axios.get(
      CONFIG.RPC_NODES[CONFIG.NETWORK] +
        `/chains/main/blocks/head/context/contracts/${dexAddress}/storage`,
    );
    const token1Pool = parseInt(storageResponse.data.args[1].args[1].int);
    // token1Pool = token1Pool / Math.pow(10, 12);
    const token2Pool = parseInt(storageResponse.data.args[4].int);
    const lpTokenTotalSupply = parseInt(storageResponse.data.args[5].int);

    const token1Address = storageResponse.data.args[0].args[2].string.toString();
    const token1Check = storageResponse.data.args[0].args[3].prim.toString();

    const token2Address = storageResponse.data.args[1].args[2].string.toString();
    const token2Id = parseInt(storageResponse.data.args[2].args[1].int);
    const token2Check = storageResponse.data.args[2].args[0].prim.toString();

    // const tokenPriceResponse = await axios.get(
    //   'https://api.teztools.io/token/prices'
    // );
    // const tokenPricesData = tokenPriceResponse.data.contracts;
    const tokenData = {};

    if (token2Address === 'KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4') {
      const ctezPriceInUSD = await getCtezPrice();
      tokenData['token1'] = {
        tokenName: 'cTez',
        tokenValue: ctezPriceInUSD.ctezPriceInUSD,
        tokenDecimal: 6,
      };
    }

    let token1Type;
    let token2Type;

    if (token1Check.match('True')) {
      token1Type = 'fa2';
    } else {
      token1Type = 'fa1.2';
    }

    if (token2Check.match('True')) {
      token2Type = 'fa2';
    } else {
      token2Type = 'fa1.2';
    }

    for (const i in tokenPricesData) {
      if (
        tokenPricesData[i].tokenAddress === token1Address &&
        tokenPricesData[i].type === token1Type
      ) {
        tokenData['token0'] = {
          tokenName: tokenPricesData[i].symbol,
          tokenValue: tokenPricesData[i].usdValue,
          tokenDecimal: tokenPricesData[i].decimals,
        };
      }

      // if (
      //   tokenPricesData[i].tokenAddress === token2Address &&
      //   tokenPricesData[i].type === token2Type &&
      //   tokenPricesData[i].tokenId === token2Id &&
      //   tokenPricesData[i].tokenId === token2Id
      // ) {
      //   tokenData['token1'] = {
      //     tokenName: tokenPricesData[i].symbol,
      //     tokenValue: tokenPricesData[i].usdValue,
      //     tokenDecimal: tokenPricesData[i].decimals,
      //   };
      // }

      if (token2Type === 'fa2') {
        if (
          tokenPricesData[i].tokenAddress === token2Address &&
          tokenPricesData[i].type === token2Type &&
          tokenPricesData[i].tokenId === token2Id
        ) {
          tokenData['token1'] = {
            tokenName: tokenPricesData[i].symbol,
            tokenValue: tokenPricesData[i].usdValue,
            tokenDecimal: tokenPricesData[i].decimals,
          };
        }
      } else if (token2Type === 'fa1.2') {
        if (
          tokenPricesData[i].tokenAddress === token2Address &&
          tokenPricesData[i].type === token2Type
        ) {
          tokenData['token1'] = {
            tokenName: tokenPricesData[i].symbol,
            tokenValue: tokenPricesData[i].usdValue,
            tokenDecimal: tokenPricesData[i].decimals,
          };
        }
      }
    }
    let token1Amount = (Math.pow(10, lpTokenDecimal) * token1Pool) / lpTokenTotalSupply;
    token1Amount =
      (token1Amount * tokenData['token0'].tokenValue) /
      Math.pow(10, tokenData['token0'].tokenDecimal);

    let token2Amount = (Math.pow(10, lpTokenDecimal) * token2Pool) / lpTokenTotalSupply;
    token2Amount =
      (token2Amount * tokenData['token1'].tokenValue) /
      Math.pow(10, tokenData['token1'].tokenDecimal);
    const totalAmount = (token1Amount + token2Amount).toFixed(2);
    return {
      success: true,
      identifier,
      totalAmount,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
/**
 * Returns data of all farms either active or inactive
 * @param isActive {boolean}- Choose one from active and inactive
 * @returns {Promise<{success: boolean, response: {}}>}
 */
export const getFarmsDataAPI = async (isActive) => {
  try {
    const promises = [];
    const dexPromises = [];
    const initialDataPromises = [];
    initialDataPromises.push(axios.get(CONFIG.API.url));
    initialDataPromises.push(axios.get(CONFIG.API.tezToolTokenPrice));
    const initialDataResponse = await Promise.all(initialDataPromises);
    //const xtzPriceResponse = await axios.get(CONFIG.API.url);
    const xtzPriceResponse = initialDataResponse[0];
    const xtzPriceInUsd = xtzPriceResponse.data.market_data.current_price.usd;
    //const tokenPrices = await axios.get(CONFIG.API.tezToolTokenPrice);
    const tokenPrices = initialDataResponse[1];
    const tokenPricesData = tokenPrices.data.contracts;
    let priceOfPlenty = 0;
    let priceOfYou = 0;
    for (const i in tokenPricesData) {
      if (
        tokenPricesData[i].symbol === 'PLENTY' &&
        tokenPricesData[i].tokenAddress === 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b'
      ) {
        priceOfPlenty = tokenPricesData[i].usdValue;
      }
      if (
        tokenPricesData[i].symbol === 'YOU' &&
        tokenPricesData[i].tokenAddress === 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL'
      ) {
        priceOfYou = tokenPricesData[i].usdValue;
      }
    }
    for (const key in CONFIG.FARMS[CONFIG.NETWORK]) {
      for (const i in CONFIG.FARMS[CONFIG.NETWORK][key][
        isActive === true ? 'active' : 'inactive'
      ]) {
        if (key === 'PLENTY - XTZ' || key === 'KALAM - XTZ') {
          dexPromises.push(
            getLpPriceFromDex(
              key,
              CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i].DEX,
            ),
          );
        } else if (
          key === 'PLENTY - wBUSD' ||
          key === 'PLENTY - wUSDC' ||
          key === 'PLENTY - wWBTC' ||
          key === 'PLENTY - wMATIC' ||
          key === 'PLENTY - wLINK' ||
          key === 'PLENTY - USDtz' ||
          key === 'PLENTY - hDAO' ||
          key === 'PLENTY - ETHtz' ||
          key === 'PLENTY - wWETH' ||
          key === 'PLENTY - kUSD' ||
          key === 'PLENTY - QUIPU' ||
          key === 'PLENTY - KALAM' ||
          key === 'PLENTY - SMAK' ||
          key === 'PLENTY - UNO' ||
          key === 'PLENTY - WRAP' ||
          key === 'PLENTY - tzBTC' ||
          key === 'PLENTY - uUSD' ||
          key === 'PLENTY - GIF' ||
          key === 'PLENTY - YOU' ||
          key === 'PLENTY - wDAI' ||
          key === 'PLENTY - wUSDT' ||
          key === 'PLENTY - cTez' ||
          key === 'uUSD - YOU' ||
          key === 'uUSD - uDEFI' ||
          key === 'uUSD - wUSDC' ||
          key === 'ctez - kUSD' ||
          key === 'ctez - USDtz' ||
          key === 'ctez - wUSDT' ||
          key === 'ctez - wBUSD' ||
          key === 'ctez - wUSDC' ||
          key === 'ctez - wDAI' ||
          key === 'ctez - KALAM' ||
          key === 'ctez - GIF' ||
          key === 'ctez - ETHtz' ||
          key === 'ctez - QUIPU' ||
          key === 'ctez - hDAO' ||
          key === 'ctez - kDAO' ||
          key === 'ctez - wWETH' ||
          key === 'ctez - uUSD' ||
          key === 'ctez - FLAME' ||
          key === 'ctez - SMAK' ||
          key === 'ctez - crDAO' ||
          key === 'ctez - PXL' ||
          key === 'ctez - UNO' ||
          key === 'ctez - WRAP' ||
          key === 'ctez - wWBTC' ||
          key === 'ctez - tzBTC' ||
          key === 'ctez - PAUL' ||
          key === 'ctez - INSTA' ||
          key === 'ctez - CRUNCH'
        ) {
          dexPromises.push(
            getPriceForPlentyLpTokens(
              key,
              CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i]
                .TOKEN_DECIMAL,
              CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i].DEX,
              tokenPricesData,
            ),
          );
        }
      }
    }
    const response = await Promise.all(dexPromises);
    const lpPricesInUsd = {};
    for (const i in response) {
      if (response[i].lpPriceInXtz * xtzPriceInUsd) {
        lpPricesInUsd[response[i].identifier] = response[i].lpPriceInXtz * xtzPriceInUsd;
      } else {
        lpPricesInUsd[response[i].identifier] = response[i].totalAmount;
      }
    }
    for (const key in CONFIG.FARMS[CONFIG.NETWORK]) {
      for (const i in CONFIG.FARMS[CONFIG.NETWORK][key][
        isActive === true ? 'active' : 'inactive'
      ]) {
        if (
          CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i]
            .isDualFarm === false
        ) {
          if (key === 'uUSD - YOU' || key === 'uUSD - uDEFI' || key === 'uUSD - wUSDC') {
            promises.push(
              fetchStorageOfStakingContract(
                key,
                CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i]
                  .CONTRACT,
                lpPricesInUsd[key],
                priceOfYou,
              ),
            );
          } else {
            promises.push(
              fetchStorageOfStakingContract(
                key,
                CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i]
                  .CONTRACT,
                lpPricesInUsd[key],
                priceOfPlenty,
              ),
            );
          }
        } else {
          promises.push(
            fetchStorageForDualStakingContract(
              key,
              CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i]
                .CONTRACT,
              CONFIG.FARMS[CONFIG.NETWORK][key][isActive === true ? 'active' : 'inactive'][i]
                .dualInfo,
              lpPricesInUsd[key],
              tokenPricesData,
            ),
          );
        }
      }
    }
    const farmsData = {};

    const farmResponse = await Promise.all(promises);
    for (const i in farmResponse) {
      farmsData[farmResponse[i].address] = {
        identifier: farmResponse[i].identifier,
        APR: farmResponse[i].APR,
        totalLiquidty: farmResponse[i].totalLiquidty,
        roiTable: farmResponse[i].roiTable,
        totalSupply: farmResponse[i].totalSupply,
        rewardRate: farmResponse[i].rewardRate,
      };
    }
    return {
      success: true,
      response: farmsData,
    };
  } catch (error) {
    return {
      success: false,
      response: {},
    };
  }
};

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
/**
 * Performs and operation for user to stake in a particular farm
 * @param amount - amount of LP token(s) user wants to stake
 * @param farmIdentifier - Name to identify a farm type case-sensitive to CONFIG
 * @param isActive {boolean} - Whether the particular farm is active or inactive
 * @param position - Array based position in farm in CONFIG
 * @returns {Promise<{success: boolean, operationId: string}|{success: boolean, error}>}
 */
export const stakeFarmAPI = async (amount, farmIdentifier, isActive, position) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const wallet = new BeaconWallet(options);
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const account = await wallet.client.getActiveAccount();
      const userAddress = account.address;
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);

      const farmContractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT

        CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][
          position
        ].CONTRACT,
      );
      const tokenContractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].LP_TOKEN
        CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][
          position
        ].LP_TOKEN,
      );
      const tokenAmount =
        amount *
        Math.pow(
          10,
          //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TOKEN_DECIMAL
          CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][
            position
          ].TOKEN_DECIMAL,
        );
      let batch = null;
      if (
        //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TYPE === 'FA1.2'
        CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][
          position
        ].TYPE === 'FA1.2'
      ) {
        batch = await Tezos.wallet
          .batch()
          .withContractCall(
            tokenContractInstance.methods.approve(
              //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT,
              CONFIG.FARMS[connectedNetwork][farmIdentifier][
                isActive === true ? 'active' : 'inactive'
              ][position].CONTRACT,
              tokenAmount,
            ),
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
                    CONFIG.FARMS[connectedNetwork][farmIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].CONTRACT,
                  token_id:
                    //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TOKEN_ID,
                    CONFIG.FARMS[connectedNetwork][farmIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].TOKEN_ID,
                },
              },
            ]),
          )
          .withContractCall(farmContractInstance.methods.stake(tokenAmount))
          .withContractCall(
            tokenContractInstance.methods.update_operators([
              {
                remove_operator: {
                  owner: userAddress,
                  operator:
                    //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].CONTRACT,
                    CONFIG.FARMS[connectedNetwork][farmIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].CONTRACT,
                  token_id:
                    //CONFIG.CONTRACT[connectedNetwork].FARMS[farmIdentifier].TOKEN_ID,
                    CONFIG.FARMS[connectedNetwork][farmIdentifier][
                      isActive === true ? 'active' : 'inactive'
                    ][position].TOKEN_ID,
                },
              },
            ]),
          );
      }
      const batchOperation = await batch.send();
      store.dispatch(stakingOnFarmProcessing(batchOperation));
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
    throw new Error(error);
  }
};
/**
 * Performs operations to remove stake of user from a particular farm
 * @param stakesToUnstake - Array of stake which are needed to be unstaked
 * @param farmIdentifier - Name to identify a farm type case-sensitive to CONFIG
 * @param isActive {boolean} - Whether the particular farm is active or inactive
 * @param position - Array based position in farm in CONFIG
 * @returns {Promise<{success: boolean, operationId: string}|{success: boolean, error}>}
 */
export const unstakeAPI = async (stakesToUnstake, farmIdentifier, isActive, position) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    const wallet = new BeaconWallet(options);
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);

      const contractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].PLENTY_FARM_CONTRACT
        CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][
          position
        ].CONTRACT,
      );
      let amount;
      const unstakeBatch = stakesToUnstake.map((stake) => {
        amount =
          stake.amount *
          Math.pow(
            10,
            CONFIG.FARMS[connectedNetwork][farmIdentifier][
              isActive === true ? 'active' : 'inactive'
            ][position].TOKEN_DECIMAL,
          );
        return {
          kind: OpKind.TRANSACTION,
          ...contractInstance.methods.unstake(amount, stake.mapId).toTransferParams(),
        };
      });
      const batch = await Tezos.wallet.batch(unstakeBatch);
      const batchOperation = await batch.send();
      store.dispatch(unstakingOnFarmProcessing(batchOperation));
      await batchOperation.confirmation().then(() => batchOperation.hash);
      return {
        success: true,
        operationId: batchOperation.opHash,
      };
      // let tokenAmount = amount * Math.pow(10, CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][position].DECIMAL);
      // const operation = await contractInstance.methods
      //   .unstake(tokenAmount, mapKey)
      //   .send();
      // await operation.confirmation().then(() => operation.opHash);
      // return {
      //   success: true,
      //   operationId: operation.opHash,
      // };
    } else {
      return {
        success: false,
        error: WALLET_RESP.error,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * Performs operation to harvest user rewards from particular farm
 * @param farmIdentifier - Name to identify a farm type case-sensitive to CONFIG
 * @param isActive {boolean} - Whether the particular farm is active or inactive
 * @param position - Array based position in farm in CONFIG
 * @returns {Promise<{success: boolean, operationId: string}|{success: boolean, error}>}
 */
export const harvestAPI = async (farmIdentifier, isActive, position) => {
  try {
    const options = {
      name: CONFIG.NAME,
    };
    // const wallet = new BeaconWallet(options);
    // await wallet.client.requestPermissions({
    //   network,
    // });
    const wallet = new BeaconWallet(options);
    const connectedNetwork = CONFIG.NETWORK;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[connectedNetwork];
    const WALLET_RESP = await CheckIfWalletConnected(wallet);
    if (WALLET_RESP.success) {
      const Tezos = new TezosToolkit(rpcNode);
      Tezos.setRpcProvider(rpcNode);
      Tezos.setWalletProvider(wallet);
      const contractInstance = await Tezos.wallet.at(
        //CONFIG.CONTRACT[connectedNetwork].PLENTY_FARM_CONTRACT
        CONFIG.FARMS[connectedNetwork][farmIdentifier][isActive === true ? 'active' : 'inactive'][
          position
        ].CONTRACT,
      );
      const operation = await contractInstance.methods.GetReward(1).send();
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
