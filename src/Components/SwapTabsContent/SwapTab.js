import SwapDetails from '../SwapDetails';
import { swapTokens } from '../../apis/swap/swap';

const SwapTab = (props) => {
  const callSwapToken = () => {
    swapTokens(
      props.tokenIn.name,
      props.tokenOut.name,
      0,
      props.walletAddress,
      props.firstTokenAmount,
      props.walletAddress
    );
  };
  let swapContentButton = (
    <button className="swap-content-btn" onClick={props.connecthWallet}>
      <span className="material-icons-outlined">add</span> Connect Wallet
    </button>
  );

  if (props.walletAddress) {
    swapContentButton = (
      <button className="swap-content-btn enter-amount">Enter an amount</button>
    );
  }
  if (props.walletAddress && props.firstTokenAmount) {
    swapContentButton = (
      <button className="swap-content-btn" onClick={callSwapToken}>
        Swap
      </button>
    );
  }
  return (
    <div className="swap-content-box-wrapper">
      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            <button
              className="token-selector"
              onClick={() => props.handleTokenType('tokenIn')}
            >
              <img src={props.tokenIn.image} className="button-logo" />
              {props.tokenIn.name}{' '}
              <span className="material-icons-outlined">expand_more</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              placeholder="0.0"
              onChange={(e) => props.setFirstTokenAmount(e.target.value)}
            />
          </div>
          {props.walletAddress ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">Balance: 0 Plenty</p>
              <p className="wallet-token-balance">~$99.00</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="swap-arrow-center">
        <span className="material-icons-outlined">south</span>
      </div>

      <div className="swap-content-box">
        <div className="swap-token-select-box">
          <div className="token-selector-balance-wrapper">
            <button
              className="token-selector"
              onClick={() => props.handleTokenType('tokenOut')}
            >
              <img src={props.tokenOut.image} className="button-logo" />
              {props.tokenOut.name}{' '}
              <span className="material-icons-outlined">expand_more</span>
            </button>
          </div>

          <div className="token-user-input-wrapper">
            <input
              type="text"
              className="token-user-input"
              value={props.computedOutDetails.tokenOut_amount}
              placeholder="0.0"
            />
          </div>
          {props.walletAddress ? (
            <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
              <p className="wallet-token-balance">Balance: 0 Kalam</p>
              <p className="wallet-token-balance">~$99.00</p>
            </div>
          ) : null}
        </div>
      </div>
      {props.walletAddress && props.swapData.success ? (
        <p style={{ margin: 0, textAlign: 'right', fontSize: '10px' }}>
          1 {props.tokenIn.name} = {props.swapData.tokenOutPerTokenIn}{' '}
          {props.tokenOut.name}
        </p>
      ) : null}
      {swapContentButton}
      {props.walletAddress && props.firstTokenAmount ? (
        <SwapDetails
          computedOutDetails={props.computedOutDetails}
          tokenIn={props.tokenIn}
        />
      ) : null}
    </div>
  );
};

export default SwapTab;
