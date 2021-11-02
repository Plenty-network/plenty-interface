export const tokensDataFetchingActions = {
  startTokensDataFetching: (state) => {
    state.tokensData.isLoading = true;
    state.tokensData.isPresent = true;
  },

  tokensDataFetchingSuccessfull: (state, action) => {
    state.tokensData.isLoading = false;
    state.tokensData.isPresent = true;
    state.tokensData.isError = false;
    state.tokensData.data = action.payload;
    state.tokensData.update += 1;
  },
  tokensDataFetchingFailed: (state) => {
    state.tokensData.isLoading = false;
    state.tokensData.isPresent = false;
    state.tokensData.isError = false;
  },
};
