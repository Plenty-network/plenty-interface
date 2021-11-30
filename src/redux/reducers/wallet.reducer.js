import {
  WALLET_CONNECT_START,
  WALLET_CONNECT_SUCCESSFULL,
  WALLET_CONNECT_FAIL,
  WALLET_DISCONNECT,
  WALLET_GET_ADDRESS,
} from '../actions/index.action';

const initialState = {
  address: null,
  loading: false,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case WALLET_CONNECT_START:
      return {
        ...state,
        loading: true,
      };
    case WALLET_CONNECT_SUCCESSFULL:
      return {
        ...state,
        address: action.address,
        loading: false,
      };
    case WALLET_CONNECT_FAIL:
      return {
        ...state,
        loading: false,
      };
    case WALLET_DISCONNECT:
      return {
        ...state,
        address: null,
      };
    case WALLET_GET_ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    default:
      return {
        ...state,
      };
  }
};

export default walletReducer;
