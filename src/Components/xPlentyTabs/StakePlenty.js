import React, { useState } from 'react';

import plenty from '../../assets/images/logo_small.png';

const StakePlenty = (props) => {
  const [plentyInput, setPlentyInput] = useState(0);
  const plentyInputHandler = (value) => {
    setPlentyInput(parseFloat(value));
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

  let xplentyButton = (
    <button
      className="swap-content-btn xplenty-btn"
      onClick={props.connecthWallet}
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
            className="token-user-input"
            placeholder="0.0"
          />
        </div>
        <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
          <p className="wallet-token-balance" style={{ cursor: 'pointer' }}>
            Balance: {props.plentyBalance ? props.plentyBalance.toFixed(4) : 0}{' '}
            PLENTY
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
