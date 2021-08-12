import * as actions from '../index.action';
import * as userApis from './api.user';

const userBalancesFetchStart = () => {
  return {
    type : actions.USER_BALANCES_FETCH_START
  }
}

const userBalancesFetchSuccessfull = (balances) => {
  return {
    type : actions.USER_BALANCES_FETCH_SUCCESSFULL,
    balances :balances
  }
}

const userBalancesFetchFail = () => {
  return {
    type : actions.USER_BALANCES_FETCH_FAIL
  }
}
export const userBalancesClear = () => {
  return {
    type : actions.USER_BALANCES_CLEAR
  }
}
export const fetchUserBalances = (addressOfUser) => {
  return dispatch => {
    dispatch(userBalancesFetchStart());
    userApis.getBalanceAmountForAllContracts(addressOfUser)
      .then(resp => {
        console.log(resp);
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


const userStakesFetchStart = () => {
  return {
    type : actions.USER_STAKES_FETCH_START
  }
}

const userStakesFetchSuccessfull = (data , type , isActive) => {
  return {
    type : actions.USER_STAKES_FETCH_SUCCESSFULL,
    data
  }
}

const userStakesFetchFailed = () => {
  return {
    type : actions.USER_STAKES_FETCH_FAILED
  }
}

export const userStakesClear = () => {
  return {
    type : actions.USER_STAKES_CLEAR
  }
}

export const getUserStakes = (addressOfUser, type , isActive) => {
  return dispatch => {
    dispatch(userStakesFetchStart());
    userApis.getStakedAmountForAllContracts(addressOfUser, type , isActive)
      .then(response => {
        console.log({response});
        dispatch(userStakesFetchSuccessfull(response.response))
      })
      .catch(error => {
        console.log(error)
        dispatch(userStakesFetchFailed())
      })
  }
}