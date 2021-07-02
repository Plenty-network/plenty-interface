import React from "react";
import { Provider } from "react-redux";
import Routes from "./routes";
//import configureStore from "../store/index";

const WarppaedRoute = (props) => {
  return (
    <Provider store={props.store}>
      <Routes />
    </Provider>
  );
};

export default WarppaedRoute;
