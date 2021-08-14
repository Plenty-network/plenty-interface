import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
//Components
import Header from '../Components/Header/Header';
import Swap from '../Pages/Swap';
import Farms from '../Pages/Farms';
import Ponds from '../Pages/Ponds';
import Pools from '../Pages/Pools';
import {ThemeProvider} from 'styled-components';
import {lightTheme, darkTheme, GlobalStyles} from '../themes';
import {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import Frontpage from "../Pages/Frontpage/Frontpage";

const Routes = (props) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light');
    };

    const connecthWallet = async () => {
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
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles/>
            <Router>
                <Switch>
                    <Route path="/" exact>
                        <Frontpage/>
                    </Route>
                    <div>
                        <Header
                            toggleTheme={toggleTheme}
                            theme={theme}
                            connecthWallet={connecthWallet}
                            disconnectWallet={disconnectUserWallet}
                            walletAddress={props.userAddress}
                        />

                        <Route path="/swap" exact>
                            <Swap
                                walletAddress={props.userAddress}
                                connecthWallet={connecthWallet}
                            />
                        </Route>
                        <Route path="/farms">
                            <Farms walletAddress={props.userAddress}/>
                        </Route>
                        <Route path="/pools">
                            <Pools walletAddress={props.userAddress}/>
                        </Route>
                        <Route path="/ponds">
                            <Ponds walletAddress={props.userAddress}/>
                        </Route>
                    </div>
                </Switch>
            </Router>
        </ThemeProvider>
    );
};

const mapStateToProps = state => {
    return {
        userAddress: state.wallet.address,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        connectWallet: () => (dispatch(walletActions.connectWallet())),
        disconnectWallet: () => (dispatch(walletActions.disconnectWallet())),
        fetchWalletAddress: () => (dispatch(walletActions.fetchWalletAddress())),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
