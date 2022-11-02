import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SwapDetails from '../SwapDetails';
import ConfirmSwap from './ConfirmSwap';
import { connect } from 'react-redux';
import fromExponential from 'from-exponential';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { swapTokens } from '../../apis/swap/swap';
import Button from '../Ui/Buttons/Button';
import {
  loadSwapDataStable,
  calculateTokensOutStable,
  ctez_to_tez,
  tez_to_ctez,
  getXtzDollarPrice,
} from '../../apis/stableswap/stableswap';
import {
  computeTokenOutForRouteBaseV2,
  swapTokenUsingRouteV3,
  computeTokenOutForRouteBaseByOutAmountV2,
} from '../../apis/swap/swap-v2';
import ConfirmTransaction from '../WrappedAssets/ConfirmTransaction';
import InfoModal from '../Ui/Modals/InfoModal';
import Loader from '../loader';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import switchImg from '../../assets/images/SwapModal/swap-switch.svg';
import config from '../../config/config';
import switchImgDark from '../../assets/images/SwapModal/swap-switch-dark.svg';
import {
  calculateTokensOutGeneralStable,
  loadSwapDataGeneralStableWithoutDecimal,
} from '../../apis/stableswap/generalStableswap';
import { ERRORMESSAGESWAP } from '../../constants/global';

