import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/user.reducer';
import walletReducer from '../reducers/wallet.reducer';
import swapReducer from '../reducers/swap.reducer';
// import farmsReducer from '../reducers/farms.reducer';
import pondsReducer from '../reducers/ponds.reducer';
import poolsReducer from '../reducers/pools.reducer';
import priceReducer from '../reducers/price.reducer';
import homeReducer from '../reducers/home.reducers';
import settingsReducer from '../slices/settings/settings.slice';

import farmsReducer from '../slices/farms/farms.slice';
import xPlentyReducer from '../slices/xPlenty/xPlenty.slice';

const rootReducer = {
  user: userReducer,
  wallet: walletReducer,
  swap: swapReducer,
  farms: farmsReducer,
  pools: poolsReducer,
  ponds: pondsReducer,
  price: priceReducer,
  home: homeReducer,
  settings: settingsReducer,
  xPlenty: xPlentyReducer,
};

//const store = createStore(rootReducer);
const store = configureStore({ reducer: rootReducer });

export default store;
