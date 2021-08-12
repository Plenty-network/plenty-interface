import React from "react";
import WrappedRoute from "./routes/routeWrapper";
import configureStore from "./redux/store/store";
import "./App.scss";

function App() {
  return (
    <>
      <WrappedRoute store={configureStore()} />
    </>
  );
}

export default App;
