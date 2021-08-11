import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
//Components
import Header from '../Components/Header/Header';
import Swap from '../Pages/Swap';
import Farms from '../Pages/Farms';
import Ponds from '../Pages/Ponds';
import Pools from '../Pages/Pools';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from '../themes';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  connectWallet,
  disconnectWallet,
  getWalletAddress,
} from '../redux/actions/wallet/wallet.action';

const Routes = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.wallet);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  const connecthWallet = async () => {
    if (walletAddress === null) {
      return dispatch(connectWallet());
    }
  };

  const disconnectUserWallet = async () => {
    if (walletAddress) {
      return dispatch(disconnectWallet());
    }
  };

  useEffect(() => {
    return dispatch(getWalletAddress());
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          connecthWallet={connecthWallet}
          disconnectWallet={disconnectUserWallet}
          walletAddress={walletAddress}
        />
        <Switch>
          <Route path="/" exact>
            <Redirect to="/swap" />
          </Route>

          <Route path="/swap" exact>
            <Swap
              walletAddress={walletAddress}
              connecthWallet={connecthWallet}
            />
          </Route>
          <Route path="/farms">
            <Farms walletAddress={walletAddress} />
          </Route>
          <Route path="/pools">
            <Pools walletAddress={walletAddress} />
          </Route>
          <Route path="/ponds">
            <Ponds walletAddress={walletAddress} />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default Routes;
