import plentyPoolIcon from '../assets/images/logo-icon.png';
import plentyToken from '../assets/images/logo_small.png';
import hdao from '../assets/images/hdao.png';
import ethtz from '../assets/images/ethtz.png';
import wmatic from '../assets/images/wmatic.png';
import wlink from '../assets/images/wlink.png';
import usdtz from '../assets/images/usdtz.png';
import wrap from '../assets/images/wrap.png';

export const POOL_PAGE_MODAL = {
  NULL: null,
  ROI: 'roi',
  STAKE: 'stake',
  UNSTAKE: 'unstake',
  WITHDRAWAL: 'withdrawal',
  TRANSACTION_SUCCESS: 'transaction-success',
};

export const POOLS_CARDS_TYPE_LIST = {
  PLENTY: {
    image: plentyPoolIcon,
    harvestImg: plentyToken,
    title: 'PLENTY',
  },
  hDAO: {
    image: hdao,
    harvestImg: plentyToken,
    title: 'hDAO',
  },
  ETHtz: {
    image: ethtz,
    harvestImg: plentyToken,
    title: 'ETHtz',
  },
  wMATIC: {
    image: wmatic,
    harvestImg: plentyToken,
    title: 'wMATIC',
  },
  wLINK: {
    image: wlink,
    harvestImg: plentyToken,
    title: 'wLINK',
  },
  USDtz: {
    image: usdtz,
    harvestImg: plentyToken,
    title: 'USDtz',
  },
  WRAP: {
    image: wrap,
    harvestImg: plentyToken,
    title: 'USDtz',
  },
};
