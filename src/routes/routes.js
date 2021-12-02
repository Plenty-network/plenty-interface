import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//Components
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from '../themes';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import useThemes from '../hooks/theme';
import OtherPages from '../Pages/OtherPages';

// * Lazy loading
const Swap = React.lazy(() => import('../Pages/Swap'));
const Farms = React.lazy(() => import('../Pages/Farms'));
const Ponds = React.lazy(() => import('../Pages/Ponds'));
const Pools = React.lazy(() => import('../Pages/Pools'));
const Tokens = React.lazy(() => import('../Pages/Tokens/Tokens'));
const Frontpage = React.lazy(() => import('../Pages/Frontpage/Frontpage'));
const Stake = React.lazy(() => import('../Pages/xPlenty'));

const MyRoutes = (props) => {
  const { theme, toggleTheme } = useThemes();

  const connectWallet = useCallback(async () => {
    if (props.userAddress === null) {
      return props.connectWallet();
    }
  }, [props.userAddress, props.connectWallet]);

  const disconnectUserWallet = useCallback(async () => {
    if (props.userAddress) {
      return props.disconnectWallet();
    }
  }, [props.userAddress, props.disconnectWallet]);

  const otherPageProps = useMemo(
    () => ({
      toggleTheme: toggleTheme,
      theme: theme,
      connectWallet: connectWallet,
      disconnectWallet: disconnectUserWallet,
      walletAddress: props.userAddress,
    }),
    [theme, toggleTheme, connectWallet, disconnectUserWallet],
  );

  useEffect(() => {
    return props.fetchWalletAddress();
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <BrowserRouter>
        <React.Suspense fallback={<div />}>
          <Routes>
            <Route
              path="/"
              exact
              element={
                <Frontpage
                  toggleTheme={toggleTheme}
                  theme={theme}
                  connecthWallet={connectWallet}
                  disconnectWallet={disconnectUserWallet}
                  walletAddress={props.userAddress}
                />
              }
            />

            <Route
              path={'/swap'}
              element={
                <OtherPages {...otherPageProps}>
                  <Swap walletAddress={props.userAddress} connecthWallet={connectWallet} />
                </OtherPages>
              }
            />
            <Route
              path="/liquidity/*"
              element={
                <OtherPages {...otherPageProps}>
                  <Swap walletAddress={props.userAddress} connecthWallet={connectWallet} />
                </OtherPages>
              }
            />
            <Route
              path="/farms"
              element={
                <OtherPages {...otherPageProps}>
                  <Farms walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
            <Route
              path="/pools"
              element={
                <OtherPages {...otherPageProps}>
                  <Pools walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
            <Route
              path="/ponds"
              element={
                <OtherPages {...otherPageProps}>
                  <Ponds walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
            <Route
              path="/stake"
              element={
                <OtherPages {...otherPageProps}>
                  <Stake walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
            <Route
              path="/tokens"
              element={
                <OtherPages {...otherPageProps}>
                  <Tokens walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

MyRoutes.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  fetchWalletAddress: PropTypes.any,
  userAddress: PropTypes.any,
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

export default connect(mapStateToProps, mapDispatchToProps)(MyRoutes);
