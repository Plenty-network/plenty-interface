import * as actions from '../actions/index.action';

const initialState = {
  tokensPrice: {
    loading: false,
    data: {},
  },
  lpTokensPrice: {
    loading: false,
    data: {},
  },
};

const priceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.START_FETCHING_TOKENS_PRICE:
      return {
        ...state,
        tokensPrice: {
          loading: true,
          data: {},
        },
      };
    case actions.FETCHING_TOKENS_PRICE_SUCCESSFULL:
      return {
        ...state,
        tokensPrice: {
          loading: false,
          data: action.data,
        },
      };
    case actions.FETCHING_TOKENS_PRICE_FAILED:
      return {
        ...state,
        tokensPrice: {
          loading: false,
          data: action.data,
        },
      };
    case actions.CLEAR_TOKENS_PRICE_DATA:
      return {
        ...state,
        tokensPrice: {
          loading: false,
          data: {},
        },
      };
    case actions.START_FETCHING_LP_TOKENS_PRICE:
      return {
        ...state,
        lpTokensPrice: {
          loading: true,
          data: {},
        },
      };
    case actions.FETCHING_LP_TOKENS_PRICE_SUCCESSFULL:
      return {
        ...state,
        lpTokensPrice: {
          loading: false,
          data: action.data,
        },
      };
    case actions.FETCHING_LP_TOKENS_PRICE_FAILED:
      return {
        ...state,
        lpTokensPrice: {
          loading: false,
          data: {},
        },
      };
    case actions.CLEAR_LP_TOKENS_PRICE_DATA:
      return {
        ...state,
        lpTokensPrice: {
          loading: false,
          ddata: {},
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default priceReducer;
