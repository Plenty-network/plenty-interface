import * as actions from '../index.action';
import * as farmApis from './api.farms';

const startActiveFarmDataFetching = () => {
  return {
    type: actions.START_ACTIVE_FARMS_DATA_FETCH,
  };
};

const startInactiveFarmDataFetching = () => {
  return {
    type: actions.START_INACTIVE_FARMS_DATA_FETCH,
  };
};

const activeFarmDataFetchingSuccesfull = (data) => {
  return {
    type: actions.ACTIVE_FARMS_DATA_FETCH_SUCCESSFULL,
    data,
  };
};

const inactiveFarmDataFetchingSuccesfull = (data) => {
  return {
    type: actions.INACTIVE_FARMS_DATA_FETCH_SUCCESSFULL,
    data,
  };
};

const activeFarmDataFetchingFailed = () => {
  return {
    type: actions.ACTIVE_FARMS_DATA_FETCH_FAILED,
  };
};

const inactiveFarmDataFetchingFailed = () => {
  return {
    type: actions.INACTIVE_FARMS_DATA_FETCH_FAILED,
  };
};

export const getFarmsData = (isActive) => {
  return (dispatch) => {
    if (isActive) {
      dispatch(startActiveFarmDataFetching());
      farmApis
        .getFarmsData(isActive)
        .then((response) => {
          dispatch(activeFarmDataFetchingSuccesfull(response));
        })
        .catch((error) => {
          dispatch(activeFarmDataFetchingFailed());
        });
    } else {
      dispatch(startInactiveFarmDataFetching());
      farmApis
        .getFarmsData(isActive)
        .then((response) => {
          dispatch(inactiveFarmDataFetchingSuccesfull(response));
        })
        .catch((error) => {
          dispatch(inactiveFarmDataFetchingFailed());
        });
    }
  };
};

export const clearActiveFarmsData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_ACTIVE_FARMS_DATA,
    });
  };
};

export const clearInactiveFarmsData = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_INACTIVE_FARMS_DATA,
    });
  };
};

const initiateStakingOperationOnFarm = () => {
  return {
    type: actions.INITIATE_STAKING_ON_FARM,
  };
};

export const stakingOnFarmProcessing = (batchOperation) => {
  return {
    type: actions.PROCESSING_STAKING_ON_FARM,
    payload: batchOperation
  }
}

const stakingOnFarmSuccessFull = (operationHash) => {
  return {
    type: actions.STAKING_ON_FARM_SUCCESSFULL,
    data: operationHash,
  };
};

const stakingOnFarmFailed = () => {
  return {
    type: actions.STAKING_ON_FARM_FAILED,
  };
};

export const stakeOnFarm = (amount, farmIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateStakingOperationOnFarm());
    farmApis
      .stakeFarm(amount, farmIdentifier, isActive, position)
      .then((response) => {
        dispatch(stakingOnFarmSuccessFull(response));
      })
      .catch((error) => {
        dispatch(stakingOnFarmFailed());
      });
  };
};

export const clearStakeFarmResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_STAKING_ON_FARM_RESPONSE,
    });
  };
};

// unstake

const initiateUnstakingOperationOnFarm = () => {
  return {
    type: actions.INITIATE_UNSTAKING_ON_FARM,
  };
};

const unstakingOnFarmSuccessFull = (operationHash) => {
  return {
    type: actions.UNSTAKING_ON_FARM_SUCCESSFULL,
    data: operationHash,
  };
};

const unstakingOnFarmFailed = () => {
  return {
    type: actions.UNSTAKING_ON_FARM_FAILED,
  };
};

export const unstakeOnFarm = (
  stakesToUnstake,
  farmIdentifier,
  isActive,
  position
) => {
  return (dispatch) => {
    dispatch(initiateUnstakingOperationOnFarm());
    farmApis
      .unstake(stakesToUnstake, farmIdentifier, isActive, position)
      .then((response) => {
        dispatch(unstakingOnFarmSuccessFull(response));
      })
      .catch((error) => {
        dispatch(unstakingOnFarmFailed());
      });
  };
};

export const clearUntakeFarmResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_UNSTAKING_ON_FARM_RESPONSE,
    });
  };
};

// harvest

const initiateHarvestingOperationOnFarm = () => {
  return {
    type: actions.INITIATE_HARVESTING_ON_FARM,
  };
};

const harvestingOnFarmSuccessFull = (operationHash) => {
  return {
    type: actions.HARVESTING_ON_FARM_SUCCESSFULL,
    data: operationHash,
  };
};

const harvestingOnFarmFailed = () => {
  return {
    type: actions.HARVESTING_ON_FARM_FAILED,
  };
};

export const harvestOnFarm = (farmIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnFarm());
    farmApis
      .harvest(farmIdentifier, isActive, position)
      .then((response) => {
        dispatch(harvestingOnFarmSuccessFull(response));
      })
      .catch((error) => {
        dispatch(harvestingOnFarmFailed());
      });
  };
};

export const clearHarvestFarmResponse = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_HARVESTING_ON_FARM_RESPONSE,
    });
  };
};

export const toggleFarmsType = (isActive) => {
  return (dispatch) => {
    if (isActive) {
      dispatch({
        type: actions.OPEN_ACTIVE_FARMS,
      });
    } else {
      dispatch({
        type: actions.OPEN_INACTIVE_FARMS,
      });
    }
  };
};

export const handleStakeOfFarmInputValue = (value) => {
  return (dispatch) => {
    dispatch({
      type: actions.HANDLE_STAKE_ON_FARMS_INPUT_VALUE,
      data: {
        value,
      },
    });
  };
};

export const setFarmsToRender = (farmsToRender) => {
  return (dispatch) => {
    dispatch({
      type: actions.SET_FARMS_TO_RENDER,
      data: farmsToRender,
    });
  };
};

export const clearRenderedFarms = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLEAR_RENDERED_FARMS,
    });
  };
};

export const openFarmsStakeModal = (
  identifier,
  title,
  position,
  contractAddress
) => {
  return (dispatch) => {
    dispatch({
      type: actions.OPEN_FARMS_STAKE_MODAL,
      data: {
        identifier,
        title,
        position,
        contractAddress,
      },
    });
  };
};

export const closeFarmsStakeModal = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLOSE_FARMS_STAKE_MODAL,
    });
  };
};

export const openFarmsUnstakeModal = (
  identifier,
  contractAddress,
  title,
  withdrawalFeeStructure,
  position
) => {
  return (dispatch) => {
    dispatch({
      type: actions.OPEN_FARMS_UNSTAKE_MODAL,
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

export const closeFarmsUnstakeModal = () => {
  return (dispatch) => {
    dispatch({
      type: actions.CLOSE_FARMS_UNSTAKE_MODAL,
    });
  };
};

export const openCloseFarmsModal = (payload) => ({
  type: actions.OPEN_CLOSE_FARMS_MODAL,
  payload,
});
