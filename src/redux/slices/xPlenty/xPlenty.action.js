export const xPlentyDataFetchingActions = {
  startxPlentyDataFetching: (state) => {
    state.xPlentyData = {
      isLoading: true,
      isPresent: false,
      data: {},
    };
  },
  xPlentyDataFetchingSuccessfull: (state, action) => {
    state.xPlentyData = {
      isLoading: false,
      isPresent: true,
      data: action.payload,
    };
  },
  xPlentyDataFetchingFailed: (state) => {
    state.xPlentyData = {
      isLoading: false,
      isPresent: false,
      data: {},
    };
  },
};

export const expectedPlentyActions = {
  setExpectedPlenty: (state, action) => {
    state.expectedPlenty = action.payload;
  },
};

export const expectedxPlentyActions = {
  setExpectedxPlenty: (state, action) => {
    state.expectedxPlenty = action.payload;
  },
};

export const transactionInjectionModalActions = {
  opentransactionInjectionModal: (state, action) => {
    state.isTransactionInjectionModalOpen = true;
    state.currentOpHash = action.payload;
  },
  closetransactionInjectionModal: (state) => {
    state.isTransactionInjectionModalOpen = false;
  },
};

export const toastActions = {
  openToastOnFail: (state) => {
    state.toastMessage = 'Transaction Failed';
    state.isInfoType = true;
    state.isToastOpen = true;
  },
  openToastOnSuccess: (state) => {
    state.toastMessage = 'Transaction Successfull';
    state.isInfoType = false;
    state.isToastOpen = true;
  },
  closeToast: (state) => {
    state.isToastOpen = false;
  },
};

export const buyingxPlentyActions = {
  initiateBuying: (state) => {
    state.xPlentyBuyingOperation = {
      processing: true,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },

  buyingSuccessfull: (state, action) => {
    state.xPlentyBuyingOperation = {
      processing: false,
      completed: true,
      failed: false,
      operationHash: action.payload.opHash,
    };
  },
  buyingFailed: (state) => {
    state.xPlentyBuyingOperation = {
      processing: false,
      completed: false,
      failed: true,
      operationHash: null,
    };
  },
  clearBuyingResponse: (state) => {
    state.xPlentyBuyingOperation = {
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },
};

export const sellingxPlentyActions = {
  initiateSelling: (state) => {
    state.xPlentySellingOperation = {
      processing: true,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },

  sellingSuccessfull: (state, action) => {
    state.xPlentySellingOperation = {
      processing: false,
      completed: true,
      failed: false,
      operationHash: action.payload.opHash,
    };
  },
  sellingFailed: (state) => {
    state.xPlentySellingOperation = {
      processing: false,
      completed: false,
      failed: true,
      operationHash: null,
    };
  },
  clearSellingResponse: (state) => {
    state.xPlentySellingOperation = {
      processing: false,
      completed: false,
      failed: false,
      operationHash: null,
    };
  },
};
