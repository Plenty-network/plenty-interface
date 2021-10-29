export const tokensDataFetchingActions = {
  startTokensDataFetching: (state) => {
    state.tokensData = {
      isLoading: true,
      isPresent: false,
      data: {},
    };
  },
  tokensDataFetchingSuccessfull : (state,action) => {
    state.tokensData = {
      isLoading : false,
      isPresent : true,
      data : action.payload
    };
  },
  tokensDataFetchingFailed : (state) => {
    state.tokensData = {
      isLoading : false,
      isPresent : false,
      data : {}
    }
  }
};
