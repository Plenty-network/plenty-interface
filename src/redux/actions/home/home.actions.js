import * as actions from '../index.action';
import * as homeApis from './api.home';
import CONFIG from '../../../config/config';
import store from '../../store/store';

export const getHomeStatsData = () => {
  return (dispatch) => {
    dispatch({ type: actions.HOME_STATS_FETCH });
    homeApis
      .getHomeStatsDataApi()
      .then((res) => {
        if (res.success) {
          dispatch({
            type: actions.HOME_STATS_FETCH_SUCCESS,
            data: res.data,
          });
        } else {
          throw 'Error in home stats api';
        }
      })
      .catch(() => {
        // console.log(error)
        dispatch({ type: actions.HOME_STATS_FETCH_FAILED });
      });
  };
};

export const getTVL = () => {
  return (dispatch) => {
    dispatch({ type: actions.TVL_FETCH });
    homeApis
      .getTVLHelper()
      .then((res) => {
        if (res.success) {
          dispatch({ type: actions.TVL_FETCH_SUCCESS, data: res.data });
        } else {
          throw 'Error in TVL api';
        }
      })
      .catch(() => {
        // console.log(error)
        dispatch({ type: actions.TVL_FETCH_FAILED });
      });
  };
};

export const getPlentyToHarvest = (addressOfUser) => {
  return (dispatch) => {
    dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH });
    homeApis
      .plentyToHarvestHelper(addressOfUser)
      .then((res) => {
        if (res.success) {
          dispatch({
            type: actions.PLENTY_TO_HARVEST_FETCH_SUCCESS,
            data: res.data,
          });
        } else {
          const errorMessage = 'Error in plentyToHarvestHelper';
          throw errorMessage;
        }
      })
      .catch(() => {
        dispatch({ type: actions.PLENTY_TO_HARVEST_FETCH_FAILED });
      });
  };
};

export const getPlentyBalanceOfUser = (userAddress) => {
  return (dispatch) => {
    dispatch({ type: actions.PLENTY_BALANCE_FETCH });
    const packedKey = homeApis.getPackedKey(0, userAddress, 'FA1.2');
    const connectedNetwork = CONFIG.NETWORK;
    const balancePromises = [];
    balancePromises.push(
      homeApis.getBalanceAmount(
        CONFIG.TOKEN_CONTRACTS[connectedNetwork]['PLENTY'].mapId,
        packedKey,
        'PLENTY',
        CONFIG.TOKEN_CONTRACTS[connectedNetwork]['PLENTY'].decimal,
      ),
    );

    balancePromises.push(
      homeApis.getBalanceAmount(
        CONFIG.TOKEN_CONTRACTS[connectedNetwork]['xPLENTY'].mapId,
        packedKey,
        'xPLENTY',
        CONFIG.TOKEN_CONTRACTS[connectedNetwork]['xPLENTY'].decimal,
      ),
    );
    Promise.all(balancePromises)
      .then((res) => {
        dispatch({
          type: actions.PLENTY_BALANCE_FETCH_SUCCESS,
          data: { PLENTY: res[0].balance, xPLENTY: res[1].balance },
        });
      })
      .catch(() => {
        dispatch({ type: actions.PLENTY_BALANCE_FETCH_FAILED });
      });
  };
};

const dispatchHarvestAllProcessing = (batchOperation) => {
  store.dispatch({
    type: actions.HARVEST_ALL_PROCESSING,
    payload: batchOperation,
  });
};

export const harvestAll = (userAddress) => {
  return (dispatch) => {
    dispatch({ type: actions.HARVEST_ALL_INITIATION });
    homeApis
      .harvestAllHelper(userAddress, dispatchHarvestAllProcessing)
      .then((res) => {
        if (res.success) {
          dispatch({
            type: actions.HARVEST_ALL_SUCCESS,
            payload: res.batchConfirm,
          }); // snack transaction success
          dispatch(getPlentyToHarvest(userAddress));
          dispatch(getPlentyBalanceOfUser(userAddress));
        } else {
          throw res.error;
        }
      })
      .catch((error) => {
        dispatch({ type: actions.HARVEST_ALL_FAILED, payload: error });
      })
      .finally(() => {
        setTimeout(() => {
          dispatch({
            type: actions.OPEN_CLOSE_HOME_MODAL,
            payload: { snackbar: false },
          });
        }, 5000);
      });
  };
};

export const getTVLOfUser = (userAddress) => {
  return (dispatch) => {
    dispatch({ type: actions.USER_TVL_FETCH });
    homeApis
      .getTVLOfUserHelper(userAddress)
      .then((res) => {
        if (res.success) {
          dispatch({ type: actions.USER_TVL_FETCH_SUCCESS, data: res.data });
        } else {
          throw res.error;
        }
      })
      .catch(() => {
        // console.log(error)
        dispatch({ type: actions.USER_TVL_FETCH_FAILED });
      });
  };
};

export const onModalOpenClose = (payload) => ({
  type: actions.OPEN_CLOSE_HOME_MODAL,
  payload: payload,
});
