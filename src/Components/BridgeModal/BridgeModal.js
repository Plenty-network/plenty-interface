/* eslint-disable no-unused-vars */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import truncateMiddle from 'truncate-middle';
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
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import { changeNetwork } from '../../apis/bridge/bridgeAPI';
import { ReactComponent as MaxBtnIcon } from '../../assets/images/bridge/max_btn.svg';
import { ReactComponent as MaxBtnIconDark } from '../../assets/images/bridge/max_btn_dark.svg';
import { CHANGE_NETWORK_PROMPT_DELAY } from '../../constants/bridges';
import { getAllowance } from '../../apis/bridge/bridgeAPI';
import { useInterval } from '../../hooks/useInterval';
import { getActionRequiredCount } from '../../apis/bridge/bridgeAPI';
/* import { getCurrentNetwork } from '../../apis/bridge/bridgeAPI'; */
const BridgeModal = (props) => {
  //const [firstTokenAmount, setFirstTokenAmount] = useState();
  //const [secondTokenAmount, setSecondTokenAmount] = useState();
  const dispatch = useDispatch();
  const [triggerTooltips, setTriggerTooltips] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  //const [metamaskAddress, setMetamaskAddress] = useState(null);
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
  const [pendingTransCount, setPendingTransCount] = useState(0);
  //const [fromBridge, setFromBridge] = useState({name: 'ETHEREUM', image: ethereum, buttonImage: ethereum});
  //const [toBridge, setToBridge] = useState({name: 'TEZOS', image: tezos, buttonImage: ''});
  //const [connectBridgeWallet, setConnectBrigeWallet] = useState({name: fromBridge.name, image: fromBridge.image, buttonImage: fromBridge.buttonImage});
  //const [fee, setFee] = useState(0);
  //const [selector, setSelector] = useState('BRIDGES');
  const selector = useRef('BRIDGES');
  const delay = useRef(5000);
  //const [operation, setOperation] = useState('BRIDGE');
  //const operation = useRef('BRIDGE');
  //const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);
  //userBalances[tokenIn.name]

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
    setOpeningFromHistory,
    metamaskAddress,
    setMetamaskAddress,
    currentChain,
    metamaskChain,
    displayMessage,
    setSwitchButtonPressed,
    connectWalletHandler,
  } = props;

  //const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);
  const [connectBridgeWallet, setConnectBrigeWallet] = useState({
    name: fromBridge.name,
    image: fromBridge.image,
    buttonImage: fromBridge.buttonImage,
  });
  /*   const getChain = async () => {
    const network = await getCurrentNetwork();
    console.log(network);
    return network;
  };
  useEffect(() => {
    getChain();
  }, [firstTokenAmount]); */
  useEffect(() => {
    console.log(currentChain, metamaskChain);
    if (currentChain !== metamaskChain && transaction === 1) {
      if (metamaskChain !== null) {
        //alert(`Please select ${currentChain} as chain in metmask wallet to proceed.`);
        console.log(`Please select ${currentChain} as chain in metmask wallet to proceed.`);
        displayMessage({
          type: 'warning',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Chain Mismatch',
          content: `Change metamask wallet chain to ${currentChain}.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        
          setTimeout(async () => {
            try {
              console.log('Changing metamask chain to ', currentChain);
              await changeNetwork({ networkName: currentChain });
            } catch (error) {
              console.log(error.message);
            }
          }, CHANGE_NETWORK_PROMPT_DELAY);
        
      }
    }
  }, [currentChain, metamaskChain]);

  useEffect(() => {
    if (currentChain === metamaskChain && isError) {
      setIsError(false);
    }
  }, [metamaskChain]);

  useEffect(() => {
    setOpeningFromHistory(false);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      dispatch(setConnectWalletTooltip(false));
      setIsError(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (metamaskAddress) {
      setShowMetamaskTooltip(false);
      setIsError(false);
    }
  }, [metamaskAddress]);

  useEffect(async () => {
    setUserTokenBalance(null);
    setUserBalances((prevState) => ({...prevState,[tokenIn.name]: null}));
    console.log(tokenIn);
    if (
      tokenIn.name !== 'Token NA' &&
      walletAddress &&
      metamaskAddress &&
      metamaskChain === currentChain
    ) {
      if (operation === 'BRIDGE') {
        const balanceResult = await getBalance(tokenIn.tokenData.CONTRACT_ADDRESS, metamaskAddress);
        console.log(balanceResult);
        if (balanceResult.success) {
          setUserTokenBalance(Number(balanceResult.balance) / 10 ** tokenIn.tokenData.DECIMALS);
          setUserBalances((prevState) => ({...prevState,[tokenIn.name]: Number(balanceResult.balance) / 10 ** tokenIn.tokenData.DECIMALS}));
        } else {
          setUserTokenBalance(-1);
          setUserBalances((prevState) => ({...prevState,[tokenIn.name]: -1}));
        }
        console.log(tokenIn.tokenData.DECIMALS);
        console.log(Number(balanceResult.balance) / 10 ** tokenIn.tokenData.DECIMALS);
      } else {
        const tokenInDecimals = BridgeConfiguration.getOutTokenUnbridgingWhole(
          toBridge.name,
          tokenIn.name,
        ).DECIMALS;
        const balanceResult = await getBalanceTez(
          tokenIn.tokenData.CONTRACT_ADDRESS,
          tokenIn.tokenData.TOKEN_ID,
          walletAddress,
          tokenInDecimals,
        );
        console.log(
          tokenIn.tokenData.CONTRACT_ADDRESS,
          walletAddress,
          tokenIn.tokenData.TOKEN_ID,
          tokenInDecimals,
        );
        console.log(balanceResult);
        if (balanceResult.success) {
          setUserTokenBalance(Number(balanceResult.balance));
          setUserBalances((prevState) => ({...prevState,[tokenIn.name]: Number(balanceResult.balance)}));
          //setUserTokenBalance(Number('10'));
          console.log(Number(balanceResult.balance));
        } else {
          setUserTokenBalance(-1);
          setUserBalances((prevState) => ({...prevState,[tokenIn.name]: -1}));
        }
        console.log(BridgeConfiguration.getOutTokenUnbridgingWhole(toBridge.name, tokenIn.name));
      }
    } else {
      setUserTokenBalance(-1);
      setUserBalances((prevState) => ({...prevState,[tokenIn.name]: -1}));
    }
  }, [tokenIn, walletAddress, metamaskAddress, metamaskChain]);
  /* useEffect(() => {
    //setLoading(true);
    //setLoaderInButton(true);
    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      //setLoading(false);
    });
  }, []); */

  useInterval(async () => {
    if(metamaskAddress && walletAddress) {
      const pendingHistoryCount = await getActionRequiredCount({ethereumAddress: metamaskAddress, tzAddress: walletAddress});
      //console.log(pendingHistoryCount);
      setPendingTransCount(pendingHistoryCount.count);
    }
  }, delay.current);

  const getDollarValue = (amount, price) => {
    const calculatedValue = amount * price;
    if (calculatedValue < 100) {
      return calculatedValue.toFixed(2);
    }
    return Math.floor(calculatedValue);
  };

  const onClickAmount = () => {
    // const value = userTokenBalance ?? 0;
    const value = userBalances[tokenIn.name] ?? 0;
    handleFromTokenInput(value);
  };

  const handleFromTokenInput = (input) => {
    setIsError(false);
    if (!walletAddress && !metamaskAddress) {
      dispatch(setConnectWalletTooltip(true));
      setShowMetamaskTooltip(true);
      displayMessage({
        type: 'info',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Connect wallet',
        content: 'Connect both the wallets and proceed.',
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      setErrorMessage('Please connect to both the wallets.');
      setIsError(true);
    } else if (!walletAddress && metamaskAddress) {
      dispatch(setConnectWalletTooltip(true));
      setErrorMessage('Please connect to tezos wallet.');
      setIsError(true);
    } else if (!metamaskAddress && walletAddress) {
      setShowMetamaskTooltip(true);
      setErrorMessage(
        `Please connect to ${
          fromBridge.name === 'TEZOS' ? toBridge.name : fromBridge.name
        } wallet.`,
      );
      setIsError(true);
    } else {
      if (
        input === '' ||
        isNaN(input) ||
        tokenIn.name === 'Token NA' ||
        // userTokenBalance === null ||
        // userTokenBalance < 0
        userBalances[tokenIn.name] === null ||
        userBalances[tokenIn.name] < 0
      ) {
        setFirstTokenAmount('');
        setSecondTokenAmount('');
        setFee(0);
      } else {
        setFirstTokenAmount(input);
        // if (input > userTokenBalance) {
          if (input > userBalances[tokenIn.name]) {
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

  const handelClickWithMetaAddedBtn = async () => {
    setIsError(false);
    if (firstTokenAmount === '' || isNaN(firstTokenAmount) || firstTokenAmount === 0) {
      setErrorMessage('Enter the amount and proceed');
      setIsError(true);
    // } else if (firstTokenAmount > userTokenBalance) {
    } else if (firstTokenAmount > userBalances[tokenIn.name]) {
      setErrorMessage('Insufficient balance');
      setIsError(true);
    } else {
      if (currentChain !== metamaskChain) {
        //alert('Chain selected on app does not match with the one selected in metamask wallet. Please change metamask wallet chain to ' + currentChain + '.');
        console.log(
          'Chain selected on app does not match with the one selected in metamask wallet. Please change metamask wallet chain to ' +
            currentChain +
            '.',
        );
        displayMessage({
          type: 'warning',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Chain Mismatch',
          content: `Change metamask wallet chain to ${currentChain}.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        
          setTimeout(async () => {
            try {
              console.log('Changing metamask chain to ', currentChain);
              await changeNetwork({ networkName: currentChain });
            } catch (error) {
              console.log(error.message);
            }
          }, CHANGE_NETWORK_PROMPT_DELAY);
        
      } else {
        SetisLoading(true);
        if (operation === 'UNBRIDGE') {
          SetCurrentProgress(1);
        } else {
          const allowanceResult = await getAllowance(tokenIn,metamaskAddress,fromBridge.name);
          if(allowanceResult.success) {
            console.log(allowanceResult.allowance);
            if(allowanceResult.allowance >= Number(firstTokenAmount)) {
              SetCurrentProgress(1);
            }
          } else {
            console.log(allowanceResult.error);
            displayMessage({
              type: 'error',
              duration: FLASH_MESSAGE_DURATION,
              title: 'Allowance Error',
              content: 'Failed to fetch allowance for user. Please try again.',
              isFlashMessageALink: false,
              flashMessageLink: '#',
            });
          }
          
        }
        setTimeout(() => {
          SetisLoading(false);
          setTransaction(3);
        }, 100);
      }
    }
  };

  /* const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          //accountChangedHandler(result[0]);
          setMetamaskAddress(result[0]);
          //setConnButtonText('Wallet Connected');
          //getAccountBalance(result[0]);
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
  }; */

  // update account, will cause component re-render
  // const accountChangedHandler = (newAccount) => {
  //   setMetamaskAddress(newAccount);
  //   getAccountBalance(newAccount.toString());
  // };

  // const getAccountBalance = (account) => {
  //   window.ethereum
  //     .request({ method: 'eth_getBalance', params: [account, 'latest'] })
  //     .then((balance) => {
  //       setUserBalance(ethers.utils.formatEther(balance));
  //     })
  //     .catch((error) => {
  //       setErrorMessage(error.message);
  //       setIsError(true);
  //     });
  // };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  //window.ethereum.on('accountsChanged', accountChangedHandler);

  //window.ethereum.on('chainChanged', chainChangedHandler);

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
  const handleInputFocus = () => {
    setIsError(false);
    setIsTokenInSelected(true);
    if(currentChain !== metamaskChain) {
      setErrorMessage(`Please select ${currentChain} chain in metamask.`);
      setIsError(true);
    }
  };


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
      if(currentFrom.name !== 'TEZOS') {
        setToBridge({
          name: currentFrom.name,
          image: currentFrom.image,
          buttonImage: currentFrom.buttonImage,
        });
      }
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
        image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName)
          ? allTokens[outTokenName]
          : allTokens.fallback,
      });
    } else {
      const outTokenName = BridgeConfiguration.getOutTokenBridging(fromBridge.name, token.name);
      setTokenOut({
        name: outTokenName,
        image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName)
          ? allTokens[outTokenName]
          : allTokens.fallback,
      });
    }
    setIsTokenSelected(true);
    handleClose();
  };

  const handleTokenSelect = () => {
    setIsError(false);
    if (!walletAddress && !metamaskAddress) {
      dispatch(setConnectWalletTooltip(true));
      setShowMetamaskTooltip(true);
      displayMessage({
        type: 'info',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Connect wallet',
        content: 'Connect both the wallets and proceed.',
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      setErrorMessage('Please connect to both the wallets.');
      setIsError(true);
    } else if (!walletAddress && metamaskAddress) {
      dispatch(setConnectWalletTooltip(true));
      setErrorMessage('Please connect to tezos wallet.');
      setIsError(true);
    } else if (!metamaskAddress && walletAddress) {
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
    setSwitchButtonPressed(true);
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
    const currentTokenIn = tokenIn.name;
    const currentTokenOut = tokenOut.name;
    //console.log(loadedTokensList);
    const tokenData =
      operation === 'BRIDGE'
        ? loadedTokensList.TEZOS[currentFrom.name].find((token) => token.name === currentTokenOut)
            .tokenData
        : loadedTokensList[currentTo.name].find((token) => token.name === currentTokenOut)
            .tokenData;
    
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
    //setTimeout(() => {
      setTokenIn({
        name: currentTokenOut,
        image: Object.prototype.hasOwnProperty.call(allTokens, currentTokenOut)
        ? allTokens[currentTokenOut]
        : allTokens.fallback,
        tokenData
      });
      setTokenOut({
        name: currentTokenIn,
        image: Object.prototype.hasOwnProperty.call(allTokens, currentTokenIn)
        ? allTokens[currentTokenIn]
        : allTokens.fallback,
      });
    //}, 10);
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
      className={`justify-content-center mx-auto col-20 col-md-10 col-lg-12 col-xl-12 mb-3 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal}`}>
          <div className="leftToRightFadeInAnimation-4-bridge">
            <div className={styles.resultsHeader}>
              <p className={styles.heading}>
                Bridge{' '}
                {metamaskAddress && (
                  <span className={styles.metamaskAddressText}>{`(${truncateMiddle(
                    metamaskAddress,
                    5,
                    4,
                    '...',
                  )})`}</span>
                )}
              </p>
              {walletAddress && metamaskAddress && (
                <p
                  className={`${styles.res} ${pendingTransCount > 0 && styles.pendingHistory}`}
                  onClick={() => {
                    setTransaction(2);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  View History{' '}
                  {pendingTransCount > 0 && (
                    <span className={styles.actionRequiredCount}>{pendingTransCount}</span>
                  )}
                </p>
              )}
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
                <span className="span-themed material-icons-round" style={{ fontSize: '20px' }}>
                  expand_more
                </span>
              </div>
            </div>
            <div className={`my-3 ${styles.lineMid} `}></div>
            <p className={styles.midLabel}>Choose your token and enter the amount</p>
            <div
              className={`mt-2 ${styles.tokenSelectBox} ${
                isTokenInSelected && styles.tokenInSelected
              } ${styles.inputSelectBox} ${isError && styles.inputError}`}
            >
              {/* <div className={'flex align-items-center'}> */}
              <div
                className={clsx(styles.selector, styles.toTokenSelector)}
                onClick={handleTokenSelect}
                style={{ boxShadow: isTokenSelected && 'none' }}
              >
                <img src={tokenIn.image} className="button-logo" />
                <span>{tokenIn.name} </span>
                <span className="span-themed material-icons-round" style={{ fontSize: '18px' }}>
                  expand_more
                </span>
              </div>
              {/* <span
                onClick={onClickAmount}
                className={`flex justify-content-center align-items-center ml-2 ${styles.selectMaxBtn}`}
              >
                MAX
              </span> */}
              {/* </div> */}
              <div className={clsx(styles.inputWrapper)}>
                <input
                  type="text"
                  className={`text-right ${styles.tokenUserInput}`}
                  placeholder="0.0"
                  value={firstTokenAmount}
                  onChange={(e) => handleFromTokenInput(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={() => setIsTokenInSelected(false)}
                />
              </div>
            </div>
            <div
              className="flex justify-between"
              style={{ flex: '0 0 100%', marginBottom: '2vh', height: '24px' }}
            >
              <p className={clsx(styles.errorText)}>{isError ? errorMessage : ' '}</p>
              <p className={clsx('wallet-token-balance', styles.balanceText)}>
                {/* {userTokenBalance >= 0 && userTokenBalance !== null && ( */}
                {userBalances[tokenIn.name] >= 0 && userBalances[tokenIn.name] !== null && (
                  <>
                    Balance:{' '}
                    <span className={styles.balanceValue} onClick={onClickAmount}>
                      {/* {userTokenBalance} */}
                      {userBalances[tokenIn.name]}
                      {theme === 'light' ? (
                        <MaxBtnIcon className={styles.maxButton} />
                      ) : (
                        <MaxBtnIconDark className={styles.maxButton} />
                      )}
                    </span>
                  </>
                )}
                {/* {userTokenBalance === null && ( */}
                {userBalances[tokenIn.name] === null && (
                  <>
                    Balance: <span className="shimmer">0.0000</span>
                  </>
                )}
                {/* {walletAddress ? (
                <>
                  Balance:{' '}
                  {userTokenBalance >= 0 && userTokenBalance !== null ? (
                    userTokenBalance
                  ) : (
                    <div className="shimmer">0.0000</div>
                  )}
                </>
              ) : (
                ' '
              )} */}

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
            <div
              className={`mt-2 ${styles.toBridgeSelectBox} ${styles.inputSelectBox} ${
                isTokenInSelected ? styles.toBridgeSelected : null
              }`}
            >
              <div className={clsx(styles.toBridgeWrapper)}>
                <div className={styles.toBridgeSelector}>
                  <img src={toBridge.image} className="button-logo" />
                  <span>{toBridge.name} </span>
                </div>
                <div className={clsx(styles.lineVertical, 'mx-2')}></div>
                <div className={clsx(styles.inputWrapper)}>
                  <p className={styles.toLabel}>You will receive</p>
                  <OverlayTrigger
                    overlay={(props) => (
                      <Tooltip className="switchTooltip token-output-tooltip" {...props}>
                        {secondTokenAmount === '' ? '0.0' : secondTokenAmount}
                      </Tooltip>
                    )}
                    placement="top"
                  >
                    <input
                      type="text"
                      className={`text-left ${styles.toTokenOutput}`}
                      placeholder="0.0"
                      value={secondTokenAmount}
                      disabled
                    />
                  </OverlayTrigger>
                </div>
              </div>
              <span
                className={`flex justify-content-center align-items-center ml-2 ${styles.toTokenLabel}`}
              >
                {tokenOut.name}
              </span>
            </div>
            <p className={clsx('mt-2', styles.feeEstimateText)}>
              Estimated fee:{' '}
              <span style={{ fontWeight: '700' }}>
                {Number(fee) > 0 ? Number(fee).toFixed(6) : 0}
                {` ${operation === 'BRIDGE' ? tokenOut.name : tokenIn.name}`}
              </span>
            </p>

            {metamaskAddress === null ? (
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
                    {/* <span>{metamaskAddress}</span> */}
                  </div>
                </Button>
              </>
            )}
          </div>
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
  setOpeningFromHistory: PropTypes.any,
  metamaskAddress: PropTypes.any,
  setMetamaskAddress: PropTypes.any,
  currentChain: PropTypes.any,
  metamaskChain: PropTypes.any,
  displayMessage: PropTypes.any,
  setSwitchButtonPressed: PropTypes.any,
  connectWalletHandler: PropTypes.any,
};

export default BridgeModal;
