import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    rpcNode: '',
    loader: false,
    firstTokenAmount: 0,
    secondTokenAmount: 0,
    tokenIn: '',
    tokenOut: '',
    opertaionId: '',
    loaderMessage: {},
    connectWalletTooltip: false,
  },
  reducers: {
    setNode: (state, action) => {
      state.rpcNode = action.payload;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setFirstTokenAmountFloater: (state, action) => {
      state.firstTokenAmount = action.payload;
    },
    setSecondTokenAmountFloater: (state, action) => {
      state.secondTokenAmount = action.payload;
    },
    setTokenInFloater: (state, action) => {
      state.tokenIn = action.payload;
    },
    setTokenOutFloater: (state, action) => {
      state.tokenOut = action.payload;
    },
    setOpertaionIdFloater: (state, action) => {
      state.opertaionId = action.payload;
    },
    setLoaderMessageFloater: (state, action) => {
      state.loaderMessage = action.payload;
    },
    setConnectWalletTooltip: (state, action) => {
      state.connectWalletTooltip = action.payload;
    },
  },
});

export const {
  setNode,
  setLoader,
  setFirstTokenAmountFloater,
  setLoaderMessageFloater,
  setOpertaionIdFloater,
  setSecondTokenAmountFloater,
  setTokenInFloater,
  setTokenOutFloater,
  setConnectWalletTooltip,
} = settingsSlice.actions;

export default settingsSlice.reducer;
