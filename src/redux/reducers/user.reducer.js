import * as actions from '../actions/index.action';

const initialState = {
  balances : {},
  balancesLoading : false, 
  stakes : {},
  stakesLoading : false 
}

const userReducer = (state = initialState , action) => {
  switch(action.type)
  {
    case actions.USER_BALANCES_FETCH_START:
      return {
        ...state,
        balancesLoading : true
      }
    case actions.USER_BALANCES_FETCH_SUCCESSFULL:
      return {
        ...state,
        balances : action.balances,
        balancesLoading : false
      }
    case actions.USER_BALANCES_FETCH_FAIL:
      return {
        ...state,
        balances : {},
        balancesLoading : false
      }
    case actions.USER_BALANCES_CLEAR:
      return {
        ...state,
        balances : {},
        balancesLoading : false
      }
    case actions.USER_STAKES_FETCH_START:
      return {
        ...state,
        stakesLoading : true,
      }
    case actions.USER_STAKES_FETCH_SUCCESSFULL:
      return {
        ...state,
        stakesLoading : false,
        stakes : action.data
      }
    case actions.USER_STAKES_FETCH_FAILED:
      return {
        ...state,
        stakesLoading : false,
        stakes : {}
      }
    case actions.USER_STAKES_CLEAR:
      return {
        ...state,
        stakesLoading : false,
        stakes : {}
      }
    default:
      return {
        ...state
      }
  }
}

export default userReducer;