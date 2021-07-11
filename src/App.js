import React from "react";
import WarppaedRoute from "./routes/routeWrapper";
import configureStore from "./redux/store/store";

import "./App.scss";

function App() {
  return (
    <>
      <WarppaedRoute store={configureStore()} />
    </>
  );
}

export default App;
