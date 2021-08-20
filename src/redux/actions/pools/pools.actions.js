import * as actions from '../index.action';
import * as poolsApis from './api.pools';

const startActivePoolDataFetching = () => {
  return {
    type: actions.START_ACTIVE_POOLS_DATA_FETCH,
  };
};

const startInactivePoolDataFetching = () => {
  return {
    type: actions.START_INACTIVE_POOLS_DATA_FETCH,
  };
};

const activePoolDataFetchingSuccesfull = (data) => {
  return {
    type: actions.ACTIVE_POOLS_DATA_FETCH_SUCCESSFULL,
    data,
  };
};

const inactivePoolDataFetchingSuccesfull = (data) => {
  return {
    type: actions.INACTIVE_POOLS_DATA_FETCH_SUCCESSFULL,
    data,
  };
};

const activePoolDataFetchingFailed = () => {
  return {
    type: actions.ACTIVE_POOLS_DATA_FETCH_FAILED,
  };
};

const inactivePoolDataFetchingFailed = () => {
  return {
    type: actions.INACTIVE_POOLS_DATA_FETCH_FAILED,
  };
};

export const getPoolsData = (isActive) => {
  return (dispatch) => {
    if (isActive) {
      dispatch(startActivePoolDataFetching());
      poolsApis
        .getPoolsData(isActive)
        .then((response) => {
          dispatch(activePoolDataFetchingSuccesfull(response));
        })
        .catch((error) => {
          dispatch(activePoolDataFetchingFailed());
        });
    } else {
      dispatch(startInactivePoolDataFetching());
      poolsApis
        .getPoolsData(isActive)
        .then((response) => {
          dispatch(inactivePoolDataFetchingSuccesfull(response));
        })
        .catch((error) => {
          dispatch(inactivePoolDataFetchingFailed());
        });
    }
  };
};

export const clearActivePoolsData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_ACTIVE_POOLS_DATA,
    });
  };
};

export const clearInactivePoolsData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_INACTIVE_POOLS_DATA,
    });
  };
};

const initiateStakingOperationOnPool = () => {
  return {
    type: actions.INITIATE_STAKING_ON_POOL,
  };
};

export const stakingOnPoolProcessing = (batchOperation) => {
  return {
    type: actions.PROCESSING_STAKING_ON_POOL,
    payload: batchOperation
  }
}

const stakingOnPoolSuccessFull = (operationHash) => {
  return {
    type: actions.STAKING_ON_POOL_SUCCESSFULL,
    data: operationHash,
  };
};

const stakingOnPoolFailed = () => {
  return {
    type: actions.STAKING_ON_POOL_FAILED,
  };
};

export const stakeOnPool = (amount, poolIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateStakingOperationOnPool());
    poolsApis
      .stake(amount, poolIdentifier, isActive, position)
      .then((response) => {
        dispatch(stakingOnPoolSuccessFull(response));
      })
      .catch((error) => {
        dispatch(stakingOnPoolFailed());
      })
      .finally(() => {
        setTimeout(
          () => dispatch(dismissSnackbar()),
          5000
        )
      });
  };
};

export const clearStakePoolResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_STAKING_ON_POOL_RESPONSE,
    });
  };
};

// unstake

const initiateUnstakingOperationOnPool = () => {
  return {
    type: actions.INITIATE_UNSTAKING_ON_POOL,
  };
};

export const unstakingOnPoolProcessing = (batchOperation) => {
  return {
    type: actions.PROCESSING_UNSTAKING_ON_POOL,
    payload: batchOperation
  }
}

const unstakingOnPoolSuccessFull = (operationHash) => {
  return {
    type: actions.UNSTAKING_ON_POOL_SUCCESSFULL,
    data: operationHash,
  };
};

const unstakingOnPoolFailed = () => {
  return {
    type: actions.UNSTAKING_ON_POOL_FAILED,
  };
};

export const unstakeOnPool = (
  stakesToUnstake,
  poolIdentifier,
  isActive,
  position
) => {
  return (dispatch) => {
    dispatch(initiateUnstakingOperationOnPool());
    poolsApis
      .unstake(stakesToUnstake, poolIdentifier, isActive, position)
      .then((response) => {
        dispatch(unstakingOnPoolSuccessFull(response));
      })
      .catch((error) => {
        dispatch(unstakingOnPoolFailed());
      })
      .finally(() => {
        setTimeout(
          () => dispatch(dismissSnackbar()),
          5000
        )
      });
  };
};

export const clearUntakePoolResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_UNSTAKING_ON_POOL_RESPONSE,
    });
  };
};

// harvest

const initiateHarvestingOperationOnPool = () => {
  return {
    type: actions.INITIATE_HARVESTING_ON_POOL,
  };
};

const harvestingOnPoolSuccessFull = (operationHash) => {
  return {
    type: actions.HARVESTING_ON_POOL_SUCCESSFULL,
    data: operationHash,
  };
};

const harvestingOnPoolFailed = () => {
  return {
    type: actions.HARVESTING_ON_POOL_FAILED,
  };
};

export const harvestOnPool = (poolIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnPool());
    poolsApis
      .harvest(poolIdentifier, isActive, position)
      .then((response) => {
        dispatch(harvestingOnPoolSuccessFull(response));
      })
      .catch((error) => {
        dispatch(harvestingOnPoolFailed());
      });
  };
};

export const clearHarvestPoolResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_HARVESTING_ON_POOL_RESPONSE,
    });
  };
};

export const openClosePoolsModal = (payload) => ({
  type: actions.OPEN_CLOSE_POOLS_MODAL,
  payload,
});


export const togglePoolsType = (isActive) => {
  return (dispatch) => {
    if (isActive) {
      dispatch({
        type: actions.OPEN_ACTIVE_POOLS,
      });
    } else {
      dispatch({
        type: actions.OPEN_INACTIVE_POOLS,
      });
    }
  };
};

export const setPoolsToRender = (poolsToRender) => {
  return (dispatch) => {
    dispatch({
      type: actions.SET_POOLS_TO_RENDER,
      data: poolsToRender,
    });
  };
};

export const clearRenderedPools= () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_RENDERED_POOLS,
    });
  };
};


export const openPoolsStakeModal = (
  identifier,
  title,
  position,
  contractAddress
) => {
  return (dispatch) => {
    dispatch({
      type: actions.OPEN_POOLS_STAKE_MODAL,
      data: {
        identifier,
        title,
        position,
        contractAddress,
      },
    });
  };
};

export const closePoolsStakeModal = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLOSE_POOLS_STAKE_MODAL,
    });
  };
};

export const handleStakeOfPoolInputValue = (value) => {
  console.log({value});
  return (dispatch) => {
    dispatch({
      type: actions.HANDLE_STAKE_ON_POOLS_INPUT_VALUE,
      data: {
        value,
      },
    });
  };
};

export const openPoolsUnstakeModal = (
  identifier,
  contractAddress,
  title,
  withdrawalFeeStructure,
  position
) => {
  return (dispatch) => {
    dispatch({
      type: actions.OPEN_POOLS_UNSTAKE_MODAL,
      data: {
        identifier,
        contractAddress,
        title,
        withdrawalFeeStructure,
        position,
      },
    });
  };
};

export const closePoolsUnstakeModal = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLOSE_POOLS_UNSTAKE_MODAL,
    });
  };
};

const dismissSnackbar = () => ({
  type: actions.DISMISS_POOLS_SNACKBAR,
})