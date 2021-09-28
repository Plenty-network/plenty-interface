import React, { useState } from 'react';

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
      <button className="swap-content-btn xplenty-btn" onClick={buyHandler}>
        Stake PLENTY
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
              {props.expectedxPlenty ? props.expectedxPlenty.toFixed(3) : 0}
            </p>
          </div>
        </>
      </div>
    </>
  );
};

export default StakePlenty;
