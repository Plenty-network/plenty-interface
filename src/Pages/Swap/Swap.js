import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  computeOutputBasedOnTokenOutAmount,
  computeTokenOutForRouteBase,
  computeTokenOutForRouteBaseByOutAmount,
  computeTokenOutput,
  getTokenPrices,
  getUserBalanceByRpc,
  fetchtzBTCBalance,
} from '../../apis/swap/swap';
import { loadSwapData } from '../../apis/swap/swap-v2';
import config from '../../config/config';
import TransactionSettings from '../../Components/TransactionSettings/TransactionSettings';
import SwapModal from '../../Components/SwapModal/SwapModal';
import SwapTab from '../../Components/SwapTabsContent/SwapTab';
import { Tab, Tabs } from 'react-bootstrap';
import { tokens } from '../../constants/swapPage';

import { useLocationStateInSwap } from './hooks';
import { getAllRoutes } from '../../apis/swap/swap-v2';
import '../../assets/scss/animation.scss';

const NormalSwap = (props) => {
  const { activeTab, setActiveTab, tokenIn, setTokenIn, tokenOut, setTokenOut } =
    useLocationStateInSwap();

  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  const [tokenType, setTokenType] = useState('tokenIn');

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [swapData, setSwapData] = useState({});
  const [routeData, setRouteData] = useState({});
  const [computedOutDetails, setComputedOutDetails] = useState({});
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [loaderInButton, setLoaderInButton] = useState(false);

  const pairExist = useMemo(() => {
    return !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOut, 'name')
    ) {
      if (tokenIn.name === tokenOut.name) {
        setTokenOut({});
      }
    }
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    const updateBalance = async () => {
      setTokenContractInstances({});
      const userBalancesCopy = { ...userBalances };
      const tzBTCName = 'tzBTC';
      const balancePromises = [];
      if (!userBalancesCopy[tokenIn.name]) {
        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenIn.name, props.walletAddress));
      }
      if (!userBalancesCopy[tokenOut.name]) {
        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenOut.name, props.walletAddress));
      }
      if (config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]) {
        const lpToken =
          config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

        balancePromises.push(getUserBalanceByRpc(lpToken, props.walletAddress));
      }
      const balanceResponse = await Promise.all(balancePromises);

      setUserBalances((prev) => ({
        ...prev,
        ...balanceResponse.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.identifier]: cur.balance,
          }),
          {},
        ),
      }));
    };
    updateBalance();
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    if (activeTab === 'swap') {
      if (
        Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
        Object.prototype.hasOwnProperty.call(tokenOut, 'name')
      ) {
        getAllRoutes(tokenIn.name, tokenOut.name).then((response) => {
          if (response.success) {
            setRouteData(response);
            setSwapData(response.bestRouteUntilNoInput.swapData);
            setLoaderInButton(false);
          }
        });
      }
    }

    if (activeTab === 'liquidity') {
      if (
        Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
        Object.prototype.hasOwnProperty.call(tokenOut, 'name')
      ) {
        const pairExists = !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
        if (pairExists) {
          loadSwapData(tokenIn.name, tokenOut.name).then((data) => {
            if (data.success) {
              setSwapData(data);
              //setLoading(false);
              setLoaderInButton(false);
            }
          });
        }
      }
    }
  }, [tokenIn, tokenOut, activeTab]);

  const handleClose = () => {
    setShow(false);
    setShowConfirmSwap(false);
    setShowConfirmTransaction(false);
    setSearchQuery('');
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
    } else {
      let computedData;

      if (pairExist) {
        computedData = computeTokenOutput(
          parseFloat(input),
          swapData.tokenIn_supply,
          swapData.tokenOut_supply,
          swapData.exchangeFee,
          slippage,
        );
      } else {
        computedData = computeTokenOutForRouteBase(parseFloat(input), swapData, slippage);
      }

      setComputedOutDetails(computedData);
      setLoading(false);
    }
  };

  const handleOutTokenInput = (input) => {
    setSecondTokenAmount(input);
    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      setComputedOutDetails({
        tokenOut_amount: '',
        fees: 0,
      });
    } else {
      let computedData;
      if (pairExist) {
        computedData = computeOutputBasedOnTokenOutAmount(
          parseFloat(input),
          swapData.tokenIn_supply,
          swapData.tokenOut_supply,
          swapData.exchangeFee,
          slippage,
        );
      } else {
        computedData = computeTokenOutForRouteBaseByOutAmount(
          parseFloat(input),
          swapData,
          slippage,
        );
      }
      setFirstTokenAmount(computedData.tokenIn_amount);
      setComputedOutDetails(computedData);
    }
  };

  const fetchUserWalletBalance = () => {
    setLoaderInButton(true);
  };

  useEffect(() => {
    if (!props.walletAddress) {
      return;
    }
    setLoaderInButton(true);
  }, [props.walletAddress]);

  useEffect(() => {
    setLoaderInButton(true);

    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
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
    setComputedOutDetails({
      tokenOut_amount: '',
    });
  };
  const [showRecepient, setShowRecepient] = useState(false);
  const handleRecepient = (elem) => {
    setRecepient(elem);
  };

  const selectToken = (token) => {
    setLoaderInButton(true);
    setFirstTokenAmount('');
    setSecondTokenAmount('');
    setSwapData({});
    setComputedOutDetails({
      tokenOut_amount: '',
    });

    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });
    } else {
      setTokenOut({
        name: token.name,
        image: token.image,
      });
    }
    handleClose();
  };

  return (
    <>
      <div className="bg-themed my-0 swap-content-container leftToRightFadeInAnimation-4">
        <Tabs
          activeKey={activeTab}
          className="swap-container-tab"
          onSelect={(e) => setActiveTab(e)}
          mountOnEnter={true}
          unmountOnExit={true}
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
              tokens={tokens}
              handleTokenType={handleTokenType}
              swapData={swapData}
              routeData={routeData}
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
              setLoaderMessage={setLoaderMessage}
              resetAllValues={resetAllValues}
              changeTokenLocation={changeTokenLocation}
              handleOutTokenInput={handleOutTokenInput}
              showRecepient={showRecepient}
              setSecondTokenAmount={setSecondTokenAmount}
              fetchUserWalletBalance={fetchUserWalletBalance}
              loaderInButton={loaderInButton}
              setLoaderInButton={setLoaderInButton}
              setShowConfirmTransaction={setShowConfirmTransaction}
              showConfirmTransaction={showConfirmTransaction}
              theme={props.theme}
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
      <SwapModal
        show={show}
        activeTab={activeTab}
        onHide={handleClose}
        selectToken={selectToken}
        tokens={tokens}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* <InfoModal
        open={showTransactionSubmitModal}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      /> */}

      {/* <Loader loading={loading} loaderMessage={loaderMessage} /> */}
    </>
  );
};

export default NormalSwap;

NormalSwap.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
  redirect: PropTypes.any,
};
