
import {  TezosParameterFormat, TezosMessageUtils } from 'conseiljs'
const CONFIG = require('../../../config/config');
const TezosToolkit = require('@taquito/taquito').TezosToolkit;
const axios = require('axios');
const STAKING_CONFIG = {
  STAKING_CONTRACTS : {
      'POOL-ACTIVE-PLENTY' : {
          address : 'KT1QqjR4Fj9YegB37PQEqXUPHmFbhz6VJtwE',
          mapId : 4494,
          decimal : 18
      },
      'POOL-ACTIVE-wMATIC' : {
          address : 'KT1XherecVvrE6X4PV5RTwdEKNzA294ZE9T9',
          mapId : 4493,
          decimal : 18
      },
      'POOL-ACTIVE-wLINK' : {
          address : 'KT1KyxPitU1xNbTriondmAFtPEcFhjSLV1hz',
          mapId : 4492,
          decimal : 18
      },
      'POOL-ACTIVE-USDtz' : {
          address : 'KT1MBqc3GHpApBXaBZyvY63LF6eoFyTWtySn',
          mapId : 4490,
          decimal : 18
      },
      'POOL-ACTIVE-ETHtz' : {
          address : 'KT19asUVzBNidHgTHp8MP31YSphooMb3piWR',
          mapId : 4491,
          decimal : 18
      },
      'POOL-ACTIVE-hDAO' : {
          address : 'KT1Ga15wxGR5oWK1vBG2GXbjYM6WqPgpfRSP',
          mapId : 4496,
          decimal : 18
      },
      'POOL-ACTIVE-WRAP' : {
          address : 'KT18oB3x8SLxMJq2o9hKNupbZZ5ZMsgr2aho',
          mapId : 7988,
          decimal : 18
      },
      'POOL-INACTIVE-PLENTY' : {
          address : 'KT1UDe1YP963CQSb5xN7cQ1X8NJ2pUyjGw5T',
          mapId : 3949,
          decimal : 18
      },
      'POOL-INACTIVE-wMATIC' : {
          address : 'KT1TNzH1KiVsWh9kpFrWACrDNnfK4ihvGAZs',
          mapId : 3947,
          decimal : 18
      },
      'POOL-INACTIVE-wLINK' : {
          address : 'KT1JCkdS3x5hTWdrTQdzK6vEkeAdQzsm2wzf',
          mapId : 3948,
          decimal : 18
      },
      'POOL-INACTIVE-USDtz' : {
          address : 'KT1K5cgrw1A8WTiizZ5b6TxNdFnBq9AtyQ7X',
          mapId : 3953,
          decimal : 18
      },
      'POOL-INACTIVE-ETHtz' : {
          address : 'KT1J7v85udA8GnaBupacgY9mMvrb8zQdYb3E',
          mapId : 3950,
          decimal : 18
      },
      'POOL-INACTIVE-hDAO' : {
          address : 'KT1Vs8gqh7YskPnUQMfmjogZh3A5ZLpqQGcg',
          mapId : 3952,
          decimal : 18
      },
      'FARM-PLENTY-XTZ-ACTIVE': {
        address : 'KT1JQAZqShNMakSNXc2cgTzdAWZFemGcU6n1',
        mapId : 4503,
        decimal : 18
      },
      'FARM-PLENTY-XTZ-INACTIVE': {
        address : 'KT1BfQLAsQNX8BjSBzgjTLx3GTd3qhwLoWNz',
        mapId : 3962,
        decimal : 18
      },
      'FARM-KALAM-XTZ-INACTIVE': {
        address : 'KT1DjDZio7k2GJwCJCXwK82ing3n51AE55DW',
        mapId : 4488,
        decimal : 18
      },
      'POND-WRAP-ACTIVE' : {
        address : 'KT1GotpjdBaxt2GiMFcQExLEk9GTfYo4UoTa',
        mapId : 7985,
        decimal : 8
      },
      'POND-KALAM-INACTIVE' : {
        address : 'KT1WfLprabHVTnNhWFigmopAduUpxG5HKvNf',
        mapId : 5137,
        decimal : 10
      }
  },
  BALANCE_CONTRACTS : {
    'PLENTY' : {
        address : 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
        mapId : 3943,
        decimal : 18,
        type: 'FA1.2',
        tokenId: 0
    },
    'wMATIC' : {
        address : 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId : 1772,
        decimal : 18,
        type: 'FA2',
        tokenId: 11
    },
    'wLINK' : {
        address : 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
        mapId : 1772,
        decimal : 18,
        type: 'FA2',
        tokenId: 10
    },
    'USDtz' : {
        address : 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9',
        mapId : 36,
        decimal : 6,
        type: 'FA1.2',
        tokenId: 0
    },
    'ETHtz' : {
        address : 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8',
        mapId : 199,
        decimal : 18,
        type: 'FA1.2',
        tokenId: 0
    },
    'hDAO' : {
        address : 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW',
        mapId : 515,
        decimal : 6,
        type: 'FA2',
        tokenId: 0
    },
    'WRAP' : {
        address : 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd',
        mapId : 1777,
        decimal : 8,
        type: 'FA1.2',
        tokenId: 0
    },
    'KALAM' : {
        address : 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT',
        mapId : 4178,
        decimal : 10,
        type: 'FA1.2',
        tokenId: 0
    },
    'PLENTY-XTZ' : {
        address : 'KT1X1LgNkQShpF9nRLYw3Dgdy4qp38MX617z',
        mapId : 3956,
        decimal : 6,
        type: 'FA1.2',
        tokenId: 0,
    },
    'KALAM-XTZ' : {
        address : 'KT1J3wTYb4xk5BsSBkg6ML55bX1xq7desS34',
        mapId : 4353,
        decimal : 6,
        type: 'FA1.2',
        tokenId: 0,
    }
  }
}



