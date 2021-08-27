import { TezosParameterFormat, TezosMessageUtils } from 'conseiljs';
import { RPC_NODE } from '../../../constants/localStorage';
const CONFIG = require('../../../config/config');
const TezosToolkit = require('@taquito/taquito').TezosToolkit;
const axios = require('axios');

const getPackedKey = (tokenId, address, type) => {
  const accountHex = `0x${TezosMessageUtils.writeAddress(address)}`;
  let packedKey = null;
  if (type === 'FA2') {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `(Pair ${accountHex} ${tokenId})`,
          '',
          TezosParameterFormat.Michelson
        ),
        'hex'
      )
    );
  } else {
    packedKey = TezosMessageUtils.encodeBigMapKey(
      Buffer.from(
        TezosMessageUtils.writePackedData(
          `${accountHex}`,
          '',
          TezosParameterFormat.Michelson
        ),
        'hex'
      )
    );
  }
  return packedKey;
};

const getStakedAmount = async (
  mapId,
  packedKey,
  identifier,
  decimal,
  address,
  tokenDecimal
) => {
  try {
    let rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    const url = `${
      rpcNode
    }chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
    const response = await axios.get(url);
    let balance = response.data.args[0].args[1].int;
    balance = parseInt(balance);
    balance = balance / Math.pow(10, decimal);
    let singularStakes = [];
    for (let i = 0; i < response.data.args[0].args[0].length; i++) {
      let amount = parseInt(
        response.data.args[0].args[0][i].args[1].args[0].int
      );
      amount = parseFloat(
        response.data.args[0].args[0][i].args[1].args[0].int /
          Math.pow(10, tokenDecimal)
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

const getBalanceAmount = async (mapId, packedKey, identifier, decimal) => {
  try {
    let balance;
    let rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    const url = `${
      rpcNode
    }chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
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
      mapId === 4178
    ) {
      balance = response.data.int;
    } else if ((mapId = 10749)) {
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

export const getBalanceAmountForAllContracts = async (address) => {
  try {
    let packedKey;
    let promises = [];

    for (let key in CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK]) {
      if (CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].type === 'FA1.2') {
        packedKey = getPackedKey(0, address, 'FA1.2');
      } else {
        packedKey = getPackedKey(
          CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].tokenId,
          address,
          'FA2'
        );
      }
      promises.push(
        getBalanceAmount(
          CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].mapId,
          packedKey,
          key,
          CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].decimal
        )
      );
    }
    const response = await Promise.all(promises);
    let balancesResponse = {};
    for (let i in response) {
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

export const getStakedAmountForAllContracts = async (
  address,
  type,
  isActive
) => {
  try {
    let packedKey = getPackedKey(0, address, 'FA1.2');

    let promises = [];
    let blockData = await axios.get(
      `${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`
    );

    for (let identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]) {
      for (let i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
        isActive === true ? 'active' : 'inactive'
      ]) {
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
            ][i].tokenDecimal
          )
        );
      }
    }
    const response = await Promise.all(promises);
    let stakedAmountResponse = {};
    for (let i in response) {
      stakedAmountResponse[response[i].address] = {
        stakedAmount: response[i].balance,
        identifier: response[i].identifier,
        singularStakes: response[i].singularStakes,
      };
    }
    console.log({stakedAmountResponse});
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

const calculateHarvestValue = async (
  stakingContractAddress,
  DECIMAL,
  currentBlockLevel,
  mapId,
  packedAddress
) => {
  try {
    let rpcNode = localStorage.getItem(RPC_NODE) ?? CONFIG.RPC_NODES[CONFIG.NETWORK];
    let url = `${
      rpcNode
    }chains/main/blocks/head/context/contracts/${stakingContractAddress}/storage`;
    const smartContractResponse = await axios.get(url);
    let periodFinish = smartContractResponse.data.args[1].args[0].args[0].int;
    let lastUpdateTime = smartContractResponse.data.args[0].args[2].int;
    let rewardRate = smartContractResponse.data.args[1].args[1].int;
    let totalSupply = smartContractResponse.data.args[3].int;
    let rewardPerTokenStored =
      smartContractResponse.data.args[1].args[0].args[1].int;
    if (totalSupply == 0) {
      throw 'No One Staked';
    }
    let rewardPerToken = Math.min(currentBlockLevel, parseInt(periodFinish));
    rewardPerToken = rewardPerToken - parseInt(lastUpdateTime);
    rewardPerToken *= parseInt(rewardRate) * Math.pow(10, DECIMAL);
    rewardPerToken =
      rewardPerToken / totalSupply + parseInt(rewardPerTokenStored);
    url = `${
      rpcNode
    }chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`;
    let bigMapResponse = await axios.get(url);

    let userBalance = bigMapResponse.data.args[0].args[1].int;
    let userRewardPaid = bigMapResponse.data.args[3].int;
    let rewards = bigMapResponse.data.args[2].int;
    let totalRewards =
      parseInt(userBalance) * (rewardPerToken - parseInt(userRewardPaid));
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
export const getHarvestValue = async (address, type, isActive) => {
  try {
    let packedKey = getPackedKey(0, address, 'FA1.2');
    let blockData = await axios.get(
      `${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`
    );
    let promises = [];
    let harvestResponse = {};
    for (let identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]) {
      for (let i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][
        isActive === true ? 'active' : 'inactive'
      ]) {
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
            packedKey
          )
        );
      }
    }
    const response = await Promise.all(promises);

    for (let i in response) {
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
