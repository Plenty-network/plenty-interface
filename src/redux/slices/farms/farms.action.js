import { FARM_PAGE_MODAL } from "../../../constants/farmsPage";

export const activeFarmsActions = {
  startActiveFarmDataFetching: (state) => {
    state.active = {
      isPresent: false,
      loading: true,
    }
  },
  activeFarmDataFetchingSuccesfull: (state, action) => {
    state.data.active = Object.entries(action.payload).map(([ key, value ]) => ({id: key, ...value}))
    state.active = {
      isPresent: true,
      loading: false,
    }
  },
  activeFarmDataFetchingFailed: (state) => {
    state.active = {
      isPresent: false,
      loading: false,
    }
  },
  clearActiveFarmsData: (state) => {
    state.active = {
      isPresent: false,
      loading: false,
    }
  }
};

export const inactiveFarmsActions = {
  startInactiveFarmDataFetching: (state) => {
    state.inactive = {
      isPresent: false,
      loading: true,
    }
  },
  inactiveFarmDataFetchingSuccesfull: (state, action) => {
    state.data.inactive = Object.entries(action.payload).map(([ key, value ]) => ({id: key, ...value}))
    state.inactive = {
      isPresent: true,
      loading: false,
    }
  },
  inactiveFarmDataFetchingFailed: (state) => {
    state.active = {
      isPresent: false,
      loading: false,
    }
  },
  clearInactiveFarmsData: (state) => {
    state.inactive = {
      isPresent: false,
      loading: false,
    }
  }
}

export const stakingFarmsActions = {
  initiateStakingOperationOnFarm: (state) => {
    state.stakeOperation = {
      isLoading: true,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null
    }
  },

  stakingOnFarmProcessing: (state, action) => {
    state.modals.open = FARM_PAGE_MODAL.TRANSACTION_SUCCESS;
    state.modals.transactionId = action.payload.opHash;

    state.stakeOperation = {
      isLoading: false,
      processing: true,
      completed: false,
      failed: false,
      operationHash: null
    };
    state.isStakeModalOpen = false;
    state.stakeInputValue = "";
  },

  stakingOnFarmSuccessFull: (state, action) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: true,
      failed: false,
      operationHash: action.data
    }
    state.modals.snackbar = true
  },

  stakingOnFarmFailed: (state) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: true,
      operationHash: null
    };
    state.modals.snackbar = true
  },

  clearStakeFarmResponse: (state) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null
    }
  },
}

export const unstakingFarmsAction = {
  initiateUnstakingOperationOnFarm: (state, action) => {
    state.unstakeOperation = {
      isLoading: true,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null
    }
  },

  unstakingOnFarmProcessing: (state, action) => {
    state.modals.open = FARM_PAGE_MODAL.TRANSACTION_SUCCESS;
    state.modals.transactionId = action.payload.opHash;

    state.unstakeOperation = {
      isLoading: false,
      processing: true,
      completed: false,
      failed: false,
      operationHash: null
    };
    state.isUnstakeModalOpen = false;
  },

  unstakingOnFarmSuccessFull: (state, action) => {
    state.unstakeOperation = {
      isLoading: false,
      processing: false,
      completed: true,
      failed: false,
      operationHash: action.payload
    }
    state.modals.snackbar = true
  },

  unstakingOnFarmFailed: (state) => {
    state.unstakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: true,
      operationHash: null
    };
    state.modals.snackbar = true
  },

  clearUntakeFarmResponse: (state) => {
    state.stakeOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null
    }
  },
}

export const harvestFarmsAction = {
  initiateHarvestingOperationOnFarm: (state, action) => {
    state.harvestOperation = {
      isLoading: true,
      completed: false,
      failed: false,
      operationHash: null,
      tokenPair: action.payload.tokenPair
    }
  },

  harvestingOnFarmSuccessFull: (state, action) => {
    state.harvestOperation = {
      isLoading: false,
      completed: true,
      failed: false,
      operationHash: action.data,
      tokenPair: null,
    }
  },
  harvestingOnFarmFailed: (state) => {
    state.harvestOperation = {
      isLoading: false,
      completed: false,
      failed: true,
      operationHash: null,
      tokenPair: null,
    }
  },
  clearHarvestFarmResponse: (state) => {
    state.harvestOperation = {
      isLoading: false,
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
      tokenPair: null,
    }
  },
}

export const otherFarmsActions = {
  toggleFarmsType: (state, action) => {
    state.isActiveOpen = action.payload;
  },

  setFarmsToRender: (state, action) => {
    state.farmsToRender = action.payload
  },

  openFarmsStakeModal: (state, action) => {
    state.isStakeModalOpen = true;
    state.stakeModalIdentifier = action.data.identifier;
    state.stakeModalTitle = action.data.title;
    state.stakeModalFarmPosition = action.data.position;
    state.stakeModalContractAddress = action.data.contractAddress;
  },

  closeFarmsStakeModal: (state) => {
    state.isStakeModalOpen = false;
    state.stakeModalIdentifier = '';
    state.stakeModalTitle = '';
    state.stakeModalFarmPosition = -1;
    state.stakeModalContractAddress = '';
  },

  openFarmsUnstakeModal: (state, action) => {
    state.isUnstakeModalOpen = true;
    state.unstakeModalIdentifier = action.data.identifier;
    state.unstakeModalTitle = action.data.title;
    state.unstakeModalFarmPosition = action.data.position;
    state.unstakeModalContractAddress = action.data.contractAddress;
    state.unstakeModalwithdrawalFeeStructure = action.data.withdrawalFeeStructure;
  },

  closeFarmsUnstakeModal: (state) => {
    state.isStakeModalOpen = false;
    state.unstakeModalIdentifier = '';
    state.unstakeModalTitle = '';
    state.unstakeModalFarmPosition = -1;
    state.unstakeModalContractAddress = '';
    state.unstakeModalwithdrawalFeeStructure = []
  },

  openCloseFarmsModal: (state, action) => {
    state.modals = {...state.modals, ...action.payload}
  },

  dismissSnackbar: (state) => {
    state.modals.snackbar = false;
  }
}
