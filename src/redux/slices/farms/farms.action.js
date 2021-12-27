import { FARM_PAGE_MODAL } from '../../../constants/farmsPage';

export const commonFarmsAction = {
  populateEmptyFarmsData: (state, action) => {
    state.data = action.payload;
  },
};

export const activeFarmsActions = {
  startActiveFarmDataFetching: (state) => {
    state.active = {
      isPresent: false,
      loading: true,
    };
  },
  activeFarmDataFetchingSuccesfull: (state, action) => {
    state.data.active = state.data.active.map((x) => ({
      ...x,
      values: action.payload[x.farmData.CONTRACT],
    }));

    state.active = {
      isPresent: true,
      loading: false,
    };
  },
  activeFarmDataFetchingFailed: (state) => {
    state.active = {
      isPresent: false,
      loading: false,
    };
  },
  clearActiveFarmsData: (state) => {
    state.active = {
      isPresent: false,
      loading: false,
    };
  },
};

export const inactiveFarmsActions = {
  startInactiveFarmDataFetching: (state) => {
    state.inactive = {
      isPresent: false,
      loading: true,
    };
  },
  inactiveFarmDataFetchingSuccesfull: (state, action) => {
    state.data.inactive = state.data.inactive.map((x) => ({
      ...x,
      values: action.payload[x.farmData.CONTRACT],
    }));
    state.inactive = {
      isPresent: true,
      loading: false,
    };
  },
  inactiveFarmDataFetchingFailed: (state) => {
    state.active = {
      isPresent: false,
      loading: false,
    };
  },
  clearInactiveFarmsData: (state) => {
    state.inactive = {
      isPresent: false,
      loading: false,
    };
  },
};

export const stakingFarmsActions = {
  initiateStakingOperationOnFarm: (state) => {
    state.stakeOperation = {
      isLoading: true,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },

  stakingOnFarmProcessing: (state, action) => {
    state.modals.open = FARM_PAGE_MODAL.TRANSACTION_SUCCESS;
    state.modals.transactionId = action.payload.opHash;
    state.modals.snackbar = true;

    state.stakeModal = {
      open: false,
      identifier: '',
      title: '',
      contractAddress: '',
      position: -1,
    };

    state.stakeOperation = {
      isLoading: false,
      processing: true,
      completed: false,
      failed: false,
      operationHash: null,
    };
    state.isStakeModalOpen = false;
    state.stakeInputValue = '';
  },

  stakingOnFarmSuccessFull: (state, action) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: true,
      failed: false,
      operationHash: action.payload,
    };
    state.modals.snackbar = true;
  },

  stakingOnFarmFailed: (state) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: true,
      operationHash: null,
    };
    state.modals.snackbar = true;
  },

  clearStakeFarmResponse: (state) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },
};

export const unstakingFarmsAction = {
  initiateUnstakingOperationOnFarm: (state) => {
    state.unstakeOperation = {
      isLoading: true,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },

  unstakingOnFarmProcessing: (state, action) => {
    state.modals.open = FARM_PAGE_MODAL.TRANSACTION_SUCCESS;
    state.modals.transactionId = action.payload.opHash;
    state.modals.snackbar = true;

    state.unstakeModal = {
      open: false,
      identifier: '',
      title: '',
      contractAddress: '',
      withdrawalFeeStructure: [],
      position: -1,
    };

    state.unstakeOperation = {
      isLoading: false,
      processing: true,
      completed: false,
      failed: false,
      operationHash: null,
    };
    state.isUnstakeModalOpen = false;
  },

  unstakingOnFarmSuccessFull: (state, action) => {
    state.unstakeOperation = {
      isLoading: false,
      processing: false,
      completed: true,
      failed: false,
      operationHash: action.payload,
    };
    state.modals.snackbar = true;
  },

  unstakingOnFarmFailed: (state) => {
    state.unstakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: true,
      operationHash: null,
    };
    state.modals.snackbar = true;
  },

  clearUntakeFarmResponse: (state) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },
};

export const harvestFarmsAction = {
  initiateHarvestingOperationOnFarm: (state, action) => {
    state.harvestOperation = {
      isLoading: true,
      completed: false,
      failed: false,
      operationHash: null,
      tokenPair: action.payload,
    };
  },

  harvestingOnFarmSuccessFull: (state, action) => {
    state.harvestOperation = {
      isLoading: false,
      completed: true,
      failed: false,
      operationHash: action.payload,
      tokenPair: null,
    };
  },
  harvestingOnFarmFailed: (state) => {
    state.harvestOperation = {
      isLoading: false,
      completed: false,
      failed: true,
      operationHash: null,
      tokenPair: null,
    };
  },
  clearHarvestFarmResponse: (state) => {
    state.harvestOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
      tokenPair: null,
    };
  },
};

export const otherFarmsActions = {
  toggleFarmsType: (state, action) => {
    state.isActiveOpen = action.payload;
  },

  toggleStakedFarmsOnly: (state, action) => {
    state.isStakedOnlyOpen = action.payload;
  },

  setFarmsToRender: (state, action) => {
    state.farmsToRender = action.payload;
  },

  openFarmsStakeModal: (state, action) => {
    state.stakeModal = {
      open: true,
      identifier: action.payload.identifier,
      title: action.payload.title,
      contractAddress: action.payload.contractAddress,
      position: action.payload.position,
    };
  },

  closeFarmsStakeModal: (state) => {
    state.stakeModal = {
      open: false,
      identifier: '',
      title: '',
      contractAddress: '',
      position: -1,
    };
  },

  openFarmsUnstakeModal: (state, action) => {
    state.unstakeModal = {
      open: true,
      identifier: action.payload.identifier,
      title: action.payload.title,
      contractAddress: action.payload.contractAddress,
      withdrawalFeeStructure: action.payload.withdrawalFeeStructure,
      position: action.payload.position,
    };
  },

  closeFarmsUnstakeModal: (state) => {
    state.unstakeModal = {
      open: false,
      identifier: '',
      title: '',
      contractAddress: '',
      withdrawalFeeStructure: [],
      position: -1,
    };
  },

  openCloseFarmsModal: (state, action) => {
    state.modals = { ...state.modals, ...action.payload };
  },

  dismissSnackbar: (state) => {
    state.modals.snackbar = false;
  },
};
