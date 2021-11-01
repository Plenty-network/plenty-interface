export const tokensDataFetchingActions = {
  startTokensDataFetching: (state) => {
    // state.tokensData = {
    //   isLoading: true,
    //   isPresent: false,
    // };
    state.tokensData.isLoading = true;
    state.tokensData.isPresent = true;
  },

  tokensDataFetchingSuccessfull: (state, action) => {
    // state.tokensData = {
    //   isLoading: false,
    //   isPresent: true,
    //   data: action.payload,
    // };
    state.tokensData.isLoading = false;
    state.tokensData.isPresent = true;
    state.tokensData.isError = false;
    state.tokensData.data = action.payload;
  },
  tokensDataFetchingFailed: (state) => {
    // state.tokensData = {
    //   isLoading: false,
    //   isPresent: false,
    //   data: [],
    // };
    state.tokensData.isLoading = false;
    state.tokensData.isPresent = false;
    state.tokensData.isError = false;
  },
};
