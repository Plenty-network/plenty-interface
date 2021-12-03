import {
  activeFarmDataFetchingFailed,
  activeFarmDataFetchingSuccesfull,
  dismissSnackbar,
  harvestingOnFarmFailed,
  harvestingOnFarmSuccessFull,
  inactiveFarmDataFetchingFailed,
  inactiveFarmDataFetchingSuccesfull,
  initiateHarvestingOperationOnFarm,
  initiateStakingOperationOnFarm,
  initiateUnstakingOperationOnFarm,
  stakingOnFarmFailed,
  stakingOnFarmSuccessFull,
  startActiveFarmDataFetching,
  startInactiveFarmDataFetching,
  unstakingOnFarmFailed,
  unstakingOnFarmSuccessFull,
} from './farms.slice';
import { getFarmsDataAPI, harvestAPI, stakeFarmAPI, unstakeAPI } from './farms.api';

export const getFarmsDataThunk = (isActive) => (dispatch) => {
  let startDataFetching;
  let dataFetchingSuccessful;
  let dataFetchingFailed;

  if (isActive) {
    startDataFetching = startActiveFarmDataFetching;
    dataFetchingSuccessful = activeFarmDataFetchingSuccesfull;
    dataFetchingFailed = activeFarmDataFetchingFailed;
  } else {
    startDataFetching = startInactiveFarmDataFetching;
    dataFetchingSuccessful = inactiveFarmDataFetchingSuccesfull;
    dataFetchingFailed = inactiveFarmDataFetchingFailed;
  }

  dispatch(startDataFetching());
  getFarmsDataAPI(isActive)
    .then((response) => {
      dispatch(dataFetchingSuccessful(response.response));
    })
    .catch(() => {
      dispatch(dataFetchingFailed());
    });
};

export const stakeOnFarmThunk = (amount, farmIdentifier, isActive, position) => (dispatch) => {
  dispatch(initiateStakingOperationOnFarm());
  stakeFarmAPI(amount, farmIdentifier, isActive, position)
    .then((response) => {
      dispatch(stakingOnFarmSuccessFull(response));
    })
    .catch(() => {
      dispatch(stakingOnFarmFailed());
    })
    .finally(() => {
      setTimeout(() => dispatch(dismissSnackbar()), 5000);
    });
};

export const unstakeOnFarmThunk =
  (stakesToUnstake, farmIdentifier, isActive, position) => (dispatch) => {
    dispatch(initiateUnstakingOperationOnFarm());
    unstakeAPI(stakesToUnstake, farmIdentifier, isActive, position)
      .then((response) => {
        dispatch(unstakingOnFarmSuccessFull(response));
      })
      .catch(() => {
        dispatch(unstakingOnFarmFailed());
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
      });
  };

export const harvestOnFarmThunk = (farmIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnFarm(farmIdentifier));
    harvestAPI(farmIdentifier, isActive, position)
      .then((response) => {
        dispatch(harvestingOnFarmSuccessFull(response));
      })
      .catch(() => {
        dispatch(harvestingOnFarmFailed());
      });
  };
};
