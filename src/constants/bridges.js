// Bridges
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

export const bridgesList = [
  {
    name: 'ETHEREUM',
    image: ethereum,
    buttonImage: ethereum,
    bigIcon: ethereum,
  },
  /* {
        name: 'AVALANCHE',
        image: avaxRed,
        buttonImage: avax,
        bigIcon: avaxRed
    }, */
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
