import React, { useState } from 'react';
import { loadSwapData, computeTokenOutput } from '../apis/swap/swap';

import TransactionSettings from '../Components/TransactionSettings/TransactionSettings';
import SwapModal from '../Components/SwapModal/SwapModal';
import SwapTab from '../Components/SwapTabsContent/SwapTab';
import LiquidityTab from '../Components/SwapTabsContent/LiquidityTab';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import plenty from '../assets/images/logo_small.png';
import kalam from '../assets/images/kalam.png';
import wrap from '../assets/images/wrap.png';
import wdai from '../assets/images/wdai.png';

const Swap = (props) => {
  const tokens = [
    {
      name: 'PLENTY',
      image: plenty,
    },
    {
      name: 'KALAM',
      image: kalam,
    },
    {
      name: 'WRAP',
      image: wrap,
    },
    {
      name: 'wDAI',
      image: wdai,
    },
  ];

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [tokenType, setTokenType] = useState('tokenIn');

  const [tokenIn, setTokenIn] = useState({
    name: 'PLENTY',
    image: plenty,
  });
  const [tokenOut, setTokenOut] = useState({
    name: 'PLENTY',
    image: plenty,
  });
  const [firstTokenAmount, setFirstTokenAmount] = useState(0);
  const [swapData, setSwapData] = useState({});
  const [computedOutDetails, setComputedOutDetails] = useState({});

  const selectToken = (token) => {
    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });
      loadSwapData(token.name, tokenOut.name).then((data) => {
        if (data.success) {
          setSwapData(data);
        }
      });
    } else {
      setTokenOut({
        name: token.name,
        image: token.image,
      });
      loadSwapData(tokenIn.name, token.name).then((data) => {
        if (data.success) {
          setSwapData(data);
        }
      });
    }

    handleClose();
  };

  const handleTokenType = (type) => {
    setShow(true);
    setTokenType(type);
  };

  const handleTokenInput = (input) => {
    setFirstTokenAmount(parseFloat(input));
    if (input === '' || isNaN(input)) {
      setComputedOutDetails({
        tokenOut_amount: 0,
        fees: 0,
      });
      return;
    } else {
      const conputedData = computeTokenOutput(
        parseFloat(input),
        swapData.tokenIn_supply,
        swapData.tokenOut_supply,
        swapData.exchangeFee
      );
      setComputedOutDetails(conputedData);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={8} md={4} className="swap-content-section">
          <div className="swap-content-container">
            <Tabs defaultActiveKey="swap" className="swap-container-tab">
              <Tab eventKey="swap" title="Swap">
                <SwapTab
                  walletAddress={props.walletAddress}
                  setFirstTokenAmount={handleTokenInput}
                  firstTokenAmount={firstTokenAmount}
                  connecthWallet={props.connecthWallet}
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                  handleTokenType={handleTokenType}
                  swapData={swapData}
                  computedOutDetails={computedOutDetails}
                />
              </Tab>
              <Tab eventKey="liquidity" title="Liquidity">
                <LiquidityTab
                  walletAddress={props.walletAddress}
                  firstTokenAmount={firstTokenAmount}
                  setFirstTokenAmount={handleTokenInput}
                  connecthWallet={props.connecthWallet}
                />
              </Tab>
            </Tabs>

            <TransactionSettings />
          </div>
        </Col>
      </Row>
      <SwapModal
        show={show}
        onHide={handleClose}
        selectToken={selectToken}
        tokens={tokens}
      ></SwapModal>
    </Container>
  );
};

export default Swap;
