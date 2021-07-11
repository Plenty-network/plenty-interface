/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* @flow */
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
//import rootReducer from "../reducer/reducer";
import allReducers from "../reducer/reducer";

const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore);

const configureStore = function (initialState) {
  if (initialState === void 0) {
    initialState = {};
  }
  return createStoreWithMiddleware(allReducers, initialState);
};

export default configureStore;
