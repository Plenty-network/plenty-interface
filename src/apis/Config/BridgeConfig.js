import { BRIDGES_CONFIG } from '../../constants/localStorage';
import { allTokens } from '../../constants/bridges';

const DEPRECATED_TOKENS = [
  'wAAVE',
  'wLEO',
  'wCEL',
  'wCOMP',
  'wCRO',
  'wFTT',
  'wHUSD',
  'wHT',
  'wMKR',
  'wOKB',
  'wPAX',
  'wSUSHI',
  'wUNI',
  'AAVE',
  'LEO',
  'CEL',
  'COMP',
  'CRO',
  'FTT',
  'HUSD',
  'HT',
  'MKR',
  'OKB',
  'PAX',
  'SUSHI',
  'UNI',
  'WRAP'
];

export const BridgeConfiguration = {
  getConfig: () => JSON.parse(localStorage.getItem(BRIDGES_CONFIG)),
  getConfigForChain: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain] : null;
  },
  getFeesForChain: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].FEES : null;
  },
  getWrapContract: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].WRAP_CONTRACT_ADDRESS : null;
  },
  getUnwrapSignReq: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].UNWRAP_SIGNATURE_REQ : null;
  },
  getWrapSignReq: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].WRAP_SIGNATURE_REQ : null;
  },
  getConnectedNetwork: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].NETWORK : null;
  },
  getTezosNetwork: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].TEZOS.NETWORK : null;
  },
  getTezosMinterContract: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].TEZOS.MINTER_CONTRACT : null;
  },
  getTezosQourumContract: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].TEZOS.QOURUM_CONTRACT : null;
  },
  getTokensForChain: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].TOKENS : null;
  },
  getTezosWrappedTokens: (chain) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].TEZOS.WRAPPED_TOKENS : null;
  },
  getOutTokenBridging: (chain, fromToken) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig ? loadedConfig[chain].TOKENS[fromToken].WRAPPED_TOKEN.NAME : null;
  },
  getOutTokenUnbridging: (chain, fromToken) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig
      ? loadedConfig[chain].TEZOS.WRAPPED_TOKENS[fromToken].UNWRAPPED_TOKEN.NAME
      : null;
  },
  getOutTokenUnbridgingWhole: (chain, fromToken) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    return loadedConfig
      ? loadedConfig[chain].TEZOS.WRAPPED_TOKENS[fromToken].UNWRAPPED_TOKEN
      : null;
  },
  getToken: (chain, address) => {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    if (loadedConfig) {
      let result;
      // eslint-disable-next-line
      for (const [token, tokenData] of Object.entries(loadedConfig[chain].TOKENS)) {
        if (tokenData.CONTRACT_ADDRESS === address) {
          result = tokenData;
          break;
        }
      }
      return result;
    } else {
      return null;
    }
  },
};

/**
 * Creates a tokens config list with names and icons for each chain along with list of reference tokens in tezos chain for each of other chains.
 * @returns { {success: boolean; data: { CHAIN_A: []; CHAIN_B?: []; TEZOS: { CHAIN_A: []; CHAIN_B?: [] }; }; error?: undefined; } | { success: boolean; data: never[]; error: any; } }
 */
export const createTokensList = () => {
  try {
    const loadedConfig = JSON.parse(localStorage.getItem(BRIDGES_CONFIG));
    if (loadedConfig) {
      const finalTokensList = {};
      finalTokensList['TEZOS'] = {};
      for (const [chain, chainData] of Object.entries(loadedConfig)) {
        finalTokensList[chain] = [];
        finalTokensList['TEZOS'][chain] = [];
        for (const [token, tokenData] of Object.entries(chainData.TOKENS)) {
          const chainTokenData = {...tokenData};
          const tezosTokenData = {...tokenData.WRAPPED_TOKEN};
          chainTokenData.deprecated = DEPRECATED_TOKENS.includes(token) ? true : false;
          tezosTokenData.deprecated = DEPRECATED_TOKENS.includes(tokenData.WRAPPED_TOKEN.NAME) ? true : false;
          finalTokensList[chain].push({
            name: token,
            image: Object.prototype.hasOwnProperty.call(allTokens, token)
              ? allTokens[token]
              : allTokens.fallback,
            tokenData: chainTokenData,
          });
          finalTokensList['TEZOS'][chain].push({
            name: tokenData.WRAPPED_TOKEN.NAME,
            image: Object.prototype.hasOwnProperty.call(allTokens, tokenData.WRAPPED_TOKEN.NAME)
              ? allTokens[tokenData.WRAPPED_TOKEN.NAME]
              : allTokens.fallback,
            tokenData: tezosTokenData,
          });
        }
      }
      return {
        success: true,
        data: finalTokensList,
      };
    } else {
      return {
        success: false,
        data: [],
        error: 'Failed to load config data.',
      };
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
};
