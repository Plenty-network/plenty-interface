import * as actions from '../index.action';
import * as userApis from './api.user';

const userBalancesFetchStart = () => {
  return {
    type: actions.USER_BALANCES_FETCH_START,
  };
};

const userBalancesFetchSuccessfull = (balances) => {
  return {
    type: actions.USER_BALANCES_FETCH_SUCCESSFULL,
    balances: balances,
  };
};

const userBalancesFetchFail = () => {
  return {
    type: actions.USER_BALANCES_FETCH_FAIL,
  };
};
export const userBalancesClear = () => {
  return {
    type: actions.USER_BALANCES_CLEAR,
  };
};
export const fetchUserBalances = (addressOfUser) => {
  return (dispatch) => {
    dispatch(userBalancesFetchStart());
    userApis
      .getBalanceAmountForAllContracts(addressOfUser)
      .then((resp) => {
        if (resp.success === true) {
          dispatch(userBalancesFetchSuccessfull(resp.response));
        } else {
          dispatch(userBalancesFetchFail());
        }
      })
      .catch(() => {
        dispatch(userBalancesFetchFail());
      });
  };
};

const userStakesFetchStart = () => {
  return {
    type: actions.USER_STAKES_FETCH_START,
  };
};

const userStakesFetchSuccessfull = (data, block) => {
  return {
    type: actions.USER_STAKES_FETCH_SUCCESSFULL,
    data,
    block,
  };
};

const userStakesFetchFailed = () => {
  return {
    type: actions.USER_STAKES_FETCH_FAILED,
  };
};

export const userStakesClear = () => {
  return {
    type: actions.USER_STAKES_CLEAR,
  };
};

export const getUserStakes = (addressOfUser, type, isActive) => {
  return (dispatch) => {
    dispatch(userStakesFetchStart());
    userApis
      .getStakedAmountForAllContracts(addressOfUser, type, isActive)
      .then((response) => {
        dispatch(userStakesFetchSuccessfull(response.response, response.currentBlock));
      })
      .catch(() => {
        dispatch(userStakesFetchFailed());
      });
  };
};

const harvestValueFetchStart = () => {
  return {
    type: actions.HARVEST_VALUE_FETCH_START,
  };
};

const harvestValueFetchSuccessfull = (data, type, isActive) => {
  if (type === 'FARMS') {
    return {
      type: actions.HARVEST_VALUE_FARMS_FETCH_SUCCESSFULL,
      data: {
        data,
        isActive,
      },
    };
  } else if (type === 'POOLS') {
    return {
      type: actions.HARVEST_VALUE_POOLS_FETCH_SUCCESSFULL,
      data: {
        data,
        isActive,
      },
    };
  } else if (type === 'PONDS') {
    return {
      type: actions.HARVEST_VALUE_PONDS_FETCH_SUCCESSFULL,
      data: {
        data,
        isActive,
      },
    };
  }
};

const harvestValueFetchFailed = () => {
  return {
    type: actions.HARVEST_VALUE_FETCH_FAILED,
  };
};

export const getHarvestValues = (addressOfUser, type, isActive) => {
  return (dispatch) => {
    dispatch(harvestValueFetchStart());
    userApis
      .getHarvestValue(addressOfUser, type, isActive)
      .then((response) => {
        dispatch(harvestValueFetchSuccessfull(response.response, type, isActive));
      })
      .catch(() => {
        dispatch(harvestValueFetchFailed());
      });
  };
};

export const harvestValuesClear = () => {
  return (dispatch) => {
    dispatch({
      type: actions.HARVEST_VALUE_CLEAR,
    });
  };
};
