import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  computeOutputBasedOnTokenOutAmount,
  computeTokenOutForRouteBase,
  computeTokenOutForRouteBaseByOutAmount,
  computeTokenOutput,
  getTokenPrices,
  fetchtzBTCBalance,
} from '../../apis/swap/swap';
import { getUserBalanceByRpc, getReferenceToken } from '../../apis/WrappedAssets/WrappedAssets';
import config from '../../config/config';
import WrappedTokenModal from '../../Components/WrappedAssets/WrappedTokens';

import { Tab, Tabs } from 'react-bootstrap';

import { wrappedTokens } from '../../constants/wrappedAssets';
import { useLocationStateInWrappedAssets } from '../Swap/hooks/useLocationStateInWrappedAssets';
import '../../assets/scss/animation.scss';
import SwapContent from '../../Components/WrappedAssets/SwapContent';

const SwapWA = (props) => {
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } = useLocationStateInWrappedAssets();
  const activeTab = 'wrappedswap';

  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  const [tokenType, setTokenType] = useState('tokenIn');

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');

  const [swapData, setSwapData] = useState({});

  const [computedOutDetails, setComputedOutDetails] = useState({});
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [loaderInButton, setLoaderInButton] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

  const pairExist = useMemo(() => {
    return !!config.WRAPPED_ASSETS[config.NETWORK][tokenIn.name].REF_TOKEN[tokenOut.name];
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOut, 'name')
    ) {
      if (tokenIn.name) {
        const tokenout = getReferenceToken(tokenIn.name);

        setTokenOut(tokenout);
      }
    }
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    if (props.walletAddress) {
      const updateBalance = async () => {
        setTokenContractInstances({});

        const tzBTCName = 'tzBTC';
        const balancePromises = [];

        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenIn.name, props.walletAddress));

        tokenOut.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenOut.name, props.walletAddress));

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
    }
  }, [tokenIn, tokenOut, props, balanceUpdate]);

  const handleClose = () => {
    setShow(false);
    setShowConfirmSwap(false);
    setSearchQuery('');
    setShowConfirmTransaction(false);
  };

  const handleTokenType = (type) => {
    setBalanceUpdate(false);
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
              tokens={wrappedTokens}
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
              setLoaderMessage={setLoaderMessage}
              resetAllValues={resetAllValues}
              handleOutTokenInput={handleOutTokenInput}
              setSecondTokenAmount={setSecondTokenAmount}
              fetchUserWalletBalance={fetchUserWalletBalance}
              loaderInButton={loaderInButton}
              setLoaderInButton={setLoaderInButton}
              setShowConfirmTransaction={setShowConfirmTransaction}
              showConfirmTransaction={showConfirmTransaction}
              theme={props.theme}
              setBalanceUpdate={setBalanceUpdate}
            />
          </Tab>
        </Tabs>
      </div>
      <WrappedTokenModal
        show={show}
        activeTab={activeTab}
        onHide={handleClose}
        selectToken={selectToken}
        tokens={wrappedTokens}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
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
