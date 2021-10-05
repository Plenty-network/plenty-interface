import React, { useState, useEffect } from 'react';

import xplenty from '../../assets/images/xplenty-icon.png';

import PuffLoader from 'react-spinners/PuffLoader';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const UnstakePlenty = (props) => {
  const [xPlentyInput, setxPlentyInput] = useState('');
  const xPlentyInputHandler = (value) => {
    if (value === '' || isNaN(value)) {
      setxPlentyInput('');
      return;
    }
    setxPlentyInput(value);
    props.setExpectedPlenty(
      props.xPlentyData.data.plentyBalance,
      props.xPlentyData.data.totalSupply,
      parseFloat(value)
    );
  };
  const sellHandler = () => {
    let xPlentyInputWithFormat = xPlentyInput * Math.pow(10, 18);
    xPlentyInputWithFormat = Math.floor(xPlentyInputWithFormat);

    props.sellXPlenty(
      xPlentyInputWithFormat,
      props.expectedPlenty,
      props.walletAddress
    );
  };

  let xplentyButton = (
    <button
      className="swap-content-btn xplenty-btn"
      onClick={props.connectWallet}
    >
      <span className="material-icons-round">add</span> Connect Wallet
    </button>
  );
  if (props.walletAddress) {
    if (xPlentyInput > props.xplentyBalance) {
      xplentyButton = (
        <button className="swap-content-btn enter-amount">
          Insufficient balance
        </button>
      );
    } else if (xPlentyInput) {
      xplentyButton = (
        <button className="swap-content-btn xplenty-btn" onClick={sellHandler}>
          Unstake
        </button>
      );
    } else {
      xplentyButton = (
        <button className="swap-content-btn enter-amount">
          Enter an amount
        </button>
      );
    }
  }
  if (props.isProcessing) {
    xplentyButton = (
      <button className="swap-content-btn loader-btn xplenty-btn">
        <PuffLoader color={'#fff'} size={28} />
      </button>
    );
  }
  const onMaxClick = (value) => {
    value =
      value.toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    xPlentyInputHandler(value);
  };
  useEffect(() => {
    if (props.isToastOpen) {
      setxPlentyInput('');
    }
  }, [props.isToastOpen]);
  return (
    <>
      <div
        className="swap-token-select-box bg-themed-light swap-content-box-wrapper"
        style={{
          borderRadius: '6px',
          minHeight: 0,
        }}
      >
        <div className="token-selector-balance-wrapper">
          <button
            className="token-selector"
            style={{ textTransform: 'none' }}
          >
            <img src={xplenty} className="button-logo" />
            <span className="span-themed">xPLENTY </span>
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
            Balance:{' '}
            {props.xplentyBalance ? props.xplentyBalance.toFixed(4) : 0} xPLENTY{' '}
            <span className="max-btn">(Max)</span>
          </p>
              ) : null }
        </div>
      </div>
      <div className="flex">
        <p className="wallet-token-balance whitespace-prewrap ml-auto flex flex-row">
          1 xPLENTY = {' '}
          <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip className="xplenty-tooltip" id="button-tooltip" {...props}>
                  {props.xPlentyData.data.xPlentyPerPlenty}
                </Tooltip>}>
            <div>
              {props.xPlentyData.data.xPlentyPerPlenty
                  ? props.xPlentyData.data.xPlentyPerPlenty.toFixed(3)
                  : 0}{' '}
              PLENTY</div>
          </OverlayTrigger>
        </p>
      </div>
      {xplentyButton}
    </>
  );
};

export default UnstakePlenty;
