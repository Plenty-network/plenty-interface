import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { computeRemoveTokens, removeLiquidity } from '../../../apis/swap/swap';

import ConfirmRemoveLiquidity from './ConfirmRemoveLiquidity';
import InfoModal from '../../Ui/Modals/InfoModal';

import CONFIG from '../../../config/config';
import Button from '../../Ui/Buttons/Button';

const RemoveLiquidity = (props) => {
  const [removableTokens, setRemovableTokens] = useState({});
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const removeLiquidityInput = (input) => {
    const removeAmount = parseFloat(input);
    let computedRemoveTokens = computeRemoveTokens(
      removeAmount,
      props.swapData.lpTokenSupply,
      props.swapData.tokenIn_supply,
      props.swapData.tokenOut_supply,
      props.slippage,
    );
    computedRemoveTokens = {
      ...computedRemoveTokens,
      removeAmount: removeAmount,
    };
    setRemovableTokens(computedRemoveTokens);
  };

  const handleRemoveLiquidity = () => {
    props.setShowConfirmRemoveSupply(true);
    props.setHideContent('content-hide');
  };
  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const confirmRemoveLiquidity = () => {
    props.setLoading(true);
    removeLiquidity(
      props.tokenIn.name,
      props.tokenOut.name,
      removableTokens.tokenFirst_Out,
      removableTokens.tokenSecond_Out,
      removableTokens.removeAmount,
      props.walletAddress,
      props.swapData.dexContractInstance,
      transactionSubmitModal,
    ).then((data) => {
      if (data.success) {
        props.setLoading(false);
        props.handleLoaderMessage('success', 'Transaction confirmed');
        props.setShowConfirmRemoveSupply(false);
        props.setHideContent('');
        props.resetAllValues();
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      } else {
        props.setLoading(false);
        props.handleLoaderMessage('error', 'Transaction failed');
        props.setShowConfirmRemoveSupply(false);
        props.setHideContent('');
        props.resetAllValues();
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      }
    });
  };
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
    swapContentButton = (
      <Button
        onClick={() => null}
        color={'primary'}
        className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
      >
        Enter an amount
      </Button>
    );
  }
  if (props.walletAddress && props.firstTokenAmount) {
    swapContentButton = (
      <Button
        onClick={handleRemoveLiquidity}
        color={'primary'}
        className={'mt-4 w-100 flex align-items-center justify-content-center'}
      >
        Confirm Withdrawal
      </Button>
    );
  }
  if (props.tokenIn.name && props.tokenOut.name) {
    if (
      props.walletAddress &&
      props.firstTokenAmount &&
      props.firstTokenAmount >
        props.userBalances[
          CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
            .liquidityToken
        ]
    ) {
      swapContentButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Insufficient Balance
        </Button>
      );
    }
  }

  const onClickAmount = () => {
    const value =
      props.userBalances[
        CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name].liquidityToken
      ].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    props.setFirstTokenAmount(value.substring(0, value.length - 1));
    removeLiquidityInput(value.substring(0, value.length - 1));
  };

  return (
    <>
      <div className="swap-content-box">
        <div className="swap-token-select-box" style={{ minHeight: '70px' }}>
          <div className="token-selector-balance-wrapper">
            <p className="remove-liquidity-token-info">Amount to remove</p>
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              placeholder="0.0"
              value={props.firstTokenAmount}
              onChange={(e) => {
                props.setFirstTokenAmount(e.target.value);
                removeLiquidityInput(e.target.value);
              }}
            />
          </div>
          <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
            {CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name] ? (
              <p
                className="wallet-token-balance"
                style={{ cursor: 'pointer' }}
                onClick={onClickAmount}
              >
                Balance:{' '}
                {props.userBalances[
                  CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                    .liquidityToken
                ] >= 0 ? (
                  props.userBalances[
                    CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                      .liquidityToken
                  ]
                ) : (
                  <div className="shimmer">0.0000</div>
                )}
                <span className="max-btn"> (Max)</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="swap-arrow-center">
        <span className="material-icons-round">south</span>
      </div>

      <div className="swap-content-box">
        <div className="swap-token-select-box" style={{ minHeight: '70px' }}>
          <div className="token-selector-balance-wrapper">
            <p className="remove-liquidity-token-info">Receiving</p>
          </div>

          <div className="token-user-input-wrapper remove-liquidity-pair-wrapper flex">
            <button className="token-selector">
              <img src={props.tokenIn.image} className="button-logo" />
              {removableTokens.tokenFirst_Out ? removableTokens.tokenFirst_Out.toFixed(4) : '0.00'}
              <span className="remove-liquidity-token-name">{props.tokenIn.name}</span>
            </button>

            <button className="token-selector">
              <img src={props.tokenOut.image} className="button-logo" />
              {removableTokens.tokenSecond_Out
                ? removableTokens.tokenSecond_Out.toFixed(4)
                : '0.00'}
              <span className="remove-liquidity-token-name">{props.tokenOut.name}</span>
            </button>
          </div>
          {props.walletConnected ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">Balance: 0 Kalam</p>
            </div>
          ) : null}
        </div>
      </div>
      {swapContentButton}
      <ConfirmRemoveLiquidity
        {...props}
        removableTokens={removableTokens}
        confirmRemoveLiquidity={confirmRemoveLiquidity}
        onHide={props.handleClose}
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

export default RemoveLiquidity;

RemoveLiquidity.propTypes = {
  connecthWallet: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  resetAllValues: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setHideContent: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  setShowConfirmRemoveSupply: PropTypes.any,
  slippage: PropTypes.any,
  swapData: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  userBalances: PropTypes.any,
  walletAddress: PropTypes.any,
  walletConnected: PropTypes.any,
};
