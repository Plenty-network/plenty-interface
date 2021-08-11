import { BeaconWallet } from '@taquito/beacon-wallet';
const CONFIG =require('../../../config/config');

export const ConnectWalletAPI = async () => {
    try {
        const network = {
            type: CONFIG.WALLET_NETWORK,
        };
        const options = {
            name: CONFIG.NAME,
        };
        const wallet = new BeaconWallet(options);
        let account = await wallet.client.getActiveAccount();
        if (!account) {
            await wallet.client.requestPermissions({
                network,
            });
            account = await wallet.client.getActiveAccount();
        }
        console.log(account);
        return {
            success: true,
            wallet: account.address,
        };
    } catch (error) {
        return {
            success: false,
            wallet: null,
            error,
        };
    }
};

export const DisconnectWalletAPI = async () => {
    try {
        const options = {
            name: CONFIG.WALLET_NETWORK,
        };
        const wallet = new BeaconWallet(options);
        await wallet.disconnect();
        return {
            success: true,
            wallet: null,
        };
    } catch (error) {
        return {
            success: false,
            wallet: null,
            error,
        };
    }
};

export const FetchWalletAPI = async () => {
    try {
        const options = {
            name: CONFIG.NAME,
        };
        const wallet = new BeaconWallet(options);
        let account = await wallet.client.getActiveAccount();
        if (!account) {
            return {
                success: false,
                wallet: null,
            };
        }
        return {
            success: true,
            wallet: account.address,
        };
    } catch (error) {
        return {
            success: false,
            wallet: null,
        };
    }
};