import { HOME_PAGE_MODAL } from '../../constants/homePage';
import * as actions from '../actions/index.action';

const initState = {
  homeStats: {
    isPresent: false,
    loading: false,
    data: {
      marketcap: 0,
      circulating_supply: 0,
      total_minted: 0,
      total_burned: 0,
      price: 0,
      plenty_per_block: 0,
    },
  },
  tvl: {
    isPresent: false,
    loading: false,
    data: 0,
  },
  plentyBalance: {
    isPresent: false,
    loading: false,
    data: null,
  },
  plentyToHarvest: {
    isPresent: false,
    loading: false,
    data: null,
  },
  harvestBatch: {
    isPresent: false,
    loading: false,
    data: [],
  },
  userTVL: {
    isPresent: false,
    loading: false,
    data: null,
  },
  harvestAllOperation: {
    loading: false,
    processing: false,
    completed: false,
    failed: false,
    batchOperation: null,
  },
  modals: {
    open: HOME_PAGE_MODAL.NULL,
    contractAddress: null,
    transactionId: '',
    snackbar: false,
  },
};

const homeReducer = (state = initState, action) => {
  switch (action.type) {
    case actions.HOME_STATS_FETCH:
      return {
        ...state,
        homeStats: {
          isPresent: false,
          loading: true,
          data: { ...state.homeStats.data },
        },
      };
    case actions.HOME_STATS_FETCH_SUCCESS:
      return {
        ...state,
        homeStats: { isPresent: true, loading: false, data: action.data },
      };
    case actions.HOME_STATS_FETCH_FAILED:
      return {
        ...state,
        homeStats: { isPresent: false, loading: false, data: { ...state.homeStats.data } },
      };

    case actions.TVL_FETCH:
      return {
        ...state,
        tvl: {
          isPresent: false,
          loading: true,
          data: 0,
        },
      };
    case actions.TVL_FETCH_SUCCESS:
      return {
        ...state,
        tvl: { isPresent: true, loading: false, data: action.data },
      };
    case actions.TVL_FETCH_FAILED:
      return {
        ...state,
        tvl: { isPresent: false, loading: false, data: 0 },
      };
    case actions.PLENTY_BALANCE_FETCH:
      return {
        ...state,
        plentyBalance: { isPresent: false, loading: true, data: null },
      };
    case actions.PLENTY_BALANCE_FETCH_SUCCESS:
      return {
        ...state,
        plentyBalance: { isPresent: true, loading: false, data: action.data },
      };
    case actions.PLENTY_BALANCE_FETCH_FAILED:
      return {
        ...state,
        plentyBalance: { isPresent: false, loading: false, data: 0 },
      };
    case actions.PLENTY_TO_HARVEST_FETCH:
      return {
        ...state,
        plentyToHarvest: { isPresent: false, loading: true, data: null },
      };
    case actions.PLENTY_TO_HARVEST_FETCH_SUCCESS:
      return {
        ...state,
        plentyToHarvest: { isPresent: true, loading: false, data: action.data },
      };
    case actions.PLENTY_TO_HARVEST_FETCH_FAILED:
      return {
        ...state,
        plentyToHarvest: { isPresent: false, loading: false, data: 0 },
      };
    case actions.HARVEST_BATCH_FETCH:
      return {
        ...state,
        plentyToHarvest: { isPresent: false, loading: true, data: [] },
      };
    case actions.HARVEST_BATCH_FETCH_SUCCESS:
      return {
        ...state,
        harvestBatch: { isPresent: true, loading: false, data: action.data },
      };
    case actions.HARVEST_BATCH_FETCH_FAILED:
      return {
        ...state,
        harvestBatch: { isPresent: false, loading: false, data: [] },
      };
    case actions.HARVEST_ALL_INITIATION: // INITIATION
      return {
        ...state,
        harvestAllOperation: { ...state.harvestAllOperation, loading: true },
      };
    case actions.HARVEST_ALL_PROCESSING: // INITIATION
      return {
        ...state,
        harvestAllOperation: { ...state.harvestAllOperation, loading: false, processing: true },
        modals: {
          ...state.modals,
          open: HOME_PAGE_MODAL.TRANSACTION_SUCCESS,
          transactionId: action.payload.opHash,
          snackbar: true,
        },
      };
    case actions.HARVEST_ALL_SUCCESS:
      return {
        ...state,
        harvestAllOperation: {
          ...state.harvestAllOperation,
          processing: false,
          completed: true,
          batchOperation: action.payload,
        },
      };
    case actions.HARVEST_ALL_FAILED:
      return {
        ...state,
        harvestAllOperation: {
          ...state.harvestAllOperation,
          processing: false,
          failed: true,
          loading: false,
          batchOperation: action.payload,
        },
      };
    case actions.USER_TVL_FETCH:
      return {
        ...state,
        userTVL: { isPresent: false, loading: true, data: null },
      };
    case actions.USER_TVL_FETCH_SUCCESS:
      return {
        ...state,
        userTVL: { isPresent: true, loading: false, data: action.data },
      };
    case actions.USER_TVL_FETCH_FAILED:
      return {
        ...state,
        userTVL: { isPresent: true, loading: false, data: 0 },
      };
    case actions.OPEN_CLOSE_HOME_MODAL:
      return {
        ...state,
        modals: { ...state.modals, ...action.payload },
      };
    default:
      return {
        ...state,
      };
  }
};

export default homeReducer;
