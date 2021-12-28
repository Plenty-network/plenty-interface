import { createSlice } from '@reduxjs/toolkit';
import { FARM_PAGE_MODAL } from '../../../constants/farmsPage';
import {
  activeFarmsActions,
  commonFarmsAction,
  harvestFarmsAction,
  inactiveFarmsActions,
  otherFarmsActions,
  stakingFarmsActions,
  unstakingFarmsAction,
} from './farms.action';

const initialState = {
  data: {
    active: [],
    inactive: [],
  },
  active: {
    isPresent: false,
    loading: false,
  },
  inactive: {
    isPresent: false,
    loading: false,
  },
  stakeOperation: {
    isLoading: false,
    processing: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
  unstakeOperation: {
    isLoading: false,
    processing: false,
    completed: false,
    failed: false,
    operationHash: null,
  },
  harvestOperation: {
    isLoading: false,
    completed: false,
    failed: false,
    operationHash: null,
    tokenPair: null,
  },
  modals: {
    open: FARM_PAGE_MODAL.NULL,
    contractAddress: null,
    transactionId: '',
    snackbar: false,
    withdrawalFeeType: [],
    roiTable: [],
  },
  stakeModal: {
    open: false,
    identifier: '',
    title: '',
    contractAddress: '',
    position: -1,
  },
  unstakeModal: {
    open: false,
    identifier: '',
    title: '',
    contractAddress: '',
    withdrawalFeeStructure: [],
  },
  isActiveOpen: true,
  isStakedOnlyOpen: false,
};

export const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    ...commonFarmsAction,
    ...activeFarmsActions,
    ...inactiveFarmsActions,
    ...stakingFarmsActions,
    ...unstakingFarmsAction,
    ...harvestFarmsAction,
    ...otherFarmsActions,
  },
});

export const {
  // * Common Farms
  populateEmptyFarmsData,

  // * Active Farms
  startActiveFarmDataFetching,
  activeFarmDataFetchingSuccesfull,
  activeFarmDataFetchingFailed,
  clearActiveFarmsData,

  // * Inactive Farms
  startInactiveFarmDataFetching,
  inactiveFarmDataFetchingSuccesfull,
  inactiveFarmDataFetchingFailed,
  clearInactiveFarmsData,

  // * Stake Farms
  initiateStakingOperationOnFarm,
  stakingOnFarmProcessing,
  stakingOnFarmSuccessFull,
  stakingOnFarmFailed,
  clearStakeFarmResponse,

  // * Unstaking Farms
  initiateUnstakingOperationOnFarm,
  unstakingOnFarmProcessing,
  unstakingOnFarmSuccessFull,
  unstakingOnFarmFailed,
  clearUntakeFarmResponse,

  // * Harvest Farms
  initiateHarvestingOperationOnFarm,
  harvestingOnFarmSuccessFull,
  harvestingOnFarmFailed,
  clearHarvestFarmResponse,

  // * Other Farms
  toggleFarmsType,
  toggleStakedFarmsOnly,
  setFarmsToRender,
  openFarmsStakeModal,
  closeFarmsStakeModal,
  openFarmsUnstakeModal,
  closeFarmsUnstakeModal,
  openCloseFarmsModal,
  dismissSnackbar,
} = farmsSlice.actions;

export default farmsSlice.reducer;
