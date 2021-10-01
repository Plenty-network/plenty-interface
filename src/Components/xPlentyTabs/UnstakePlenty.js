import React, { useState, useEffect } from 'react';

import xplenty from '../../assets/images/xplenty-icon.png';

import PuffLoader from 'react-spinners/PuffLoader';

const UnstakePlenty = (props) => {
  const [xPlentyInput, setxPlentyInput] = useState('');
  const xPlentyInputHandler = (value) => {
    if (value == '' || isNaN(value)) {
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
    xPlentyInputHandler(value.substring(0, value.length - 1));
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
            className="token-selector dropdown-themed"
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
          <p
            className="wallet-token-balance"
            style={{ cursor: 'pointer' }}
            onClick={() => onMaxClick(props.xplentyBalance)}
          >
            Balance:{' '}
            {props.xplentyBalance ? props.xplentyBalance.toFixed(4) : 0} xPLENTY{' '}
            <span className="max-btn">(Max)</span>
          </p>
          <p className="wallet-token-balance">
            1 xPLENTY ={' '}
            {props.xPlentyData.data.plentyPerXplenty
              ? props.xPlentyData.data.plentyPerXplenty.toFixed(3)
              : 0}{' '}
            PLENTY
          </p>
        </div>
      </div>

      {xplentyButton}
      {xPlentyInput <= props.xplentyBalance && props.expectedPlenty ? (
        <div
          className="swap-token-select-box bg-themed-light swap-content-box-wrapper"
          style={{
            minHeight: 0,
            borderRadius: '6px',
          }}
        >
          <div className="token-selector-balance-wrapper">
            <p className="wallet-token-balance">Minimum received</p>
          </div>
          <div className="token-user-input-wrapper">
            <p className="xplenty-staking-apr">
              {props.expectedPlenty ? props.expectedPlenty.toFixed(3) : 0}{' '}
              {' Plenty'}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UnstakePlenty;
