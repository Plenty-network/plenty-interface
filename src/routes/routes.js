import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Components
import Header from "../Components/Header/Header";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../themes";
import { useEffect } from "react";
import { connect } from "react-redux";
import * as walletActions from "../redux/actions/wallet/wallet.action";
import useThemes from "../apis/hooks/theme";

// * Lazy loading
const Swap = React.lazy(() => import("../Pages/Swap"));
const Farms = React.lazy(() => import("../Pages/Farms"));
const Ponds = React.lazy(() => import("../Pages/Ponds"));
const Pools = React.lazy(() => import("../Pages/Pools"));
const Tokens = React.lazy(() => import("../Pages/Tokens/Tokens"));
const Frontpage = React.lazy(() => import("../Pages/Frontpage/Frontpage"));
const Stake = React.lazy(() => import("../Pages/xPlenty"));

const Routes = (props) => {
  const { theme, toggleTheme } = useThemes();

  const connectWallet = async () => {
    if (props.userAddress === null) {
      return props.connectWallet();
    }
  };

  const disconnectUserWallet = async () => {
    if (props.userAddress) {
      return props.disconnectWallet();
    }
  };

  useEffect(() => {
    return props.fetchWalletAddress();
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <React.Suspense fallback={<div />}>
        <Router>
          <Switch>
            <Route path="/" exact>
              <Frontpage
                toggleTheme={toggleTheme}
                theme={theme}
                connecthWallet={connectWallet}
                disconnectWallet={disconnectUserWallet}
                walletAddress={props.userAddress}
              />
            </Route>
            <Route path="/tokens">
              <Tokens
                toggleTheme={toggleTheme}
                theme={theme}
                connecthWallet={connectWallet}
                disconnectWallet={disconnectUserWallet}
                walletAddress={props.userAddress}
              />
            </Route>
            <div>
              <Header
                toggleTheme={toggleTheme}
                theme={theme}
                connecthWallet={connectWallet}
                disconnectWallet={disconnectUserWallet}
                walletAddress={props.userAddress}
              />

              <Route path="/swap">
                <Swap
                  walletAddress={props.userAddress}
                  connecthWallet={connectWallet}
                />
              </Route>
              <Route path="/liquidity">
                <Swap
                  walletAddress={props.userAddress}
                  connecthWallet={connectWallet}
                />
              </Route>
              <Route path="/farms">
                <Farms walletAddress={props.userAddress} />
              </Route>
              <Route path="/pools">
                <Pools walletAddress={props.userAddress} />
              </Route>
              <Route path="/ponds">
                <Ponds walletAddress={props.userAddress} />
              </Route>
              <Route path="/stake">
                <Stake walletAddress={props.userAddress} />
              </Route>
            </div>
          </Switch>
        </Router>
      </React.Suspense>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    userAddress: state.wallet.address,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    disconnectWallet: () => dispatch(walletActions.disconnectWallet()),
    fetchWalletAddress: () => dispatch(walletActions.fetchWalletAddress()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
