import { createSlice } from "@reduxjs/toolkit";

import { tokensDataFetchingActions } from "./tokens.action";

const initialState = {
  tokensData: {
    isLoading: false,
    isPresent: false,
    isError: false,
    data: [],
    update: 0,
  },
};

export const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    ...tokensDataFetchingActions,
  },
});

export const {
  startTokensDataFetching,
  tokensDataFetchingSuccessfull,
  tokensDataFetchingFailed,
} = tokensSlice.actions;

export default tokensSlice.reducer;