const getPackedKey = (tokenId,address,type) => {

  const accountHex = `0x${TezosMessageUtils.writeAddress(address)}`;
  let packedKey = null;
  if(type === 'FA2')
  {
      packedKey = TezosMessageUtils.encodeBigMapKey(Buffer.from(TezosMessageUtils.writePackedData(`(Pair ${accountHex} ${tokenId})`, '', TezosParameterFormat.Michelson), 'hex'));
  }
  else
  {
      packedKey = TezosMessageUtils.encodeBigMapKey(Buffer.from(TezosMessageUtils.writePackedData(`${accountHex}`, '', TezosParameterFormat.Michelson), 'hex'));   
  }
  return packedKey;
  
}

const getStakedAmount = async (mapId,packedKey,identifier,decimal,address) => {
  try {
      const url = `${CONFIG.RPC_NODES[CONFIG.NETWORK]}chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
      const response = await axios.get(url);
      let balance = response.data.args[0].args[1].int;
      balance = parseInt(balance);
      balance =  balance / Math.pow(10,decimal);
      let singularStakes = []
      for(let i=0;i<response.data.args[0].args[0].length;i++)
      {
        singularStakes.push({
          amount : response.data.args[0].args[0][i].args[1].args[0].int,
          block : response.data.args[0].args[0][i].args[1].args[1].int
        })
        console.log(identifier,response.data.args[0].args[0][i].args[1].args[0].int,response.data.args[0].args[0][i].args[1].args[1].int)
      }

      return {
          success : true,
          balance,
          identifier,
          address,
          singularStakes
      }
  }
  catch(error)
  {   

      return {
          success : false,
          balance : 0,
          identifier,
          singularStakes : []
      }
  }
}

const getBalanceAmount = async (mapId,packedKey,identifier,decimal) => {
  try {
      let balance;
      const url = `https://mainnet.smartpy.io/chains/main/blocks/head/context/big_maps/${mapId}/${packedKey}`;
      const response = await axios.get(url);

      if(mapId === 3956 || mapId === 4353) {
        balance = response.data.args[0].args[1].int;
      } else if(mapId === 3943) {
        balance = response.data.args[1].int;
      } else if(mapId === 199 || mapId === 36 ) {
        balance = response.data.args[0].int;
      } else if (mapId === 1777 || mapId === 1772 || mapId === 515 || mapId === 4178) {
        balance = response.data.int;
      }
      

      balance = parseInt(balance);
      balance =  balance / Math.pow(10,decimal);

      return {
          success : true,
          balance,
          identifier
      }
  }
  catch(error)
  {   
    console.log(error);
      return {
          success : false,
          balance : 0,
          identifier
      }
  }
}

export const getBalanceAmountForAllContracts = async (address) => {
  try {
    let packedKey;
    let promises = [];
    console.log({address});
    for(let key in CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK])
    {
      if(CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].type === 'FA1.2') {
        packedKey = getPackedKey(0,address,'FA1.2');
      }
      else {
        packedKey = getPackedKey(CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].tokenId,address,'FA2');
      }
      promises.push(getBalanceAmount(CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].mapId , packedKey , key, CONFIG.TOKEN_CONTRACTS[CONFIG.NETWORK][key].decimal));

    }
    const response = await Promise.all(promises);
    console.log({response});
    return {
      success : true,
      response,
    }
  }
  catch(error)
  {
    return {
      success : false,
      response : {}
    }
  }

}

