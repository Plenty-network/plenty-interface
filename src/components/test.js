import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserDetails } from '../redux/actions/user/index.action';

export default function Test() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userState, setUserState] = useState({
    liquidity: 0,
    tvl: 0,
    tvlUser: 0,
    homePageTokenBalance: 0,
    homePageTokenPrice: 0,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveUserDetails(userState));
  };
  return (
    <React.Fragment>
      {user && (
        <div style={{ textAlign: 'center' }}>
          <h2>Liquidity : {user.liquidity}</h2>
          <h2>tvl : {user.tvl}</h2>
          <h2>tvlUser : {user.tvlUser}</h2>
          <h2>homePageTokenBalance : {user.homePageTokenBalance}</h2>
          <h2>homePageTokenPrice : {user.homePageTokenPrice}</h2>
        </div>
      )}
      <div style={{ textAlign: 'left' }}>
        <form onSubmit={handleSubmit}>
          <label>
            Liquidity:
            <input
              type="text"
              value={userState.liquidity}
              onChange={(e) => setUserState({ ...userState, liquidity: e.target.value })}
            />
          </label>
          <br />
          <label>
            tvl:
            <input
              type="text"
              value={userState.tvl}
              onChange={(e) => setUserState({ ...userState, tvl: e.target.value })}
            />
          </label>
          <br />
          <label>
            tvlUser:
            <input
              type="text"
              value={userState.tvlUser}
              onChange={(e) => setUserState({ ...userState, tvlUser: e.target.value })}
            />
          </label>
          <br />
          <label>
            homePageTokenBalance:
            <input
              type="text"
              value={userState.homePageTokenBalance}
              onChange={(e) =>
                setUserState({
                  ...userState,
                  homePageTokenBalance: e.target.value,
                })
              }
            />
          </label>
          <br />
          <label>
            homePageTokenPrice:
            <input
              type="text"
              value={userState.homePageTokenPrice}
              onChange={(e) =>
                setUserState({
                  ...userState,
                  homePageTokenPrice: e.target.value,
                })
              }
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </React.Fragment>
  );
}
