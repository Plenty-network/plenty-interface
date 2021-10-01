import { createSlice } from '@reduxjs/toolkit';
import {
  xPlentyDataFetchingActions,
  expectedPlentyActions,
  expectedxPlentyActions,
  buyingxPlentyActions,
  sellingxPlentyActions,
  transactionInjectionModalActions,
  toastActions,
} from './xPlenty.action';

const initialState = {
  expectedPlenty: 0,
  expectedxPlenty: 0,
  isTransactionInjectionModalOpen: false,
  currentOpHash: null,
  toastMessage: '',
  isInfoType: true,
  isToastOpen: false,
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
    ...transactionInjectionModalActions,
    ...toastActions,
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

  opentransactionInjectionModal,
  closetransactionInjectionModal,

  openToastOnFail,
  openToastOnSuccess,
  closeToast,
} = xPlentySlice.actions;

export default xPlentySlice.reducer;
