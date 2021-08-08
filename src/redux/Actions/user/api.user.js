const CONFIG = require('../../../CONFIG/config');


const TezosToolkit = require('@taquito/taquito').TezosToolkit;

const fetchWalletBalance = async (
  addressOfUser,
  tokenContractAddress,
  icon,
  type,
  token_id,
  token_decimal
) => {
  try {
    const connectedNetwork = CONFIG.NETWORK;
    const Tezos = new TezosToolkit(CONFIG.RPC_NODES[connectedNetwork]);
    Tezos.setProvider(CONFIG.RPC_NODES[connectedNetwork]);
    const contract = await Tezos.contract.at(tokenContractAddress);
    const storage = await contract.storage();
    let userBalance = 0;
    if (type === 'FA1.2') {
      if (icon === 'WRAP') {
        const userDetails = await storage.assets.ledger.get(addressOfUser);
        let userBalance = userDetails;
        userBalance =
          userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3);
        userBalance = parseFloat(userBalance);
        return {
          success: true,
          balance: userBalance,
          symbol: icon,
        };
      } else if (icon === 'KALAM') {
        const userDetails = await storage.ledger.get(addressOfUser);
        let userBalance = userDetails;
        userBalance =
          userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3);
        userBalance = parseFloat(userBalance);
        return {
          success: true,
          balance: userBalance,
          symbol: icon,
        };
      } else {
        const userDetails = await storage.balances.get(addressOfUser);

        let userBalance = userDetails.balance;
        userBalance =
          userBalance.toNumber() / Math.pow(10, token_decimal).toFixed(3);
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
      userBalance = (
        userDetails.toNumber() / Math.pow(10, token_decimal)
      ).toFixed(3);

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
    let promises = [];
    for (let identifier in CONFIG.AMM[network]) {
      promises.push(
        fetchWalletBalance(
          addressOfUser,
          CONFIG.AMM[network][identifier].TOKEN_CONTRACT,
          identifier,
          CONFIG.AMM[network][identifier].READ_TYPE,
          CONFIG.AMM[network][identifier].TOKEN_ID,
          CONFIG.AMM[network][identifier].TOKEN_DECIMAL
        )
      );
    }
    let response = await Promise.all(promises);
    return {
      success: true,
      response,
    };
  } catch (error) {
    return {
      success: false,
      response: {},
    };
  }
};
