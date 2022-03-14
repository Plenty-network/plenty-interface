import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import ConfirmTransaction from './ConfirmTransaction';
import ConfirmSwap from './ConfirmSwap';
import { connect } from 'react-redux';
import Button from '../Ui/Buttons/Button';
import Loader from '../loader';
import InfoModal from '../Ui/Modals/InfoModal';
import { swapWrappedAssets } from '../../apis/WrappedAssets/WrappedAssets';
import { setLoader } from '../../redux/slices/settings/settings.slice';

const SwapContent = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();
  const [firstAmount, setFirstAmount] = useState(0);
  const [secondAmount, setSecondAmount] = useState(0);

  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  // const check = {
  //   type: 'success',
  //   message: 'success',
  // };
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  useEffect(() => {
    firstTokenAmount && setFirstAmount(firstTokenAmount);
    secondTokenAmount && setSecondAmount(secondTokenAmount);
  }, [firstTokenAmount, secondTokenAmount]);

  const handleSwapTokenInput = (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
      setSecondTokenAmount('');
    } else {
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);
        setSecondTokenAmount(input);
      } else if (tokenType === 'tokenOut') {
        setSecondTokenAmount(input);
        setFirstTokenAmount(input);
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
      props.handleLoaderMessage('success', 'Transaction confirmed');
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      //props.setHideContent('');
      props.setSecondTokenAmount('');
      props.resetAllValues();
      props.setLoaderInButton(false);
      setFirstTokenAmount('');
      setSecondTokenAmount('');
    } else {
      props.setLoading(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setLoader(false);
      props.setShowConfirmSwap(false);
      //props.setHideContent('');
      props.resetAllValues();
      props.setSecondTokenAmount('');
      props.setLoaderInButton(false);
    }
  };

  const confirmSwapToken = async () => {
    props.setLoading(true);
    props.setLoader(true);
    props.setShowConfirmSwap(false);
    props.setShowConfirmTransaction(true);
    props.setLoaderInButton(true);
    const recepientAddress = props.recepient ? props.recepient : props.walletAddress;
    swapWrappedAssets(
      props.tokenIn.name,
      firstTokenAmount,
      recepientAddress,
      transactionSubmitModal,
      props.setShowConfirmSwap,
      resetVal,
      props.setShowConfirmTransaction,
      setShowTransactionSubmitModal,
    ).then((response) => {
      props.setShowConfirmSwap(false);
      props.setShowConfirmTransaction(false);
      // setTimeout(() => {
      //   props.setShowTransactionSubmitModal(false);
      // }, 5000);
      handleSwapResponse(response.success);
      setTimeout(() => {
        props.setLoaderMessage({});
      }, 5000);
    });
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
            onClick={() => setErrorMessageOnUI('Please select a token and then enter the amount')}
            color={'disabled'}
            className={' mt-4 w-100 flex align-items-center justify-content-center'}
          >
            Swap
          </Button>
        );
      }

      return (
        <Button
          onClick={() => setErrorMessageOnUI('Enter an amount to swap')}
          color={'disabled'}
          className={' mt-4 w-100 flex align-items-center justify-content-center'}
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
                className="token-selector dropdown-themed"
                onClick={() => props.handleTokenType('tokenIn')}
              >
                <img src={props.tokenIn.image} className="button-logo" />
                <span className="span-themed">{props.tokenIn.name} </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              <input
                type="text"
                className="token-user-input"
                placeholder="0.0"
                value={firstTokenAmount}
                onChange={(e) => handleSwapTokenInput(e.target.value, 'tokenIn')}
              />
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
        <div className="swap-arrow-center bg-themed ">
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
              <button className="token-selector dropdown-themed">
                <img src={props.tokenOut.image} className="button-logo" />
                <span className="span-themed">{props.tokenOut.name} </span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              {props.tokenOut.name ? (
                <input
                  type="text"
                  className="token-user-input"
                  value={secondTokenAmount}
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
      </div>
      <ConfirmSwap
        show={props.showConfirmSwap}
        tokenIn={props.tokenIn}
        firstTokenAmount={Number(firstTokenAmount)}
        secondTokenAmount={Number(secondTokenAmount)}
        tokenOut={props.tokenOut}
        slippage={props.slippage}
        confirmSwapToken={confirmSwapToken}
        onHide={props.handleClose}
        loading={props.loading}
      />
      <ConfirmTransaction
        show={props.showConfirmTransaction}
        tokenIn={props.tokenIn}
        firstTokenAmount={firstAmount}
        tokenOut={props.tokenOut}
        slippage={props.slippage}
        confirmSwapToken={confirmSwapToken}
        onHide={props.handleClose}
        routeData={props.routeData}
        loading={props.loading}
        theme={props.theme}
        secondTokenAmount={secondAmount}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        firstTokenAmount={firstAmount}
        secondTokenAmount={secondAmount}
        tokenIn={props.tokenIn.name}
        tokenOut={props.tokenOut.name}
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
        setLoaderMessage={props.setLoaderMessage}
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

SwapContent.propTypes = {
  computedOutDetails: PropTypes.any,
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  setLoader: PropTypes.func,
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
  //setHideContent: PropTypes.any,
  setLoaderInButton: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  loaderMessage: PropTypes.any,
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
  showConfirmTransaction: PropTypes.any,
  setShowConfirmTransaction: PropTypes.any,
  theme: PropTypes.any,
  setShowTransactionSubmitModal: PropTypes.any,
  transactionId: PropTypes.any,
  showTransactionSubmitModal: PropTypes.any,
};

//export default SwapContent;

export default connect(mapStateToProps, mapDispatchToProps)(SwapContent);
