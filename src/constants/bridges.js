// Bridges
import ethereum from '../assets/images/bridge/eth.svg';
import { ReactComponent as ethereumButtonIcon } from '../assets/images/bridge/ethereum_btn_icon.svg';
import tezos from '../assets/images/bridge/ic_tezos.svg';
import { ReactComponent as polygonButtonIcon } from '../assets/images/bridge/tokens/matic_icon.svg';

// Tokens
import dai_normal from '../assets/images/bridge/tokens/dai_icon.svg';
import link_normal from '../assets/images/bridge/tokens/link_icon.svg';
import matic_normal from '../assets/images/bridge/tokens/matic_icon.svg';
import usdt_normal from '../assets/images/bridge/tokens/usdt_icon.svg';
import usdc_normal from '../assets/images/bridge/tokens/usdc_icon.svg';
import busd_normal from '../assets/images/bridge/tokens/busd_icon.svg';
import weth_normal from '../assets/images/bridge/tokens/weth_icon.svg';
import wbtc_normal from '../assets/images/bridge/tokens/wbtc_icon.svg';
import ageur_normal from '../assets/images/bridge/tokens/agEUR_icon.svg';
import paxg_normal from '../assets/images/bridge/tokens/paxg_icon.svg';
import aleph_normal from '../assets/images/bridge/tokens/aleph_icon.svg';
import wmatic_normal from '../assets/images/bridge/tokens/wmatic_icon.svg';
import fallbackIcon from '../assets/images/bridge/tokens/fallback_icon.svg';

// Deprecated wrapped tokens
import waave from '../assets/images/bridge/tokens/old_wrapped/wAAVE.png';
import wcel from '../assets/images/bridge/tokens/old_wrapped/wCEL.png';
import wcomp from '../assets/images/bridge/tokens/old_wrapped/wCOMP.png';
import wcro from '../assets/images/bridge/tokens/old_wrapped/wCRO.png';
import wftt from '../assets/images/bridge/tokens/old_wrapped/wFTT.png';
import wht from '../assets/images/bridge/tokens/old_wrapped/wHT.png';
import whusd from '../assets/images/bridge/tokens/old_wrapped/wHUSD.png';
import wleo from '../assets/images/bridge/tokens/old_wrapped/wLEO.png';
import wmkr from '../assets/images/bridge/tokens/old_wrapped/wMKR.png';
import wokb from '../assets/images/bridge/tokens/old_wrapped/wOKB.png';
import wpax from '../assets/images/bridge/tokens/old_wrapped/wPAX.png';
import wsushi from '../assets/images/bridge/tokens/old_wrapped/wSUSHI.png';
import wuni from '../assets/images/bridge/tokens/old_wrapped/wUNI.png';
import wrap from '../assets/images/bridge/tokens/old_wrapped/WRAP.png';

export const CHANGE_NETWORK_PROMPT_DELAY = 3000;

export const DEFAULT_ETHEREUM_TOKEN = 'USDC';
export const DEFAULT_TEZOS_TOKEN = 'USDC.e';

export const bridgesList = {
  ETHEREUM: {
    name: 'ETHEREUM',
    image: ethereum,
    buttonImage: ethereumButtonIcon,
    bigIcon: ethereum,
  },
  TEZOS: {
    name: 'TEZOS',
    image: tezos,
    buttonImage: tezos,
    bigIcon: tezos,
  },
  POLYGON: {
    name: 'POLYGON',
    image: matic_normal,
    buttonImage: polygonButtonIcon,
    bigIcon: matic_normal,
  },
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
  agEUR: ageur_normal,
  PAXG: paxg_normal,
  ALEPH: aleph_normal,
  WMATIC: wmatic_normal,
  'DAI.e': dai_normal,
  'LINK.e': link_normal,
  'MATIC.e': matic_normal,
  'USDT.e': usdt_normal,
  'USDC.e': usdc_normal,
  'BUSD.e': busd_normal,
  'WETH.e': weth_normal,
  'WBTC.e': wbtc_normal,
  'agEUR.e': ageur_normal,
  'PAXG.e': paxg_normal,
  'ALEPH.e': aleph_normal,
  wAAVE: waave,
  wCEL: wcel,
  wCOMP: wcomp,
  wCRO: wcro,
  wFTT: wftt,
  wHT: wht,
  wHUSD: whusd,
  wLEO: wleo,
  wMKR: wmkr,
  wOKB: wokb,
  wPAX: wpax,
  wSUSHI: wsushi,
  wUNI: wuni,
  WRAP: wrap,
  'WETH.p': weth_normal,
  'WMATIC.p': wmatic_normal,
  fallback: fallbackIcon,
};
