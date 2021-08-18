import React, { useState, useEffect } from 'react';
import {
  loadSwapData,
  computeTokenOutput,
  fetchAllWalletBalance,
  getTokenPrices,
} from '../apis/swap/swap';

import TransactionSettings from '../Components/TransactionSettings/TransactionSettings';
import SwapModal from '../Components/SwapModal/SwapModal';
import SwapTab from '../Components/SwapTabsContent/SwapTab';
import LiquidityTab from '../Components/SwapTabsContent/LiquidityTab';
import Loader from '../Components/loader';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import plenty from '../assets/images/logo_small.png';
import wusdc from '../assets/images/wusdc.png';
import wbusd from '../assets/images/wBUSD.png';
import wwbtc from '../assets/images/wwbtc.png';

const Swap = (props) => {
  const tokens = [
    {
      name: 'PLENTY',
      image: plenty,
    },
    {
      name: 'wUSDC',
      image: wusdc,
    },
    {
      name: 'wBUSD',
      image: wbusd,
    },
    {
      name: 'wWBTC',
      image: wwbtc,
    },
  ];

  const [show, setShow] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [showConfirmAddSupply, setShowConfirmAddSupply] = useState(false);
  const [showConfirmRemoveSupply, setShowConfirmRemoveSupply] = useState(false);
  const [hideContent, setHideContent] = useState('');

  const handleClose = () => {
    setShow(false);
    setShowConfirmSwap(false);
    setShowConfirmAddSupply(false);
    setShowConfirmRemoveSupply(false);
    setHideContent('');
    setLoading(false);
  };
  const [slippage, setSlippage] = useState(0.05);
  const [recepient, setRecepient] = useState('');
  const [tokenType, setTokenType] = useState('tokenIn');
  const [tokenOut, setTokenOut] = useState({});
  const [firstTokenAmount, setFirstTokenAmount] = useState(0);
  const [swapData, setSwapData] = useState({});
  const [computedOutDetails, setComputedOutDetails] = useState({});
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [tokenIn, setTokenIn] = useState({
    name: 'PLENTY',
    image: plenty,
  });

  const changeTokenLocation = () => {
    const tempTokenIn = tokenIn.name;
    const tempTokenOut = tokenOut.name;
    if (tokenOut.name) {
      setTokenIn({
        name: tokenOut.name,
        image: tokenOut.image,
      });
      setTokenOut({
        name: tokenIn.name,
        image: tokenIn.image,
      });
      setSwapData({});
      setComputedOutDetails({
        tokenOut_amount: 0,
      });
      setFirstTokenAmount(0);

      loadSwapData(tempTokenOut, tempTokenIn).then((data) => {
        if (data.success) {
          setSwapData(data);
        }
      });
    }
  };

  const selectToken = (token) => {
    setLoading(true);
    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });
      loadSwapData(token.name, tokenOut.name).then((data) => {
        if (data.success) {
          setSwapData(data);
          setLoading(false);
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
          setLoading(false);
        }
      });
    }
    handleClose();
  };

  const handleTokenType = (type) => {
    setHideContent('content-hide');
    setShow(true);
    setTokenType(type);

    setLoading(false);
  };

  const handleTokenInput = (input) => {
    setFirstTokenAmount(parseFloat(input));
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount(0);
      setComputedOutDetails({
        tokenOut_amount: 0,
        fees: 0,
      });
      return;
    } else {
      const computedData = computeTokenOutput(
        parseFloat(input),
        swapData.tokenIn_supply,
        swapData.tokenOut_supply,
        swapData.exchangeFee,
        slippage
      );
      setComputedOutDetails(computedData);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (!props.walletAddress) {
      return;
    }
    fetchAllWalletBalance(props.walletAddress).then((resp) => {
      setUserBalances(resp.userBalances);
      setTokenContractInstances(resp.contractInstances);
      setLoading(false);
    });
  }, [props.walletAddress]);

  useEffect(() => {
    setLoading(true);
    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      setLoading(false);
    });
  }, []);

  const handleLoaderMessage = (type, message) => {
    setLoaderMessage({
      type: type,
      message: message,
    });
    setLoading(false);
  };

  const resetAllValues = () => {
    setSlippage(0.05);
    setRecepient('');
    setTokenType('tokenIn');
    setTokenOut({});
    setFirstTokenAmount(0);
    setSwapData({});
    setComputedOutDetails({});
    setGetTokenPrice({});
    setUserBalances({});
    setTokenContractInstances({});
    setLoading(false);
    setLoaderMessage({});
    setTokenIn({
      name: 'PLENTY',
      image: plenty,
    });
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={8} md={6} className="swap-content-section">
          <div className={`swap-content-container ${hideContent}`}>
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
                  userBalances={userBalances}
                  tokenContractInstances={tokenContractInstances}
                  getTokenPrice={getTokenPrice}
                  setSlippage={setSlippage}
                  setRecepient={setRecepient}
                  recepient={recepient}
                  slippage={slippage}
                  loading={loading}
                  setLoading={setLoading}
                  handleLoaderMessage={handleLoaderMessage}
                  loaderMessage={loaderMessage}
                  setShowConfirmSwap={setShowConfirmSwap}
                  showConfirmSwap={showConfirmSwap}
                  handleClose={handleClose}
                  setHideContent={setHideContent}
                  setLoaderMessage={setLoaderMessage}
                  resetAllValues={resetAllValues}
                  changeTokenLocation={changeTokenLocation}
                />
              </Tab>
              <Tab eventKey="liquidity" title="Liquidity">
                <LiquidityTab
                  walletAddress={props.walletAddress}
                  setFirstTokenAmount={handleTokenInput}
                  firstTokenAmount={firstTokenAmount}
                  connecthWallet={props.connecthWallet}
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                  handleTokenType={handleTokenType}
                  swapData={swapData}
                  computedOutDetails={computedOutDetails}
                  userBalances={userBalances}
                  tokenContractInstances={tokenContractInstances}
                  getTokenPrice={getTokenPrice}
                  setSlippage={setSlippage}
                  setRecepient={setRecepient}
                  recepient={recepient}
                  slippage={slippage}
                  loading={loading}
                  setLoading={setLoading}
                  handleLoaderMessage={handleLoaderMessage}
                  loaderMessage={loaderMessage}
                  handleClose={handleClose}
                  showConfirmAddSupply={showConfirmAddSupply}
                  setShowConfirmAddSupply={setShowConfirmAddSupply}
                  showConfirmRemoveSupply={showConfirmRemoveSupply}
                  setShowConfirmRemoveSupply={setShowConfirmRemoveSupply}
                  setHideContent={setHideContent}
                  setLoaderMessage={setLoaderMessage}
                  resetAllValues={resetAllValues}
                />
              </Tab>
            </Tabs>

            <TransactionSettings
              recepient={recepient}
              slippage={slippage}
              setSlippage={setSlippage}
              setRecepient={setRecepient}
              walletAddress={props.walletAddress}
            />
          </div>
        </Col>
      </Row>
      <SwapModal
        show={show}
        onHide={handleClose}
        selectToken={selectToken}
        tokens={tokens}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
      ></SwapModal>

      <Loader loading={loading} loaderMessage={loaderMessage} />
    </Container>
  );
};

export default Swap;
