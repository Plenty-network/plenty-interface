import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useState } from "react";

//Redux Actions
import { saveUserDetails } from "./store/actions/user.actions";
function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userState, setUserState] = useState({
    name: "",
    lastName: "",
    mobileNumber: "",
    address: "",
  });
  const handleSubmit = () => {
    dispatch(saveUserDetails(userState));
  };
  return (
    <React.Fragment>
      <div style={{ textAlign: "center" }}>
        <h2>Name : {user.name}</h2>
        <h2>Lastname : {user.lastName}</h2>
        <h2>Mobile Number : {user.mobileNumber}</h2>
        <h2>Addess : {user.address}</h2>
      </div>
      <div style={{ textAlign: "left" }}>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type='text'
              value={userState.name}
              onChange={(e) =>
                setUserState({ ...userState, name: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            Lastname:
            <input
              type='text'
              value={userState.lastName}
              onChange={(e) =>
                setUserState({ ...userState, lastName: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            Mobile Number:
            <input
              type='text'
              value={userState.mobileNumber}
              onChange={(e) =>
                setUserState({ ...userState, mobileNumber: e.target.value })
              }
            />
          </label>
          <br />
          <label>
            Address:
            <input
              type='text'
              value={userState.address}
              onChange={(e) =>
                setUserState({ ...userState, address: e.target.value })
              }
            />
          </label>
          <br />
          <input type='submit' value='Submit' />
        </form>
      </div>
    </React.Fragment>
  );
}

export default App;
