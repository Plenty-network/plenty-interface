import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import SwapDetails from '../SwapDetails';
import ConfirmSwap from './ConfirmSwap';
import {
  computeOutputBasedOnTokenOutAmount,
  computeTokenOutput,
  swapTokens,
} from '../../apis/swap/swap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from '../Ui/Buttons/Button';
import config from '../../config/config';
import {
  computeTokenOutForRouteBaseByOutAmountV2,
  computeTokenOutForRouteBaseV2,
  swapTokenUsingRouteV2,
} from '../../apis/swap/swap-v2';

const SwapTab = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [computedData, setComputedData] = useState({
    success: false,
    data: {
      tokenOutAmount: 0,
      fees: [],
      totalFees: 0,
      minimumOut: [],
      finalMinimumOut: 0,
      priceImpact: 0,
    },
  });

  const handleSwapTokenInput = (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
    } else {
      const isDirectRoute = props.routeData.bestRoute?.path.length === 2;

      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);

        if (isDirectRoute) {
          const computedData = computeTokenOutput(
            parseFloat(input),
            props.routeData.bestRoute.swapData?.[0].tokenIn_supply,
            props.routeData.bestRoute.swapData?.[0].tokenOut_supply,
            props.routeData.bestRoute.swapData?.[0].exchangeFee,
            props.slippage,
          );
          setComputedData({
            success: true,
            data: {
              tokenOutAmount: computedData.tokenOut_amount,
              fees: [computedData.fees],
              totalFees: computedData.fees,
              minimumOut: [computedData.minimum_Out],
              finalMinimumOut: computedData.minimum_Out,
              priceImpact: computedData.priceImpact,
            },
          });
          setSecondTokenAmount(computedData.tokenOut_amount);
        } else {
          const res = computeTokenOutForRouteBaseV2(
            input,
            props.routeData.bestRoute.swapData,
            props.slippage,
          );
          setComputedData(res);
          setSecondTokenAmount(res.data.tokenOutAmount);
        }
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);

        if (isDirectRoute) {
          const computedData = computeOutputBasedOnTokenOutAmount(
            parseFloat(input),
            props.routeData.bestRoute.swapData?.[0].tokenIn_supply,
            props.routeData.bestRoute.swapData?.[0].tokenOut_supply,
            props.routeData.bestRoute.swapData?.[0].exchangeFee,
            props.slippage,
          );
          setComputedData({
            success: true,
            data: {
              tokenOutAmount: computedData.tokenOut_amount,
              fees: [computedData.fees],
              totalFees: computedData.fees,
              minimumOut: [computedData.minimum_Out],
              finalMinimumOut: computedData.minimum_Out,
              priceImpact: computedData.priceImpact,
            },
          });
          setFirstTokenAmount(computedData.tokenIn_amount);
        } else {
          const res = computeTokenOutForRouteBaseByOutAmountV2(
            input,
            props.routeData.bestRoute.swapData,
            props.slippage,
          );
          setComputedData(res);
          setFirstTokenAmount(res.data.tokenInAmount);
        }
      }
    }
  };

  useEffect(() => {
    handleSwapTokenInput(firstTokenAmount, 'tokenIn');
  }, [props.routeData]);

  const callSwapToken = () => {
    props.setShowConfirmSwap(true);
    props.setHideContent('content-hide');
  };

  const getDollarValue = (amount, price) => {
    const calculatedValue = amount * price;
    if (calculatedValue < 100) {
      return calculatedValue.toFixed(2);
    }
    return Math.floor(calculatedValue);
  };

  const pairExist = useMemo(() => {
    return !!config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name];
  }, [props.tokenIn, props.tokenOut]);

  const handleSwapResponse = (status) => {
    if (status) {
      props.setLoading(false);
      props.handleLoaderMessage('success', 'Transaction confirmed');
      props.setShowConfirmSwap(false);
      props.setHideContent('');
      props.setSecondTokenAmount('');
      props.resetAllValues();
      props.fetchUserWalletBalance();
      props.setLoaderInButton(false);
    } else {
      props.setLoading(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setShowConfirmSwap(false);
      props.setHideContent('');
      props.resetAllValues();
      props.setSecondTokenAmount('');
      props.fetchUserWalletBalance();
      props.setLoaderInButton(false);
    }
  };

  const confirmSwapToken = async () => {
    props.setLoading(true);
    props.setLoaderInButton(true);
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;

    if (pairExist) {
      swapTokens(
        props.tokenIn.name,
        props.tokenOut.name,
        computedData.data.finalMinimumOut,
        recepientAddress,
        firstTokenAmount,
        props.walletAddress,
        props.transactionSubmitModal,
      ).then((swapResp) => {
        handleSwapResponse(swapResp.success);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    } else {
      swapTokenUsingRouteV2(
        props.routeData.bestRoute.path,
        computedData.data.minimumOut,
        props.walletAddress,
        firstTokenAmount,
      ).then((swapResp) => {
        handleSwapResponse(swapResp.success);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    }
  };

  const onClickAmount = () => {
    const value =
      props.userBalances[props.tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    props.setFirstTokenAmount(value.substring(0, value.length - 1));
  };

  // TODO Refactor once again
  const swapContentButton = useMemo(() => {
    if (props.walletAddress) {
      if (props.tokenOut.name && firstTokenAmount) {
        return (
          <Button
            onClick={callSwapToken}
            color={'primary'}
            className={'mt-4 w-100 flex align-items-center justify-content-center'}
          >
            Swap
          </Button>
        );
      }

      if (!props.tokenOut.name) {
        return (
          <Button
            onClick={() => null}
            color={'primary'}
            className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
          >
            Select a token
          </Button>
        );
      }

      if (!pairExist && props.midTokens === null) {
        return (
          <Button
            disabled
            color={'primary'}
            className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
          >
            Route does not exist
          </Button>
        );
      }

      if (props.loaderInButton) {
        return (
          <Button
            onClick={() => null}
            color={'primary'}
            loading={true}
            className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
          />
        );
      }
      return (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Enter an amount
        </Button>
      );
    }

    return (
      <Button
        onClick={props.connecthWallet}
        color={'primary'}
        startIcon={'add'}
        className={'mt-4 w-100 flex align-items-center justify-content-center'}
      >
        Connect Wallet
      </Button>
    );
  }, [
    callSwapToken,
    pairExist,
    props.connecthWallet,
    firstTokenAmount,
    props.loaderInButton,
    props.midTokens,
    props.tokenOut.name,
    props.walletAddress,
  ]);

  return (
    <>
      <div className="swap-content-box-wrapper">
        <div className="swap-content-box">
          <div className="swap-token-select-box bg-themed-light">
            <div className="token-selector-balance-wrapper">
              <button
                className="token-selector dropdown-themed"
                onClick={() => props.handleTokenType('tokenIn')}
              >
                <img src={props.tokenIn.image} className="button-logo" />
                <span className="span-themed">{props.tokenIn.name} </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              {props.routeData.success ? (
                <input
                  type="text"
                  className="token-user-input"
                  placeholder="0.0"
                  value={firstTokenAmount}
                  onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenIn')}
                />
              ) : (
                <input type="text" className="token-user-input" placeholder="0.0" disabled />
              )}
            </div>
            {props.walletAddress ? (
              <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
                {props.tokenOut.name ? (
                  <p
                    className="wallet-token-balance"
                    onClick={onClickAmount}
                    style={{ cursor: 'pointer' }}
                  >
                    Balance: {props.userBalances[props.tokenIn.name]}{' '}
                    <span className="max-btn">(Max)</span>
                  </p>
                ) : (
                  <p className="wallet-token-balance">
                    Balance: {props.userBalances[props.tokenIn.name]}
                  </p>
                )}

                <p className="wallet-token-balance">
                  ~$
                  {props.getTokenPrice.success && firstTokenAmount
                    ? getDollarValue(
                        firstTokenAmount,
                        props.getTokenPrice.tokenPrice[props.tokenIn.name],
                      )
                    : '0.00'}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="swap-arrow-center bg-themed icon-animated"
          onClick={props.changeTokenLocation}
        >
          <span className="span-themed material-icons-round">arrow_downward</span>
        </div>

        <div className="swap-content-box">
          <div className="swap-token-select-box bg-themed-light">
            <div className="token-selector-balance-wrapper">
              {props.tokenOut.name ? (
                <button
                  className="token-selector dropdown-themed"
                  onClick={() => props.handleTokenType('tokenOut')}
                >
                  <img src={props.tokenOut.image} className="button-logo" />
                  <span className="span-themed">{props.tokenOut.name} </span>
                  <span className="span-themed material-icons-round">expand_more</span>
                </button>
              ) : (
                <button
                  className="token-selector not-selected"
                  onClick={() => props.handleTokenType('tokenOut')}
                >
                  Select a token <span className="material-icons-round">expand_more</span>
                </button>
              )}
            </div>

            <div className="token-user-input-wrapper">
              {props.routeData.success && props.tokenOut.name ? (
                <input
                  type="text"
                  className="token-user-input"
                  value={
                    secondTokenAmount ? secondTokenAmount : props.computedOutDetails.tokenOut_amount
                  }
                  placeholder="0.0"
                  onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenOut')}
                />
              ) : (
                <input
                  type="text"
                  className="token-user-input"
                  disabled
                  placeholder="0.0"
                  value={firstTokenAmount}
                />
              )}
            </div>
            {props.walletAddress && props.tokenOut.name ? (
              <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
                <p className="wallet-token-balance">
                  Balance: {props.userBalances[props.tokenOut.name]}
                </p>
                <p className="wallet-token-balance">
                  ~$
                  {props.getTokenPrice.success && secondTokenAmount
                    ? getDollarValue(
                        secondTokenAmount,
                        props.getTokenPrice.tokenPrice[props.tokenOut.name],
                      )
                    : '0.00'}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {props.walletAddress && props.routeData.success ? (
          <div className="flex">
            <p className="wallet-token-balance whitespace-prewrap ml-auto flex flex-row">
              1 {props.tokenIn.name} ={' '}
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="swap-token-out-tooltip" {...props}>
                    {props.routeData.tokenOutPerTokenIn}
                  </Tooltip>
                }
              >
                <div>
                  {props.routeData.tokenOutPerTokenIn
                    ? props.routeData.tokenOutPerTokenIn.toFixed(3)
                    : 0}{' '}
                  {props.tokenOut.name}
                </div>
              </OverlayTrigger>
            </p>
          </div>
        ) : null}
        {props.showRecepient ? (
          <input
            type="text"
            className="slipping-tolerance-input full-width"
            placeholder="Send to:"
            onChange={(e) => props.setRecepient(e.target.value)}
            value={props.recepient}
          />
        ) : (
          ''
        )}
        {swapContentButton}
        {props.walletAddress && props.tokenIn.name && props.tokenOut.name && (
          <SwapDetails
            computedOutDetails={computedData}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            midTokens={props.midTokens}
            firstTokenAmount={firstTokenAmount}
          />
        )}
      </div>

      <ConfirmSwap
        show={props.showConfirmSwap}
        computedData={computedData}
        tokenIn={props.tokenIn}
        firstTokenAmount={firstTokenAmount}
        tokenOut={props.tokenOut}
        slippage={props.slippage}
        confirmSwapToken={confirmSwapToken}
        onHide={props.handleClose}
        midTokens={props.midTokens}
      />
    </>
  );
};

SwapTab.propTypes = {
  changeTokenLocation: PropTypes.any,
  computedOutDetails: PropTypes.any,
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  // firstTokenAmount: PropTypes.any,
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  handleOutTokenInput: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  midTokens: PropTypes.any,
  recepient: PropTypes.any,
  resetAllValues: PropTypes.any,
  // secondTokenAmount: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setHideContent: PropTypes.any,
  setLoaderInButton: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  setRecepient: PropTypes.any,
  setSecondTokenAmount: PropTypes.any,
  setShowConfirmSwap: PropTypes.any,
  showConfirmSwap: PropTypes.any,
  showRecepient: PropTypes.any,
  slippage: PropTypes.any,
  // swapData: PropTypes.any,
  routeData: PropTypes.any,
  tokenContractInstances: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  transactionSubmitModal: PropTypes.any,
  userBalances: PropTypes.any,
  walletAddress: PropTypes.any,
};

export default SwapTab;
