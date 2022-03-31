import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import xplenty from '../../assets/images/xplenty-icon.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from '../Ui/Buttons/Button';
import Loader from '../../Components/loader';
import ConfirmTransaction from '../WrappedAssets/ConfirmTransaction';
import InfoModal from '../Ui/Modals/InfoModal';
import { connect } from 'react-redux';
import { closetransactionInjectionModalThunk } from '../../redux/slices/xPlenty/xPlenty.thunk';

const UnstakePlenty = (props) => {
  const [xPlentyInput, setxPlentyInput] = useState('');
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [stakeInput, setStakeInput] = useState(0);

  const xPlentyInputHandler = (value) => {
    if (value === '' || isNaN(value)) {
      setxPlentyInput('');
      return;
    }
    setxPlentyInput(value);
    props.setExpectedPlenty(
      props.xPlentyData.data.plentyBalance,
      props.xPlentyData.data.totalSupply,
      parseFloat(value),
    );
  };
  const sellHandler = () => {
    setShowConfirmTransaction(true);
    props.setLoader(true);
    localStorage.setItem(stakeInput, xPlentyInput);
    setStakeInput(localStorage.getItem(stakeInput));
    let xPlentyInputWithFormat = xPlentyInput * Math.pow(10, 18);
    xPlentyInputWithFormat = Math.floor(xPlentyInputWithFormat);

    props.sellXPlenty(
      xPlentyInputWithFormat,
      props.expectedPlenty,
      props.walletAddress,
      setShowConfirmTransaction,
      props.setLoader,
    );
  };

  let xplentyButton = (
    <Button
      onClick={props.connectWallet}
      color={'primary'}
      startIcon={'add'}
      className={'xplenty-btn mt-4 w-100 flex align-items-center justify-content-center'}
    >
      Connect Wallet
    </Button>
  );
  if (props.walletAddress) {
    if (xPlentyInput > props.xplentyBalance) {
      xplentyButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Insufficient Balance
        </Button>
      );
    } else if (xPlentyInput) {
      xplentyButton = (
        <Button
          color={'primary'}
          onClick={sellHandler}
          className={'xplenty-btn mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Unstake
        </Button>
      );
    } else {
      xplentyButton = (
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
  if (props.isProcessing) {
    xplentyButton = (
      <Button
        onClick={() => null}
        color={'primary'}
        loading={true}
        className={'xplenty-btn mt-4 w-100 flex align-items-center justify-content-center'}
      />
    );
  }
  const onMaxClick = (value) => {
    let withoutDecimals = Math.floor(value);
    if (value === withoutDecimals) {
      withoutDecimals =
        withoutDecimals.toLocaleString('en-US', {
          maximumFractionDigits: 20,
          useGrouping: false,
        }) ?? 0;
      xPlentyInputHandler(withoutDecimals);
    } else {
      value =
        value.toLocaleString('en-US', {
          maximumFractionDigits: 20,
          useGrouping: false,
        }) ?? 0;
      xPlentyInputHandler(value.substring(0, value.length - 1));
      //xPlentyInputHandler(value);
    }
  };
  useEffect(() => {
    if (props.isToastOpen) {
      setxPlentyInput('');
    }
  }, [props.isToastOpen]);
  return (
    <>
      <>
        <div
          className="swap-token-select-box bg-themed-light swap-content-box-wrapper"
          style={{
            borderRadius: '6px',
            minHeight: 0,
          }}
        >
          <div className="token-selector-balance-wrapper">
            <button className="token-selector" style={{ textTransform: 'none' }}>
              <img src={xplenty} className="button-logo" />
              <span className="span-themed">xPLENTY</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              placeholder="0.0"
              value={xPlentyInput}
              onChange={(event) => {
                xPlentyInputHandler(event.target.value);
              }}
            />
          </div>
          <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
            {props.walletAddress ? (
              <p
                className="wallet-token-balance"
                style={{ cursor: 'pointer' }}
                onClick={() => onMaxClick(props.xplentyBalance)}
              >
                Balance: {props.xplentyBalance ? props.xplentyBalance.toFixed(4) : 0} xPLENTY{' '}
                <span className="max-btn">(Max)</span>
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex">
          <p className="wallet-token-balance whitespace-prewrap ml-auto flex flex-row">
            1 xPLENTY ={' '}
            <OverlayTrigger
              placement="auto"
              overlay={
                <Tooltip id="button-tooltip" {...props}>
                  {props.xPlentyData.data.xPlentyPerPlenty}
                </Tooltip>
              }
            >
              <div>
                {props.xPlentyData.data.xPlentyPerPlenty
                  ? props.xPlentyData.data.xPlentyPerPlenty.toFixed(3)
                  : 0}{' '}
                PLENTY
              </div>
            </OverlayTrigger>
          </p>
        </div>
        {xplentyButton}
      </>
      <Loader
        loading={props.isProcessing}
        loaderMessage={props.loaderMessage}
        content={`${stakeInput} xPlenty Unstaked`}
        tokenIn={true}
        setLoaderMessage={props.setLoaderMessage}
      />
      <ConfirmTransaction
        show={showConfirmTransaction}
        theme={props.theme}
        content={`Unstaking ${stakeInput} xPlenty `}
      />

      <InfoModal
        open={props.isTransactionInjectionModalOpen}
        onClose={props.closetransactionInjectionModal}
        InfoMessage={`Unstaking ${stakeInput} xPlenty `}
        message={'Transaction submitted'}
        buttonText={'View on TzKT'}
        onBtnClick={
          props.currentOpHash
            ? () => window.open(`https://tzkt.io/${props.currentOpHash}`, '_blank')
            : null
        }
      />
    </>
  );
};

UnstakePlenty.propTypes = {
  connectWallet: PropTypes.any,
  expectedPlenty: PropTypes.any,
  isProcessing: PropTypes.any,
  isToastOpen: PropTypes.any,
  sellXPlenty: PropTypes.any,
  setExpectedPlenty: PropTypes.any,
  walletAddress: PropTypes.any,
  xPlentyData: PropTypes.any,
  xplentyBalance: PropTypes.any,
  setShowConfirmTransaction: PropTypes.any,
  setLoader: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  currentOpHash: PropTypes.any,
  isTransactionInjectionModalOpen: PropTypes.any,
  theme: PropTypes.any,
  closetransactionInjectionModal: PropTypes.any,
  loaderMessage: PropTypes.any,
};
const mapStateToProps = (state) => {
  return {
    currentOpHash: state.xPlenty.currentOpHash,
    isTransactionInjectionModalOpen: state.xPlenty.isTransactionInjectionModalOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closetransactionInjectionModal: () => dispatch(closetransactionInjectionModalThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnstakePlenty);
