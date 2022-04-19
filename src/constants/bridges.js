// Bridges
/* import avaxRed from '../assets/images/bridge/avax_red.svg';
import avax from '../assets/images/bridge/avax.svg'; */
import ethereum from '../assets/images/bridge/eth.svg';
import tezos from '../assets/images/bridge/tezos.svg';

// Tokens
import dai_normal from '../assets/images/bridge/tokens/dai_normal_icon.svg';
import link_normal from '../assets/images/bridge/tokens/link_normal_icon.svg';
import matic_normal from '../assets/images/bridge/tokens/matic_normal_icon.svg';
import usdt_normal from '../assets/images/bridge/tokens/usdt_normal_icon.svg';
import usdc_normal from '../assets/images/bridge/tokens/usdc_normal_icon.svg';
import busd_normal from '../assets/images/bridge/tokens/busd_normal_icon.svg';
import weth_normal from '../assets/images/bridge/tokens/weth_normal_icon.svg';
import wbtc_normal from '../assets/images/bridge/tokens/wbtc_normal_icon.svg';
import fallbackIcon from '../assets/images/bridge/tokens/fallback_icon.svg';

export const CHANGE_NETWORK_PROMPT_DELAY = 3000;

export const bridgesList = [
  /* {
    name: 'ETHEREUM',
    image: ethereum,
    buttonImage: ethereum,
    bigIcon: ethereum,
  }, */
  {
    name: 'RINKEBY',
    image: ethereum,
    buttonImage: ethereum,
    bigIcon: ethereum,
  },
  {
    name: 'TEZOS',
    image: tezos,
    buttonImage: tezos,
    bigIcon: tezos,
  },
];

export const tokensList = {
  ETHEREUM: [
    {
      name: 'DAI',
      image: dai_normal,
      tinyIcon: dai_normal,
      bigIcon: dai_normal,
    },
    {
      name: 'LINK',
      image: link_normal,
      tinyIcon: link_normal,
      bigIcon: link_normal,
    },
    {
      name: 'MATIC',
      image: matic_normal,
      tinyIcon: matic_normal,
      bigIcon: matic_normal,
    },
    {
      name: 'USDT',
      image: usdt_normal,
      tinyIcon: usdt_normal,
      bigIcon: usdt_normal,
    },
    {
      name: 'USDC',
      image: usdc_normal,
      tinyIcon: usdc_normal,
      bigIcon: usdc_normal,
    },
    {
      name: 'BUSD',
      image: busd_normal,
      tinyIcon: busd_normal,
      bigIcon: busd_normal,
    },
    {
      name: 'WETH',
      image: weth_normal,
      tinyIcon: weth_normal,
      bigIcon: weth_normal,
    },
    {
      name: 'WBTC',
      image: wbtc_normal,
      tinyIcon: wbtc_normal,
      bigIcon: wbtc_normal,
    },
  ],
  TEZOS: [
    {
      name: 'DAI.e',
      image: dai_normal,
      tinyIcon: dai_normal,
      bigIcon: dai_normal,
    },
    {
      name: 'LINK.e',
      image: link_normal,
      tinyIcon: link_normal,
      bigIcon: link_normal,
    },
    {
      name: 'MATIC.e',
      image: matic_normal,
      tinyIcon: matic_normal,
      bigIcon: matic_normal,
    },
    {
      name: 'USDT.e',
      image: usdt_normal,
      tinyIcon: usdt_normal,
      bigIcon: usdt_normal,
    },
    {
      name: 'USDC.e',
      image: usdc_normal,
      tinyIcon: usdc_normal,
      bigIcon: usdc_normal,
    },
    {
      name: 'BUSD.e',
      image: busd_normal,
      tinyIcon: busd_normal,
      bigIcon: busd_normal,
    },
    {
      name: 'WETH.e',
      image: weth_normal,
      tinyIcon: weth_normal,
      bigIcon: weth_normal,
    },
    {
      name: 'WBTC.e',
      image: wbtc_normal,
      tinyIcon: wbtc_normal,
      bigIcon: wbtc_normal,
    },
  ],
};

export const allTokens = {
  DAI: dai_normal,
  LINK: link_normal,
  MATIC: matic_normal,
  USDT: usdt_normal,
  USDC: usdc_normal,
  BUSD: busd_normal,
  WETH: weth_normal,
  WBTC: wbtc_normal,
  'DAI.e': dai_normal,
  'LINK.e': link_normal,
  'MATIC.e': matic_normal,
  'USDT.e': usdt_normal,
  'USDC.e': usdc_normal,
  'BUSD.e': busd_normal,
  'WETH.e': weth_normal,
  'WBTC.e': wbtc_normal,
  fallback: fallbackIcon,
};
