import React from "react";
import WarppaedRoute from "./routes/routeWrapper";
import store from "./redux/store/store";

import "./App.scss";

function App() {
  return (
    <>
      <WarppaedRoute store={store} />
    </>
  );
}

export default App;
