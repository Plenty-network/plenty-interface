import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import SwapDetails from '../SwapDetails';
import ConfirmSwap from './ConfirmSwap';
import { swapTokens } from '../../apis/swap/swap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from '../Ui/Buttons/Button';
import {
  computeTokenOutForRouteBaseV2,
  swapTokenUsingRouteV3,
  computeTokenOutForRouteBaseByOutAmountV2,
} from '../../apis/swap/swap-v2';

const SwapTab = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [routePath, setRoutePath] = useState([]);
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
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);

        const res = computeTokenOutForRouteBaseV2(input, props.routeData.allRoutes, props.slippage);

        setComputedData(res);
        setComputedData({
          success: true,
          data: {
            tokenOutAmount: res.bestRoute.computations.tokenOutAmount,
            fees: res.bestRoute.computations.fees,
            totalFees: res.bestRoute.computations.fees[res.bestRoute.computations.fees.length - 1],
            minimumOut: res.bestRoute.computations.minimumOut,
            finalMinimumOut:
              res.bestRoute.computations.minimumOut[
                res.bestRoute.computations.minimumOut.length - 1
              ],
            priceImpact: res.bestRoute.computations.priceImpact,
          },
        });
        setRoutePath(res.bestRoute.path);
        setSecondTokenAmount(res.bestRoute.computations.tokenOutAmount);
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);

        const res = computeTokenOutForRouteBaseByOutAmountV2(
          input,
          props.routeData.allRoutes,
          props.slippage,
        );
        setComputedData({
          success: true,
          data: {
            tokenOutAmount: res.bestRoute.computations.tokenOutAmount,
            fees: res.bestRoute.computations.fees,
            totalFees: res.bestRoute.computations.fees[res.bestRoute.computations.fees.length - 1],
            minimumOut: res.bestRoute.computations.minimumOut,
            finalMinimumOut:
              res.bestRoute.computations.minimumOut[
                res.bestRoute.computations.minimumOut.length - 1
              ],
            priceImpact: res.bestRoute.computations.priceImpact,
          },
        });
        setRoutePath(res.bestRoute.path);
        setFirstTokenAmount(res.bestRoute.computations.tokenInAmount);
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

  const handleSwapResponse = (status) => {
    if (status) {
      console.log({ status });
      props.setLoading(false);
      props.handleLoaderMessage('success', 'Transaction confirmed');
      props.setShowConfirmSwap(false);
      props.setHideContent('');
      props.setSecondTokenAmount('');
      props.resetAllValues();
      props.setLoaderInButton(false);
      setFirstTokenAmount('');
      setSecondTokenAmount('');
    } else {
      props.setLoading(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setShowConfirmSwap(false);
      props.setHideContent('');
      props.resetAllValues();
      props.setSecondTokenAmount('');
      props.setLoaderInButton(false);
    }
  };

  const confirmSwapToken = async () => {
    props.setLoading(true);
    props.setLoaderInButton(true);
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;

    if (routePath.length <= 2) {
      swapTokens(
        routePath[0],
        routePath[1],
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
      swapTokenUsingRouteV3(
        routePath,
        computedData.data.minimumOut,
        props.walletAddress,
        firstTokenAmount,
        props.transactionSubmitModal,
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
    handleSwapTokenInput(value, 'tokenIn');
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
    props.routeData,
    props.connecthWallet,
    firstTokenAmount,
    props.loaderInButton,
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
                    Balance:{' '}
                    {props.userBalances[props.tokenIn.name] >= 0 ? (
                      props.userBalances[props.tokenIn.name]
                    ) : (
                      <div className="shimmer">0.0000</div>
                    )}{' '}
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
                  Balance:{' '}
                  {props.userBalances[props.tokenOut.name] >= 0 ? (
                    props.userBalances[props.tokenOut.name]
                  ) : (
                    <div className="shimmer">0.0000</div>
                  )}
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
                    {props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn}
                  </Tooltip>
                }
              >
                <div>
                  {props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn
                    ? props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn.toFixed(3)
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
            routePath={routePath}
            computedOutDetails={computedData}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            routeData={props.routeData}
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
        routeData={props.routeData}
        loading={props.loading}
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
  // midTokens: PropTypes.any,
  recepient: PropTypes.any,
  resetAllValues: PropTypes.any,
  // secondTokenAmount: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setHideContent: PropTypes.any,
  setLoaderInButton: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  loading: PropTypes.any,
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
