import { createStore, applyMiddleware, compose, combineReducers } from "redux"
import thunk from "redux-thunk"

import userReducer from "../Reducers/user.reducer"
import walletReducer from "../Reducers/wallet.reducer"
import swapReducer from "../Reducers/swap.reducer"
import farmsReducer from "../Reducers/farms.reducer"
import pondsReducer from "../Reducers/ponds.reducer"
import poolsReducer from "../Reducers/pools.reducer"
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
	user: userReducer,
	wallet: walletReducer,
	swap: swapReducer,
	farms: farmsReducer,
	pools: poolsReducer,
	ponds: pondsReducer,
})

//const store = createStore(rootReducer);
const store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunk)))

export default store
