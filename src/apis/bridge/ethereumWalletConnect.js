import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      supportedChainIds: [1, 4],
      rpc: {
        1: 'https://mainnet.infura.io/v3/ae39eed1b9b94b47bb56ab5f8c454501',  // TODO: Change infura. Fetch from env
        4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      },
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Plenty Bridge',
      rpc: 'https://mainnet.infura.io/v3/ae39eed1b9b94b47bb56ab5f8c454501',   // TODO: Change infura. Fetch from env
      chainId: 1,
      darkMode: false,
    },
  },
};

let web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions,
  theme: localStorage.getItem('theme'),
});
/* const web3Modal = new Web3Modal({
  network: 'rinkeby',
  cacheProvider: true,
  providerOptions,
  theme: 'light',
}); */

export const connectWallet = async (setMetamaskAddress, theme) => {
  try {
    if (theme === 'light') {
      web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions,
        theme: 'light',
      });
    } else {
      web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions,
        theme: 'dark',
      });
    }
    const provider = await web3Modal.connect();
    console.log('provider', provider);
    const web3 = new Web3(provider);
    const address = await web3.eth.getAccounts();
    if (setMetamaskAddress) {
      setMetamaskAddress(address[0]);
      localStorage.setItem('isWalletConnected', true);
    }
    console.log('web3', web3);
    console.log('web3.eth.accounts', address[0]);
    return {
      address: address[0],
      web3,
      provider,
      success: true,
    };
  } catch (e) {
    console.log('Error', e);
    if (setMetamaskAddress) {
      localStorage.setItem('isWalletConnected', false);
      setMetamaskAddress(null);
    }
    return {
      success: false,
    };
  }
};

export const disconnectWallet = async () => {
  web3Modal.clearCachedProvider();
};
