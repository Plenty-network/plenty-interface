import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import plenty from '../../assets/images/logo_small.png';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from '../Ui/Buttons/Button';

const StakePlenty = (props) => {
  const [plentyInput, setPlentyInput] = useState('');
  const plentyInputHandler = (value) => {
    if (value === '' || isNaN(value)) {
      setPlentyInput('');
      return;
    }
    setPlentyInput(value);
    props.setExpectedxPlenty(
      props.xPlentyData.data.plentyBalance,
      props.xPlentyData.data.totalSupply,
      parseFloat(value),
    );
  };
  const buyHandler = () => {
    let plentyInputWithFormat = plentyInput * Math.pow(10, 18);
    plentyInputWithFormat = Math.floor(plentyInputWithFormat);

    props.buyxPlenty(plentyInputWithFormat, props.expectedxPlenty, props.walletAddress);
  };

  const onMaxClick = (value) => {
    let withoutDecimals = Math.floor(value);
    if (value === withoutDecimals) {
      withoutDecimals =
        withoutDecimals.toLocaleString('en-US', {
          maximumFractionDigits: 20,
          useGrouping: false,
        }) ?? 0;
      plentyInputHandler(withoutDecimals);
    } else {
      value =
        value.toLocaleString('en-US', {
          maximumFractionDigits: 20,
          useGrouping: false,
        }) ?? 0;
      plentyInputHandler(value.substring(0, value.length - 1));
    }
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
    if (plentyInput > props.plentyBalance) {
      xplentyButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Insufficient Balance
        </Button>
      );
    } else if (plentyInput) {
      xplentyButton = (
        <Button
          color={'primary'}
          onClick={buyHandler}
          className={'xplenty-btn mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Stake Plenty
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
      ></Button>
    );
  }
  useEffect(() => {
    if (props.isToastOpen) {
      setPlentyInput('');
    }
  }, [props.isToastOpen]);
  return (
    <>
      <div className="swap-token-select-box bg-themed-light swap-content-box-wrapper">
        <div className="token-selector-balance-wrapper">
          <button className="token-selector">
            <img src={plenty} className="button-logo" />
            <span className="span-themed">PLENTY </span>
          </button>
        </div>

        <div className="token-user-input-wrapper">
          <input
            type="text"
            onChange={(event) => plentyInputHandler(event.target.value)}
            value={plentyInput}
            className="token-user-input"
            placeholder="0.0"
          />
        </div>
        {props.walletAddress ? (
          <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
            <p
              className="wallet-token-balance"
              style={{ cursor: 'pointer' }}
              onClick={() => onMaxClick(props.plentyBalance)}
            >
              Balance: {props.plentyBalance ? props.plentyBalance : 0}{' '}
              <span className="max-btn">(Max)</span>
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex">
        <p className="wallet-token-balance whitespace-prewrap ml-auto flex flex-row">
          1 PLENTY ={' '}
          <OverlayTrigger
            placement="auto"
            overlay={
              <Tooltip id="button-tooltip" {...props}>
                {props.xPlentyData.data.plentyPerXplenty}
              </Tooltip>
            }
          >
            <div>
              {props.xPlentyData.data.plentyPerXplenty
                ? props.xPlentyData.data.plentyPerXplenty.toFixed(3)
                : 0}{' '}
              xPLENTY
            </div>
          </OverlayTrigger>
        </p>
      </div>
      {xplentyButton}
    </>
  );
};

export default StakePlenty;

StakePlenty.propTypes = {
  buyxPlenty: PropTypes.any,
  connectWallet: PropTypes.any,
  expectedxPlenty: PropTypes.any,
  isProcessing: PropTypes.any,
  isToastOpen: PropTypes.any,
  plentyBalance: PropTypes.any,
  setExpectedxPlenty: PropTypes.any,
  walletAddress: PropTypes.any,
  xPlentyData: PropTypes.any,
};
