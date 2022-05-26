import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BridgeText from '../../Components/BridgeText/BridgeText';
import BridgeModal from '../../Components/BridgeModal/BridgeModal';
import ethereum from '../../assets/images/bridge/eth.svg';
import { ReactComponent as ethereumButtonIcon } from '../../assets/images/bridge/ethereum_btn_icon.svg';
import tezos from '../../assets/images/bridge/ic_tezos.svg';
//import { tokens } from '../../constants/swapPage';
import { createTokensList } from '../../apis/Config/BridgeConfig';
import { BridgeConfiguration } from '../../apis/Config/BridgeConfig';
//import { getAvailableLiquidityPairs } from '../../apis/WrappedAssets/WrappedAssets';
//import { BridgeConfiguration } from '../../apis/Config/BridgeConfig';
// import BridgeModal from '../../Components/TransferInProgress/BridgeTransferModal';
// import ApproveModal from '../../Components/TransferInProgress/ApproveModal';
// import MintModal from '../../Components/TransferInProgress/MintModal';
import { allTokens, DEFAULT_ETHEREUM_TOKEN, DEFAULT_TEZOS_TOKEN } from '../../constants/bridges';
import TransactionHistory from '../../Components/TransactionHistory/TransactionHistory';
import BridgeTransferModal from '../../Components/TransferInProgress/BridgeTransferModal';
import { getCurrentNetwork } from '../../apis/bridge/bridgeAPI';
import FlashMessage from '../../Components/FlashMessage/FlashMessage';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import '../Bridge/bridge.scss';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { connectWallet, disconnectWallet } from '../../apis/bridge/ethereumWalletConnect';

TimeAgo.addDefaultLocale(en);

