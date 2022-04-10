import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import SwapDetails from '../SwapDetails';
import ConfirmSwap from './ConfirmSwap';
import { connect } from 'react-redux';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { swapTokens } from '../../apis/swap/swap';
import Button from '../Ui/Buttons/Button';
import {
  computeTokenOutForRouteBaseV2,
  swapTokenUsingRouteV3,
  computeTokenOutForRouteBaseByOutAmountV2,
} from '../../apis/swap/swap-v2';
import ConfirmTransaction from '../WrappedAssets/ConfirmTransaction';
import InfoModal from '../Ui/Modals/InfoModal';
import Loader from '../loader';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import switchImg from '../../assets/images/bridge/bridge-switch.svg';
import maxlight from '../../assets/images/max-light.svg';

const SwapTab = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [firstAmount, setFirstAmount] = useState(0);
  const [secondAmount, setSecondAmount] = useState(0);
  const [routePath, setRoutePath] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    firstTokenAmount && setFirstAmount(firstTokenAmount);
    secondTokenAmount && setSecondAmount(secondTokenAmount);
  }, [firstTokenAmount, secondTokenAmount]);

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const handleCloseModal = () => {
    props.setShowConfirmSwap(false);
    props.setShowConfirmTransaction(false);

    props.setLoader(false);
    resetVal();
    props.resetAllValues();
    props.setLoading(false);
  };

  const handleSwapTokenInput = (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      props.setComputedOutDetails({});
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
  useEffect(() => {
    setErrorMessage(false);
  }, [props.tokenOut.name, firstTokenAmount]);

  const callSwapToken = () => {
    props.setShowConfirmSwap(true);
    //props.setHideContent('content-hide');
  };

  const resetVal = () => {
    props.resetAllValues();
    setFirstTokenAmount('');
    props.setSecondTokenAmount('');
    setSecondTokenAmount('');
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
      props.setLoading(false);
      setShowTransactionSubmitModal(false);
      props.handleLoaderMessage('success', 'Transaction confirmed');
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      props.setShowConfirmTransaction(false);
      //props.setHideContent('');
      props.setSecondTokenAmount('');
      props.resetAllValues();
      props.setLoaderInButton(false);
      setFirstTokenAmount('');
      setSecondTokenAmount('');
    } else {
      props.setLoading(false);
      setShowTransactionSubmitModal(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      props.setShowConfirmTransaction(false);
      //props.setHideContent('');
      props.resetAllValues();
      props.setSecondTokenAmount('');
      props.setLoaderInButton(false);
    }
  };

  const confirmSwapToken = async () => {
    props.setLoading(true);
    props.setLoader(true);
    props.setLoaderInButton(true);
    props.setShowConfirmSwap(false);
    props.setShowConfirmTransaction(true);
    localStorage.setItem('wrapped', firstTokenAmount);
    localStorage.setItem('token', props.tokenIn.name);
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;

    if (routePath.length <= 2) {
      swapTokens(
        routePath[0],
        routePath[1],
        computedData.data.finalMinimumOut,
        recepientAddress,
        firstTokenAmount,
        props.walletAddress,
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetVal,
        props.setShowConfirmTransaction,
      ).then((swapResp) => {
        props.setShowConfirmSwap(false);
        props.setLoader(false);
        props.setShowConfirmTransaction(false);
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
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetVal,
        props.setShowConfirmTransaction,
      ).then((swapResp) => {
        props.setShowConfirmSwap(false);
        props.setLoader(false);
        props.setShowConfirmTransaction(false);
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

  const setErrorMessageOnUI = (value) => {
    setMessage(value);
    setErrorMessage(true);
  };

  // TODO Refactor once again
  const swapContentButton = useMemo(() => {
    if (props.walletAddress) {
      if (props.tokenOut.name && firstTokenAmount) {
        if (firstTokenAmount > props.userBalances[props.tokenIn.name]) {
          return (
            <Button
              onClick={() => setErrorMessageOnUI('Insufficient balance')}
              color={'disabled'}
              className={
                'mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
              }
            >
              Swap
            </Button>
          );
        } else {
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
      }

      if (!props.tokenOut.name) {
        return (
          <Button
            onClick={() => setErrorMessageOnUI('Please select a token and then enter the amount')}
            color={'disabled'}
            className={
              ' mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
            }
          >
            Swap
          </Button>
        );
      }
      return (
        <Button
          onClick={() => setErrorMessageOnUI('Enter an amount to swap')}
          color={'disabled'}
          className={
            ' mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
          }
        >
          Swap
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
        <div className="swap-content-box swap-left-right-padding">
          <div
            className={clsx(
              'swap-token-select-box',
              'bg-themed-light',
              errorMessage && 'errorBorder',
              firstTokenAmount > 0 && (errorMessage ? 'errorBorder' : 'typing-border'),
            )}
          >
            <div className="token-selector-balance-wrapper-swap">
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
              <div className="input-heading">YOU PAY</div>
              {props.routeData.success ? (
                <input
                  type="text"
                  className={clsx(
                    'token-user-input',
                    errorMessage && message === 'Insufficient balance' && 'error-text-color',
                  )}
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
                    className="wallet-token-balance balance-revamp"
                    onClick={onClickAmount}
                    style={{ cursor: 'pointer' }}
                  >
                    Balance:{' '}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="button-tooltip" {...props}>
                          {props.userBalances[props.tokenIn.name]}
                        </Tooltip>
                      }
                    >
                      <span
                        className={clsx(
                          'balance-tokenin',
                          errorMessage && message === 'Insufficient balance' && 'error-text-color',
                        )}
                      >
                        {props.userBalances[props.tokenIn.name] >= 0 ? (
                          props.userBalances[props.tokenIn.name].toFixed(4)
                        ) : (
                          <div className="shimmer">0.0000</div>
                        )}{' '}
                        <img src={maxlight} className="max-swap" />
                      </span>
                    </OverlayTrigger>
                  </p>
                ) : (
                  <p className="wallet-token-balance balance-revamp">
                    Balance: {props.userBalances[props.tokenIn.name]?.toFixed(4)}
                  </p>
                )}

                <p className="wallet-token-balance balance-revamp">
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
          {errorMessage && <span className="error-message">{message}</span>}
        </div>
        <div className="switch-img">
          <div
            className="swap-arrow-center-revamp  icon-animated"
            onClick={props.changeTokenLocation}
          >
            <img src={switchImg} />
          </div>
        </div>
        <div className="second-token-bg">
          <div className="swap-content-box ">
            <div
              className={clsx(
                'swap-token-select-box',
                'second-token-input-swap',
                errorMessage && 'errorBorder',
                secondTokenAmount && 'second-input-typing',
              )}
            >
              <div className="token-selector-balance-wrapper-swap">
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
                <div className="input-heading receive-heading">YOU RECEIVE</div>
                {props.routeData.success && props.tokenOut.name ? (
                  <input
                    type="text"
                    className={clsx('token-user-input', secondTokenAmount && 'second-input-color')}
                    value={secondTokenAmount && secondTokenAmount}
                    placeholder="0.0"
                    onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenOut')}
                  />
                ) : (
                  <input
                    type="text"
                    className="token-user-input"
                    disabled
                    placeholder="--"
                    value={firstTokenAmount}
                  />
                )}
              </div>
              {props.walletAddress ? (
                <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
                  <p className="wallet-token-balance balance-revamp">
                    Balance:{' '}
                    {props.tokenOut.name ? (
                      props.userBalances[props.tokenOut.name] >= 0 ? (
                        props.userBalances[props.tokenOut.name]
                      ) : (
                        <div className="shimmer">0.0000</div>
                      )
                    ) : (
                      '--'
                    )}
                  </p>
                  <p className="wallet-token-balance balance-revamp">
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
          {props.showRecepient ? (
            <>
              <div className="send-heading">Send to</div>
              <input
                type="text"
                className="receiptant"
                placeholder="Receipient address"
                onChange={(e) => props.setRecepient(e.target.value)}
                value={props.recepient}
              />
            </>
          ) : (
            ''
          )}
          {props.walletAddress &&
            props.tokenIn.name &&
            props.tokenOut.name &&
            props.routeData.success && (
              <SwapDetails
                routePath={routePath}
                computedOutDetails={computedData}
                tokenIn={props.tokenIn}
                tokenOut={props.tokenOut}
                routeData={props.routeData}
                firstTokenAmount={firstTokenAmount}
                isStableSwap={false}
              />
            )}
          {swapContentButton}
        </div>
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
        isStableSwap={false}
      />
      <ConfirmTransaction
        show={props.showConfirmTransaction}
        content={`Swapping ${Number(localStorage.getItem('wrapped')).toFixed(
          6,
        )} ${localStorage.getItem('token')} `}
        theme={props.theme}
        onHide={handleCloseModal}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        InfoMessage={`Swapping ${Number(localStorage.getItem('wrapped')).toFixed(
          6,
        )} ${localStorage.getItem('token')} `}
        theme={props.theme}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on TzKT'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />
      <Loader
        loading={props.loading}
        content={`${Number(localStorage.getItem('wrapped')).toFixed(6)} ${localStorage.getItem(
          'token',
        )} Swapped`}
        loaderMessage={props.loaderMessage}
        tokenIn={props.tokenIn.name}
        firstTokenAmount={firstAmount}
        tokenOut={props.tokenOut.name}
        secondTokenAmount={secondAmount}
        setLoaderMessage={props.setLoaderMessage}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  loader: state.settings.loader,
});

const mapDispatchToProps = (dispatch) => ({
  setLoader: (value) => dispatch(setLoader(value)),
});
SwapTab.propTypes = {
  changeTokenLocation: PropTypes.any,
  computedOutDetails: PropTypes.any,
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  setLoader: PropTypes.func,
  // firstTokenAmount: PropTypes.any,
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  loaderMessage: PropTypes.any,
  handleOutTokenInput: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  // midTokens: PropTypes.any,
  recepient: PropTypes.any,
  resetAllValues: PropTypes.any,
  // secondTokenAmount: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  //setHideContent: PropTypes.any,
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
  setShowConfirmTransaction: PropTypes.any,
  showConfirmTransaction: PropTypes.any,
  theme: PropTypes.any,
  setComputedOutDetails: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapTab);
