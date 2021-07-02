import { WALLET_ADDRESS } from './index.action';
import {
    ConnectWalletAPI,
    DisconnectWalletAPI,
    FetchWalletAPI,
} from '../api.wallet';

export const connectWallet = () => {
    return async (dispatch) => {
        const WALLET_RESP = await ConnectWalletAPI();
        if (WALLET_RESP.success) {
            dispatch({
                type: WALLET_ADDRESS,
                payload: WALLET_RESP.wallet,
            });
        } else {
            dispatch({
                type: WALLET_ADDRESS,
                payload: null,
            });
        }
    };
};

export const disconnectWallet = () => {
    return async (dispatch) => {
        const WALLET_RESP = await DisconnectWalletAPI();
        if (WALLET_RESP.success) {
            dispatch({
                type: WALLET_ADDRESS,
                payload: null,
            });
        }
    };
};

export const getWalletAddress = () => {
    return async (dispatch) => {
        const WALLET_RESP = await FetchWalletAPI();
        if (WALLET_RESP.success) {
            dispatch({
                type: WALLET_ADDRESS,
                payload: WALLET_RESP.wallet,
            });
        } else {
            dispatch({
                type: WALLET_ADDRESS,
                payload: null,
            });
        }
    };
};
