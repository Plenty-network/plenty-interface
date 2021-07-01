import React from "react";
import { Provider } from "react-redux";
import Routes from "./routes";
import configureStore from "../store/index";

const WarppaedRoute = () => {
  return (
    <Provider store={configureStore}>
      <Routes />
    </Provider>
  );
};

export default WarppaedRoute;
