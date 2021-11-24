import * as actions from '../actions/index.action';
import { FARM_PAGE_MODAL } from '../../constants/farmsPage';
import { POND_PAGE_MODAL } from '../../constants/pondsPage';

const initialState = {
  active: {
    isPresent: false,
    loading: false,
    data: {},
  },
  inactive: {
    isPresent: false,
    loading: false,
    data: {},
  },
  stakeOperation: {
    isLoading: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
  unstakeOperation: {
    isLoading: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
  harvestOperation: {
    isLoading: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
  modals: {
    open: POND_PAGE_MODAL.NULL,
    contractAddress: null,
  },
  isActiveOpen: true,
  pondsToRender: [],
};

const pondsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.START_ACTIVE_PONDS_DATA_FETCH:
      return {
        ...state,
        active: {
          isPresent: false,
          loading: true,
          data: {},
        },
      };
    case actions.ACTIVE_PONDS_DATA_FETCH_SUCCESSFULL:
      return {
        ...state,
        active: {
          isPresent: true,
          loading: false,
          data: action.data,
        },
      };
    case actions.ACTIVE_PONDS_DATA_FETCH_FAILED:
      return {
        ...state,
        active: {
          isPresent: false,
          loading: false,
          data: {},
        },
      };
    case actions.CLEAR_ACTIVE_PONDS_DATA:
      return {
        ...state,
        active: {
          isPresent: false,
          loading: false,
          data: {},
        },
      };
    //
    case actions.START_INACTIVE_PONDS_DATA_FETCH:
      return {
        ...state,
        inactive: {
          isPresent: false,
          loading: true,
          data: {},
        },
      };
    case actions.INACTIVE_PONDS_DATA_FETCH_SUCCESSFULL:
      return {
        ...state,
        inactive: {
          isPresent: true,
          loading: false,
          data: action.data,
        },
      };
    case actions.INACTIVE_PONDS_DATA_FETCH_FAILED:
      return {
        ...state,
        inactive: {
          isPresent: false,
          loading: false,
          data: {},
        },
      };
    case actions.CLEAR_INACTIVE_PONDS_DATA:
      return {
        ...state,
        inactive: {
          isPresent: false,
          loading: false,
          data: {},
        },
      };
    case actions.INITIATE_STAKING_ON_POND:
      return {
        ...state,
        stakeOperation: {
          isLoading: true,
          completed: false,
          failed: false,
          operationHash: null,
        },
      };
    case actions.STAKING_ON_POND_SUCCESSFULL:
      return {
        ...state,
        stakeOperation: {
          isLoading: false,
          completed: true,
          failed: false,
          operationHash: action.data,
        },
      };
    case actions.STAKING_ON_POND_FAILED:
      return {
        ...state,
        stakeOperation: {
          isLoading: false,
          completed: false,
          failed: true,
          operationHash: null,
        },
      };
    case actions.CLEAR_STAKING_ON_POND_RESPONSE:
      return {
        ...state,
        stakeOperation: {
          isLoading: false,
          completed: false,
          failed: false,
          operationHash: null,
        },
      };
    //
    case actions.INITIATE_UNSTAKING_ON_POND:
      return {
        ...state,
        unstakeOperation: {
          isLoading: true,
          completed: false,
          failed: false,
          operationHash: null,
        },
      };
    case actions.UNSTAKING_ON_POND_SUCCESSFULL:
      return {
        ...state,
        unstakeOperation: {
          isLoading: false,
          completed: true,
          failed: false,
          operationHash: action.data,
        },
      };
    case actions.UNSTAKING_ON_POND_FAILED:
      return {
        ...state,
        unstakeOperation: {
          isLoading: false,
          completed: false,
          failed: true,
          operationHash: null,
        },
      };
    case actions.CLEAR_UNSTAKING_ON_POND_RESPONSE:
      return {
        ...state,
        unstakeOperation: {
          isLoading: false,
          completed: false,
          failed: false,
          operationHash: null,
        },
      };
    //
    case actions.INITIATE_HARVESTING_ON_POND:
      return {
        ...state,
        harvestOperation: {
          isLoading: true,
          completed: false,
          failed: false,
          operationHash: null,
        },
      };
    case actions.HARVESTING_ON_POND_SUCCESSFULL:
      return {
        ...state,
        harvestOperation: {
          isLoading: false,
          completed: true,
          failed: false,
          operationHash: action.data,
        },
      };
    case actions.HARVESTING_ON_POND_FAILED:
      return {
        ...state,
        harvestOperation: {
          isLoading: false,
          completed: false,
          failed: true,
          operationHash: null,
        },
      };
    case actions.CLEAR_HARVESTING_ON_POND_RESPONSE:
      return {
        ...state,
        stakeOperation: {
          isLoading: false,
          completed: false,
          failed: false,
          operationHash: null,
        },
      };
    case actions.OPEN_ACTIVE_PONDS:
      return {
        ...state,
        isActiveOpen: true,
      };
    case actions.OPEN_INACTIVE_PONDS:
      return {
        ...state,
        isActiveOpen: false,
      };
    case actions.SET_PONDS_TO_RENDER:
      return {
        ...state,
        pondsToRender: action.data,
      };
    case actions.CLEAR_RENDERED_PONDS:
      return {
        ...state,
        pondsToRender: [],
      };
    default:
      return {
        ...state,
      };
  }
};

export default pondsReducer;
