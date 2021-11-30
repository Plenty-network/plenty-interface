import {
  WALLET_CONNECT_START,
  WALLET_CONNECT_SUCCESSFULL,
  WALLET_CONNECT_FAIL,
  WALLET_DISCONNECT,
  WALLET_GET_ADDRESS,
} from '../index.action';

import { ConnectWalletAPI, DisconnectWalletAPI, FetchWalletAPI } from './api.wallet';

const walletConnectionStart = () => {
  return {
    type: WALLET_CONNECT_START,
  };
};

const walletConnectionSuccessfull = (address) => {
  return {
    type: WALLET_CONNECT_SUCCESSFULL,
    address,
  };
};

const walletConnectionFailed = () => {
  return {
    type: WALLET_CONNECT_FAIL,
  };
};

const walletDisconnection = () => {
  return {
    type: WALLET_DISCONNECT,
  };
};

const fetchWallet = (address) => {
  return {
    type: WALLET_GET_ADDRESS,
    address,
  };
};

export const connectWallet = () => {
  return (dispatch) => {
    dispatch(walletConnectionStart());
    ConnectWalletAPI()
      .then((resp) => {
        if (resp.success === true) {
          dispatch(walletConnectionSuccessfull(resp.wallet));
        } else {
          dispatch(walletConnectionFailed());
        }
      })
      .catch(() => {
        dispatch(walletConnectionFailed());
      });
  };
};

export const disconnectWallet = () => {
  return (dispatch) => {
    DisconnectWalletAPI()
      .then((resp) => {
        if (resp.success === true) {
          dispatch(walletDisconnection());
        }
      })
      .catch(() => {});
  };
};

export const fetchWalletAddress = () => {
  return (dispatch) => {
    FetchWalletAPI()
      .then((resp) => {
        if (resp.success === true) {
          dispatch(fetchWallet(resp.wallet));
        }
      })
      .catch(() => {});
  };
};
