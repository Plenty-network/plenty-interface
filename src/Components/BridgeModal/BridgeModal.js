/* eslint-disable no-unused-vars */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './BridgeModal.module.scss';
import Button from '../Ui/Buttons/Button';
// import AvalancheRed from '../../assets/images/bridge/avax_red.svg';
// //import { ReactComponent as Avalanche } from '../../assets/images/bridge/avax.svg';
// import Avalanche from '../../assets/images/bridge/avax.svg';
import ethereum from '../../assets/images/bridge/eth.svg';
import tezos from '../../assets/images/bridge/tezos.svg';
//import { tokens } from '../../constants/swapPage';
import { tokensList } from '../../constants/bridges';
import SwapModal from '../SwapModal/SwapModal';
import plenty from '../../assets/images/logo_small.png';
import { getTokenPrices, getUserBalanceByRpc, fetchtzBTCBalance } from '../../apis/swap/swap';
import config from '../../config/config';
import { ethers } from 'ethers';
import dummyApiCall from '../../apis/dummyApiCall';
import '../../assets/scss/animation.scss';
import switchImg from '../../assets/images/bridge/bridge-switch.svg';
import switchImgDark from '../../assets/images/bridge/bridge-switch-dark.svg';
import { bridgesList } from '../../constants/bridges';
import SelectorModal from '../Bridges/SelectorModal';
import { BridgeConfiguration } from '../../apis/Config/BridgeConfig';
import { setConnectWalletTooltip } from '../../redux/slices/settings/settings.slice';
import { useDispatch } from 'react-redux';
import { allTokens } from '../../constants/bridges';
import { getBalance, getBalanceTez } from '../../apis/bridge/bridgeAPI';

