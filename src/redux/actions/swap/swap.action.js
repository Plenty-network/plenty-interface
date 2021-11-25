import * as actions from '../index.action';
import * as swapApis from './api.swap';

const swapDetailsFetchStart = () => {
  return {
    type: actions.SWAP_DETAILS_FETCH_START,
  };
};

const swapDetailsFetchSuccessfull = (details) => {
  return {
    type: actions.SWAP_DETAILS_FETCH_SUCCESSFULL,
    data: details,
  };
};

const swapDetailsFetchFailed = () => {
  return {
    type: actions.SWAP_DETAILS_FETCH_FAIL,
  };
};

export const clearSwapDetails = () => {
  return {
    type: actions.SWAP_DETAILS_CLEAR,
  };
};

export const getSwapDetails = (tokenIn, tokenOut) => {
  return (dispatch) => {
    dispatch(swapDetailsFetchStart());
    swapApis
      .loadSwapData(tokenIn, tokenOut)
      .then((response) => {
        dispatch(swapDetailsFetchSuccessfull(response));
      })
      .catch(() => {
        dispatch(swapDetailsFetchFailed());
      });
  };
};

export const setSwapTokenOutput = (
  tokenIn_amount,
  tokenIn_supply,
  tokenOut_supply,
  exchangeFee,
  slippage,
) => {
  return (dispatch) => {
    const tokenOutputDetails = swapApis.computeTokenOutput(
      tokenIn_amount,
      tokenIn_supply,
      tokenOut_supply,
      exchangeFee,
      slippage,
    );
    dispatch({
      type: actions.SET_SWAP_OUTPUT_DETAILS,
      data: tokenOutputDetails,
    });
  };
};

export const clearSwapTokenOutput = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_SWAP_OUTPUT_DETAILS,
    });
  };
};

export const setEstimateOtherToken = (tokenIn_amount, tokenIn_supply, tokenOut_supply) => {
  return (dispatch) => {
    const estimateOtherToken = swapApis.estimateOtherToken(
      tokenIn_amount,
      tokenIn_supply,
      tokenOut_supply,
    );
    dispatch({
      type: actions.SET_OTHER_TOKEN_ESTIMATE_FOR_ADD_LIQUIDITY,
      data: estimateOtherToken,
    });
  };
};

export const clearOtherTokenEstimate = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_OTHER_TOKEN_ESTIMATE_FOR_ADD_LIQUIDITY,
    });
  };
};

export const computeRemoveTokens = (
  burnAmount,
  lpTotalSupply,
  tokenFirst_Supply,
  tokenSecond_Supply,
  slippage,
) => {
  const removeTokensOutput = swapApis.computeRemoveTokens(
    burnAmount,
    lpTotalSupply,
    tokenFirst_Supply,
    tokenSecond_Supply,
    slippage,
  );
  return (dispatch) => {
    dispatch({
      type: actions.SET_REMOVE_LIQUIDITY_OUTPUT_DETAILS,
      data: removeTokensOutput,
    });
  };
};

export const clearRemoveTokensComputations = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_REMOVE_LIQUIDITY_OUTPUT_DETAILS,
    });
  };
};

export const setLpTokenOutput = (
  tokenIn_amount,
  tokenOut_amount,
  tokenIn_supply,
  tokenOut_supply,
  lpTokenSupply,
) => {
  const lpOutput = swapApis.lpTokenOutput(
    tokenIn_amount,
    tokenOut_amount,
    tokenIn_supply,
    tokenOut_supply,
    lpTokenSupply,
  );
  return (dispatch) => {
    dispatch({
      type: actions.SET_LP_OUTPUT,
      data: lpOutput,
    });
  };
};

export const clearLpTokenOutput = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_LP_OUTPUT,
    });
  };
};

const initiateSwap = () => {
  return {
    type: actions.INITIATE_SWAP,
  };
};

const swapSuccessfull = (operationHash) => {
  return {
    type: actions.SWAP_SUCCESSFULL,
    data: operationHash,
  };
};

const swapFailed = () => {
  return {
    type: actions.SWAP_FAILED,
  };
};

export const swapOperationInjected = (operationHash) => {
  return {
    type: actions.SWAP_INJECTED_OPERATION,
    data: operationHash,
  };
};

export const swap = (tokenIn, tokenOut, minimumTokenOut, recipent, tokenInAmount, caller) => {
  return (dispatch) => {
    dispatch(initiateSwap());
    swapApis
      .swapTokens(tokenIn, tokenOut, minimumTokenOut, recipent, tokenInAmount, caller)
      .then((resp) => {
        dispatch(swapSuccessfull(resp));
      })
      .catch(() => {
        dispatch(swapFailed());
      });
  };
};

export const clearSwapResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_SWAP_RESPONSE,
    });
  };
};

const initiateAddLiquidity = () => {
  return (dispatch) => {
    dispatch({
      type: actions.INITIATE_ADD_LIQUIDITY,
    });
  };
};

const addLiquiditySuccessfull = (operationHash) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_LIQUIDITY_SUCCESSFULL,
      data: operationHash,
    });
  };
};

const addLiquidityFailed = () => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_LIQUIDITY_FAILED,
    });
  };
};

export const addLiquidity = (tokenA, tokenB, tokenA_Amount, tokenB_Amount, caller) => {
  return (dispatch) => {
    dispatch(initiateAddLiquidity());
    addLiquidity(tokenA, tokenB, tokenA_Amount, tokenB_Amount, caller)
      .then((resp) => {
        dispatch(addLiquiditySuccessfull(resp));
      })
      .catch(() => {
        dispatch(addLiquidityFailed());
      });
  };
};

export const addLiquidityOperationInjected = (operationHash) => {
  return (dispatch) => {
    dispatch({
      type: actions.ADD_LIQUIDITY_INJECTED_OPERATION,
      data: operationHash,
    });
  };
};

export const clearAddLiquidityResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_ADD_LIQUIDITY_RESPONSE,
    });
  };
};

const initiateRemoveLiquidity = () => {
  return {
    type: actions.INITIATE_REMOVE_LIQUIDITY,
  };
};

const removeLiquiditySuccessfull = (operationHash) => {
  return {
    type: actions.REMOVE_LIQUIDITY_SUCCESSFULL,
    data: operationHash,
  };
};

const removeLiquidityFailed = () => {
  return {
    type: actions.REMOVE_LIQUIDITY_FAILED,
  };
};

export const removeLiquidity = (
  tokenA,
  tokenB,
  tokenA_MinimumRecieve,
  tokenB_MinimumRecieve,
  lpToken_Amount,
  caller,
) => {
  return (dispatch) => {
    dispatch(initiateRemoveLiquidity());
    swapApis
      .removeLiquidity(
        tokenA,
        tokenB,
        tokenA_MinimumRecieve,
        tokenB_MinimumRecieve,
        lpToken_Amount,
        caller,
      )
      .then((resp) => {
        dispatch(removeLiquiditySuccessfull(resp));
      })
      .catch(() => {
        dispatch(removeLiquidityFailed());
      });
  };
};

export const removeLiquidityOperationInjected = (operationHash) => {
  return (dispatch) => {
    dispatch({
      type: actions.REMOVE_LIQUIDITY_INJECTED_OPERATION,
      data: operationHash,
    });
  };
};

export const clearRemoveLiquidityResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_REMOVE_LIQUIDITY_RESPONSE,
    });
  };
};
