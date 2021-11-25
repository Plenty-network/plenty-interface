import React from 'react';

const XplentyBalance = () => {
  return (
    <>
      <div className="xplenty-total-balance-wrapper">
        <p className="xplenty-total-balance-label">Balance</p>
        <div className="xplenty-token-balance-wrapper flex align-center">
          <img src="" />
          <span style={{ display: 'inline-block', marginLeft: '6px' }}>0.00 xPLENTY</span>
        </div>
      </div>

      <div className="xplenty-total-balance-wrapper">
        <p className="xplenty-total-balance-label">Unstaked</p>
        <div className="xplenty-token-balance-wrapper flex align-center">
          <img src="" />
          <span style={{ display: 'inline-block', marginLeft: '6px' }}>0.00 PLENTY</span>
        </div>
      </div>
    </>
  );
};

export default XplentyBalance;