const BridgeModal = (props) => {
  //const [firstTokenAmount, setFirstTokenAmount] = useState();
  //const [secondTokenAmount, setSecondTokenAmount] = useState();
  const dispatch = useDispatch();
  const [triggerTooltips, setTriggerTooltips] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [provider, setProvider] = useState(null);
  const [showMetamaskTooltip, setShowMetamaskTooltip] = useState(false);
  /* const [tokenIn, setTokenIn] = useState({
    name: tokensList['ETHEREUM'][0].name,
    image: tokensList['ETHEREUM'][0].image,
  });
  const [tokenOut, setTokenOut] = useState({
    name: `${tokensList['ETHEREUM'][0].name}.e`,   //Change after creating config.
    image: ''
  }); */
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [userTokenBalance, setUserTokenBalance] = useState(null);
  const [userBalances, setUserBalances] = useState({});
  const [tokenType, setTokenType] = useState('tokenIn');
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [isLoading, SetisLoading] = useState(false);
  const [isTokenInSelected, setIsTokenInSelected] = useState(false);
  const [isBridgeSelected, setIsBridgeSelected] = useState(false);
  const [isTokenSelected, setIsTokenSelected] = useState(false);
  const [isBridgeClicked, setIsBridgeClicked] = useState(false);
  //const [fromBridge, setFromBridge] = useState({name: 'ETHEREUM', image: ethereum, buttonImage: ethereum});
  //const [toBridge, setToBridge] = useState({name: 'TEZOS', image: tezos, buttonImage: ''});
  //const [connectBridgeWallet, setConnectBrigeWallet] = useState({name: fromBridge.name, image: fromBridge.image, buttonImage: fromBridge.buttonImage});
  //const [fee, setFee] = useState(0);
  //const [selector, setSelector] = useState('BRIDGES');
  const selector = useRef('BRIDGES');
  //const [operation, setOperation] = useState('BRIDGE');
  //const operation = useRef('BRIDGE');
  //const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);

  // Destructuring all props to respective variable names.
  const {
    walletAddress,
    transaction,
    setTransaction,
    fromBridge,
    toBridge,
    tokenIn,
    tokenOut,
    firstTokenAmount,
    secondTokenAmount,
    fee,
    currentProgress,
    operation,
    setFromBridge,
    setToBridge,
    setTokenIn,
    setTokenOut,
    setFirstTokenAmount,
    setSecondTokenAmount,
    setFee,
    SetCurrentProgress,
    setOperation,
    tokenList,
    setTokenList,
    loadedTokensList,
    theme,
  } = props;

  //const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);
  const [connectBridgeWallet, setConnectBrigeWallet] = useState({
    name: fromBridge.name,
    image: fromBridge.image,
    buttonImage: fromBridge.buttonImage,
  });

  useEffect(() => {
    if (triggerTooltips) {
      dispatch(setConnectWalletTooltip(true));
    } else {
      dispatch(setConnectWalletTooltip(false));
    }
  }, [triggerTooltips]);

  useEffect(() => {
    if (walletAddress) {
      dispatch(setConnectWalletTooltip(false));
      setIsError(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (defaultAccount) {
      setShowMetamaskTooltip(false);
      setIsError(false);
    }
  }, [defaultAccount]);

  useEffect(async () => {
    // const updateBalance = async () => {
    //   const userBalancesCopy = { ...userBalances };
    //   const tzBTCName = 'tzBTC';
    //   const balancePromises = [];
    //   if (!userBalancesCopy[tokenIn.name]) {
    //     tokenIn.name === tzBTCName
    //       ? balancePromises.push(fetchtzBTCBalance(walletAddress))
    //       : balancePromises.push(getUserBalanceByRpc(tokenIn.name, walletAddress));
    //   }
    //   if (!userBalancesCopy[tokenOut.name]) {
    //     tokenOut.name === tzBTCName
    //       ? balancePromises.push(fetchtzBTCBalance(walletAddress))
    //       : balancePromises.push(getUserBalanceByRpc(tokenOut.name, walletAddress));
    //   }
    //   /* if (config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]) {
    //     const lpToken =
    //       config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

    //     balancePromises.push(getUserBalanceByRpc(lpToken, walletAddress));
    //   } */
    //   const balanceResponse = await Promise.all(balancePromises);

    //   setUserBalances((prev) => ({
    //     ...prev,
    //     ...balanceResponse.reduce(
    //       (acc, cur) => ({
    //         ...acc,
    //         [cur.identifier]: 10, //cur.balance,
    //       }),
    //       {},
    //     ),
    //   }));
    // };
    // updateBalance();
    setUserTokenBalance(null);
    if(tokenIn.name !== 'Token NA' && walletAddress && defaultAccount) {
      if(operation === 'BRIDGE') {
        const balanceResult = await getBalance(tokenIn.tokenData.CONTRACT_ADDRESS,defaultAccount);
        if(balanceResult.success) {
          setUserTokenBalance(Number(balanceResult.balance) / (10**tokenIn.tokenData.DECIMALS));
        } else {
          setUserTokenBalance(null);
        }
        console.log(tokenIn.tokenData.DECIMALS);
        console.log(Number(balanceResult.balance) / (10**tokenIn.tokenData.DECIMALS));
      } else {
        const tokenInDecimals = BridgeConfiguration.getOutTokenUnbridgingWhole(toBridge.name,tokenIn.name).DECIMALS;
        const balanceResult = await getBalanceTez(tokenIn.tokenData.CONTRACT_ADDRESS,tokenIn.tokenData.TOKEN_ID,walletAddress,tokenInDecimals);
        console.log(tokenIn.tokenData.CONTRACT_ADDRESS,walletAddress,tokenIn.tokenData.TOKEN_ID,tokenInDecimals);
        console.log(balanceResult);
        if(balanceResult.success) {
          //setUserTokenBalance(Number(balanceResult.balance));
          setUserTokenBalance(Number('10'));
          console.log(Number(balanceResult.balance));
        } else {
          setUserTokenBalance(null);
        }
        console.log(BridgeConfiguration.getOutTokenUnbridgingWhole(toBridge.name,tokenIn.name));
      }
    } else {
      setUserTokenBalance(null);
    }
  }, [tokenIn]);
  /* useEffect(() => {
    //setLoading(true);
    //setLoaderInButton(true);
    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      //setLoading(false);
    });
  }, []); */

  const getDollarValue = (amount, price) => {
    const calculatedValue = amount * price;
    if (calculatedValue < 100) {
      return calculatedValue.toFixed(2);
    }
    return Math.floor(calculatedValue);
  };
  const onClickAmount = () => {
    const value =
      userBalances[tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    handleFromTokenInput(value, 'tokenIn');
  };

  const handleFromTokenInput = (input) => {
    setIsError(false);
    if (!walletAddress && !defaultAccount) {
      dispatch(setConnectWalletTooltip(true));
      setShowMetamaskTooltip(true);
      setErrorMessage('Please connect to both the wallets.');
      setIsError(true);
    } else if (!walletAddress && defaultAccount) {
      dispatch(setConnectWalletTooltip(true));
      setErrorMessage('Please connect to tezos wallet.');
      setIsError(true);
    } else if (!defaultAccount && walletAddress) {
      setShowMetamaskTooltip(true);
      setErrorMessage(
        `Please connect to ${
          fromBridge.name === 'TEZOS' ? toBridge.name : fromBridge.name
        } wallet.`,
      );
      setIsError(true);
    } else {
      if (input === '' || isNaN(input) || tokenIn.name === 'Token NA' || userTokenBalance === null) {
        setFirstTokenAmount('');
        setSecondTokenAmount('');
        setFee(0);
      } else {
        setFirstTokenAmount(input);
        if (input > userTokenBalance) {
          setErrorMessage('Insufficient balance');
          setIsError(true);
        } else {
          if (operation === 'BRIDGE') {
            setFee(
              (input * BridgeConfiguration.getFeesForChain(fromBridge.name).WRAP_FEES) / 10000,
            );
            const outputAmount =
              input -
              (input * BridgeConfiguration.getFeesForChain(fromBridge.name).WRAP_FEES) / 10000;
            setSecondTokenAmount(outputAmount);
          } else {
            setFee(
              (input * BridgeConfiguration.getFeesForChain(toBridge.name).UNWRAP_FEES) / 10000,
            );
            const outputAmount =
              input -
              (input * BridgeConfiguration.getFeesForChain(toBridge.name).UNWRAP_FEES) / 10000;
            setSecondTokenAmount(outputAmount);
          }
        }
      }
    }
  };

  const handleToTokenInput = (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
    } else {
      if (tokenType === 'tokenIn') {
        setSecondTokenAmount(input);
        const fromAmt = input * 0.9985;
        setFirstTokenAmount(fromAmt);
      }
    }
  };

  const handelClickWithMetaAddedBtn = () => {
    setIsError(false);
    if (firstTokenAmount === '' || isNaN(firstTokenAmount) || firstTokenAmount === 0) {
      setErrorMessage('Enter the amount and proceed');
      setIsError(true);
    } else if (firstTokenAmount > userBalances[tokenIn.name]) {
      setErrorMessage('Insufficient balance');
      setIsError(true);
    } else {
      SetisLoading(true);
      if(operation === 'UNBRIDGE') {
        SetCurrentProgress(1);
      }
      dummyApiCall({ isfinished: true }).then((res) => {
        if (res.isfinished) {
          SetisLoading(false);
          setTransaction(3);
        }
      });
    }
  };
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText('Wallet Connected');
          getAccountBalance(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setIsError(true);
        });
    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
      setIsError(true);
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getAccountBalance(newAccount.toString());
  };

  const getAccountBalance = (account) => {
    window.ethereum
      .request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setIsError(true);
      });
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  window.ethereum.on('accountsChanged', accountChangedHandler);

  window.ethereum.on('chainChanged', chainChangedHandler);

  const handleClose = () => {
    setShow(false);
    setIsBridgeClicked(false);
    setSearchQuery('');
  };
  const handleTokenType = (type) => {
    setShow(true);
    setTokenType(type);
  };
  /* const setTransaction = (value) => {
    if (value) {
      props.setTransaction(value);
    }
  }; */

  //From Bridge Related

  const selectBridge = (bridge) => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setFee(0);
    if (bridge.name === 'TEZOS') {
      const currentFrom = {
        name: fromBridge.name,
        image: fromBridge.image,
        buttonImage: fromBridge.buttonImage,
      };
      setToBridge({
        name: currentFrom.name,
        image: currentFrom.image,
        buttonImage: currentFrom.buttonImage,
      });
      //setFromBridge({name: bridge.name, image: bridge.image, buttonImage: bridge.buttonImage});
      setOperation('UNBRIDGE');
      //operation.current = 'UNBRIDGE';
      //call switch function
    } else {
      //setFromBridge({name: bridge.name, image: bridge.image, buttonImage: bridge.buttonImage});
      setConnectBrigeWallet({
        name: bridge.name,
        image: bridge.image,
        buttonImage: bridge.buttonImage,
      });
      if (operation === 'UNBRIDGE') {
        setToBridge({ name: 'TEZOS', image: tezos, buttonImage: '' });
        setOperation('BRIDGE');
        //operation.current = 'BRIDGE';
      }
    }
    setFromBridge({ name: bridge.name, image: bridge.image, buttonImage: bridge.buttonImage });
    setIsBridgeSelected(true);
    handleClose();
  };

  /* useEffect(() => {
    setTokenList(tokensList[fromBridge.name]);
    setTokenIn({
      name: tokensList[fromBridge.name][0].name,
      image: tokensList[fromBridge.name][0].image
    });
    //Change after creating config.
    setTokenOut({
      name: `${tokensList[fromBridge.name][0].name}.e`,
      image: tokensList[fromBridge.name][0].image
    });
  }, [fromBridge]); */

  const handleBridgeSelect = () => {
    //setSelector('BRIDGES');
    selector.current = 'BRIDGES';
    setIsBridgeClicked(true);
    setShow(true);
  };

  //From Token Related

  const selectToken = (token) => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setFee(0);

    setTokenIn({
      name: token.name,
      image: token.image,
      tokenData: token.tokenData,
    });
    //Change after creating config.
    if (fromBridge.name === 'TEZOS') {
      const outTokenName = BridgeConfiguration.getOutTokenUnbridging(toBridge.name, token.name);
      setTokenOut({
        name: outTokenName,
        image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName) ? allTokens[outTokenName] : allTokens.fallback, 
      });
    } else {
      const outTokenName = BridgeConfiguration.getOutTokenBridging(fromBridge.name, token.name);
      setTokenOut({
        name: outTokenName,
        image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName) ? allTokens[outTokenName] : allTokens.fallback,
      });
    }
    setIsTokenSelected(true);
    handleClose();
  };

  const handleTokenSelect = () => {
    setIsError(false);
    if (!walletAddress && !defaultAccount) {
      dispatch(setConnectWalletTooltip(true));
      setShowMetamaskTooltip(true);
      setErrorMessage('Please connect to both the wallets.');
      setIsError(true);
    } else if (!walletAddress && defaultAccount) {
      dispatch(setConnectWalletTooltip(true));
      setErrorMessage('Please connect to tezos wallet.');
      setIsError(true);
    } else if (!defaultAccount && walletAddress) {
      setShowMetamaskTooltip(true);
      setErrorMessage(
        `Please connect to ${
          fromBridge.name === 'TEZOS' ? toBridge.name : fromBridge.name
        } wallet.`,
      );
      setIsError(true);
    } else {
      //setSelector('TOKENS');
      selector.current = 'TOKENS';
      setShow(true);
    }
  };

  //To Bridge/Token/Switch Related

  const switchHandler = () => {
    //setOperation((prevOperation) => prevOperation === 'BRIDGE' ? 'UNBRIDGE' : 'BRIDGE');
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setFee(0);
    const currentFrom = {
      name: fromBridge.name,
      image: fromBridge.image,
      buttonImage: fromBridge.buttonImage,
    };
    const currentTo = {
      name: toBridge.name,
      image: toBridge.image,
      buttonImage: toBridge.buttonImage,
    };
    setToBridge({
      name: currentFrom.name,
      image: currentFrom.image,
      buttonImage: currentFrom.buttonImage,
    });
    setFromBridge({
      name: currentTo.name,
      image: currentTo.image,
      buttonImage: currentTo.buttonImage,
    });
    if (operation === 'BRIDGE') {
      setOperation('UNBRIDGE');
      //operation.current = 'UNBRIDGE';
    } else {
      setOperation('BRIDGE');
      //operation.current = 'BRIDGE';
    }
  };

  return (
    <div
      className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 mb-3 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal} leftToRightFadeInAnimation-4-bridge`}>
          <div className={styles.resultsHeader}>
            <p className={styles.heading}>Bridge Tokens</p>
            {walletAddress ? (
              <p
                className={styles.res}
                onClick={() => {
                  setTransaction(2);
                }}
                style={{ cursor: 'pointer' }}
              >
                View History
              </p>
            ) : null}
          </div>
          <div className={`mb-2 ${styles.lineBottom} `}></div>
          <div className={`mt-4 ${styles.from}`}>From</div>
          <div className={`mt-2 ${styles.fromBridgeSelectBox}`}>
            <div>
              <p className={`mb-1 ${styles.fromLabelTop}`}>Select chain: </p>
              <p className={`mb-0 ${styles.fromLabelBottom}`}>Choose your entry chain</p>
            </div>
            <div
              className={clsx(
                styles.bridgeSelector,
                styles.selector,
                isBridgeClicked && styles.fromBridgeClicked,
              )}
              onClick={handleBridgeSelect}
              style={{ boxShadow: isBridgeSelected && 'none' }}
            >
              <img src={fromBridge.image} className="button-logo" />
              <span>{fromBridge.name} </span>
              <span className="span-themed material-icons-round">expand_more</span>
            </div>
          </div>
          <div className={`my-3 ${styles.lineMid} `}></div>
          <p className={styles.midLabel}>Choose your token and enter the amount</p>
          <div
            className={`mt-2 ${styles.tokenSelectBox} ${
              isTokenInSelected && styles.tokenInSelected
            } ${styles.inputSelectBox} ${isError && styles.inputError}`}
          >
            <div className={'flex align-items-center'}>
              <div
                className={clsx(styles.selector, styles.toTokenSelector)}
                onClick={handleTokenSelect}
                style={{ boxShadow: isTokenSelected && 'none' }}
              >
                <img src={tokenIn.image} className="button-logo" />
                <span>{tokenIn.name} </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </div>
              <span
                onClick={onClickAmount}
                className={`flex justify-content-center align-items-center ml-2 ${styles.selectMaxBtn}`}
              >
                MAX
              </span>
            </div>
            <div className={clsx(styles.inputWrapper)}>
              <input
                type="text"
                className={`text-right ${styles.tokenUserInput}`}
                placeholder="0.0"
                value={firstTokenAmount}
                onChange={(e) => handleFromTokenInput(e.target.value)}
                onFocus={() => setIsTokenInSelected(true)}
                onBlur={() => setIsTokenInSelected(false)}
              />
            </div>
          </div>
          <div className="flex justify-between" style={{ flex: '0 0 100%', marginBottom: '2vh' }}>
            <p className={clsx(styles.errorText)}>{isError ? errorMessage : ' '}</p>
            <p className={clsx('wallet-token-balance', styles.balanceText)}>
              {walletAddress ? (
                <>
                  Balance:{' '}
                  {userTokenBalance >= 0 && userTokenBalance!== null ? (
                    userTokenBalance
                  ) : (
                    <div className="shimmer">0.0000</div>
                  )}
                </>
              ) : (
                ' '
              )}

              {/* ~$
                {getTokenPrice.success && firstTokenAmount
                  ? getDollarValue(firstTokenAmount, getTokenPrice.tokenPrice[tokenIn.name])
                  : '0.00'} */}
            </p>
          </div>
          <OverlayTrigger
            overlay={(props) => (
              <Tooltip id={styles.switchTooltip} className="switchTooltip" {...props}>
                Switch
              </Tooltip>
            )}
            placement="right"
          >
            <div
              className={`mx-auto flex justify-content-center align-items-center ${styles.arrowSwap}`}
              onClick={switchHandler}
            >
              <img src={theme === 'light' ? switchImg : switchImgDark} alt={'switch-image'} />
            </div>
          </OverlayTrigger>

          <div className={`mt-2 ${styles.to}`}>To</div>
          <div className={`mt-3 ${styles.toBridgeSelectBox} ${styles.inputSelectBox}`}>
            <div className={clsx(styles.toBridgeWrapper)}>
              <div className={styles.toBridgeSelector}>
                <img src={toBridge.image} className="button-logo" />
                <span>{toBridge.name} </span>
              </div>
              <div className={clsx(styles.lineVertical, 'mx-2')}></div>
              <div className={clsx(styles.inputWrapper)}>
                <p className={styles.toLabel}>you will receive</p>
                <input
                  type="text"
                  className={`text-left ${styles.toTokenOutput}`}
                  placeholder="0.0"
                  value={secondTokenAmount}
                  disabled
                />
              </div>
            </div>
            <span
              className={`flex justify-content-center align-items-center ml-2 ${styles.toTokenLabel}`}
            >
              {tokenOut.name}
            </span>
          </div>
          <p className={clsx('mt-2', styles.feeEstimateText)}>{`Estimated fee: ${fee}`}</p>

          {defaultAccount === null ? (
            <OverlayTrigger
              overlay={(props) => (
                <Tooltip className="connect-wallet-tooltip metamask-wallet-tooltip" {...props}>
                  Connect wallet
                </Tooltip>
              )}
              placement="top"
              show={showMetamaskTooltip}
            >
              <Button
                className={clsx('px-md-3', 'mt-3', 'w-100', 'connect-wallet-btn', 'button-bg')}
                onClick={connectWalletHandler}
              >
                <div className={clsx('connect-wallet-btn')}>
                  <div className="flex flex-row align-items-center">
                    {/* <Avalanche /> */}
                    <img src={connectBridgeWallet.buttonImage} />
                    <span className="ml-2">Connect to {connectBridgeWallet.name} wallet</span>
                  </div>
                </div>
              </Button>
            </OverlayTrigger>
          ) : (
            <>
              <Button
                className={clsx('px-md-3', 'mt-3', 'w-100', 'connect-wallet-btn', 'button-bg')}
                onClick={handelClickWithMetaAddedBtn}
                loading={isLoading}
              >
                <div className={clsx('connect-wallet-btn')}>
                  <div className="flex flex-row align-items-center">
                    {/* <Avalanche /> */}
                    <span className="ml-2">Proceed</span>
                    {/* <span>{userBalance}</span> */}
                  </div>
                  {/* <span>{defaultAccount}</span> */}
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
      {/* Change selectToken and tokens prop for wrapped tokens after adding them. */}
      <SelectorModal
        show={show}
        onHide={handleClose}
        selectToken={selector.current === 'BRIDGES' ? selectBridge : selectToken}
        tokens={selector.current === 'BRIDGES' ? bridgesList : tokenList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        title={selector.current === 'BRIDGES' ? 'Select a Bridge' : 'Select a Token'}
      />
    </div>
  );
};

BridgeModal.propTypes = {
  transaction: PropTypes.any,
  setTransaction: PropTypes.any,
  walletAddress: PropTypes.any,
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  fee: PropTypes.any,
  currentProgress: PropTypes.any,
  operation: PropTypes.any,
  setFromBridge: PropTypes.any,
  setToBridge: PropTypes.any,
  setTokenIn: PropTypes.any,
  setTokenOut: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setSecondTokenAmount: PropTypes.any,
  setFee: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  setOperation: PropTypes.any,
  tokenList: PropTypes.any,
  setTokenList: PropTypes.any,
  loadedTokensList: PropTypes.any,
  theme: PropTypes.any,
};

export default BridgeModal;
