import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
//import thunk from "redux-thunk";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import rootReducer from "./reducers/index";

// const persistConfig = {
//   key: "root",
//   storage: storage,
//   stateReconciler: autoMergeLevel2,
// };

// const persistantReducer = persistReducer(persistConfig, rootReducer);
// export const store = createStore(
//   persistantReducer,
//   composeWithDevTools(applyMiddleware(thunk))
// );

// export const persistor = persistStore(store);

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

const configureStore = function (initialState) {
  if (initialState === void 0) {
    initialState = {};
  }
  return createStoreWithMiddleware(rootReducer, initialState);
};

export default configureStore;
