import {
  estimateOtherToken,
  addLiquidity,
  lpTokenOutput,
} from '../../../apis/swap/swap';
import { useState } from 'react';

import InfoModal from '../../Ui/Modals/InfoModal';
import ConfirmAddLiquidity from './ConfirmAddLiquidity';
import PuffLoader from 'react-spinners/PuffLoader';

const AddLiquidity = (props) => {
  const [estimatedTokenAmout, setEstimatedTokenAmout] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [lpTokenAmount, setLpTokenAmount] = useState({});
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] =
    useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleLiquidityInput = (input) => {
    const estimatedTokenAmout = estimateOtherToken(
      input,
      props.swapData.tokenIn_supply,
      props.swapData.tokenOut_supply
    );
    setEstimatedTokenAmout(estimatedTokenAmout);
  };
  const handleLiquiditySecondInput = (input) => {
    setSecondTokenAmount(input);
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
      props.setFirstTokenAmount('');
      setEstimatedTokenAmout({});
      return;
    } else {
      const estimatedTokenAmout = estimateOtherToken(
        input,
        props.swapData.tokenOut_supply,
        props.swapData.tokenIn_supply
      );
      setEstimatedTokenAmout(estimatedTokenAmout);
      props.setFirstTokenAmount(estimatedTokenAmout.otherTokenAmount);
    }
  };
  const confirmAddLiquidity = () => {
    props.setShowConfirmAddSupply(true);
    props.setHideContent('content-hide');
    const lpTokenAmount = lpTokenOutput(
      props.firstTokenAmount,
      estimatedTokenAmout.otherTokenAmount,
      props.swapData.tokenIn_supply,
      props.swapData.tokenOut_supply,
      props.swapData.lpTokenSupply
    );
    setLpTokenAmount(lpTokenAmount);
  };
  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const CallConfirmAddLiquidity = () => {
    props.setLoading(true);
    addLiquidity(
      props.tokenIn.name,
      props.tokenOut.name,
      props.firstTokenAmount,
      estimatedTokenAmout.otherTokenAmount,
      props.tokenContractInstances[props.tokenIn.name],
      props.tokenContractInstances[props.tokenOut.name],
      props.walletAddress,
      props.swapData.dexContractInstance,
      transactionSubmitModal
    ).then((data) => {
      if (data.success) {
        props.setLoading(false);
        props.handleLoaderMessage('success', 'Transaction confirmed');
        props.setShowConfirmAddSupply(false);
        props.setHideContent('');
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      } else {
        props.setLoading(false);
        props.handleLoaderMessage('error', 'Transaction failed');
        props.setShowConfirmAddSupply(false);
        props.setHideContent('');
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      }
    });
  };

  let swapContentButton = (
    <button className="swap-content-btn" onClick={props.connecthWallet}>
      <span className="material-icons-round">add</span> Connect Wallet
    </button>
  );

  if (props.walletAddress) {
    if (props.tokenOut.name && props.firstTokenAmount) {
      swapContentButton = (
        <button className="swap-content-btn" onClick={confirmAddLiquidity}>
          Add Liquidity
        </button>
      );
    } else if (!props.tokenOut.name) {
      swapContentButton = (
        <button className="swap-content-btn enter-amount">
          Select a token
        </button>
      );
    } else {
      swapContentButton = props.loading ? (
        <button className="swap-content-btn loader-btn enter-amount">
          <PuffLoader color={'#fff'} size={28} />
        </button>
      ) : (
        <button className="swap-content-btn enter-amount">
          Enter an amount
        </button>
      );
    }
  }

  return (
    <>
      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            <button
              className="token-selector"
              onClick={() => props.handleTokenType('tokenIn')}
            >
              <img src={props.tokenIn.image} className="button-logo" />
              {props.tokenIn.name}{' '}
              <span className="material-icons-round">expand_more</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            {props.tokenOut.name ? (
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
              />
            )}
          </div>
          {props.walletAddress ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">
                Balance: {props.userBalances[props.tokenIn.name]}
              </p>
              <p className="wallet-token-balance">
                ~$
                {props.getTokenPrice.success && props.firstTokenAmount
                  ? (
                      props.firstTokenAmount *
                      props.getTokenPrice.tokenPrice[props.tokenIn.name]
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
                className="token-selector"
                onClick={() => props.handleTokenType('tokenOut')}
              >
                <img src={props.tokenOut.image} className="button-logo" />
                {props.tokenOut.name}{' '}
                <span className="material-icons-round">expand_more</span>
              </button>
            ) : (
              <button
                className="token-selector not-selected"
                onClick={() => props.handleTokenType('tokenOut')}
              >
                Select a token{' '}
                <span className="material-icons-round">expand_more</span>
              </button>
            )}
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              placeholder="0.0"
              value={
                secondTokenAmount
                  ? secondTokenAmount
                  : estimatedTokenAmout.otherTokenAmount
              }
              onChange={(e) => handleLiquiditySecondInput(e.target.value)}
            />
          </div>
          {props.walletAddress && props.tokenOut.name ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">
                Balance: {props.userBalances[props.tokenOut.name]}
              </p>
              <p className="wallet-token-balance">
                ~$
                {props.getTokenPrice.success &&
                estimatedTokenAmout.otherTokenAmount
                  ? (
                      estimatedTokenAmout.otherTokenAmount *
                      props.getTokenPrice.tokenPrice[props.tokenOut.name]
                    ).toFixed(5)
                  : '0.00'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      {swapContentButton}
      <ConfirmAddLiquidity
        {...props}
        CallConfirmAddLiquidity={CallConfirmAddLiquidity}
        lpTokenAmount={lpTokenAmount}
        onHide={props.handleClose}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          transactionId
            ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank')
            : null
        }
      />
    </>
  );
};

export default AddLiquidity;
