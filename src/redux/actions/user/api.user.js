import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';
import { RPC_NODE } from '../../../constants/localStorage';
import CONFIG from '../../../config/config';
import axios from 'axios';

const getPackedKey = (tokenId, address, type) => {
  const accountHex = `0x${TezosMessageUtils.writeAddress(address)}`;
  let packedKey = null;
  if (type === 'FA2') {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      // eslint-disable-next-line no-undef
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `(Pair ${accountHex} ${tokenId})`,
          '',
          TezosParameterFormat.Michelson,
        ),
        'hex',
      ),
    );
  } else {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      // eslint-disable-next-line no-undef
      Buffer.from(
        TezosMessageUtils.writePackedData(`${accountHex}`, '', TezosParameterFormat.Michelson),
        'hex',
      ),
    );
  }
  return packedKey;
};

/**
 * Returns staked amount and individual stakes of user
 * @param mapId - mapId of bigmap from which data is to be fetched
 * @param packedKey - User specific packed key to get its data from bigmap
 * @param identifier - Name to identify a farm type case-sensitive to CONFIG
 * @param decimal - decimals wrt farm contract
 * @param address - contract address of farm contract
 * @param tokenDecimal - decimals in token
 * @returns {Promise<{identifier, singularStakes: *[], address, balance: (number|string|T|undefined|number), success: boolean}|{identifier, singularStakes: *[], address, balance: number, success: boolean}>}
 */
const getStakedAmount = async (mapId, packedKey, identifier, decimal, address, tokenDecimal) => {
  try {
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
    const response = await axios.get(url);
    let balance = response.data.args[0].args[1].int;
    balance = parseInt(balance);
    balance = balance / Math.pow(10, decimal);
    const singularStakes = [];
    for (let i = 0; i < response.data.args[0].args[0].length; i++) {
      let amount = parseInt(response.data.args[0].args[0][i].args[1].args[0].int);
      amount = parseFloat(
        response.data.args[0].args[0][i].args[1].args[0].int / Math.pow(10, tokenDecimal),
      );
      singularStakes.push({
        mapId: response.data.args[0].args[0][i].args[0].int,
        amount: amount,
        block: response.data.args[0].args[0][i].args[1].args[1].int,
      });
    }

    return {
      success: true,
      balance,
      identifier,
      address,
      singularStakes,
    };
  } catch (error) {
    return {
      success: false,
      balance: 0,
      address,
      identifier,
      singularStakes: [],
    };
  }
};
/**
 * Returns staked amount by user for a dual farm
 * @param mapId - Big map id from where user specific data needs to be fetched
 * @param packedKey - packed key (expr..) of user
 * @param identifier - Name to identify a farm type case-sensitive to CONFIG
 * @param decimal - decimal adhered to by farm contract
 * @param address - address of user
 * @param tokenDecimal - decimals as per token contract
 * @returns {Promise<{identifier, singularStakes: *[], address, balance: (number|string|T|undefined|number), success: boolean}|{identifier, singularStakes: *[], address, balance: number, success: boolean}>}
 */
const getStakedAmountDual = async (
  mapId,
  packedKey,
  identifier,
  decimal,
  address,
  tokenDecimal,
) => {
  try {
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
    const response = await axios.get(url);
    let balance = response.data.args[1].int;
    balance = parseInt(balance);
    balance = balance / Math.pow(10, tokenDecimal);
    const singularStakes = [];
    //amt - args[0][0].args[1].args[0]
    for (let i = 0; i < response.data.args[0].length; i++) {
      const amount = parseFloat(
        response.data.args[0][i].args[1].args[0].int / Math.pow(10, tokenDecimal),
      );
      singularStakes.push({
        mapId: response.data.args[0][i].args[0].int,
        amount: amount,
        block: response.data.args[0][i].args[1].args[1].int,
      });
    }

    return {
      success: true,
      balance,
      identifier,
      address,
      singularStakes,
    };
  } catch (error) {
    return {
      success: false,
      balance: 0,
      address,
      identifier,
      singularStakes: [],
    };
  }
};
/**
 * Utility function to getBalance amount from contract
 * @param mapId - big map id from contract
 * @param packedKey - generated packed address of user
 * @param identifier - Name to identify a farm type case-sensitive to CONFIG
 * @param decimal - Decimals adhered to by contract
 * @returns {Promise<{identifier, balance: number, success: boolean}>}
 */
