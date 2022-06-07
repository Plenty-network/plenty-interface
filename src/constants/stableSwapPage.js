import ctez from '../assets/images/ctez.png';
import xtz from '../assets/images/tez.png';
import tzBTC from '../assets/images/tzbtc-swap.png';
import uUSD from '../assets/images/uUSD.png';
import kusd from '../assets/images/kusd.png';
import usdce from '../assets/images/usdce.png';
import wbtce from '../assets/images/wbtce.png';
import weth_normal from '../assets/images/bridge/tokens/weth_icon.svg';
import dai_normal from '../assets/images/bridge/tokens/dai_icon.svg';

export const stableSwapTokens = [
  {
    name: 'tez',
    image: xtz,
    new: true,
  },
  {
    name: 'WBTC.e',
    image: wbtce,
    new: true,
  },
  {
    name: 'USDC.e',
    image: usdce,
    new: true,
  },
  {
    name: 'DAI.e',
    image: dai_normal,
    new: true,
  },
  {
    name: 'WETH.e',
    image: weth_normal,
    new: true,
  },
  {
    name: 'ctez',
    image: ctez,
    new: false,
    extra: {
      text: 'Get ctez',
      link: 'https://ctez.app',
    },
  },
  {
    name: 'uUSD',
    image: uUSD,
    new: false,
  },
  {
    name: 'kUSD',
    image: kusd,
    new: false,
  },
  {
    name: 'tzBTC',
    image: tzBTC,
    new: false,
  },
];
