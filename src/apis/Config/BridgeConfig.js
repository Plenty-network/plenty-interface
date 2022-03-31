import { BRIDGES_CONFIG } from '../../constants/localStorage';

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
};
