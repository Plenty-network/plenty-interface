import PropTypes from 'prop-types';
import React from 'react';
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
const Tokens = React.lazy(() => import('../Pages/Tokens/Tokens'));
const Liquidity = React.lazy(() => import('../Pages/Liquidity'));
const Frontpage = React.lazy(() => import('../Pages/Frontpage/Frontpage'));
const Stake = React.lazy(() => import('../Pages/xPlenty'));
const Governance = React.lazy(() => import('../Pages/Governance/Governance'));

const MyRoutes = (props) => {
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

  const otherPageProps = {
    toggleTheme: toggleTheme,
    theme: theme,
    connectWallet: connectWallet,
    disconnectWallet: disconnectUserWallet,
    walletAddress: props.userAddress,
  };

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
              path={'/'}
              element={
                <OtherPages {...otherPageProps}>
                  <Frontpage
                    walletAddress={props.userAddress}
                    connecthWallet={connectWallet}
                    {...otherPageProps}
                  />
                </OtherPages>
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
                  <Farms walletAddress={props.userAddress} {...otherPageProps} />
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
            <Route
              path="/liquidity-pools"
              element={
                <OtherPages {...otherPageProps}>
                  <Liquidity walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
            <Route
              path="/vote"
              element={
                <OtherPages {...otherPageProps}>
                  <Governance walletAddress={props.userAddress} />
                </OtherPages>
              }
            />
            {/* <Route
              path="/vote"
              element={
                <Governance
                  toggleTheme={toggleTheme}
                  theme={theme}
                  connectWallet={connectWallet}
                  disconnectWallet={disconnectUserWallet}
                  walletAddress={props.userAddress}
                />
              }
            /> */}
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
