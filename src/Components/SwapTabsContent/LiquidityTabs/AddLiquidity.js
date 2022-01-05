import PropTypes from 'prop-types';
import { addLiquidity, estimateOtherToken, lpTokenOutput } from '../../../apis/swap/swap';
import React, { useEffect, useState } from 'react';

import InfoModal from '../../Ui/Modals/InfoModal';
import ConfirmAddLiquidity from './ConfirmAddLiquidity';
import Button from '../../Ui/Buttons/Button';

const AddLiquidity = (props) => {
  const [estimatedTokenAmout, setEstimatedTokenAmout] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [lpTokenAmount, setLpTokenAmount] = useState({});
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleLiquidityInput = (input) => {
    setEstimatedTokenAmout({});
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
      props.setFirstTokenAmount('');
      setEstimatedTokenAmout({
        otherTokenAmount: '',
      });
      return;
    }
    const estimatedTokenAmout = estimateOtherToken(
      input,
      props.swapData.tokenIn_supply,
      props.swapData.tokenOut_supply,
    );
    setEstimatedTokenAmout(estimatedTokenAmout);
  };
  const handleLiquiditySecondInput = (input) => {
    setSecondTokenAmount(input);
    setEstimatedTokenAmout({});
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
      props.setFirstTokenAmount('');
      setEstimatedTokenAmout({
        otherTokenAmount: '',
      });
    } else {
      const estimatedTokenAmout = estimateOtherToken(
        input,
        props.swapData.tokenOut_supply,
        props.swapData.tokenIn_supply,
      );
      setEstimatedTokenAmout(estimatedTokenAmout);
      props.setFirstTokenAmount(estimatedTokenAmout.otherTokenAmount);
    }
  };
  const confirmAddLiquidity = () => {
    props.setShowConfirmAddSupply(true);
    props.setHideContent('content-hide');

    const secondTokenAmountEntered = secondTokenAmount
      ? parseFloat(secondTokenAmount)
      : estimatedTokenAmout.otherTokenAmount;

    const lpTokenAmount = lpTokenOutput(
      props.firstTokenAmount,
      secondTokenAmountEntered,
      props.swapData.tokenIn_supply,
      props.swapData.tokenOut_supply,
      props.swapData.lpTokenSupply,
    );
    setLpTokenAmount(lpTokenAmount);
  };
  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const CallConfirmAddLiquidity = () => {
    props.setLoading(true);
    const secondTokenAmountEntered = secondTokenAmount
      ? parseFloat(secondTokenAmount)
      : estimatedTokenAmout.otherTokenAmount;
    addLiquidity(
      props.tokenIn.name,
      props.tokenOut.name,
      props.firstTokenAmount,
      secondTokenAmountEntered,
      props.tokenContractInstances[props.tokenIn.name],
      props.tokenContractInstances[props.tokenOut.name],
      props.walletAddress,
      props.swapData.dexContractInstance,
      transactionSubmitModal,
    ).then((data) => {
      if (data.success) {
        props.setLoading(false);
        props.handleLoaderMessage('success', 'Transaction confirmed');
        props.setShowConfirmAddSupply(false);
        props.setHideContent('');
        props.resetAllValues();
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      } else {
        props.setLoading(false);
        props.handleLoaderMessage('error', 'Transaction failed');
        props.setShowConfirmAddSupply(false);
        props.setHideContent('');
        props.resetAllValues();
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      }
    });
  };

  useEffect(() => {
    if (props.firstTokenAmount === '' || props.firstTokenAmount === 0) {
      setSecondTokenAmount('');
      setEstimatedTokenAmout({
        otherTokenAmount: '',
      });
    }
  }, [props.firstTokenAmount]);

  let swapContentButton = (
    <Button
      onClick={props.connecthWallet}
      color={'primary'}
      startIcon={'add'}
      className={'mt-4 w-100 flex align-items-center justify-content-center'}
    >
      Connect Wallet
    </Button>
  );

  if (props.walletAddress) {
    if (props.tokenOut.name && props.firstTokenAmount) {
      swapContentButton = (
        <Button
          onClick={confirmAddLiquidity}
          color={'primary'}
          className={'mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Add Liquidity
        </Button>
      );
    } else if (!props.tokenOut.name) {
      swapContentButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Select a token
        </Button>
      );
    } else {
      swapContentButton = props.loaderInButton ? (
        <Button
          onClick={() => null}
          color={'primary'}
          loading={true}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        ></Button>
      ) : (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Enter an amount
        </Button>
      );
    }
  }

  const onClickAmount = () => {
    const value =
      props.userBalances[props.tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    props.setFirstTokenAmount(value.substring(0, value.length - 1));
    handleLiquidityInput(value.substring(0, value.length - 1));
  };

  return (
    <>
      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            <button
              className="token-selector dropdown-themed"
              onClick={() => props.handleTokenType('tokenIn')}
            >
              <img src={props.tokenIn.image} className="button-logo" />
              {props.tokenIn.name} <span className="material-icons-round">expand_more</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            {props.swapData.success && props.userBalances[props.tokenIn.name] ? (
              <input
                type="text"
                className="token-user-input"
                placeholder="0.0"
                value={props.firstTokenAmount}
                onChange={(e) => {
                  props.setFirstTokenAmount(e.target.value);
                  handleLiquidityInput(e.target.value);
                }}
              />
            ) : (
              <input
                type="text"
                className="token-user-input"
                placeholder="0.0"
                disabled
                value={props.firstTokenAmount}
              />
            )}
          </div>
          {props.walletAddress ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p
                className="wallet-token-balance"
                style={{ cursor: 'pointer' }}
                onClick={onClickAmount}
              >
                Balance:{' '}
                {props.userBalances[props.tokenIn.name] >= 0 ? (
                  props.userBalances[props.tokenIn.name]
                ) : (
                  <div className="shimmer">0.0000</div>
                )}{' '}
                <span className="max-btn">(Max)</span>
              </p>
              <p className="wallet-token-balance">
                ~$
                {props.getTokenPrice.success && props.firstTokenAmount
                  ? (
                      props.firstTokenAmount * props.getTokenPrice.tokenPrice[props.tokenIn.name]
                    ).toFixed(5)
                  : '0.00'}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="swap-arrow-center">
        <span className="material-icons-round">add</span>
      </div>

      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            {props.tokenOut.name ? (
              <button
                className="token-selector dropdown-themed"
                onClick={() => props.handleTokenType('tokenOut')}
              >
                <img src={props.tokenOut.image} className="button-logo" />
                {props.tokenOut.name} <span className="material-icons-round">expand_more</span>
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
            {props.swapData.success ? (
              <input
                type="text"
                className="token-user-input"
                placeholder="0.0"
                value={secondTokenAmount ? secondTokenAmount : estimatedTokenAmout.otherTokenAmount}
                onChange={(e) => handleLiquiditySecondInput(e.target.value)}
              />
            ) : (
              <input
                type="text"
                disabled
                className="token-user-input"
                placeholder="0.0"
                value={props.firstTokenAmount}
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
                {props.getTokenPrice.success && estimatedTokenAmout.otherTokenAmount
                  ? (
                      (secondTokenAmount
                        ? secondTokenAmount
                        : estimatedTokenAmout.otherTokenAmount) *
                      props.getTokenPrice.tokenPrice[props.tokenOut.name]
                    ).toFixed(5)
                  : '0.00'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="swap-detail-wrapper bg-themed-light">
        <div className="add-liquidity-tip">
          When you add liquidity, you will receive pool tokens representing your position. These
          tokens automatically earn fees proportional to your share of the pool, and can be redeemed
          at any time.
        </div>
      </div>
      {swapContentButton}
      <ConfirmAddLiquidity
        {...props}
        CallConfirmAddLiquidity={CallConfirmAddLiquidity}
        lpTokenAmount={lpTokenAmount}
        onHide={props.handleClose}
        estimatedTokenAmout={estimatedTokenAmout}
        secondTokenAmount={secondTokenAmount}
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
    </>
  );
};

export default AddLiquidity;

AddLiquidity.propTypes = {
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  resetAllValues: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setHideContent: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  setShowConfirmAddSupply: PropTypes.any,
  swapData: PropTypes.any,
  tokenContractInstances: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  userBalances: PropTypes.any,
  walletAddress: PropTypes.any,
};
