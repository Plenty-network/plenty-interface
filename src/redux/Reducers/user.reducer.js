import {USER_BALANCES_FETCH_START, USER_BALANCES_FETCH_SUCCESSFULL, USER_BALANCES_FETCH_FAIL, USER_BALANCES_CLEAR} from '../Actions/index.action';

const initialState = {
  balances : {},
  balancesLoading : false,  
}

const userReducer = (state = initialState , action) => {
  switch(action.type)
  {
    case USER_BALANCES_FETCH_START:
      return {
        ...state,
        balancesLoading : true
      }
    case USER_BALANCES_FETCH_SUCCESSFULL:
      return {
        ...state,
        balances : action.balances,
        balancesLoading : false
      }
    case USER_BALANCES_FETCH_FAIL:
      return {
        ...state,
        balances : {},
        balancesLoading : false
      }
    case USER_BALANCES_CLEAR:
      return {
        ...state,
        balances : {},
        balancesLoading : false
      }
    default:
      return {
        ...state
      }
  }
}

export default userReducer;