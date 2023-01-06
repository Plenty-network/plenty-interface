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

const WrappedAssets = React.lazy(() => import('../Pages/WrappedAssets/WrappedAssets'));
const Bridge = React.lazy(() => import('../Pages/Bridge/Bridge'));

const MyRoutes = (props) => {
  const { theme } = useThemes();
  console.log('ishu', theme);

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
                  <Bridge walletAddress={props.userAddress} theme={otherPageProps.theme} />
                </OtherPages>
              }
            />

            <Route
              path="/wrappedAssets"
              element={
                <OtherPages {...otherPageProps}>
                  <WrappedAssets
                    walletAddress={props.userAddress}
                    theme={otherPageProps.theme}
                    connecthWallet={connectWallet}
                  />
                </OtherPages>
              }
            />
            <Route
              path="/bridge"
              element={
                <OtherPages {...otherPageProps}>
                  <Bridge walletAddress={props.userAddress} theme={otherPageProps.theme} />
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
