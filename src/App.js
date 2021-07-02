import React from "react";
import WarppaedRoute from "./routes/routeWrapper";
import configureStore from "./redux/store/store";

function App() {
  return (
    <div>
      <WarppaedRoute store={configureStore()} />
    </div>
  );
}

export default App;
