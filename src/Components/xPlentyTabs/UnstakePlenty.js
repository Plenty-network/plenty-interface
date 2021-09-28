import React, { useState } from 'react';

const UnstakePlenty = (props) => {
  const [xPlentyInput, setxPlentyInput] = useState(0);
  const xPlentyInputHandler = (value) => {
    console.log(value);
    setxPlentyInput(parseFloat(value));
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
            <img src="" className="button-logo" />
            <span className="span-themed">XPLENTY </span>
          </button>
        </div>

        <div className="token-user-input-wrapper">
          <input
            type="text"
            className="token-user-input"
            placeholder="0.0"
            onChange={(event) => {
              xPlentyInputHandler(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
        <p className="wallet-token-balance" style={{ cursor: 'pointer' }}>
          Balance: 252.3142 PLENTY
        </p>
        <p className="wallet-token-balance">
          1 xPLENTY ={' '}
          {props.xPlentyData.data.plentyPerXplenty
            ? props.xPlentyData.data.plentyPerXplenty.toFixed(3)
            : 0}{' '}
          PLENTY
        </p>
      </div>
      <button className="swap-content-btn xplenty-btn" onClick={sellHandler}>
        Unstake PLENTY
      </button>

      <div
        className="swap-token-select-box bg-themed-light swap-content-box-wrapper"
        style={{
          minHeight: 0,
          borderRadius: '6px',
        }}
      >
        <div className="token-selector-balance-wrapper">
          <p className="xplenty-staking-apr">Staking APR</p>
        </div>

        <div className="token-user-input-wrapper">
          <p className="xplenty-staking-apr">
            {props.xPlentyData.data.APR
              ? props.xPlentyData.data.APR.toFixed(3)
              : 0}
            {'%'}
          </p>
        </div>
        <>
          <div className="token-selector-balance-wrapper">
            <p className="xplenty-staking-apr">Minimum Recieved</p>
          </div>

          <div className="token-user-input-wrapper">
            <p className="xplenty-staking-apr">
              {props.expectedPlenty ? props.expectedPlenty.toFixed(3) : 0}
            </p>
          </div>
        </>
      </div>
    </>
  );
};

export default UnstakePlenty;