const SwapTab = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [routeDataCopy, setRouteDataCopy] = useState(false);
  const [firstAmount, setFirstAmount] = useState(0);
  const [secondAmount, setSecondAmount] = useState(0);
  const [routePath, setRoutePath] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [stableList, setStableList] = useState([]);
  const [dolar, setDolar] = useState('0.0');
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
  const [swapData, setSwapData] = useState({
    success: false,
    tezPool: 0,
    ctezPool: 0,
    tokenIn: props.tokenIn.name,
    tokenOut: props.tokenOut.name,
    lpTokenSupply: 0,
    target: 0,
    lpToken: null,
    dexContractInstance: null,
  });
  const isStableSwap = useRef(false);
  const getSwapData = async () => {
    const res = await loadSwapDataStable(props.tokenIn.name, props.tokenOut.name);

    setSwapData(res);
  };
  const getSwapDataGeneralStableswap = async () => {
    const res = await loadSwapDataGeneralStableWithoutDecimal(
      props.tokenIn.name,
      props.tokenOut.name,
    );

    setSwapData(res);
  };
  useEffect(() => {
    // if (props.isStablePair) {
    if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type === 'xtz'
    ) {
      getSwapData();
    } else if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
      'veStableAMM'
    ) {
      getSwapDataGeneralStableswap();
    }
    // }
  }, [props.tokenIn, props.tokenOut]);

  useEffect(() => {
    setRouteDataCopy(false);
    isStableSwap.current =
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
        'veStableAMM' ||
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type === 'xtz';

    setRoutePath([]);
    setFirstTokenAmount('');
    setSecondTokenAmount('');
  }, [props.tokenIn, props.tokenOut]);

  useEffect(() => {
    if (props.routeData.success) {
      setRouteDataCopy(true);
    }
  }, [props.routeData]);

  useEffect(() => {
    firstTokenAmount && setFirstAmount(firstTokenAmount);
    secondTokenAmount && setSecondAmount(secondTokenAmount);
    if (props.walletAddress) {
      if (Object.keys(props.tokenOut).length !== 0) {
        //   if (
        //     (props.tokenIn.name === 'EURL' && props.tokenOut.name !== 'agEUR.e') ||
        //     (props.tokenOut.name === 'EURL' && props.tokenIn.name !== 'agEUR.e') ||
        //     (props.tokenIn.name === 'agEUR.e' && props.tokenOut.name !== 'EURL') ||
        //     (props.tokenOut.name === 'agEUR.e' && props.tokenIn.name !== 'EURL')
        //   ) {
        //     setErrorMessageOnUI(ERRORMESSAGESWAP);
        //   } else if (
        //     (props.tokenIn.name === 'EURL' || props.tokenIn.name === 'agEUR.e') &&
        //     (props.tokenOut.name === 'EURL' || props.tokenOut.name === 'agEUR.e')
        //   ) {
        //     setErrorMessage(false);
        //     setMessage('');
        //   }
        // } else
        if (firstTokenAmount > props.userBalances[props.tokenIn.name]) {
          setErrorMessageOnUI('Insufficient balance');
        } else {
          setErrorMessage(false);
        }
      }
    }
  }, [
    firstTokenAmount,
    secondTokenAmount,
    props.changeTokenLocation,
    props.tokenIn,
    props.tokenOut,
  ]);

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

  const fetchSwapData = async (input) => {
    const tokenOutResponse = await calculateTokensOutStable(
      swapData.tezPool,
      swapData.ctezPool,
      Number(input),
      1000,
      props.slippage,
      swapData.target,
      props.tokenIn.name,
    );

    return tokenOutResponse;
  };

  const fetchSwapDataForGeneralStableSwap = async (input) => {
    const tokenOutResponse = await calculateTokensOutGeneralStable(
      swapData.tokenIn_supply,
      swapData.tokenOut_supply,
      Number(input),
      swapData.exchangeFee,
      props.slippage,
      props.tokenIn.name,
      props.tokenOut.name,
      swapData.tokenIn_precision,
      swapData.tokenOut_precision,
    );

    return tokenOutResponse;
  };

  useEffect(() => {
    getXtzDollarPrice().then((res) => {
      setDolar(res);
    });
  }, []);

  const handleSwapTokenInput = async (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
      props.setComputedOutDetails({});
    } else {
      if (tokenType === 'tokenIn') {
        if (props.isStablePair) {
          if (
            config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
            'xtz'
          ) {
            setFirstTokenAmount(input);
            const res = await fetchSwapData(input);

            setSecondTokenAmount(res.tokenOut.toFixed(6));
            setComputedData({
              success: true,
              data: {
                tokenOutAmount: res.tokenOut.toFixed(6),
                fees: res.fee,
                totalFees: res.fee,
                minimumOut: res.minimumOut.toFixed(6),
                finalMinimumOut: res.minimumOut.toFixed(6),
                priceImpact: res.priceImpact,
                exchangeRate: res.exchangeRate,
              },
            });
          } else if (
            config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
            'veStableAMM'
          ) {
            setFirstTokenAmount(input);
            const res = await fetchSwapDataForGeneralStableSwap(input);

            setSecondTokenAmount(res.tokenOut_amount);

            setComputedData({
              success: true,
              data: {
                tokenOutAmount: res.tokenOut_amount,
                fees: res.fees,
                totalFees: res.fees,
                minimumOut: res.minimum_Out,
                finalMinimumOut: res.minimum_Out,
                priceImpact: res.priceImpact,
                exchangeRate: res.exchangeRate,
              },
            });
          }
        } else {
          setFirstTokenAmount(input);

          const res = computeTokenOutForRouteBaseV2(
            input,
            props.routeData.allRoutes,
            props.slippage,
          );

          setComputedData(res);

          setComputedData({
            success: true,
            data: {
              tokenOutAmount: res.bestRoute.computations.tokenOutAmount,
              fees: res.bestRoute.computations.fees,
              totalFees:
                res.bestRoute.computations.fees[res.bestRoute.computations.fees.length - 1],
              minimumOut: res.bestRoute.computations.minimumOut,
              finalMinimumOut:
                res.bestRoute.computations.minimumOut[
                  res.bestRoute.computations.minimumOut.length - 1
                ],
              priceImpact: res.bestRoute.computations.priceImpact,
              maxfee: res.bestRoute.maxFee,
            },
          });
          setRoutePath(res.bestRoute.path);
          setStableList(res.bestRoute.isStableList);
          setSecondTokenAmount(res.bestRoute.computations.tokenOutAmount);
        }
      } else if (tokenType === 'tokenOut') {
        if (props.isStablePair) {
          setSecondTokenAmount(input);
          const res = await fetchSwapData(input);

          setFirstTokenAmount(res.tokenOut.toFixed(6));

          setComputedData({
            success: true,
            data: {
              tokenOutAmount: res.tokenOut.toFixed(6),
              fees: res.fee,
              totalFees: res.fee,
              minimumOut: res.minimumOut.toFixed(6),
              finalMinimumOut: res.minimumOut.toFixed(6),
              priceImpact: res.priceImpact,
              exchangeRate: res.exchangeRate,
            },
          });
        } else {
          setSecondTokenAmount(input);

          const res = computeTokenOutForRouteBaseByOutAmountV2(
            Number(input),
            props.routeData.allRoutes,
            props.slippage,
          );
          setComputedData({
            success: true,
            data: {
              tokenOutAmount: res.bestRoute.computations.tokenOutAmount,
              fees: res.bestRoute.computations.fees,
              totalFees:
                res.bestRoute.computations.fees[res.bestRoute.computations.fees.length - 1],
              minimumOut: res.bestRoute.computations.minimumOut,
              finalMinimumOut:
                res.bestRoute.computations.minimumOut[
                  res.bestRoute.computations.minimumOut.length - 1
                ],
              priceImpact: res.bestRoute.computations.priceImpact,
              maxfee: res.bestRoute.maxFee,
            },
          });
          setRoutePath(res.bestRoute.path);
          setStableList(res.bestRoute.isStableList);
          setFirstTokenAmount(res.bestRoute.computations.tokenInAmount);
        }
      }
    }
  };
  const onClickAmount = () => {
    setSecondTokenAmount('');
    // const value =
    //   props.userBalances[props.tokenIn.name].toLocaleString('en-US', {
    //     maximumFractionDigits: 20,
    //     useGrouping: false,
    //   }) ?? 0;
    props.tokenIn.name === 'tez'
      ? handleSwapTokenInput(props.userBalances[props.tokenIn.name] - 0.02, 'tokenIn')
      : handleSwapTokenInput(props.userBalances[props.tokenIn.name], 'tokenIn');
  };
  useEffect(() => {
    handleSwapTokenInput(firstTokenAmount, 'tokenIn');
  }, [routeDataCopy]);
  useEffect(() => {
    setErrorMessage(false);
  }, [props.tokenOut.name]);

  const callSwapToken = () => {
    props.setShowConfirmSwap(true);
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
      props.setBalanceUpdate(true);
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      props.setShowConfirmTransaction(false);
      props.setSecondTokenAmount('');
      props.resetAllValues();
      props.setLoaderInButton(false);
      setFirstTokenAmount('');
      setSecondTokenAmount('');
    } else {
      props.setLoading(false);
      setShowTransactionSubmitModal(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setBalanceUpdate(true);
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      props.setShowConfirmTransaction(false);
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
    localStorage.setItem(
      'token',
      props.tokenIn.name === 'tez'
        ? 'TEZ'
        : props.tokenIn.name === 'ctez'
        ? 'CTEZ'
        : props.tokenIn.name,
    );
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;
    if (props.tokenIn.name === 'ctez' && props.tokenOut.name === 'tez') {
      ctez_to_tez(
        props.tokenIn.name,
        props.tokenOut.name,
        computedData.data.minimumOut,
        recepientAddress,
        Number(firstTokenAmount),
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetVal,
        props.setShowConfirmTransaction,
      ).then((response) => {
        handleSwapResponse(response.success);
        props.setShowConfirmTransaction(false);
        props.setLoader(false);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    } else if (props.tokenIn.name === 'tez' && props.tokenOut.name === 'ctez') {
      tez_to_ctez(
        props.tokenIn.name,
        props.tokenOut.name,
        computedData.data.minimumOut,
        recepientAddress,
        Number(firstTokenAmount),
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetVal,
        props.setShowConfirmTransaction,
      ).then((response) => {
        props.setShowConfirmSwap(false);
        props.setShowConfirmTransaction(false);
        props.setLoader(false);
        handleSwapResponse(response.success);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    } else if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
      'veStableAMM'
    ) {
      //call api for new stableswap
      swapTokens(
        props.tokenIn.name,
        props.tokenOut.name,
        computedData.data.minimumOut,
        recepientAddress,
        Number(firstTokenAmount),
        props.walletAddress,
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetVal,
        props.setShowConfirmTransaction,
      ).then((response) => {
        props.setShowConfirmSwap(false);
        props.setShowConfirmTransaction(false);
        props.setLoader(false);
        handleSwapResponse(response.success);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    } else {
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
    }
  };
  const switchTokens = () => {
    props.changeTokenLocation();
    setFirstTokenAmount('');
    setSecondTokenAmount('');
  };

  const setErrorMessageOnUI = (value) => {
    setMessage(value);
    setErrorMessage(true);
  };

  const swapContentButton = useMemo(() => {
    if (props.walletAddress) {
      if (props.tokenOut.name && message === ERRORMESSAGESWAP) {
        return (
          <Button
            onClick={() => setErrorMessageOnUI(ERRORMESSAGESWAP)}
            color={'disabled'}
            className={
              'mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
            }
          >
            Swap
          </Button>
        );
      }
      if (props.tokenOut.name && firstTokenAmount) {
        if (Number(firstTokenAmount) === 0 || Number(secondTokenAmount) === 0) {
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
        } else if (firstTokenAmount > props.userBalances[props.tokenIn.name]) {
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
              !errorMessage && 'swap-token-select-box',

              errorMessage && 'errorBorder',
              firstTokenAmount > 0 && (errorMessage ? 'errorBorder' : 'typing-border'),
            )}
          >
            <div className="token-selector-balance-wrapper-swap">
              <button
                className="token-selector  token-selector-height"
                onClick={() => props.handleTokenType('tokenIn')}
              >
                <img src={props.tokenIn.image} className="button-logo logo-size" />
                <span className="span-themed">
                  {props.tokenIn.name === 'tez'
                    ? 'TEZ'
                    : props.tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenIn.name}{' '}
                </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              <div className="input-heading">YOU PAY</div>
              {props.tokenOut.name && props.userBalances[props.tokenIn.name] >= 0 ? (
                <input
                  type="text"
                  className={clsx(
                    'token-user-input',
                    errorMessage ? 'error-text-color' : 'typing-input-color',
                  )}
                  placeholder="0.0"
                  value={fromExponential(firstTokenAmount)}
                  onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenIn')}
                  disabled={message === ERRORMESSAGESWAP}
                />
              ) : (
                <input type="text" className="token-user-input" placeholder="--" disabled />
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
                    {props.userBalances[props.tokenIn.name] > 0 ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-e" {...props}>
                            {fromExponential(props.userBalances[props.tokenIn.name])}
                          </Tooltip>
                        }
                      >
                        <span
                          className={clsx(
                            'balance-tokenin',
                            errorMessage &&
                              message === 'Insufficient balance' &&
                              'error-text-color',
                          )}
                        >
                          {props.userBalances[props.tokenIn.name] >= 0 ? (
                            props.userBalances[props.tokenIn.name].toFixed(4)
                          ) : (
                            <div className="shimmer">0.0000</div>
                          )}{' '}
                        </span>
                      </OverlayTrigger>
                    ) : (
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
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="wallet-token-balance balance-revamp">
                    Balance: {props.userBalances[props.tokenIn.name]?.toFixed(4)}
                  </p>
                )}

                <p className="wallet-token-balance balance-revamp">
                  ~$
                  {props.tokenIn.name === 'tez' ? (
                    dolar * firstTokenAmount == null ? (
                      <span className="shimmer">99999999</span>
                    ) : firstTokenAmount ? (
                      (dolar * firstTokenAmount).toFixed(2)
                    ) : (
                      '0.00'
                    )
                  ) : props.getTokenPrice.success && firstTokenAmount ? (
                    getDollarValue(
                      firstTokenAmount,
                      props.getTokenPrice.tokenPrice[props.tokenIn.name],
                    )
                  ) : (
                    '0.00'
                  )}
                </p>
              </div>
            ) : null}
          </div>
          {errorMessage && <span className="error-message">{message}</span>}
        </div>

        <div className={clsx('switch-img-background', errorMessage && 'alignment-switch')}>
          <div className="switch-img">
            <div className="swap-arrow-center-revamp  icon-animated" onClick={switchTokens}>
              <img src={props.theme === 'light' ? switchImg : switchImgDark} />
            </div>
          </div>
        </div>

        <div className="second-token-bg">
          <div className="swap-content-box ">
            <div
              className={clsx(
                !errorMessage && 'swap-token-select-box',
                'second-token-input-swap',
                errorMessage && 'errorBorder',
                secondTokenAmount > 0 && (errorMessage ? 'errorBorder' : 'second-input-typing'),
              )}
            >
              <div className="token-selector-balance-wrapper-swap">
                {props.tokenOut.name ? (
                  <button
                    className="token-selector token-selector-height"
                    onClick={() => props.handleTokenType('tokenOut')}
                  >
                    <img src={props.tokenOut.image} className="button-logo logo-size" />
                    <span className="span-themed">
                      {props.tokenOut.name === 'tez'
                        ? 'TEZ'
                        : props.tokenOut.name === 'ctez'
                        ? 'CTEZ'
                        : props.tokenOut.name}{' '}
                    </span>
                    <span className="span-themed material-icons-round">expand_more</span>
                  </button>
                ) : (
                  <button
                    className="token-selector token-selector-height not-selected"
                    onClick={() => props.handleTokenType('tokenOut')}
                  >
                    Select a token <span className="material-icons-round">expand_more</span>
                  </button>
                )}
              </div>

              <div className="token-user-input-wrapper">
                <div className="input-heading receive-heading">YOU RECEIVE</div>
                {props.tokenOut.name ? (
                  props.userBalances[props.tokenOut.name] >= 0 && routeDataCopy ? (
                    <input
                      type="text"
                      className={clsx(
                        'token-user-input',
                        secondTokenAmount && 'second-input-color',
                      )}
                      value={secondTokenAmount && fromExponential(secondTokenAmount)}
                      placeholder="0.0"
                      disabled
                      onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenOut')}
                    />
                  ) : (
                    <span className="shimmer-text ml-auto">
                      <span className="shimmer shimmer-input">0.0000</span>
                    </span>
                  )
                ) : (
                  <input
                    type="text"
                    className="token-user-input"
                    disabled
                    placeholder="--"
                    value="--"
                  />
                )}
              </div>
              {props.walletAddress ? (
                <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
                  <p className="wallet-token-balance balance-revamp">
                    Balance:{' '}
                    {props.tokenOut.name ? (
                      props.userBalances[props.tokenOut.name] >= 0 ? (
                        fromExponential(props.userBalances[props.tokenOut.name])
                      ) : (
                        <div className="shimmer">0.0000</div>
                      )
                    ) : (
                      '--'
                    )}
                  </p>
                  <p className="wallet-token-balance balance-revamp">
                    ~$
                    {props.tokenOut.name === 'tez' ? (
                      dolar * secondTokenAmount == null ? (
                        <span className="shimmer">99999999</span>
                      ) : secondTokenAmount ? (
                        (dolar * secondTokenAmount).toFixed(2)
                      ) : (
                        '0.00'
                      )
                    ) : props.getTokenPrice.success && secondTokenAmount ? (
                      getDollarValue(
                        secondTokenAmount,
                        props.getTokenPrice.tokenPrice[props.tokenOut.name],
                      )
                    ) : (
                      '0.00'
                    )}
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
                placeholder="Recipient address"
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
          Number(firstTokenAmount) > 0 &&
          routeDataCopy ? (
            <SwapDetails
              routePath={routePath}
              theme={props.theme}
              computedOutDetails={computedData}
              tokenIn={props.tokenIn}
              tokenOut={props.tokenOut}
              routeData={props.routeData}
              firstTokenAmount={firstTokenAmount}
              stableList={stableList}
              isStableSwap={isStableSwap.current}
            />
          ) : null}
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
        theme={props.theme}
      />
      <ConfirmTransaction
        show={props.showConfirmTransaction}
        content={`Swap ${Number(localStorage.getItem('wrapped')).toFixed(6)} ${localStorage.getItem(
          'token',
        )} `}
        theme={props.theme}
        onHide={handleCloseModal}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        InfoMessage={`Swap ${Number(localStorage.getItem('wrapped')).toFixed(
          6,
        )} ${localStorage.getItem('token')} `}
        theme={props.theme}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Block Explorer'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />
      <Loader
        loading={props.loading}
        content={`Swap ${Number(localStorage.getItem('wrapped')).toFixed(6)} ${localStorage.getItem(
          'token',
        )} `}
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
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  loaderMessage: PropTypes.any,
  handleOutTokenInput: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  recepient: PropTypes.any,
  resetAllValues: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
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
  isStablePair: PropTypes.any,
  setBalanceUpdate: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapTab);
