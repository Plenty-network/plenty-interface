import { combineReducers } from "redux";
/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

import { walletAddress } from "./wallet/wallet.reducer";
import userReducer from "./user/user.reducer";
const allReducers = combineReducers({
  wallet: walletAddress,
  user: userReducer,
});

export default allReducers;
