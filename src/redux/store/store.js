import {createStore,applyMiddleware , compose , combineReducers} from 'redux';
import thunk from 'redux-thunk';

import userReducer from '../reducers/user.reducer';
import walletReducer from '../reducers/wallet.reducer';
import swapReducer from '../reducers/swap.reducer';
import farmsReducer from '../reducers/farms.reducer';
import pondsReducer from '../reducers/ponds.reducer';
import poolsReducer from '../reducers/pools.reducer';
import priceReducer from '../reducers/price.reducer';
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  user : userReducer,
  wallet : walletReducer,
  swap : swapReducer,
  farms : farmsReducer,
  pools : poolsReducer,
  ponds : pondsReducer,
  price : priceReducer
})

//const store = createStore(rootReducer);
const store = createStore(rootReducer , composeEnhancer(applyMiddleware(thunk)));

export default store;