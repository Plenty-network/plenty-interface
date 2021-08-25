import * as actions from '../index.action';
import * as priceApis from './api.price';

const startFetchingTokensPrice = () => {
  return {
    type: actions.START_FETCHING_TOKENS_PRICE,
  };
};

const tokensPriceFetchingSuccessfull = (data) => {
  return {
    type: actions.FETCHING_TOKENS_PRICE_SUCCESSFULL,
    data,
  };
};

const tokensPriceFetchingFailed = () => {
  return {
    type: actions.FETCHING_TOKENS_PRICE_FAILED,
  };
};

export const getTokensPrice = () => {
  return (dispatch) => {
    dispatch(startFetchingTokensPrice());
    priceApis
      .getTokensPrice()
      .then((response) => {
        dispatch(tokensPriceFetchingSuccessfull(response.response.data));
      })
      .catch((error) => {
        dispatch(tokensPriceFetchingFailed());
      });
  };
};

export const clearTokensPriceData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_TOKENS_PRICE_DATA,
    });
  };
};

const startFetchingLpTokensPrice = () => {
  return {
    type: actions.START_FETCHING_LP_TOKENS_PRICE,
  };
};

const lpTokensPriceFetchingSuccessfull = (data) => {
  return {
    type: actions.FETCHING_LP_TOKENS_PRICE_SUCCESSFULL,
    data,
  };
};

const lpTokensPriceFetchingFailed = () => {
  return {
    type: actions.FETCHING_TOKENS_PRICE_FAILED,
  };
};

export const getLpTokensPrice = () => {
  return (dispatch) => {
    dispatch(startFetchingLpTokensPrice());
    priceApis
      .getLpPriceInXtz()
      .then((response) => {
        dispatch(lpTokensPriceFetchingSuccessfull(response));
      })
      .catch((error) => {
        dispatch(lpTokensPriceFetchingFailed());
      });
  };
};
