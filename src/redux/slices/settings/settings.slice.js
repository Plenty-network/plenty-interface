import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    rpcNode: '',
  },
  reducers: {
    setNode: (state, action) => {
      state.rpcNode = action.payload;
    },
  },
});

export const { setNode } = settingsSlice.actions;

export default settingsSlice.reducer;
