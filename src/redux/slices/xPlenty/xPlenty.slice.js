import { createSlice } from '@reduxjs/toolkit';
import {
  xPlentyDataFetchingActions,
  expectedPlentyActions,
  expectedxPlentyActions,
  buyingxPlentyActions,
  sellingxPlentyActions,
} from './xPlenty.action';

const initialState = {
  expectedPlenty: 0,
  expectedxPlenty: 0,
  xPlentyData: {
    isLoading: false,
    isPresent: false,
    data: {},
  },
  xPlentyBuyingOperation: {
    processing: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
  xPlentySellingOperation: {
    processing: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
};

export const xPlentySlice = createSlice({
  name: 'xPlenty',
  initialState,
  reducers: {
    ...xPlentyDataFetchingActions,
    ...expectedPlentyActions,
    ...expectedxPlentyActions,
    ...buyingxPlentyActions,
    ...sellingxPlentyActions,
  },
});

export const {
  startxPlentyDataFetching,
  xPlentyDataFetchingSuccessfull,
  xPlentyDataFetchingFailed,

  setExpectedPlenty,
  setExpectedxPlenty,

  initiateBuying,
  buyingSuccessfull,
  buyingFailed,
  clearBuyingResponse,

  initiateSelling,
  sellingSuccessfull,
  sellingFailed,
  clearSellingResponse,
} = xPlentySlice.actions;

export default xPlentySlice.reducer;
