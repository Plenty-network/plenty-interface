import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BridgeText from '../../Components/BridgeText/BridgeText';
import BridgeModal from '../../Components/BridgeModal/BridgeModal';
import ethereum from '../../assets/images/bridge/eth.svg';
import tezos from '../../assets/images/bridge/tezos.svg';
//import { tokens } from '../../constants/swapPage';
import { createTokensList } from '../../apis/Config/BridgeConfig';
import { BridgeConfiguration } from '../../apis/Config/BridgeConfig';
//import { getAvailableLiquidityPairs } from '../../apis/WrappedAssets/WrappedAssets';
//import { BridgeConfiguration } from '../../apis/Config/BridgeConfig';
// import BridgeModal from '../../Components/TransferInProgress/BridgeTransferModal';
// import ApproveModal from '../../Components/TransferInProgress/ApproveModal';
// import MintModal from '../../Components/TransferInProgress/MintModal';
import { allTokens } from '../../constants/bridges';
import TransactionHistory from '../../Components/TransactionHistory/TransactionHistory';
import BridgeTransferModal from '../../Components/TransferInProgress/BridgeTransferModal';

const transactions = [
  {
    id: 0,
    currentProgress: 4,
    operation: 'BRIDGE',
    fromBridge: 'ETHEREUM',
    toBridge: 'TEZOS',
    tokenIn: 'DAI',
    tokenOut: 'DAI.e',
    firstTokenAmount: 23.393,
    secondTokenAmount: 22.393,
    fee: 1,
    date: '03/02/2022',
    time: '15:23',
  },
  {
    id: 1,
    currentProgress: 4,
    operation: 'UNBRIDGE',
    fromBridge: 'TEZOS',
    toBridge: 'ETHEREUM',
    tokenIn: 'DAI.e',
    tokenOut: 'DAI',
    firstTokenAmount: 3.393,
    secondTokenAmount: 2.393,
    fee: 1,
    date: '03/02/2022',
    time: '19:23',
  },
  {
    id: 2,
    currentProgress: 2,
    operation: 'BRIDGE',
    fromBridge: 'ETHEREUM',
    toBridge: 'TEZOS',
    tokenIn: 'DAI',
    tokenOut: 'DAI.e',
    firstTokenAmount: 13.393,
    secondTokenAmount: 12.393,
    fee: 1,
    date: '04/02/2022',
    time: '15:23',
  },
  {
    id: 3,
    currentProgress: 2,
    operation: 'UNBRIDGE',
    fromBridge: 'TEZOS',
    toBridge: 'ETHEREUM',
    tokenIn: 'DAI.e',
    tokenOut: 'DAI',
    firstTokenAmount: 27.393,
    secondTokenAmount: 26.393,
    fee: 1,
    date: '03/02/2022',
    time: '23:23',
  },
  {
    id: 4,
    currentProgress: 4,
    operation: 'BRIDGE',
    fromBridge: 'ETHEREUM',
    toBridge: 'TEZOS',
    tokenIn: 'WBTC',
    tokenOut: 'WBTC.e',
    firstTokenAmount: 67.393,
    secondTokenAmount: 26.393,
    fee: 1,
    date: '09/02/2022',
    time: '18:23',
  },
];

const Bridge = (props) => {
  //const isMobile = useMediaQuery('(max-width: 991px)');
  const initialRender = useRef(true);
  const [transaction, setTransaction] = useState(3);

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
    buttonImage: ethereum,
  });
  const [toBridge, setToBridge] = useState({ name: 'TEZOS', image: tezos, buttonImage: '' });
  const [fee, setFee] = useState(0);
  const [currentProgress, SetCurrentProgress] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [transactionData, setTransactionData] = useState(transactions);
  //const [currentOperation, setCurrentOperation] = useState('BRIDGE');
  const loadedTokensList = useRef(null);
  const operation = useRef('BRIDGE');

  const setOperation = (value) => {
    operation.current = value;
  };

  const getTransactionListLength = () => transactionData.length;

  //const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);
  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    if (!initialRender.current) {
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
            setTokenIn(loadedTokensList.current.TEZOS[toBridge.name][0]);
            //Change after creating config.
            const outTokenName = BridgeConfiguration.getOutTokenUnbridging(
              toBridge.name,
              loadedTokensList.current.TEZOS[toBridge.name][0].name);
            setTokenOut({
              name: outTokenName,
              image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName) ? allTokens[outTokenName] : allTokens.fallback,
            });
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
          //console.log('token list 2', loadedTokensList.current[fromBridge.name][0]);
          setTokenList(loadedTokensList.current[fromBridge.name]);
          setTokenIn(loadedTokensList.current[fromBridge.name][0]);
          // Change after creating config.
          const outTokenName = BridgeConfiguration.getOutTokenBridging(
            fromBridge.name,
            loadedTokensList.current[fromBridge.name][0].name,
          );
          setTokenOut({
            name: outTokenName,
            image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName) ? allTokens[outTokenName] : allTokens.fallback,
          });
        }
      }
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
      setTokenIn(loadedTokensList.current[fromBridge.name][0]);
      // Change after creating config.
      const outTokenName = BridgeConfiguration.getOutTokenBridging(
        fromBridge.name,
        loadedTokensList.current[fromBridge.name][0].name,
      );
      setTokenOut({
        name: outTokenName,
        image: Object.prototype.hasOwnProperty.call(allTokens, outTokenName) ? allTokens[outTokenName] : allTokens.fallback,
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
  const resetToDefaultStates = () => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setFromBridge({ name: 'ETHEREUM', image: ethereum, buttonImage: ethereum });
    setToBridge({ name: 'TEZOS', image: tezos, buttonImage: '' });
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
    setOperation('BRIDGE');
  };

  return (
    <>
      <Container fluid>
        <Row className={clsx('row justify-content-center')}>
          <Col xs={10} sm={8} md={10} lg={5} xl={5}>
            <BridgeText />
          </Col>
          <Col xs={20} sm={10} md={10} lg={6} xl={6}>
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
                loadedTokensList={loadedTokensList}
                theme={props.theme}
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
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Bridge;

Bridge.propTypes = {
  walletAddress: PropTypes.any,
  theme: PropTypes.any
};
