import React, { useState, useEffect } from 'react';
import {
  loadSwapData,
  computeTokenOutput,
  fetchAllWalletBalance,
  getTokenPrices,
  computeOutputBasedOnTokenOutAmount,
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
import InfoModal from '../Components/Ui/Modals/InfoModal';

import plenty from '../assets/images/logo_small.png';
import wusdc from '../assets/images/wusdc.png';
import wbusd from '../assets/images/wBUSD.png';
import wwbtc from '../assets/images/wwbtc.png';
import wmatic from '../assets/images/wmatic.png';
import wlink from '../assets/images/wlink.png';
import usdtz from '../assets/images/usdtz.png';
import kusd from '../assets/images/kusd.png';
import hDAO from '../assets/images/hdao.png';
import ETHtz from '../assets/images/ethtz.png';
import wWETH from '../assets/images/wweth.png';
import QUIPU from '../assets/images/quipu.png';

const Swap = (props) => {
  const tokens = [
    {
      name: 'ETHtz',
      image: ETHtz,
      new: true,
    },
    {
      name: 'hDAO',
      image: hDAO,
      new: true,
    },
    {
      name: 'kUSD',
      image: kusd,
      new: true,
    },
    {
      name: 'PLENTY',
      image: plenty,
      new: false,
    },
    {
      name: 'QUIPU',
      image: QUIPU,
      new: true,
    },
    {
      name: 'USDtz',
      image: usdtz,
      new: false,
    },
    {
      name: 'wBUSD',
      image: wbusd,
      new: false,
    },
    {
      name: 'wLINK',
      image: wlink,
      new: false,
    },
    {
      name: 'wMATIC',
      image: wmatic,
      new: false,
    },
    {
      name: 'wUSDC',
      image: wusdc,
      new: false,
    },
    {
      name: 'wWBTC',
      image: wwbtc,
      new: false,
    },
    {
      name: 'wWETH',
      image: wWETH,
      new: true,
    },
  ];

  const [show, setShow] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [showConfirmAddSupply, setShowConfirmAddSupply] = useState(false);
  const [showConfirmRemoveSupply, setShowConfirmRemoveSupply] = useState(false);
  const [hideContent, setHideContent] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  const [tokenType, setTokenType] = useState('tokenIn');
  const [tokenOut, setTokenOut] = useState({});
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [swapData, setSwapData] = useState({});
  const [computedOutDetails, setComputedOutDetails] = useState({});
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [loaderInButton, setLoaderInButton] = useState(false);
  const [tokenIn, setTokenIn] = useState({
    name: 'PLENTY',
    image: plenty,
  });
  const urlSearchParameters = new URLSearchParams(window.location.search);
  const parameters = Object.fromEntries(urlSearchParameters.entries());

  if (parameters.tokenA && parameters.tokenB) {
    localStorage.setItem('activeTab', 'liquidity');
  }

  const handleClose = () => {
    setShow(false);
    setShowConfirmSwap(false);
    setShowConfirmAddSupply(false);
    setShowConfirmRemoveSupply(false);
    setHideContent('');
    //setLoading(false);
  };

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
        tokenOut_amount: '',
      });
      setFirstTokenAmount('');
      setSecondTokenAmount('');

      loadSwapData(tempTokenOut, tempTokenIn).then((data) => {
        if (data.success) {
          setSwapData(data);
        }
      });
    }
  };

  const handleTokenType = (type) => {
    setHideContent('content-hide');
    setShow(true);
    setTokenType(type);
    setLoading(false);
  };

  const handleTokenInput = (input) => {
    setFirstTokenAmount(input);
    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      setComputedOutDetails({
        tokenOut_amount: '',
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

  const handleOutTokenInput = (input) => {
    setSecondTokenAmount(input);
    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
      setFirstTokenAmount('');
      setComputedOutDetails({
        tokenOut_amount: '',
        fees: 0,
      });
      return;
    } else {
      const computedData = computeOutputBasedOnTokenOutAmount(
        parseFloat(input),
        swapData.tokenIn_supply,
        swapData.tokenOut_supply,
        swapData.exchangeFee,
        slippage
      );
      setFirstTokenAmount(computedData.tokenIn_amount);
      setComputedOutDetails(computedData);
    }
  };

  const fetchUserWalletBalance = () => {
    setLoaderInButton(true);
    fetchAllWalletBalance(props.walletAddress).then((resp) => {
      setUserBalances(resp.userBalances);
      setTokenContractInstances(resp.contractInstances);
      setLoaderInButton(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    setLoaderInButton(true);
    if (!props.walletAddress) {
      return;
    }
    fetchUserWalletBalance();
  }, [props.walletAddress]);

  useEffect(() => {
    //setLoading(true);
    setLoaderInButton(true);
    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      //setLoading(false);
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
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setSwapData({});
    setComputedOutDetails({
      tokenOut_amount: '',
    });
    setGetTokenPrice({});
    setTokenContractInstances({});
    setTokenIn({
      name: 'PLENTY',
      image: plenty,
    });
  };
  const [showRecepient, setShowRecepient] = useState(false);
  const handleRecepient = (elem) => {
    setRecepient(elem);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] =
    useState(false);
  const [transactionId, setTransactionId] = useState('');

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab'));

  const storeActiveTab = (elem) => {
    setActiveTab(elem);
    localStorage.setItem('activeTab', elem);
    window.history.pushState({ path: `/${elem}` }, '', `/${elem}`);
  };

  let showActiveTab = localStorage.getItem('activeTab');

  if (
    window.location.pathname.replace('/', '') == 'liquidity' ||
    activeTab == 'liquidity'
  ) {
    showActiveTab = 'liquidity';
  }

  const selectToken = (token) => {
    setLoaderInButton(true);
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setSwapData({});
    setComputedOutDetails({
      tokenOut_amount: '',
    });
    //setLoading(true);

    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });

      if (window.location.pathname.replace('/', '') == 'swap') {
        if (tokenOut.name) {
          window.history.pushState(
            {
              path: `/swap?from=${token.name}&to=${tokenOut.name}`,
            },
            '',
            `/swap?from=${token.name}&to=${tokenOut.name}`
          );
        } else {
          window.history.pushState(
            { path: `/swap?from=${token.name}` },
            '',
            `/swap?from=${token.name}`
          );
        }
      } else {
        if (tokenOut.name) {
          window.history.pushState(
            {
              path: `/liquidity/add?tokenA=${token.name}&tokenB=${tokenOut.name}`,
            },
            '',
            `/liquidity/add?tokenA=${token.name}&tokenB=${tokenOut.name}`
          );
        } else {
          window.history.pushState(
            { path: `/liquidity/add?tokenA=${token.name}` },
            '',
            `/liquidity/add?tokenA=${token.name}`
          );
        }
      }

      loadSwapData(token.name, tokenOut.name).then((data) => {
        if (data.success) {
          setSwapData(data);
          //setLoading(false);
          setLoaderInButton(false);
        }
      });
    } else {
      setTokenOut({
        name: token.name,
        image: token.image,
      });
      if (window.location.pathname.replace('/', '') == 'swap') {
        window.history.pushState(
          {
            path: `/swap?from=${tokenIn.name}&to=${token.name}`,
          },
          '',
          `/swap?from=${tokenIn.name}&to=${token.name}`
        );
      } else {
        window.history.pushState(
          {
            path: `/liquidity/add?tokenA=${tokenIn.name}&tokenB=${token.name}`,
          },
          '',
          `/liquidity/add?tokenA=${tokenIn.name}&tokenB=${token.name}`
        );
      }

      loadSwapData(tokenIn.name, token.name).then((data) => {
        if (data.success) {
          setSwapData(data);
          //setLoading(false);
          setLoaderInButton(false);
        }
      });
    }
    handleClose();
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params.from !== params.to) {
      if (params.from) {
        tokens.map((token) => {
          if (token.name == params.from) {
            setTokenIn({
              name: params.from,
              image: token.image,
            });
          }
        });
      }

      if (params.to) {
        tokens.map((token) => {
          if (token.name == params.to) {
            setTokenOut({
              name: params.to,
              image: token.image,
            });
          }
        });
      }
    }

    if (params.from && params.to) {
      loadSwapData(params.from, params.to).then((data) => {
        if (data.success) {
          setSwapData(data);
          //setLoading(false);
          setLoaderInButton(false);
        }
      });
    }
    if (params.tokenA && params.tokenB) {
      loadSwapData(params.tokenA, params.tokenB).then((data) => {
        if (data.success) {
          setSwapData(data);
          //setLoading(false);
          setLoaderInButton(false);
        }
      });
    }
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col sm={8} md={6} className="swap-content-section">
          <div className={`bg-themed swap-content-container ${hideContent}`}>
            <Tabs
              defaultActiveKey={showActiveTab}
              className="swap-container-tab"
              onSelect={(e) => storeActiveTab(e)}
            >
              <Tab eventKey="swap" title="Swap">
                <SwapTab
                  walletAddress={props.walletAddress}
                  setFirstTokenAmount={handleTokenInput}
                  firstTokenAmount={firstTokenAmount}
                  secondTokenAmount={secondTokenAmount}
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
                  handleOutTokenInput={handleOutTokenInput}
                  showRecepient={showRecepient}
                  transactionSubmitModal={transactionSubmitModal}
                  setSecondTokenAmount={setSecondTokenAmount}
                  fetchUserWalletBalance={fetchUserWalletBalance}
                  loaderInButton={loaderInButton}
                  setLoaderInButton={setLoaderInButton}
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
                  fetchUserWalletBalance={fetchUserWalletBalance}
                  setTokenIn={setTokenIn}
                  setTokenOut={setTokenOut}
                  tokens={tokens}
                  loaderInButton={loaderInButton}
                  setLoaderInButton={setLoaderInButton}
                />
              </Tab>
            </Tabs>

            <TransactionSettings
              recepient={recepient}
              slippage={slippage}
              setSlippage={setSlippage}
              setRecepient={setRecepient}
              walletAddress={props.walletAddress}
              handleRecepient={handleRecepient}
              setShowRecepient={setShowRecepient}
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
        tokenType={tokenType}
      ></SwapModal>
      <InfoModal
        open={showTransactionSubmitModal}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          transactionId
            ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank')
            : null
        }
      />

      <Loader loading={loading} loaderMessage={loaderMessage} />
    </Container>
  );
};

export default Swap;
