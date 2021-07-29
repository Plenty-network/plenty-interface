import { Modal } from 'react-bootstrap';

const ConfirmRemoveLiquidity = (props) => {
  return (
    <Modal
      show={props.showConfirmRemoveSupply}
      onHide={props.onHide}
      animation={false}
      className="confirm-swap-modal"
      centered
    >
      <Modal.Header>
        <Modal.Title>You will receive</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="swap-content-box-wrapper">
            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <button className="token-selector">
                    <img src={props.tokenIn.image} className="button-logo" />
                    {props.tokenIn.name}{' '}
                  </button>
                </div>

                <div className="token-user-input-wrapper">
                  {props.removableTokens.tokenFirst_Out
                    ? props.removableTokens.tokenFirst_Out.toFixed(12)
                    : '0.00'}
                </div>
              </div>
            </div>

            <div className="swap-arrow-center">
              <span className="material-icons-outlined">add</span>
            </div>

            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <button className="token-selector">
                    <img src={props.tokenOut.image} className="button-logo" />
                    {props.tokenOut.name}{' '}
                  </button>
                </div>

                <div className="token-user-input-wrapper">
                  {props.removableTokens.tokenSecond_Out
                    ? props.removableTokens.tokenSecond_Out.toFixed(12)
                    : '0.00'}
                </div>
              </div>
            </div>
          </div>
          <div className="slippage-info">
            Output is estimated. If the price changes by more than{' '}
            {props.slippage}% your transaction will revert.
          </div>

          <div className="swap-detail-wrapper">
            <div
              className="swap-detail-rates-wrapper flex justify-between"
              style={{
                border: 0,
                margin: 0,
                'padding-top': '14px',
                'padding-bottom': '14px',
              }}
            >
              <p className="swap-detail-amt-details">Rates</p>
              <div className="token-user-input-wrapper">
                <p className="swap-detail-amt-details">
                  1 {props.tokenIn.name} = {props.swapData.tokenOutPerTokenIn}{' '}
                  {props.tokenOut.name}
                </p>
                <p className="swap-detail-amt-details">
                  1 {props.tokenOut.name} ={' '}
                  {1 / props.swapData.tokenOutPerTokenIn} {props.tokenIn.name}
                </p>
              </div>
            </div>
            <button
              className="swap-content-btn"
              onClick={props.confirmRemoveLiquidity}
            >
              Confirm Removal
            </button>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmRemoveLiquidity;
