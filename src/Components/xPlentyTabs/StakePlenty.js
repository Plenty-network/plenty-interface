import React, { useEffect, useState } from 'react';

import plenty from '../../assets/images/logo_small.png';

import PuffLoader from 'react-spinners/PuffLoader';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const StakePlenty = (props) => {
  const [plentyInput, setPlentyInput] = useState('');
  const plentyInputHandler = (value) => {
    if (value == '' || isNaN(value)) {
      setPlentyInput('');
      return;
    }
    setPlentyInput(value);
    props.setExpectedxPlenty(
      props.xPlentyData.data.plentyBalance,
      props.xPlentyData.data.totalSupply,
      parseFloat(value)
    );
  };
  const buyHandler = () => {
    let plentyInputWithFormat = plentyInput * Math.pow(10, 18);
    plentyInputWithFormat = Math.floor(plentyInputWithFormat);

    let expectedxPlentyWithFormat = props.expectedxPlenty * Math.pow(10, 18);
    expectedxPlentyWithFormat = Math.floor(expectedxPlentyWithFormat);
    props.buyxPlenty(
      plentyInputWithFormat,
      props.expectedxPlenty,
      props.walletAddress
    );
  };

  const onMaxClick = (value) => {
    value =
      value.toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    plentyInputHandler(value.substring(0, value.length - 1));
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
    if (plentyInput > props.plentyBalance) {
      xplentyButton = (
        <button className="swap-content-btn enter-amount">
          Insufficient balance
        </button>
      );
    } else if (plentyInput) {
      xplentyButton = (
        <button className="swap-content-btn xplenty-btn" onClick={buyHandler}>
          Stake Plenty
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
  useEffect(() => {
    if (props.isToastOpen) {
      setPlentyInput('');
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
          <button className="token-selector dropdown-themed">
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
                PLENTY <span className="max-btn">(Max)</span>
              </p>
            </div>
        ): null}
      </div>
      <div className="flex">
        <p className="wallet-token-balance whitespace-prewrap ml-auto flex flex-row">
          1 PLENTY = {' '}
          <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip className="xplenty-tooltip" id="button-tooltip" {...props}>
                  {props.xPlentyData.data.plentyPerXplenty}
                </Tooltip>}>
            <div>
              {props.xPlentyData.data.plentyPerXplenty
                  ? props.xPlentyData.data.plentyPerXplenty.toFixed(3)
                  : 0}{' '}
              xPLENTY</div>
          </OverlayTrigger>
        </p>
      </div>
      {xplentyButton}
      {plentyInput <= props.plentyBalance && props.expectedxPlenty ? (
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
              {props.expectedxPlenty ? props.expectedxPlenty.toFixed(3) : 0}
              {' xPlenty'}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default StakePlenty;
