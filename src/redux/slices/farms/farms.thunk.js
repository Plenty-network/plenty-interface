import * as farmApis from "../../actions/farms/api.farms";
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
  unstakingOnFarmSuccessFull
} from "./farms.slice";

export const getFarmsData = (isActive) => (dispatch) => {
  let startDataFetching;
  let dataFetchingSuccessful;
  let dataFetchingFailed;

  if (isActive) {
    startDataFetching = startActiveFarmDataFetching
    dataFetchingSuccessful = activeFarmDataFetchingSuccesfull
    dataFetchingFailed = activeFarmDataFetchingFailed
  } else {
    startDataFetching = startInactiveFarmDataFetching
    dataFetchingSuccessful = inactiveFarmDataFetchingSuccesfull
    dataFetchingFailed = inactiveFarmDataFetchingFailed
  }

  dispatch(startDataFetching());
  farmApis
    .getFarmsData(isActive)
    .then((response) => {
      dispatch(dataFetchingSuccessful(response));
    })
    .catch((error) => {
      dispatch(dataFetchingFailed());
    });
};

export const stakeOnFarm = (amount, farmIdentifier, isActive, position) => (dispatch) => {
  dispatch(initiateStakingOperationOnFarm());
  farmApis
    .stakeFarm(amount, farmIdentifier, isActive, position)
    .then((response) => {
      dispatch(stakingOnFarmSuccessFull(response));
    })
    .catch((error) => {
      dispatch(stakingOnFarmFailed());
    })
    .finally(() => {
      setTimeout(
        () => dispatch(dismissSnackbar()),
        5000
      );
    });
};

export const unstakeOnFarm = (
  stakesToUnstake,
  farmIdentifier,
  isActive,
  position
) => (dispatch) => {
  dispatch(initiateUnstakingOperationOnFarm());
  farmApis
    .unstake(stakesToUnstake, farmIdentifier, isActive, position)
    .then((response) => {
      dispatch(unstakingOnFarmSuccessFull(response));
    })
    .catch((error) => {
      dispatch(unstakingOnFarmFailed());
    })
    .finally(() => {
      setTimeout(
        () => dispatch(dismissSnackbar()),
        5000
      )
    });
};

export const harvestOnFarm = (farmIdentifier, isActive, position) => {
  return (dispatch) => {
    dispatch(initiateHarvestingOperationOnFarm(farmIdentifier));
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