import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/user.reducer';
import walletReducer from '../reducers/wallet.reducer';
import swapReducer from '../reducers/swap.reducer';

import priceReducer from '../reducers/price.reducer';
import homeReducer from '../reducers/home.reducers';
import govReducer from '../reducers/gov.reducers';
import settingsReducer from '../slices/settings/settings.slice';

import farmsReducer from '../slices/farms/farms.slice';
import xPlentyReducer from '../slices/xPlenty/xPlenty.slice';
import analyticsQueries from '../queries/analytics/analyticsQueries';

const rootReducer = {
  user: userReducer,
  wallet: walletReducer,
  swap: swapReducer,
  farms: farmsReducer,
  price: priceReducer,
  home: homeReducer,
  settings: settingsReducer,
  xPlenty: xPlentyReducer,
  governance: govReducer,
  [analyticsQueries.reducerPath]: analyticsQueries.reducer,
};

//const store = createStore(rootReducer);
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(analyticsQueries.middleware),
});

export default store;
