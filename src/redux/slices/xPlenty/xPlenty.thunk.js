import {
  xPlentyComputations,
  buyXPlenty,
  sellXPlenty,
  getExpectedPlenty,
  getExpectedxPlenty,
} from './xPlenty.api';

import {
  startxPlentyDataFetching,
  xPlentyDataFetchingSuccessfull,
  xPlentyDataFetchingFailed,
  initiateBuying,
  buyingSuccessfull,
  buyingFailed,
  initiateSelling,
  sellingSuccessfull,
  sellingFailed,
  setExpectedPlenty,
  setExpectedxPlenty,
  closetransactionInjectionModal,
  closeToast,
} from './xPlenty.slice';

export const xPlentyComputationsThunk = () => (dispatch) => {
  dispatch(startxPlentyDataFetching());
  xPlentyComputations()
    .then((response) => {
      dispatch(xPlentyDataFetchingSuccessfull(response));
    })
    .catch((error) => {
      console.log(error);
      dispatch(xPlentyDataFetchingFailed());
    });
};

export const getExpectedPlentyThunk = (plentyBalance, totalSupply, xplentyAmount) => (dispatch) => {
  const expectedPlenty = getExpectedPlenty(plentyBalance, totalSupply, xplentyAmount);
  dispatch(setExpectedPlenty(expectedPlenty));
};

export const getExpectedxPlentyThunk = (plentyBalance, totalSupply, plentyAmount) => (dispatch) => {
  const expectedxPlenty = getExpectedxPlenty(plentyBalance, totalSupply, plentyAmount);
  dispatch(setExpectedxPlenty(expectedxPlenty));
};

export const buyXPlentyThunk = (plentyAmount, minimumExpected, recipient) => (dispatch) => {
  dispatch(initiateBuying());
  buyXPlenty(plentyAmount, minimumExpected, recipient)
    .then((response) => {
      dispatch(buyingSuccessfull(response));
    })
    .catch((error) => {
      console.log(error);
      dispatch(buyingFailed());
    });
};

export const sellXPlentyThunk = (xPlentyAmount, minimumExpected, recipient) => (dispatch) => {
  dispatch(initiateSelling());
  sellXPlenty(xPlentyAmount, minimumExpected, recipient)
    .then((response) => {
      dispatch(sellingSuccessfull(response));
    })
    .catch((error) => {
      console.log(error);
      dispatch(sellingFailed());
    });
};

export const closetransactionInjectionModalThunk = () => (dispatch) => {
  dispatch(closetransactionInjectionModal());
};

export const closeToastThunk = () => (dispatch) => {
  dispatch(closeToast());
};