const Bridge = (props) => {
  //const isMobile = useMediaQuery('(max-width: 991px)');
  const initialRender = useRef(true);
  const [transaction, setTransaction] = useState(1);

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  /* const [tokenIn, setTokenIn] = useState({
    name: tokensList['ETHEREUM'][0].name,
    image: tokensList['ETHEREUM'][0].image,
  });
  const [tokenOut, setTokenOut] = useState({
    name: `${tokensList['ETHEREUM'][0].name}.e`,   //Change after creating config.
    image: tokensList['ETHEREUM'][0].image
  }); */
  const [tokenIn, setTokenIn] = useState({
    name: '',
    image: '',
  });
  const [tokenOut, setTokenOut] = useState({
    name: '', //Change after creating config.
    image: '',
  });
  const [fromBridge, setFromBridge] = useState({
    name: 'ETHEREUM',
    image: ethereum,
    buttonImage: ethereumButtonIcon,
  });
  const [toBridge, setToBridge] = useState({ name: 'TEZOS', image: tezos, buttonImage: '' });
  const [fee, setFee] = useState(0);
  const [currentProgress, SetCurrentProgress] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [isApproved, setIsApproved] = useState(false);
  // const [isListening, setIsListening] = useState(false);
  //const [currentOperation, setCurrentOperation] = useState('BRIDGE');
  const [metamaskAddress, setMetamaskAddress] = useState(null);
  const [currentChain, setCurrentChain] = useState(fromBridge.name);
  const [metamaskChain, setMetamaskChain] = useState(null);

  const loadedTokensList = useRef(null);
  const switchButtonPressed = useRef(false);
  const operation = useRef('BRIDGE');

  const getTransactionListLength = useMemo(() => transactionData.length, [transactionData]);

  //const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);
  const [tokenList, setTokenList] = useState([]);

  const savedFromBridge = useRef(fromBridge);
  const savedToBridge = useRef(toBridge);
  const savedOperation = useRef(operation.current);
  const mintUnmintOpHash = useRef(null);
  const finalOpHash = useRef(null);
  const openingFromHistory = useRef(false);
  const openingFromTransaction = useRef(false);

  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [flashMessageType, setFlashMessageType] = useState('success');
  const flashMessageDuration = useRef(null);
  const [flashMessageTitle, setFlashMessageTitle] = useState('Title');
  const [flashMessageContent, setFlashMessageContent] = useState('Message');
  const [isFlashMessageALink, setIsFlashMessageALink] = useState(false);
  const flashMessageLink = useRef('#');

  const setOperation = (value) => {
    operation.current = value;
  };

  const setMintUnmintOpHash = (hash) => {
    mintUnmintOpHash.current = hash;
  };

  const setFinalOpHash = (hash) => {
    finalOpHash.current = hash;
  };

  const setOpeningFromHistory = (value) => {
    openingFromHistory.current = value;
  };

  const setSavedFromBridge = (data) => {
    savedFromBridge.current = data;
  };

  const setSavedToBridge = (data) => {
    savedToBridge.current = data;
  };

  const setSavedOperation = (data) => {
    savedOperation.current = data;
  };

  const setSwitchButtonPressed = (value) => {
    switchButtonPressed.current = value;
  };

  const setOpeningFromTransaction = (value) => {
    openingFromTransaction.current = value;
  };

  const displayMessage = useCallback((messageObj) => {
    console.log('display message called');
    setShowFlashMessage(false);
    setFlashMessageType(messageObj.type);
    messageObj.duration
      ? (flashMessageDuration.current = messageObj.duration)
      : (flashMessageDuration.current = null);
    setFlashMessageTitle(messageObj.title);
    setFlashMessageContent(messageObj.content);
    setIsFlashMessageALink(messageObj.isFlashMessageALink);
    messageObj.flashMessageLink ? (flashMessageLink.current = messageObj.flashMessageLink) : '#';
    setShowFlashMessage(true);
  }, []);

  useEffect(() => {
    console.log(localStorage?.getItem('isWalletConnected'));
    if (localStorage?.getItem('isWalletConnected') === 'true') {
      try {
        console.log('HERE');
        if (
          !localStorage?.getItem('-walletlink:https://www.walletlink.org:IsStandaloneSigning') &&
          localStorage?.getItem('WEB3_CONNECT_CACHED_PROVIDER') === '"coinbasewallet"'
        ) {
          console.log('disconnected');
          setMetamaskAddress(null);
          localStorage.setItem('isWalletConnected', false);
          disconnectWallet();
          // setIsListening(false);
        } else {
          connectWalletHandler();
        }
      } catch (ex) {
        localStorage.setItem('isWalletConnected', false);
      }
    }
  }, []);

  const connectWalletHandler = async () => {
    /*     console.log('Connecting');
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('MetaMask Here!');
      console.log(window.ethereum);
      // Set the provider to metamask to resolve the conflict between metamask and coinbase wallet.
      // Allow only metamask wallet to open on connecting.
      // if (window.ethereum.isMetaMask && window.ethereum.providers && window.ethereum.providers.length > 1) {
      //   window.ethereum.selectedProvider = window.ethereum.providers.find(
      //     (provider) => provider.isMetaMask,
      //   );
      //   console.log(window.ethereum.providers.find(
      //     (provider) => provider.isMetaMask,
      //   ));
      //   console.log(typeof window.ethereum.selectedProvider);
      // }
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((result) => {
          setMetamaskAddress(result[0]);
          localStorage.setItem('isWalletConnected', true);
        })
        .catch((error) => {
          console.log(error);
          localStorage.setItem('isWalletConnected', false);
        });
    } else {
      console.log('Need to install MetaMask');
      localStorage.setItem('isWalletConnected', false);
      displayMessage({
        type: 'warning',
        duration: null,
        title: 'Metamask Not Found',
        content: 'Please install Metamask wallet and reload.',
        isFlashMessageALink: false,
        flashMessageLink: '#',
      }); */

    const web3 = await connectWallet(setMetamaskAddress, props.theme);
    //listenEvents();

    if (web3.success) {
      metamaskChainChangeHandler();
      web3.provider.on('chainChanged', metamaskChainChangeHandler);
      web3.provider.on('accountsChanged', metamaskAccountChangeHandler);
      web3.provider.on('disconnect', onDisconnect);
      console.log(web3);
    }
  };

  const handleFlashMessageClose = useCallback(() => {
    console.log('close');
    setShowFlashMessage(false);
  }, [showFlashMessage]);

  const metamaskChainChangeHandler = useCallback(async () => {
    try {
      console.log('change handler triggered');
      const chainResult = await getCurrentNetwork();
      console.log(chainResult);
      setMetamaskChain(chainResult);
      /* if (chainResult !== undefined) {
        setMetamaskChain(chainResult);
      } else {
        throw new Error('Undefined Chain');
      } */
    } catch (error) {
      console.log(error.message);
      // Add flash message to show error or chain which doesn't exist on PLENTY DeFi.
      displayMessage({
        type: 'error',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Chain change error',
        content: error.message,
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
    }
  }, [metamaskChain]);

  const metamaskAccountChangeHandler = useCallback(
    (newAccount) => {
      console.log(newAccount[0]);
      if (newAccount.length > 0) {
        setMetamaskAddress(newAccount[0]);
        localStorage.setItem('isWalletConnected', true);
      } else {
        setMetamaskAddress(null);
        localStorage.setItem('isWalletConnected', false);
        disconnectWallet();
        // setIsListening(false);
      }
      //setMetamaskAddress(newAccount);
    },
    [metamaskAddress],
  );

  /*   const onConnect = useCallback((connectInfo) => {
    console.log('connected', connectInfo);
    localStorage.setItem('isWalletConnected', true);
  }, []);*/

  const onDisconnect = useCallback((connectInfo) => {
    console.log('disconnected', connectInfo);
    setMetamaskAddress(null);
    localStorage.setItem('isWalletConnected', false);
    disconnectWallet();
    // setIsListening(false);
  }, []);

  //Add all metamask event listeners and remove them on unmount.
  /*   const listenEvents = async () => {
    const providerData = await connectWallet();

    // Listen to chain change on metamask.
    providerData.provider.on('chainChanged', metamaskChainChangeHandler);
    // listen for account changes
    providerData.provider.on('accountsChanged', metamaskAccountChangeHandler);
    providerData.provider.on('disconnect', onDisconnect);
    setIsListening(true);
  }; */

  const removeListenEvents = async () => {
    const providerData = await connectWallet(null, props.theme);
    providerData.provider.removeListener('chainChanged', metamaskChainChangeHandler);
    providerData.provider.removeListener('disconnect', onDisconnect);
    providerData.provider.removeListener('accountsChanged', metamaskAccountChangeHandler);
    // setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        removeListenEvents();
      }
    };
  }, []);

  useEffect(() => {
    if (!initialRender.current) {
      console.log('FromBridge useEffect called..!!');
      // Check if the tokens list is loaded for the loaded config and if the loaded tokens list has the items for the selected chain. Display NA if no.
      if (
        !loadedTokensList.current ||
        !Object.prototype.hasOwnProperty.call(loadedTokensList.current, fromBridge.name)
      ) {
        setTokenList([]);
        setTokenIn({
          name: 'Token NA',
          image: '',
        });
        // Change after creating config.
        setTokenOut({
          name: 'Token NA',
          image: '', // Set image if required in design in future.
        });
      } else {
        if (fromBridge.name === 'TEZOS') {
          // Check if the tokens list created and config has reference tokens for selected 'TO' chain when 'FROM' is tezos.
          if (Object.prototype.hasOwnProperty.call(loadedTokensList.current.TEZOS, toBridge.name)) {
            //console.log('token list 3', loadedTokensList.current.TEZOS[toBridge.name][0]);
            setTokenList(loadedTokensList.current.TEZOS[toBridge.name]);
            if (!switchButtonPressed.current) {
              // Load USDC.e as default token, if not available then the first token in the list.
              const defaultToken =
                loadedTokensList.current.TEZOS[toBridge.name].find(
                  (token) => token.name === DEFAULT_TEZOS_TOKEN,
                ) || loadedTokensList.current.TEZOS[toBridge.name][0];
              setTokenIn(defaultToken);
              //Change after creating config.
              const outTokenName = BridgeConfiguration.getOutTokenUnbridging(
                toBridge.name,
                defaultToken.name,
              );
              setTokenOut({
                name: outTokenName,
                image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName)
                  ? allTokens[outTokenName]
                  : allTokens.fallback,
              });
            }
          } else {
            setTokenList([]);
            setTokenIn({
              name: 'Token NA',
              image: '',
            });
            // Change after creating config.
            setTokenOut({
              name: 'Token NA',
              image: '', // Set image if required in design in future.
            });
          }
        } else {
          console.log('token list 2', loadedTokensList.current[fromBridge.name][0]);
          setTokenList(loadedTokensList.current[fromBridge.name]);
          if (!switchButtonPressed.current) {
            // Load USDC as default token, if not available then the first token in the list.
            const defaultToken =
                loadedTokensList.current[fromBridge.name].find(
                  (token) => token.name === DEFAULT_ETHEREUM_TOKEN,
                ) || loadedTokensList.current[fromBridge.name][0];
            setTokenIn(defaultToken);
            // Change after creating config.
            const outTokenName = BridgeConfiguration.getOutTokenBridging(
              fromBridge.name,
              defaultToken.name,
            );
            setTokenOut({
              name: outTokenName,
              image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName)
                ? allTokens[outTokenName]
                : allTokens.fallback,
            });
          }
        }
      }
      setCurrentChain(fromBridge.name === 'TEZOS' ? toBridge.name : fromBridge.name);
      savedFromBridge.current = fromBridge;
      savedToBridge.current = toBridge;
      savedOperation.current = operation.current;
      setSwitchButtonPressed(false);
    } else {
      initialRender.current = false;
    }
  }, [fromBridge]);

  // Function to create tokens list from the loaded config.
  const loadTokensList = useCallback(() => {
    const tokensListResult = createTokensList();
    if (
      tokensListResult.success &&
      Object.prototype.hasOwnProperty.call(tokensListResult.data, fromBridge.name)
    ) {
      loadedTokensList.current = tokensListResult.data;
      setTokenList(loadedTokensList.current[fromBridge.name]);
      console.log('token in', loadedTokensList.current[fromBridge.name][0]);
      // Load USDC as default token, if not available then the first token in the list.
      const defaultToken =
        loadedTokensList.current[fromBridge.name].find((token) => token.name === DEFAULT_ETHEREUM_TOKEN) ||
        loadedTokensList.current[fromBridge.name][0];
      setTokenIn(defaultToken);
      // Change after creating config.
      const outTokenName = BridgeConfiguration.getOutTokenBridging(
        fromBridge.name,
        defaultToken.name,
      );
      setTokenOut({
        name: outTokenName,
        image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName)
          ? allTokens[outTokenName]
          : allTokens.fallback,
      });
    } else {
      loadedTokensList.current = tokensListResult.success ? tokensListResult.data : null;
      setTokenIn({
        name: 'Token NA',
        image: '',
        tokenData: null,
      });
      // Change after creating config.
      setTokenOut({
        name: 'Token NA',
        image: '', // Set image if required in design in future.
        tokenData: null,
      });
    }
    return tokensListResult.data;
  }, []);

  useEffect(() => {
    // Create tokens data from the loaded config first time the component loads. If the config is not loaded when this module is mounted,
    // then it will re-attempt to create tokens data after a time gap once, as loading of config from indexer api may sometimes be delayed.
    // This will also take care of the scenario if a user opens /bridge directly without the config loaded.
    let loadData = loadTokensList();
    //console.log(loadData);
    let timer;
    if (loadData.length === 0) {
      console.log('Reattempting to load tokens data from config...');
      timer = setTimeout(() => {
        loadData = loadTokensList();
        console.log(loadData);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, []);

  // Function to reset all the current states to default values
  const resetToDefaultStates = useCallback(() => {
    console.log('reset called');
    console.log(savedFromBridge.current, savedToBridge.current, savedOperation.current);
    setOperation(savedOperation.current);
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setToBridge(savedToBridge.current);
    setFromBridge(savedFromBridge.current);
    // setToBridge(savedToBridge.current);
    setTimeout(() => {
      console.log(savedToBridge.current);
      //setToBridge(savedToBridge.current);
    }, 500);
    /* const [tokenIn, setTokenIn] = useState({
      name: tokensList['ETHEREUM'][0].name,
      image: tokensList['ETHEREUM'][0].image,
    });
    const [tokenOut, setTokenOut] = useState({
      name: `${tokensList['TEZOS'][0].name}`,   //Change after creating config.
      image: tokensList['TEZOS'][0].image
    }); */
    setFee(0);
    SetCurrentProgress(0);
    //setSelectedId(0);
  }, []);

  return (
    <>
      <Container fluid className="bridge-main-component">
        <Row className={clsx('row justify-content-center')}>
          <Col xs={11} sm={11} md={10} lg={6} xl={6}>
            <BridgeText />
          </Col>
          <Col xs={20} sm={10} md={10} lg={6} xl={6} className="bridge-modal-main-div">
            {transaction === 1 && (
              <BridgeModal
                walletAddress={props.walletAddress}
                transaction={transaction}
                setTransaction={setTransaction}
                fromBridge={fromBridge}
                toBridge={toBridge}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                firstTokenAmount={firstTokenAmount}
                secondTokenAmount={secondTokenAmount}
                fee={fee}
                currentProgress={currentProgress}
                operation={operation.current}
                setFromBridge={setFromBridge}
                setToBridge={setToBridge}
                setTokenIn={setTokenIn}
                setTokenOut={setTokenOut}
                setFirstTokenAmount={setFirstTokenAmount}
                setSecondTokenAmount={setSecondTokenAmount}
                setFee={setFee}
                SetCurrentProgress={SetCurrentProgress}
                setOperation={setOperation}
                tokenList={tokenList}
                setTokenList={setTokenList}
                loadedTokensList={loadedTokensList.current}
                theme={props.theme}
                setOpeningFromHistory={setOpeningFromHistory}
                metamaskAddress={metamaskAddress}
                setMetamaskAddress={setMetamaskAddress}
                currentChain={currentChain}
                metamaskChain={metamaskChain}
                displayMessage={displayMessage}
                setSwitchButtonPressed={setSwitchButtonPressed}
                connectWalletHandler={connectWalletHandler}
                setIsApproved={setIsApproved}
              />
            )}
            {transaction === 2 && (
              <TransactionHistory
                transaction={transaction}
                setTransaction={setTransaction}
                transactionData={transactionData}
                setFromBridge={setFromBridge}
                setToBridge={setToBridge}
                setTokenIn={setTokenIn}
                setTokenOut={setTokenOut}
                setFirstTokenAmount={setFirstTokenAmount}
                setSecondTokenAmount={setSecondTokenAmount}
                setFee={setFee}
                SetCurrentProgress={SetCurrentProgress}
                setOperation={setOperation}
                setSelectedId={setSelectedId}
                theme={props.theme}
                setTransactionData={setTransactionData}
                setMintUnmintOpHash={setMintUnmintOpHash}
                setFinalOpHash={setFinalOpHash}
                setOpeningFromHistory={setOpeningFromHistory}
                walletAddress={props.walletAddress}
                metamaskAddress={metamaskAddress}
                currentChain={currentChain}
                metamaskChain={metamaskChain}
                loadedTokensList={loadedTokensList.current}
                setSavedFromBridge={setSavedFromBridge}
                setSavedToBridge={setSavedToBridge}
                setSavedOperation={setSavedOperation}
                fromBridge={fromBridge}
                toBridge={toBridge}
                operation={operation.current}
                resetToDefaultStates={resetToDefaultStates}
                displayMessage={displayMessage}
                openingFromTransaction={openingFromTransaction.current}
                setOpeningFromTransaction={setOpeningFromTransaction}
              />
            )}
            {transaction === 3 && (
              <BridgeTransferModal
                walletAddress={props.walletAddress}
                transaction={transaction}
                setTransaction={setTransaction}
                fromBridge={fromBridge}
                toBridge={toBridge}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                firstTokenAmount={firstTokenAmount}
                secondTokenAmount={secondTokenAmount}
                fee={fee}
                currentProgress={currentProgress}
                operation={operation.current}
                selectedId={selectedId}
                setFromBridge={setFromBridge}
                setToBridge={setToBridge}
                setTokenIn={setTokenIn}
                setTokenOut={setTokenOut}
                setFirstTokenAmount={setFirstTokenAmount}
                setSecondTokenAmount={setSecondTokenAmount}
                setFee={setFee}
                SetCurrentProgress={SetCurrentProgress}
                setOperation={setOperation}
                resetToDefaultStates={resetToDefaultStates}
                setTransactionData={setTransactionData}
                getTransactionListLength={getTransactionListLength}
                setSelectedId={setSelectedId}
                theme={props.theme}
                mintUnmintOpHash={mintUnmintOpHash.current}
                setMintUnmintOpHash={setMintUnmintOpHash}
                finalOpHash={finalOpHash.current}
                setFinalOpHash={setFinalOpHash}
                openingFromHistory={openingFromHistory.current}
                displayMessage={displayMessage}
                setOpeningFromHistory={setOpeningFromHistory}
                isApproved={isApproved}
                setIsApproved={setIsApproved}
                setOpeningFromTransaction={setOpeningFromTransaction}
              />
            )}
          </Col>
        </Row>
      </Container>
      {/* <FlashMessage
        loading={false}
        show={showFlashMessage}
        type={'success'}
        title={'CTEZ / TEZ LP Created'}
        //content={`View on TzKT${' '}<span className=" material-icons-round launch-icon-flash">launch</span>`}
        onClose={handleFlashMessageClose}
        duration={null}
      >
        <p style={{cursor: 'pointer'}}>
        View on TzKT{' '}<span className=" material-icons-round launch-icon-flash">launch</span>
        </p>
      </FlashMessage> */}
      <FlashMessage
        show={showFlashMessage}
        type={flashMessageType}
        title={flashMessageTitle}
        onClose={handleFlashMessageClose}
        duration={flashMessageDuration.current}
      >
        <p
          className={isFlashMessageALink ? 'linkText' : 'normalText'}
          style={{ cursor: isFlashMessageALink ? 'pointer' : 'auto' }}
          onClick={
            isFlashMessageALink ? () => window.open(flashMessageLink.current, '_blank') : null
          }
        >
          {flashMessageContent}
          {isFlashMessageALink && (
            <span className=" material-icons-round launch-icon-flash">launch</span>
          )}
        </p>
      </FlashMessage>
    </>
  );
};

export default Bridge;

Bridge.propTypes = {
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
};
