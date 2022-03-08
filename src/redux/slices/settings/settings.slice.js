import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    rpcNode: '',
    loader: false,
  },
  reducers: {
    setNode: (state, action) => {
      state.rpcNode = action.payload;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const { setNode } = settingsSlice.actions;
export const { setLoader } = settingsSlice.actions;

export default settingsSlice.reducer;
