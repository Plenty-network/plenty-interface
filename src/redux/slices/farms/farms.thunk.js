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
  (amount, farmIdentifier, isActive, position, setShowConfirmTransaction, setLoader) =>
  (dispatch) => {
    dispatch(initiateStakingOperationOnFarm());
    stakeFarmAPI(amount, farmIdentifier, isActive, position, setShowConfirmTransaction)
      .then((response) => {
        dispatch(stakingOnFarmSuccessFull(response));
        setShowConfirmTransaction(false);
        setLoader(false);
      })
      .catch(() => {
        dispatch(stakingOnFarmFailed());
        setShowConfirmTransaction(false);
        setLoader(false);
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
        setShowConfirmTransaction(false);
        setLoader(false);
      });
  };

export const unstakeOnFarmThunk =
  (stakesToUnstake, farmIdentifier, isActive, position, setShowConfirmTransaction, setLoader) =>
  (dispatch) => {
    dispatch(initiateUnstakingOperationOnFarm());
    unstakeAPI(stakesToUnstake, farmIdentifier, isActive, position, setShowConfirmTransaction)
      .then((response) => {
        dispatch(unstakingOnFarmSuccessFull(response));
        setShowConfirmTransaction(false);
        setLoader(false);
      })
      .catch(() => {
        dispatch(unstakingOnFarmFailed());
        setShowConfirmTransaction(false);
        setLoader(false);
      })
      .finally(() => {
        setTimeout(() => dispatch(dismissSnackbar()), 5000);
        setShowConfirmTransaction(false);
        setLoader(false);
      });
  };

export const harvestOnFarmThunk = (
  farmIdentifier,
  isActive,
  position,
  setShowConfirmTransaction,
  setLoader,
) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnFarm(farmIdentifier));
    harvestAPI(farmIdentifier, isActive, position, setShowConfirmTransaction)
      .then((response) => {
        dispatch(harvestingOnFarmSuccessFull(response));
        setShowConfirmTransaction(false);
        setLoader(false);
      })
      .catch(() => {
        dispatch(harvestingOnFarmFailed());
        setShowConfirmTransaction(false);
        setLoader(false);
      });
  };
};
