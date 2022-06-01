import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
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
import { useLocationStateInSwap } from './hooks';
import '../../assets/scss/animation.scss';
import { tokens } from '../../constants/swapPage';
import SwapTab from '../../Components/SwapTabsContent/SwapTab';
import { getAllRoutes } from '../../apis/swap/swap-v2';
import SwapModal from '../../Components/SwapModal/SwapModal';
import TransactionSettings from '../../Components/TransactionSettings/TransactionSettings';
import {
  getUserBalanceByRpcStable,
  getxtzBalance,
  loadSwapDataStable,
} from '../../apis/stableswap/stableswap';

const Swap = (props) => {
  const { activeTab, tokenIn, setTokenIn, tokenOut, setTokenOut } = useLocationStateInSwap();

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
  const [isStablePair, setStablePair] = useState(false);
  const [balanceUpdate, setBalanceUpdate] = useState(false);

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

    if (
      config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'veStableAMM' ||
      config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'xtz'
    ) {
      setStablePair(true);
    } else {
      setStablePair(false);
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
          : (tokenIn.name === 'tez' && tokenOut.name === 'ctez') ||
            (tokenOut.name === 'tez' && tokenIn.name === 'ctez')
          ? balancePromises.push(getUserBalanceByRpcStable(tokenIn.name, props.walletAddress))
          : tokenIn.name === 'tez'
          ? balancePromises.push(getxtzBalance(tokenIn.name, props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenIn.name, props.walletAddress));

        tokenOut.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : (tokenIn.name === 'tez' && tokenOut.name === 'ctez') ||
            (tokenOut.name === 'tez' && tokenIn.name === 'ctez')
          ? balancePromises.push(getUserBalanceByRpcStable(tokenOut.name, props.walletAddress))
          : tokenOut.name === 'tez'
          ? balancePromises.push(getxtzBalance(tokenOut.name, props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenOut.name, props.walletAddress));

        if (
          (tokenIn.name === 'tez' && tokenOut.name === 'ctez') ||
          (tokenOut.name === 'tez' && tokenIn.name === 'ctez')
            ? config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
        ) {
          const lpToken =
            (tokenIn.name === 'tez' && tokenOut.name === 'ctez') ||
            (tokenOut.name === 'tez' && tokenIn.name === 'ctez')
              ? config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
                  .liquidityToken
              : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

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
    }
  }, [tokenIn, tokenOut, props, activeTab, balanceUpdate]);

  useEffect(() => {
    if (activeTab === 'swap') {
      if (
        Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
        Object.prototype.hasOwnProperty.call(tokenOut, 'name')
      ) {
        if (
          (tokenIn.name === 'tez' && tokenOut.name === 'ctez') ||
          (tokenOut.name === 'tez' && tokenIn.name === 'ctez')
        ) {
          loadSwapDataStable(tokenIn.name, tokenOut.name).then((response) => {
            if (response.success) {
              setRouteData({ success: true });
              setSwapData(response);
              setLoaderInButton(false);
            }
          });
        } else {
          getAllRoutes(tokenIn.name, tokenOut.name).then((response) => {
            if (response.success) {
              setRouteData(response);
              setSwapData(response.bestRouteUntilNoInput.swapData);
              setLoaderInButton(false);
            }
          });
        }
      }
    }
  }, [tokenIn, tokenOut, balanceUpdate]);

  const handleClose = () => {
    setShow(false);
    resetAllValues();
    setShowConfirmSwap(false);
    setShowConfirmTransaction(false);
    setSearchQuery('');
    setLoading(false);
  };

  const changeTokenLocation = () => {
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
    }
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
    // setSlippage(0.5);
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
    <Container fluid>
      <Row>
        <Col sm={10} md={6} className="swap-content-section">
          <div className="bg-themed swap-content-container-revamp">
            <div className="swap-heading swap-left-right-margin">Swap</div>
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
              setComputedOutDetails={setComputedOutDetails}
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
              isStablePair={isStablePair}
              setBalanceUpdate={setBalanceUpdate}
            />
            <TransactionSettings
              recepient={recepient}
              slippage={slippage}
              setSlippage={setSlippage}
              setRecepient={setRecepient}
              walletAddress={props.walletAddress}
              handleRecepient={handleRecepient}
              setShowRecepient={setShowRecepient}
              theme={props.theme}
            />
          </div>
        </Col>
      </Row>
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
    </Container>
  );
};

export default Swap;

Swap.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
};
