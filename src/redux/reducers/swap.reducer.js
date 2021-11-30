import * as actions from '../actions/index.action';

const initialState = {
  swapData: {
    loading: false,
    data: {},
  },
  swapDetails: {},
  addLiquidityDetails: {
    otherTokenEstimate: {},
    lpOutput: {},
  },
  removeLiquidityDetails: {},
  swapOperation: {
    operationStarted: false,
    operationInjected: false,
    operationCompleted: false,
    operationFailed: false,
    operationHash: null,
  },
  addLiquidityOperation: {
    operationStarted: false,
    operationInjected: false,
    operationCompleted: false,
    operationFailed: false,
    operationHash: null,
  },
  removeLiquidityOperation: {
    operationStarted: false,
    operationInjected: false,
    operationCompleted: false,
    operationFailed: false,
    operationHash: null,
  },
};

const swapReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SWAP_DETAILS_FETCH_START:
      return {
        ...state,
        swapData: {
          loading: true,
          data: {},
        },
      };
    case actions.SWAP_DETAILS_FETCH_SUCCESSFULL:
      return {
        ...state,
        swapData: {
          loading: false,
          data: action.data,
        },
      };
    case actions.SWAP_DETAILS_FETCH_FAIL:
      return {
        ...state,
        swapData: {
          loading: false,
          data: {},
        },
      };
    case actions.SWAP_DETAILS_CLEAR:
      return {
        ...state,
        swapData: {
          loading: false,
          data: {},
        },
      };
    case actions.SET_SWAP_OUTPUT_DETAILS:
      return {
        ...state,
        swapDetails: action.data,
      };
    case actions.CLEAR_SWAP_OUTPUT_DETAILS:
      return {
        ...state,
        swapDetails: {},
      };
    case actions.SET_OTHER_TOKEN_ESTIMATE_FOR_ADD_LIQUIDITY:
      return {
        ...state,
        addLiquidityDetails: {
          otherTokenEstimate: action.data,
          lpOutput: {},
        },
      };
    case actions.CLEAR_OTHER_TOKEN_ESTIMATE_FOR_ADD_LIQUIDITY:
      return {
        ...state,
        addLiquidityDetails: {
          otherTokenEstimate: {},
          lpOutput: state.addLiquidityDetails.lpOutput,
        },
      };
    case actions.SET_LP_OUTPUT:
      return {
        ...state,
        addLiquidityDetails: {
          otherTokenEstimate: state.addLiquidityDetails.otherTokenEstimate,
          lpOutput: action.data,
        },
      };
    case actions.CLEAR_LP_OUTPUT:
      return {
        ...state,
        addLiquidityDetails: {
          otherTokenEstimate: state.addLiquidityDetails.otherTokenEstimate,
          lpOutput: {},
        },
      };
    case actions.SET_REMOVE_LIQUIDITY_OUTPUT_DETAILS:
      return {
        ...state,
        removeLiquidityDetails: action.data,
      };
    case actions.CLEAR_REMOVE_LIQUIDITY_OUTPUT_DETAILS:
      return {
        ...state,
        removeLiquidityDetails: {},
      };
    case actions.INITIATE_SWAP:
      return {
        ...state,
        swapOperation: {
          operationStarted: true,
          operationInjected: false,
          operationCompleted: false,
          operationFailed: false,
          operationHash: null,
        },
      };
    case actions.SWAP_INJECTED_OPERATION:
      return {
        ...state,
        swapOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: false,
          operationFailed: false,
          operationHash: action.data,
        },
      };
    case actions.SWAP_SUCCESSFULL:
      return {
        ...state,
        swapOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: true,
          operationFailed: false,
          operationHash: action.data,
        },
      };
    case actions.SWAP_FAILED:
      return {
        ...state,
        swapOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: false,
          operationFailed: true,
          operationHash: null,
        },
      };
    case actions.CLEAR_SWAP_RESPONSE:
      return {
        ...state,
        swapOperation: {
          operationStarted: false,
          operationInjected: false,
          operationCompleted: false,
          operationFailed: false,
          operationHash: null,
        },
      };
    //
    case actions.INITIATE_ADD_LIQUIDITY:
      return {
        ...state,
        addLiquidityOperation: {
          operationStarted: true,
          operationInjected: false,
          operationCompleted: false,
          operationFailed: false,
          operationHash: null,
        },
      };
    case actions.ADD_LIQUIDITY_INJECTED_OPERATION:
      return {
        ...state,
        addLiquidityOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: false,
          operationFailed: false,
          operationHash: action.data,
        },
      };
    case actions.ADD_LIQUIDITY_SUCCESSFULL:
      return {
        ...state,
        addLiquidityOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: true,
          operationFailed: false,
          operationHash: action.data,
        },
      };
    case actions.ADD_LIQUIDITY_FAILED:
      return {
        ...state,
        addLiquidityOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: false,
          operationFailed: true,
          operationHash: null,
        },
      };
    case actions.CLEAR_ADD_LIQUIDITY_RESPONSE:
      return {
        ...state,
        addLiquidityOperation: {
          operationStarted: false,
          operationInjected: false,
          operationCompleted: false,
          operationFailed: false,
          operationHash: null,
        },
      };
    //
    case actions.INITIATE_REMOVE_LIQUIDITY:
      return {
        ...state,
        removeLiquidityOperation: {
          operationStarted: true,
          operationInjected: false,
          operationCompleted: false,
          operationFailed: false,
          operationHash: null,
        },
      };
    case actions.REMOVE_LIQUIDITY_INJECTED_OPERATION:
      return {
        ...state,
        removeLiquidityOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: false,
          operationFailed: false,
          operationHash: action.data,
        },
      };
    case actions.REMOVE_LIQUIDITY_SUCCESSFULL:
      return {
        ...state,
        removeLiquidityOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: true,
          operationFailed: false,
          operationHash: action.data,
        },
      };
    case actions.REMOVE_LIQUIDITY_FAILED:
      return {
        ...state,
        removeLiquidityOperation: {
          operationStarted: true,
          operationInjected: true,
          operationCompleted: false,
          operationFailed: true,
          operationHash: null,
        },
      };
    case actions.CLEAR_REMOVE_LIQUIDITY_RESPONSE:
      return {
        ...state,
        removeLiquidityOperation: {
          operationStarted: false,
          operationInjected: false,
          operationCompleted: false,
          operationFailed: false,
          operationHash: null,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default swapReducer;
