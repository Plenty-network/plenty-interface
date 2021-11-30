import * as actions from '../actions/index.action';

const initialState = {
  balances: {},
  balancesLoading: false,
  stakes: {},
  stakesLoading: false,
  harvestValueOnFarms: {},
  harvestValueOnPools: {},
  harvestValueOnPonds: {},
  harvestValuesLoading: false,
  currentBlock: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.USER_BALANCES_FETCH_START:
      return {
        ...state,
        balancesLoading: true,
      };
    case actions.USER_BALANCES_FETCH_SUCCESSFULL:
      return {
        ...state,
        balances: action.balances,
        balancesLoading: false,
      };
    case actions.USER_BALANCES_FETCH_FAIL:
      return {
        ...state,
        balances: {},
        balancesLoading: false,
      };
    case actions.USER_BALANCES_CLEAR:
      return {
        ...state,
        balances: {},
        balancesLoading: false,
      };
    case actions.USER_STAKES_FETCH_START:
      return {
        ...state,
        stakesLoading: true,
      };
    case actions.USER_STAKES_FETCH_SUCCESSFULL:
      return {
        ...state,
        stakesLoading: false,
        stakes: action.data,
        currentBlock: action.block,
      };
    case actions.USER_STAKES_FETCH_FAILED:
      return {
        ...state,
        stakesLoading: false,
        stakes: {},
        currentBlock: 0,
      };
    case actions.USER_STAKES_CLEAR:
      return {
        ...state,
        stakesLoading: false,
        stakes: {},
        currentBlock: 0,
      };
    case actions.HARVEST_VALUE_FETCH_START:
      return {
        ...state,
        harvestValuesLoading: true,
      };
    case actions.HARVEST_VALUE_FARMS_FETCH_SUCCESSFULL: {
      const duplicateDataFarms = state.harvestValueOnFarms;
      duplicateDataFarms[action.data.isActive] = action.data.data;
      return {
        ...state,
        harvestValuesLoading: false,
        harvestValueOnFarms: duplicateDataFarms,
      };
    }
    case actions.HARVEST_VALUE_POOLS_FETCH_SUCCESSFULL: {
      const duplicateDataPools = state.harvestValueOnPools;
      duplicateDataPools[action.data.isActive] = action.data.data;
      return {
        ...state,
        harvestValuesLoading: false,
        harvestValueOnPools: duplicateDataPools,
      };
    }
    case actions.HARVEST_VALUE_PONDS_FETCH_SUCCESSFULL: {
      const duplicateDataPonds = state.harvestValueOnPonds;
      duplicateDataPonds[action.data.isActive] = action.data.data;
      return {
        ...state,
        harvestValuesLoading: false,
        harvestValueOnPonds: duplicateDataPonds,
      };
    }
    case actions.HARVEST_VALUE_FETCH_FAILED:
      return {
        ...state,
        harvestValuesLoading: false,
      };
    case actions.HARVEST_VALUE_CLEAR:
      return {
        ...state,
        harvestValuesLoading: false,
        harvestValueOnFarms: {},
        harvestValueOnPools: {},
        harvestValueOnPonds: {},
      };
    default:
      return {
        ...state,
      };
  }
};

export default userReducer;
