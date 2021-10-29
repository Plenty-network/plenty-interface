import {fetchTokensData} from './tokens.api'

import { startTokensDataFetching, tokensDataFetchingSuccessfull, tokensDataFetchingFailed } from './tokens.slice'

export const tokenFetchingThunk = () => (dispatch) => {
  console.log('Thunk Called');
  dispatch(startTokensDataFetching());
  
  fetchTokensData()
    .then(response => {
      if(response.success)
      {
        dispatch(tokensDataFetchingSuccessfull(response.tokensData));
      }
      else
      {
        dispatch(tokensDataFetchingFailed());
      }
    })
    .catch(error => {
      console.log(error);
      dispatch(tokensDataFetchingFailed());
    })
}