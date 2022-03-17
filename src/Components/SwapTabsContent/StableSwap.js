import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import SwapDetails from '../SwapDetails';
import ConfirmSwap from './ConfirmSwap';
import { connect } from 'react-redux';
import Button from '../Ui/Buttons/Button';
import {
  loadSwapDataStable,
  calculateTokensOutStable,
  ctez_to_tez,
  tez_to_ctez,
  getXtzDollarPrice,
} from '../../apis/stableswap/stableswap';
import { ReactComponent as Stableswap } from '../../assets/images/SwapModal/stableswap-white.svg';
import ConfirmTransaction from '../WrappedAssets/ConfirmTransaction';
import InfoModal from '../Ui/Modals/InfoModal';
import Loader from '../loader';
import { setLoader } from '../../redux/slices/settings/settings.slice';

const StableSwap = (props) => {
  const [firstTokenAmountStable, setFirstTokenAmountStable] = useState();
  const [secondTokenAmountStable, setSecondTokenAmountStable] = useState();
  const [firstAmount, setFirstAmount] = useState(0);
  const [secondAmount, setSecondAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [dolar, setDolar] = useState('0.0');

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
  const [computedData, setComputedData] = useState({
    success: false,
    data: {
      tokenOutAmount: 0,
      fees: [],
      totalFees: 0,
      minimumOut: [],
      finalMinimumOut: 0,
      priceImpact: 0,
      exchangeRate: 0,
    },
  });

  const getSwapData = async () => {
    const res = await loadSwapDataStable(props.tokenIn.name, props.tokenOut.name);
    setSwapData(res);
  };
  useEffect(() => {
    getSwapData();
  }, [props]);

  useEffect(() => {
    getXtzDollarPrice().then((res) => {
      setDolar(res);
    });
  }, []);

  useEffect(() => {
    firstTokenAmountStable && setFirstAmount(firstTokenAmountStable);
    secondTokenAmountStable && setSecondAmount(secondTokenAmountStable);
  }, [firstTokenAmountStable, secondTokenAmountStable]);

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
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

  const handleSwapTokenInput = async (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setFirstTokenAmountStable('');
      setSecondTokenAmountStable('');
    } else {
      if (tokenType === 'tokenIn') {
        setFirstTokenAmountStable(input);

        const res = await fetchSwapData(input);

        setSecondTokenAmountStable(res.tokenOut.toFixed(6));
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
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmountStable(input);
        const res = await fetchSwapData(input);

        setFirstTokenAmountStable(res.tokenOut.toFixed(6));

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
      }
    }
  };

  const InfoMessage = useMemo(() => {
    return (
      <span>
        Swap {firstAmount} {props.tokenIn.name} for {secondAmount} {props.tokenOut.name}
      </span>
    );
  }, [firstAmount, secondAmount]);

  useEffect(() => {
    handleSwapTokenInput(firstTokenAmountStable, 'tokenIn');
  }, [props.tokenIn]);
  useEffect(() => {
    setErrorMessage(false);
  }, [props.tokenOut.name, firstTokenAmountStable]);

  const callSwapToken = () => {
    props.setShowConfirmSwap(true);
  };

  const getDollarValue = (amount, price) => {
    const calculatedValue = amount * price;
    if (calculatedValue < 100) {
      return calculatedValue.toFixed(2);
    }
    return Math.floor(calculatedValue);
  };

  const resetValues = () => {
    setFirstTokenAmountStable('');
    setSecondTokenAmountStable('');
    props.setSecondTokenAmountStable('');
    props.resetAllValues();
  };

  const handleSwapResponse = (status) => {
    if (status) {
      getSwapData();

      props.setLoading(false);
      props.handleLoaderMessage('success', 'Transaction confirmed');
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      //props.setHideContent('');
      props.setSecondTokenAmountStable('');
      props.resetAllValues();
      props.setLoaderInButton(false);
      setFirstTokenAmountStable('');
      setSecondTokenAmountStable('');
    } else {
      props.setLoading(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      //props.setHideContent('');
      props.resetAllValues();
      props.setSecondTokenAmountStable('');
      props.setLoaderInButton(false);
    }
  };

  const confirmSwapToken = async () => {
    props.setLoading(true);
    props.setLoader(true);
    props.setLoaderInButton(true);
    props.setShowConfirmSwap(false);
    props.setShowConfirmTransaction(true);
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;
    props.resetAllValues();
    if (props.tokenIn.name === 'ctez') {
      ctez_to_tez(
        props.tokenIn.name,
        props.tokenOut.name,
        computedData.data.minimumOut,
        recepientAddress,
        Number(firstTokenAmountStable),
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetValues,
        props.setShowConfirmTransaction,
        setShowTransactionSubmitModal,
      ).then((response) => {
        handleSwapResponse(response.success);
        props.setShowConfirmTransaction(false);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    } else {
      tez_to_ctez(
        props.tokenIn.name,
        props.tokenOut.name,
        computedData.data.minimumOut,
        recepientAddress,
        Number(firstTokenAmountStable),
        transactionSubmitModal,
        props.setShowConfirmSwap,
        resetValues,
        props.setShowConfirmTransaction,
        setShowTransactionSubmitModal,
      ).then((response) => {
        props.setShowConfirmSwap(false);
        props.setShowConfirmTransaction(false);
        handleSwapResponse(response.success);
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

  const swapContentButton = useMemo(() => {
    if (props.walletAddress) {
      if (props.tokenOut.name && firstTokenAmountStable) {
        return (
          <Button
            onClick={callSwapToken}
            color={'primary'}
            className={'mt-4 w-100 flex align-items-center justify-content-center'}
          >
            <span>
              <Stableswap />
              <span className="ml-2">Swap</span>
            </span>
          </Button>
        );
      }

      if (!props.tokenOut.name) {
        return (
          <Button
            onClick={() => setErrorMessageOnUI('Please select a token and then enter the amount')}
            color={'disabled'}
            className={' mt-4 w-100 flex align-items-center justify-content-center'}
          >
            <span>
              <Stableswap />
              <span className="ml-2">Swap</span>
            </span>
          </Button>
        );
      }

      return (
        <Button
          onClick={() => setErrorMessageOnUI('Enter an amount to swap')}
          color={'disabled'}
          className={' mt-4 w-100 flex align-items-center justify-content-center'}
        >
          <span>
            <Stableswap />
            <span className="ml-2">Swap</span>
          </span>
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
    props.connecthWallet,
    firstTokenAmountStable,
    props.loaderInButton,
    props.tokenOut.name,
    props.walletAddress,
  ]);

  return (
    <>
      <div className="swap-content-box-wrapper">
        <div className="swap-content-box">
          <div
            className={clsx(
              'swap-token-select-box',
              'bg-themed-light',
              errorMessage && 'errorBorder',
            )}
          >
            <div className="token-selector-balance-wrapper">
              <button
                className="token-selector dropdown-themed stable-swap-token-selector"
                onClick={() => props.handleTokenType('tokenIn')}
              >
                <img src={props.tokenIn.image} className="button-logo" />
                <span className="span-themed">{props.tokenIn.name} </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              {swapData.success ? (
                <input
                  type="text"
                  className="token-user-input"
                  placeholder="0.0"
                  value={firstTokenAmountStable}
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
                  {props.tokenIn.name === 'tez' ? (
                    dolar * firstTokenAmountStable == null ? (
                      <span className="shimmer">99999999</span>
                    ) : firstTokenAmountStable ? (
                      (dolar * firstTokenAmountStable).toFixed(2)
                    ) : (
                      '0.00'
                    )
                  ) : props.getTokenPrice.success && firstTokenAmountStable ? (
                    getDollarValue(
                      firstTokenAmountStable,
                      props.getTokenPrice.tokenPrice[props.tokenIn.name],
                    )
                  ) : (
                    '0.00'
                  )}
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
          <div
            className={clsx(
              'swap-token-select-box',
              'bg-themed-light',
              errorMessage && 'errorBorder',
            )}
          >
            <div className="token-selector-balance-wrapper">
              <button
                className="token-selector dropdown-themed stable-swap-token-selector"
                onClick={() => props.handleTokenType('tokenOut')}
              >
                <img src={props.tokenOut.image} className="button-logo" />
                <span className="span-themed">{props.tokenOut.name} </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              {props.tokenOut.name ? (
                <input
                  type="text"
                  className="token-user-input"
                  value={secondTokenAmountStable}
                  placeholder="0.0"
                  onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenOut')}
                />
              ) : (
                <input
                  type="text"
                  className="token-user-input"
                  disabled
                  placeholder="0.0"
                  value={firstTokenAmountStable}
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
                  {props.tokenOut.name === 'tez'
                    ? isNaN(dolar * secondTokenAmountStable)
                      ? '0.00'
                      : secondTokenAmountStable
                      ? (dolar * secondTokenAmountStable).toFixed(2)
                      : '0.00'
                    : props.getTokenPrice.success && secondTokenAmountStable
                    ? getDollarValue(
                        secondTokenAmountStable,
                        props.getTokenPrice.tokenPrice[props.tokenOut.name],
                      )
                    : '0.00'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
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
        {errorMessage && <span className="error-message">{message}</span>}

        {swapContentButton}

        {props.walletAddress && props.tokenIn.name && props.tokenOut.name && (
          <SwapDetails
            computedOutDetails={computedData}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            firstTokenAmount={firstTokenAmountStable}
            isStableSwap={true}
          />
        )}
      </div>

      <ConfirmSwap
        show={props.showConfirmSwap}
        computedData={computedData}
        tokenIn={props.tokenIn}
        firstTokenAmount={Number(firstTokenAmountStable)}
        tokenOut={props.tokenOut}
        slippage={props.slippage}
        confirmSwapToken={confirmSwapToken}
        onHide={props.handleClose}
        // routeData={props.routeData}
        loading={props.loading}
        isStableSwap={true}
      />
      <ConfirmTransaction
        show={props.showConfirmTransaction}
        computedData={computedData}
        tokenIn={props.tokenIn}
        theme={props.theme}
        firstTokenAmount={firstTokenAmountStable}
        tokenOut={props.tokenOut}
        slippage={props.slippage}
        confirmSwapToken={confirmSwapToken}
        onHide={props.handleClose}
        routeData={props.routeData}
        loading={props.loading}
        secondTokenAmount={secondAmount}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        firstTokenAmount={firstAmount}
        secondTokenAmount={secondAmount}
        tokenIn={props.tokenIn.name}
        tokenOut={props.tokenOut.name}
        InfoMessage={InfoMessage}
        theme={props.theme}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />
      <Loader
        loading={props.loading}
        loaderMessage={props.loaderMessage}
        tokenIn={props.tokenIn.name}
        firstTokenAmount={firstAmount}
        tokenOut={props.tokenOut.name}
        secondTokenAmount={secondAmount}
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

StableSwap.propTypes = {
  changeTokenLocation: PropTypes.any,
  computedOutDetails: PropTypes.any,
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  setLoader: PropTypes.func,
  // firstTokenAmountStable: PropTypes.any,
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  handleOutTokenInput: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  // midTokens: PropTypes.any,
  recepient: PropTypes.any,
  resetAllValues: PropTypes.any,
  // secondTokenAmountStable: PropTypes.any,
  setFirstTokenAmountStable: PropTypes.any,
  //setHideContent: PropTypes.any,
  setLoaderInButton: PropTypes.any,
  loaderMessage: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  loading: PropTypes.any,
  setRecepient: PropTypes.any,
  setSecondTokenAmountStable: PropTypes.any,
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
  isStableSwap: PropTypes.any,
  setShowConfirmTransaction: PropTypes.any,
  showConfirmTransaction: PropTypes.any,
  theme: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(StableSwap);