export const getStakedAmountForAllContracts = async (address , type , isActive) => {
  try {
    console.log({address});
    let packedKey = getPackedKey(0,address,'FA1.2');
    
    let promises = [];

    // for(let key in CONFIG.STAKING_CONTRACTS[type][isActive === true ? 'active' : 'inactive'])
    // {
       
    //     promises.push(getStakedAmount(CONFIG.STAKING_CONTRACTS[type][isActive === true ? 'active' : 'inactive'][key].mapId , packedKey , key, STAKING_CONFIG.STAKING_CONTRACTS[key].decimal));

    // }

    for(let identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK])
    {
      console.log(identifier);
      //console.log(CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK]);
      for(let i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'])
      {
        console.log(i);
        promises.push(getStakedAmount(CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'][i].mapId , packedKey , identifier, CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'][i].decimal, CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'][i].address));
      }
    }
    const response = await Promise.all(promises);
    let stakedAmountResponse = {};
    for(let i in  response)
    {
      stakedAmountResponse[response[i].address] = {stakedAmount : response[i].balance , identifier : response[i].identifier , singularStakes : response[i].singularStakes }

    }
    console.log({response , stakedAmountResponse});
    return {
      success : true,
      response : stakedAmountResponse,
    }
  }
  catch(error)
  {
    console.log(error);
    return {
      success : false,
      response : {}
    }
  }

}

const calculateHarvestValue = async (stakingContractAddress , DECIMAL , currentBlockLevel , mapId, packedAddress) => { 
  console.log({stakingContractAddress , DECIMAL , currentBlockLevel , mapId, packedAddress});
  try
  {
          let url = `${CONFIG.RPC_NODES[CONFIG.NETWORK]}chains/main/blocks/head/context/contracts/${stakingContractAddress}/storage`; 
          const smartContractResponse = await axios.get(url);
          // Setting parameters 
          let periodFinish = smartContractResponse.data.args[1].args[0].args[0].int; 
          let lastUpdateTime = smartContractResponse.data.args[0].args[2].int;
          let rewardRate = smartContractResponse.data.args[1].args[1].int ;
          let totalSupply = smartContractResponse.data.args[3].int;
          let rewardPerTokenStored = smartContractResponse.data.args[1].args[0].args[1].int;
          if (totalSupply == 0){
              throw "No One Staked"
          }
          let rewardPerToken =  Math.min(currentBlockLevel, parseInt(periodFinish));
          rewardPerToken = rewardPerToken - parseInt(lastUpdateTime);
          rewardPerToken *= parseInt(rewardRate) * Math.pow(10,DECIMAL);
          rewardPerToken = rewardPerToken / totalSupply + parseInt(rewardPerTokenStored);
          url = `${CONFIG.RPC_NODES[CONFIG.NETWORK]}chains/main/blocks/head/context/big_maps/${mapId}/${packedAddress}`; 
          let bigMapResponse = await axios.get(url); 
          console.log(bigMapResponse.data);
          let userBalance = bigMapResponse.data.args[0].args[1].int; 
          let userRewardPaid = bigMapResponse.data.args[3].int; 
          let rewards = bigMapResponse.data.args[2].int; 
          let totalRewards = parseInt(userBalance) * (rewardPerToken - parseInt(userRewardPaid));
          totalRewards = totalRewards / Math.pow(10, DECIMAL) + parseInt(rewards);
          totalRewards = totalRewards / Math.pow(10, DECIMAL); 
          console.log(totalRewards)
          if(totalRewards <0)
          {
            totalRewards = 0;
          }
          return {
            success : true,
            totalRewards,
            address : stakingContractAddress
          }; 
      }
      catch (error){
          console.log(error);
          return {
            success : false,
            totalRewards : 0,
            address : stakingContractAddress
          }
      }
  }
  export const getHarvestValue = async (address , type , isActive) => {
    try {
      
      let packedKey = getPackedKey(0,address,'FA1.2');
      let blockData = await axios.get(
        `${CONFIG.TZKT_NODES[CONFIG.NETWORK]}/v1/blocks/count`
      );
      let promises = [];
      let harvestResponse = {};
      for(let identifier in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK])
      {
        
        for(let i in CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'])
        {
          promises.push(calculateHarvestValue(CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'][i].address, CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'][i].decimal , blockData.data, CONFIG.STAKING_CONTRACTS[type][CONFIG.NETWORK][identifier][isActive === true ? 'active' : 'inactive'][i].mapId, packedKey));
        }
      }
      const response = await Promise.all(promises);
      
      for(let i in response)
      {
        harvestResponse[response[i].address] = {totalRewards : response[i].totalRewards}
      }
      console.log({harvestResponse});
      return {
        success : true,
        response : harvestResponse,
      }
    }
    catch(error)
    {
      console.log(error);
      return {
        success : false,
        response : {}
      }
    }
  
  }