const getBalanceAmount = async (mapId, packedKey, identifier, decimal) => {
  try {
    let balance;
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    const url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
    const response = await axios.get(url);

    if (mapId === 3956 || mapId === 4353) {
      balance = response.data.args[0].args[1].int;
    } else if (mapId === 3943) {
      balance = response.data.args[1].int;
    } else if (mapId === 199 || mapId === 36) {
      balance = response.data.args[0].int;
    } else if (
      mapId === 1777 ||
      mapId === 1772 ||
      mapId === 515 ||
      mapId === 4178 ||
      mapId === 18153
    ) {
      balance = response.data.int;
    } else {
      balance = response.data.args[1].int;
    }

    balance = parseInt(balance);
    balance = balance / Math.pow(10, decimal);

    return {
      success: true,
      balance,
      identifier,
    };
  } catch (error) {
    return {
      success: false,
      balance: 0,
      identifier,
    };
  }
};
/**
 * Get balance from all the contracts
 * @param address : address of user
 * @returns {Promise<{success: boolean, response: {}}>}
 */
export const getBalanceAmountForAllContracts = async (address) => {
  try {
    let packedKey;
    const promises = [];

    for (const key in CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK]) {
      if (CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].type === 'FA1.2') {
        packedKey = getPackedKey(0, address, 'FA1.2');
      } else {
        packedKey = getPackedKey(
          CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].tokenId,
          address,
          'FA2',
        );
      }
      promises.push(
        getBalanceAmount(
          CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].mapId,
          packedKey,
          key,
          CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].decimal,
        ),
      );
    }
    const response = await Promise.all(promises);
    const balancesResponse = {};
    for (const i in response) {
      balancesResponse[response[i].identifier] = response[i].balance;
    }
    return {
      success: true,
      response: balancesResponse,
    };
  } catch (error) {
    return {
      success: false,
      response: {},
    };
  }
};
/**
 * Returns staked amount from all contracts
 * @param address - Address of user
 * @param type - FARMS | POOLS | PONDS
 * @param isActive {boolean} - Whether the particular farm is active or inactiveX
 * @returns {Promise<{currentBlock: any, success: boolean, response: {}}|{currentBlock: number, success: boolean, response: {}}>}
 */
export const getStakedAmountForAllContracts = async (address, type, isActive) => {
  try {
    const packedKey = getPackedKey(0, address, 'FA1.2');

    const promises = [];
    const blockData = await axios.get(`${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`);

    for (const identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]) {
      for (const i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
        isActive === true ? 'active' : 'inactive'
      ]) {
        if (identifier === 'PLENTY - GIF') {
          promises.push(
            getStakedAmountDual(
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].mapId,
              packedKey,
              identifier,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].decimal,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].address,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].tokenDecimal,
            ),
          );
        } else {
          promises.push(
            getStakedAmount(
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].mapId,
              packedKey,
              identifier,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].decimal,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].address,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].tokenDecimal,
            ),
          );
        }
      }
    }
    const response = await Promise.all(promises);
    const stakedAmountResponse = {};
    for (const i in response) {
      stakedAmountResponse[response[i].address] = {
        stakedAmount: response[i].balance,
        identifier: response[i].identifier,
        singularStakes: response[i].singularStakes,
      };
    }
    return {
      success: true,
      response: stakedAmountResponse,
      currentBlock: blockData.data,
    };
  } catch (error) {
    return {
      success: false,
      response: {},
      currentBlock: 0,
    };
  }
};
/**
 * Calculate harvest value of user for a dual farm
 * @param stakingContractAddress - Address of farm
 * @param DECIMAL - Decimal adhered to by contract
 * @param currentBlockLevel - Last block baked on blockchain
 * @param mapId - big map id from where user data needs to be fetched
 * @param packedAddress - User specific address for fetching big map data
 * @returns {Promise<{address, success: boolean, totalRewards: number}>}
 */
