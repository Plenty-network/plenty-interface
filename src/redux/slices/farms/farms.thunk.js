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

export const stakeOnFarmThunk =
  (amount, farmIdentifier, isActive, position, setShowConfirmTransaction) => (dispatch) => {
    dispatch(initiateStakingOperationOnFarm());
    stakeFarmAPI(amount, farmIdentifier, isActive, position, setShowConfirmTransaction)
      .then((response) => {
        dispatch(stakingOnFarmSuccessFull(response));
        setShowConfirmTransaction(false);
      })
      .catch(() => {
        dispatch(stakingOnFarmFailed());
        setShowConfirmTransaction(false);
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
        setShowConfirmTransaction(false);
      });
  };

export const unstakeOnFarmThunk =
  (stakesToUnstake, farmIdentifier, isActive, position, setShowConfirmTransaction) =>
  (dispatch) => {
    dispatch(initiateUnstakingOperationOnFarm());
    unstakeAPI(stakesToUnstake, farmIdentifier, isActive, position, setShowConfirmTransaction)
      .then((response) => {
        dispatch(unstakingOnFarmSuccessFull(response));
        setShowConfirmTransaction(false);
      })
      .catch(() => {
        dispatch(unstakingOnFarmFailed());
        setShowConfirmTransaction(false);
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
        setShowConfirmTransaction(false);
      });
  };

export const harvestOnFarmThunk = (
  farmIdentifier,
  isActive,
  position,
  setShowConfirmTransaction,
) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnFarm(farmIdentifier));
    harvestAPI(farmIdentifier, isActive, position, setShowConfirmTransaction)
      .then((response) => {
        dispatch(harvestingOnFarmSuccessFull(response));
        setShowConfirmTransaction(false);
      })
      .catch(() => {
        dispatch(harvestingOnFarmFailed());
        setShowConfirmTransaction(false);
      });
  };
};
