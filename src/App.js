import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useState } from "react";
import Routes from "./routes/routeWrapper";

//Redux Actions
import { saveUserDetails } from "./store/actions/user.actions";
function App() {
  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
