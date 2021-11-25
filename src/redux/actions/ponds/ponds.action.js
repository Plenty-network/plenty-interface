import * as actions from '../index.action';
import * as pondsApis from './api.ponds';

const startActivePondDataFetching = () => {
  return {
    type: actions.START_ACTIVE_PONDS_DATA_FETCH,
  };
};

const startInactivePondDataFetching = () => {
  return {
    type: actions.START_INACTIVE_PONDS_DATA_FETCH,
  };
};

const activePondDataFetchingSuccesfull = (data) => {
  return {
    type: actions.ACTIVE_PONDS_DATA_FETCH_SUCCESSFULL,
    data,
  };
};

const inactivePondDataFetchingSuccesfull = (data) => {
  return {
    type: actions.INACTIVE_PONDS_DATA_FETCH_SUCCESSFULL,
    data,
  };
};

const activePondDataFetchingFailed = () => {
  return {
    type: actions.ACTIVE_PONDS_DATA_FETCH_FAILED,
  };
};

const inactivePondDataFetchingFailed = () => {
  return {
    type: actions.INACTIVE_PONDS_DATA_FETCH_FAILED,
  };
};

export const getPondsData = (isActive) => {
  return (dispatch) => {
    if (isActive) {
      dispatch(startActivePondDataFetching());
      pondsApis
        .getPondsData(isActive)
        .then((response) => {
          dispatch(activePondDataFetchingSuccesfull(response));
        })
        .catch(() => {
          dispatch(activePondDataFetchingFailed());
        });
    } else {
      dispatch(startInactivePondDataFetching());
      pondsApis
        .getPondsData(isActive)
        .then((response) => {
          dispatch(inactivePondDataFetchingSuccesfull(response));
        })
        .catch(() => {
          dispatch(inactivePondDataFetchingFailed());
        });
    }
  };
};

export const clearActivePondsData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_ACTIVE_PONDS_DATA,
    });
  };
};

export const clearInactivePondsData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_INACTIVE_PONDS_DATA,
    });
  };
};

const initiateStakingOperationOnPond = () => {
  return {
    type: actions.INITIATE_STAKING_ON_POND,
  };
};

export const stakingOnPondProcessing = (batchOperation) => {
  return {
    type: actions.PROCESSING_STAKING_ON_POND,
    payload: batchOperation,
  };
};

const stakingOnPondSuccessFull = (operationHash) => {
  return {
    type: actions.STAKING_ON_POND_SUCCESSFULL,
    data: operationHash,
  };
};

const stakingOnPondFailed = () => {
  return {
    type: actions.STAKING_ON_POND_FAILED,
  };
};

export const stakeOnPond = (amount, pondIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateStakingOperationOnPond());
    pondsApis
      .stake(amount, pondIdentifier, isActive, position)
      .then((response) => {
        dispatch(stakingOnPondSuccessFull(response));
      })
      .catch(() => {
        dispatch(stakingOnPondFailed());
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
      });
  };
};

export const clearStakePondResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_STAKING_ON_POND_RESPONSE,
    });
  };
};

// unstake

const initiateUnstakingOperationOnPond = () => {
  return {
    type: actions.INITIATE_UNSTAKING_ON_POND,
  };
};

export const unstakingOnPondProcessing = (batchOperation) => {
  return {
    type: actions.PROCESSING_UNSTAKING_ON_POND,
    payload: batchOperation,
  };
};

const unstakingOnPondSuccessFull = (operationHash) => {
  return {
    type: actions.UNSTAKING_ON_POND_SUCCESSFULL,
    data: operationHash,
  };
};

const unstakingOnPondFailed = () => {
  return {
    type: actions.UNSTAKING_ON_POND_FAILED,
  };
};

export const unstakeOnPond = (amount, mapKey, pondIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateUnstakingOperationOnPond());
    pondsApis
      .unstake(amount, mapKey, pondIdentifier, isActive, position)
      .then((response) => {
        dispatch(unstakingOnPondSuccessFull(response));
      })
      .catch(() => {
        dispatch(unstakingOnPondFailed());
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
      });
  };
};

export const clearUntakePondResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_UNSTAKING_ON_POND_RESPONSE,
    });
  };
};

// harvest

const initiateHarvestingOperationOnPond = () => {
  return {
    type: actions.INITIATE_HARVESTING_ON_POND,
  };
};

const harvestingOnPondSuccessFull = (operationHash) => {
  return {
    type: actions.HARVESTING_ON_POND_SUCCESSFULL,
    data: operationHash,
  };
};

const harvestingOnPondFailed = () => {
  return {
    type: actions.HARVESTING_ON_POND_FAILED,
  };
};

export const harvestOnPond = (pondIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnPond());
    pondsApis
      .harvest(pondIdentifier, isActive, position)
      .then((response) => {
        dispatch(harvestingOnPondSuccessFull(response));
      })
      .catch(() => {
        dispatch(harvestingOnPondFailed());
      });
  };
};

export const clearHarvestPondResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_HARVESTING_ON_POND_RESPONSE,
    });
  };
};

export const openClosePondsModal = (payload) => ({
  type: actions.OPEN_CLOSE_PONDS_MODAL,
  payload,
});

export const togglePondsType = (isActive) => {
  return (dispatch) => {
    if (isActive) {
      dispatch({
        type: actions.OPEN_ACTIVE_PONDS,
      });
    } else {
      dispatch({
        type: actions.OPEN_INACTIVE_PONDS,
      });
    }
  };
};

export const setPondsToRender = (poolsToRender) => {
  return (dispatch) => {
    dispatch({
      type: actions.SET_PONDS_TO_RENDER,
      data: poolsToRender,
    });
  };
};

export const clearRenderedPonds = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_RENDERED_PONDS,
    });
  };
};
const dismissSnackbar = () => ({
  type: actions.DISMISS_PONDS_SNACKBAR,
});
