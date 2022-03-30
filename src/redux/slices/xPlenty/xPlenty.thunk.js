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

export const buyXPlentyThunk =
  (plentyAmount, minimumExpected, recipient, setShowConfirmTransaction, setLoader) =>
  (dispatch) => {
    dispatch(initiateBuying());
    buyXPlenty(plentyAmount, minimumExpected, recipient, setShowConfirmTransaction)
      .then((response) => {
        setLoader(false);
        setShowConfirmTransaction(false);
        dispatch(buyingSuccessfull(response));
      })
      .catch((error) => {
        setShowConfirmTransaction(false);
        setLoader(false);
        console.log(error);
        dispatch(buyingFailed());
      });
  };

export const sellXPlentyThunk =
  (xPlentyAmount, minimumExpected, recipient, setShowConfirmTransaction, setLoader) =>
  (dispatch) => {
    dispatch(initiateSelling());
    sellXPlenty(xPlentyAmount, minimumExpected, recipient, setShowConfirmTransaction)
      .then((response) => {
        setShowConfirmTransaction(false);
        setLoader(false);
        dispatch(sellingSuccessfull(response));
      })
      .catch((error) => {
        console.log(error);
        setShowConfirmTransaction(false);
        setLoader(false);
        dispatch(sellingFailed());
      });
  };

export const closetransactionInjectionModalThunk = () => (dispatch) => {
  dispatch(closetransactionInjectionModal());
};

export const closeToastThunk = () => (dispatch) => {
  dispatch(closeToast());
};
