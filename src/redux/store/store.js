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
import tokensApi from '../slices/tokens/tokens.query';

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
  [tokensApi.reducerPath]: tokensApi.reducer,
};

//const store = createStore(rootReducer);
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokensApi.middleware),
});

export default store;