const calculateHarvestValueDualEntity = async (
  stakingContractAddress,
  DECIMAL,
  currentBlockLevel,
  mapId,
  packedAddress,
) => {
  try {
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    let url = `${rpcNode}chains/main/blocks/head/context/contracts/${stakingContractAddress}/storage`;
    const smartContractResponse = await axios.get(url);

    const periodFinish = smartContractResponse.data.args[1].args[0].int;

    const lastUpdateTime = smartContractResponse.data.args[0].args[2].int;

    const rewardRate = smartContractResponse.data.args[1].args[2].int;

    const totalSupply = smartContractResponse.data.args[4].int;

    const rewardPerTokenStored = smartContractResponse.data.args[1].args[1].int;

    if (totalSupply === 0) {
      throw 'No One Staked';
    }

    let rewardPerToken = Math.min(currentBlockLevel, parseInt(periodFinish));
    rewardPerToken = rewardPerToken - parseInt(lastUpdateTime);
    rewardPerToken *= parseInt(rewardRate) * Math.pow(10, DECIMAL);
    rewardPerToken = rewardPerToken / totalSupply + parseInt(rewardPerTokenStored);
    url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`;
    const bigMapResponse = await axios.get(url);

    const userBalance = bigMapResponse.data.args[0].int;
    const userRewardPaid = bigMapResponse.data.args[2].int;
    const rewards = bigMapResponse.data.args[1].int;
    let totalRewards = parseInt(userBalance) * (rewardPerToken - parseInt(userRewardPaid));
    totalRewards = totalRewards / Math.pow(10, DECIMAL) + parseInt(rewards);
    totalRewards = totalRewards / Math.pow(10, DECIMAL);

    if (totalRewards < 0) {
      totalRewards = 0;
    }
    return {
      success: true,
      totalRewards,
      address: stakingContractAddress,
    };
  } catch (error) {
    return {
      success: false,
      totalRewards: 0,
      address: stakingContractAddress,
    };
  }
};
/**
 * Utility function to calculate harvest value for dual farm
 * @param stakingContract - Address of Contract
 * @param dualInfo - Dual data of farm from CONFIG
 * @param currentBlock - Last block baked
 * @param packedAddress - User specific address for fetching big map data
 * @returns {Promise<{address, success: boolean, totalRewards: number[]}|{address, success: boolean, totalRewards: (number|[(number|*|number[]|[*,*]|number[]),(number|*|number[]|[*,*]|number[])]|number[]|[*,*]|number[]|*)[]}>}
 */
const calculateHarvestValueDual = async (
  stakingContract,
  dualInfo,
  currentBlock,
  packedAddress,
) => {
  try {
    const harvestValuePromises = [];
    harvestValuePromises.push(
      calculateHarvestValueDualEntity(
        dualInfo.tokenFirst.rewardContract,
        dualInfo.tokenFirst.tokenDecimal,
        currentBlock,
        dualInfo.tokenFirst.rewardMapId,
        packedAddress,
      ),
    );

    harvestValuePromises.push(
      calculateHarvestValueDualEntity(
        dualInfo.tokenSecond.rewardContract,
        dualInfo.tokenSecond.tokenDecimal,
        currentBlock,
        dualInfo.tokenSecond.rewardMapId,
        packedAddress,
      ),
    );

    const harvestValueResponse = await Promise.all(harvestValuePromises);
    return {
      success: true,
      totalRewards: [harvestValueResponse[0].totalRewards, harvestValueResponse[1].totalRewards],
      address: stakingContract,
    };
  } catch (error) {
    console.log({ message: 'calculateHarvestValueDual', error });
    return {
      success: false,
      totalRewards: [0, 0],
      address: stakingContract,
    };
  }
};
/**
 * Calculates harvest value for a non-dual farm
 * @param stakingContractAddress -  Contract address of the farm
 * @param DECIMAL - Decimal in the contract
 * @param currentBlockLevel - last block baked
 * @param mapId - big map Id from where user specific data needs to be fetched
 * @param packedAddress - Specific packed address of user
 * @returns {Promise<{address, success: boolean, totalRewards: number}>}
 */
const calculateHarvestValue = async (
  stakingContractAddress,
  DECIMAL,
  currentBlockLevel,
  mapId,
  packedAddress,
) => {
  try {
    const rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    let url = `${rpcNode}chains/main/blocks/head/context/contracts/${stakingContractAddress}/storage`;
    const smartContractResponse = await axios.get(url);
    const periodFinish = smartContractResponse.data.args[1].args[0].args[0].int;
    const lastUpdateTime = smartContractResponse.data.args[0].args[2].int;
    const rewardRate = smartContractResponse.data.args[1].args[1].int;
    const totalSupply = smartContractResponse.data.args[3].int;
    const rewardPerTokenStored = smartContractResponse.data.args[1].args[0].args[1].int;
    if (totalSupply === 0) {
      throw 'No One Staked';
    }
    let rewardPerToken = Math.min(currentBlockLevel, parseInt(periodFinish));
    rewardPerToken = rewardPerToken - parseInt(lastUpdateTime);
    rewardPerToken *= parseInt(rewardRate) * Math.pow(10, DECIMAL);
    rewardPerToken = rewardPerToken / totalSupply + parseInt(rewardPerTokenStored);
    url = `${rpcNode}chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`;
    const bigMapResponse = await axios.get(url);

    const userBalance = bigMapResponse.data.args[0].args[1].int;
    const userRewardPaid = bigMapResponse.data.args[3].int;
    const rewards = bigMapResponse.data.args[2].int;
    let totalRewards = parseInt(userBalance) * (rewardPerToken - parseInt(userRewardPaid));
    totalRewards = totalRewards / Math.pow(10, DECIMAL) + parseInt(rewards);
    totalRewards = totalRewards / Math.pow(10, DECIMAL);

    if (totalRewards < 0) {
      totalRewards = 0;
    }
    return {
      success: true,
      totalRewards,
      address: stakingContractAddress,
    };
  } catch (error) {
    return {
      success: false,
      totalRewards: 0,
      address: stakingContractAddress,
    };
  }
};

/**
 * Calculate harvest value for all the farms
 * @param address - Address of user
 * @param type - FARMS | POOLS | PONDS
 * @param isActive {boolean} - Select one between active and inactive
 * @returns {Promise<{success: boolean, response: {}}>}
 */
export const getHarvestValue = async (address, type, isActive) => {
  try {
    //   stakingContract,
    // dualInfo,
    // currentBlock,
    // packedAddress
    const packedKey = getPackedKey(0, address, 'FA1.2');
    const blockData = await axios.get(`${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`);
    const promises = [];
    const harvestResponse = {};
    for (const identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]) {
      for (const i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
        isActive === true ? 'active' : 'inactive'
      ]) {
        if (identifier === 'PLENTY - GIF') {
          promises.push(
            calculateHarvestValueDual(
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].address,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].dualInfo,
              blockData.data,
              packedKey,
            ),
          );
        } else {
          promises.push(
            calculateHarvestValue(
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].address,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].decimal,
              blockData.data,
              CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
                isActive === true ? 'active' : 'inactive'
              ][i].mapId,
              packedKey,
            ),
          );
        }
      }
    }
    const response = await Promise.all(promises);

    for (const i in response) {
      harvestResponse[response[i].address] = {
        totalRewards: response[i].totalRewards,
      };
    }

    return {
      success: true,
      response: harvestResponse,
    };
  } catch (error) {
    return {
      success: false,
      response: {},
    };
  }
};
