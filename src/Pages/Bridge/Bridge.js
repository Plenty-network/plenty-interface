import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './bridge.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BridgeText from '../../Components/BridgeText/BridgeText';
import BridgeModal from '../../Components/BridgeModal/BridgeModal';
import ethereum from '../../assets/images/bridge/eth.svg';
import tezos from '../../assets/images/bridge/tezos.svg';
//import { tokens } from '../../constants/swapPage';
import { tokensList } from '../../constants/bridges';
//import { getAvailableLiquidityPairs } from '../../apis/WrappedAssets/WrappedAssets';
//import { BridgeConfiguration } from '../../apis/Config/BridgeConfig';
// import BridgeModal from '../../Components/TransferInProgress/BridgeTransferModal';
// import ApproveModal from '../../Components/TransferInProgress/ApproveModal';
// import MintModal from '../../Components/TransferInProgress/MintModal';

import useMediaQuery from '../../hooks/mediaQuery';

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
    firstTokenAmount: 23.3930,
    secondTokenAmount: 22.3930,
    fee: 1,
    date: '03/02/2022',
    time: '15:23'
  },
  {
    id: 1,
    currentProgress: 4,
    operation: 'UNBRIDGE',
    fromBridge: 'TEZOS',
    toBridge: 'ETHEREUM',
    tokenIn: 'DAI.e',
    tokenOut: 'DAI',
    firstTokenAmount: 3.3930,
    secondTokenAmount: 2.3930,
    fee: 1,
    date: '03/02/2022',
    time: '19:23'
  },
  {
    id: 2,
    currentProgress: 2,
    operation: 'BRIDGE',
    fromBridge: 'ETHEREUM',
    toBridge: 'TEZOS',
    tokenIn: 'DAI',
    tokenOut: 'DAI.e',
    firstTokenAmount: 13.3930,
    secondTokenAmount: 12.3930,
    fee: 1,
    date: '04/02/2022',
    time: '15:23'
  },
  {
    id: 3,
    currentProgress: 2,
    operation: 'UNBRIDGE',
    fromBridge: 'TEZOS',
    toBridge: 'ETHEREUM',
    tokenIn: 'DAI.e',
    tokenOut: 'DAI',
    firstTokenAmount: 27.3930,
    secondTokenAmount: 26.3930,
    fee: 1,
    date: '03/02/2022',
    time: '23:23'
  },
  {
    id: 4,
    currentProgress: 4,
    operation: 'BRIDGE',
    fromBridge: 'ETHEREUM',
    toBridge: 'TEZOS',
    tokenIn: 'WBTC',
    tokenOut: 'WBTC.e',
    firstTokenAmount: 67.3930,
    secondTokenAmount: 26.3930,
    fee: 1,
    date: '09/02/2022',
    time: '18:23'
  }
];

const Bridge = (props) => {
  //const isMobile = useMediaQuery('(max-width: 991px)');
  const [transaction, setTransaction] = useState(1);

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [tokenIn, setTokenIn] = useState({
    name: tokensList['ETHEREUM'][0].name,
    image: tokensList['ETHEREUM'][0].image,
  });
  const [tokenOut, setTokenOut] = useState({
    name: `${tokensList['ETHEREUM'][0].name}.e`,   //Change after creating config.
    image: tokensList['ETHEREUM'][0].image
  });
  const [fromBridge, setFromBridge] = useState({name: 'ETHEREUM', image: ethereum, buttonImage: ethereum});
  const [toBridge, setToBridge] = useState({name: 'TEZOS', image: tezos, buttonImage: ''});
  const [fee, setFee] = useState(0);
  const [currentProgress,SetCurrentProgress] = useState(0);
  const [selectedId, setSelectedId] = useState(0);
  const [transactionData, setTransactionData] = useState(transactions);
  //const [currentOperation, setCurrentOperation] = useState('BRIDGE');
  const operation = useRef('BRIDGE');

  const setOperation = (value) => {
    operation.current = value;
  };

  const getTransactionListLength = () => transactionData.length;

  const [tokenList, setTokenList] = useState(tokensList[fromBridge.name]);

  useEffect(() => {
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
  }, [fromBridge]);

  /* useEffect(() => {
    //console.log(BridgeConfiguration.getTezosWrappedTokens('AVALANCHE'));
    console.log(getAvailableLiquidityPairs('wUSDC'));
  }, []); */


  // Function to reset all the current states to default values
  const resetToDefaultStates = () => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setFromBridge({name: 'ETHEREUM', image: ethereum, buttonImage: ethereum});
    setToBridge({name: 'TEZOS', image: tezos, buttonImage: ''});
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
            {transaction===1 && (
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
              />
            )} 
            {transaction===2 && (
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
              />
            )}
            {transaction===3 && (
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
};
