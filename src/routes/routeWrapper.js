import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import Routes from "./routes";
//import configureStore from "../store/index";
import FirstTimeDisclaimer from "../Pages/FirstTimeDisclaimer/FirstTimeDisclaimer";
import { FIRST_TIME_DISCLAIMER } from "../constants/localStorage";


const WrappedRoute = (props) => {
  const [isDisclaimerAccepted, setDisclaimerAccepted] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(FIRST_TIME_DISCLAIMER) === "true") {
      setDisclaimerAccepted(true)
    }
  }, [])

  return (
    <Provider store={props.store}>
      {
        isDisclaimerAccepted
          ? <Routes />
          : <FirstTimeDisclaimer />
      }
    </Provider>
  );
};

export default WrappedRoute;
