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

import config from '../../config/config';

import TransactionSettings from '../../Components/TransactionSettings/TransactionSettings';
import SwapModal from '../../Components/SwapModal/SwapModal';
import { Tab, Tabs } from 'react-bootstrap';
import InfoModal from '../../Components/Ui/Modals/InfoModal';
import { tokens } from '../../constants/swapPage';
import Loader from '../../Components/loader';
import { useLocationStateInSwap } from '../../Pages/Swap/hooks';
import { getAllRoutes } from '../../apis/swap/swap-v2';
import '../../assets/scss/animation.scss';
import SwapContent from '../../Components/WrappedAssets/SwapContent';

const SwapWA = (props) => {
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } = useLocationStateInSwap();
  const activeTab = 'wrappedswap';

  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [showConfirmAddSupply, setShowConfirmAddSupply] = useState(false);
  const [showConfirmRemoveSupply, setShowConfirmRemoveSupply] = useState(false);
  console.log(showConfirmAddSupply);
  console.log(showConfirmRemoveSupply);
  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  const [tokenType, setTokenType] = useState('tokenIn');

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  // const [firstTokenAmountStable, setFirstTokenAmountStable] = useState('');
  // const [secondTokenAmountStable, setSecondTokenAmountStable] = useState('');
  const [swapData, setSwapData] = useState({});
  const [routeData, setRouteData] = useState({});
  const [computedOutDetails, setComputedOutDetails] = useState({});
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [loaderInButton, setLoaderInButton] = useState(false);
  const isStableSwap = useState(false);

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
  }, [tokenIn, tokenOut, activeTab]);

  const handleClose = () => {
    setShow(false);
    setShowConfirmSwap(false);
    setShowConfirmAddSupply(false);
    setShowConfirmRemoveSupply(false);
    //setHideContent('');
    setSearchQuery('');
    //setLoading(false);
  };

  const handleTokenType = (type) => {
    //setHideContent('content-hide');
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
    //setLoading(true);
    setLoaderInButton(true);
    !isStableSwap &&
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
    setComputedOutDetails({
      tokenOut_amount: '',
    });
  };
  const [showRecepient, setShowRecepient] = useState(false);
  const handleRecepient = (elem) => {
    setRecepient(elem);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

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
          className="swap-container-tab remove-border-bottom"
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <Tab eventKey="wrappedswap" title="Swap Wrapped Assets">
            <SwapContent
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
              handleOutTokenInput={handleOutTokenInput}
              showRecepient={showRecepient}
              transactionSubmitModal={transactionSubmitModal}
              setSecondTokenAmount={setSecondTokenAmount}
              fetchUserWalletBalance={fetchUserWalletBalance}
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
      <InfoModal
        open={showTransactionSubmitModal}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />

      <Loader loading={loading} loaderMessage={loaderMessage} />
    </>
  );
};

export default SwapWA;

SwapWA.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
  redirect: PropTypes.any,
};
