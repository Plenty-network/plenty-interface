import logo from '../../../assets/images/logo_small.png';
import kalam from '../../../assets/images/kalam.png';

const AddLiquidity = (props) => {
  let swapContentButton = (
    <button className="swap-content-btn" onClick={props.setWalletConnected}>
      <span className="material-icons-outlined">add</span> Connect Wallet
    </button>
  );

  if (props.walletConnected) {
    swapContentButton = (
      <button className="swap-content-btn enter-amount">Enter an amount</button>
    );
  }
  if (props.walletConnected && props.firstToken) {
    swapContentButton = (
      <button className="swap-content-btn">Add Liquidity</button>
    );
  }
  return (
    <>
      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            <button className="token-selector" onClick={props.handleShow}>
              <img src={logo} className="button-logo" />
              Plenty{' '}
              <span className="material-icons-outlined">expand_more</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              placeholder="0.0"
              onChange={(e) => props.setFirstToken(e.target.value)}
            />
          </div>
          {props.walletConnected ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">Balance: 0 Plenty</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="swap-arrow-center">
        <span className="material-icons-outlined">add</span>
      </div>

      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            <button className="token-selector" onClick={props.handleShow}>
              <img src={kalam} className="button-logo" />
              Kalam <span className="material-icons-outlined">expand_more</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              placeholder="0.0"
              onChange={(e) => props.setSecondToken(e.target.value)}
            />
          </div>
          {props.walletConnected ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">Balance: 0 Kalam</p>
            </div>
          ) : null}
        </div>
      </div>
      {swapContentButton}
    </>
  );
};

export default AddLiquidity;
