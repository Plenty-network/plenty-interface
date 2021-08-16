import {USER_BALANCES_FETCH_START, USER_BALANCES_FETCH_SUCCESSFULL, USER_BALANCES_FETCH_FAIL,USER_BALANCES_CLEAR} from '../index.action';
import {fetchAllWalletBalance} from './api.user';

const userBalancesFetchStart = () => {
  return {
    type : USER_BALANCES_FETCH_START
  }
}

const userBalancesFetchSuccessfull = (balances) => {
  return {
    type : USER_BALANCES_FETCH_SUCCESSFULL,
    balances :balances
  }
}

const userBalancesFetchFail = () => {
  return {
    type : USER_BALANCES_FETCH_FAIL
  }
}
export const userBalancesClear = () => {
  return {
    type : USER_BALANCES_CLEAR
  }
}
export const fetchUserBalances = (addressOfUser) => {
  return dispatch => {
    dispatch(userBalancesFetchStart());
    fetchAllWalletBalance(addressOfUser)
      .then(resp => {
        if(resp.success === true)
        {
          dispatch(userBalancesFetchSuccessfull(resp.response))
        }
        else
        {
          dispatch(userBalancesFetchFail())
        }
      })
      .catch(err => {
        dispatch(userBalancesFetchFail())
      })
  }
}

