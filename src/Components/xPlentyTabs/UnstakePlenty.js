const UnstakePlenty = () => {
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
          <input type="text" className="token-user-input" placeholder="0.0" />
        </div>
      </div>
      <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
        <p className="wallet-token-balance" style={{ cursor: 'pointer' }}>
          Balance: 252.3142 PLENTY
        </p>
        <p className="wallet-token-balance">1 xPLENTY = 1.2513 PLENTY</p>
      </div>
      <button className="swap-content-btn xplenty-btn">Unstake PLENTY</button>

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
          <p className="xplenty-staking-apr">5.77%</p>
        </div>
      </div>
    </>
  );
};

export default UnstakePlenty;
