import { Modal } from 'react-bootstrap';
import PuffLoader from 'react-spinners/PuffLoader';

const ConfirmSwap = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      animation={false}
      className="confirm-swap-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Swap</Modal.Title>
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

                <div
                  className="token-user-input-wrapper"
                  style={{ textAlign: 'right' }}
                >
                  {props.firstTokenAmount}
                </div>
              </div>
            </div>

            <div className="swap-arrow-center">
              <span className="material-icons-round">south</span>
            </div>

            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <button className="token-selector">
                    <img src={props.tokenOut.image} className="button-logo" />
                    {props.tokenOut.name}{' '}
                  </button>
                </div>

                <div
                  className="token-user-input-wrapper"
                  style={{ textAlign: 'right' }}
                >
                  {props.computedOutDetails.tokenOut_amount}
                </div>
              </div>
            </div>
          </div>

          <div className="swap-detail-wrapper">
            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Minimum received{' '}
                <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">
                {props.computedOutDetails.minimum_Out
                  ? props.computedOutDetails.minimum_Out.toFixed(8)
                  : '0.00'}{' '}
                {props.tokenOut.name}
              </p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Price Impact{' '}
                <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">
                {props.computedOutDetails.priceImpact
                  ? props.computedOutDetails.priceImpact
                  : '0.00'}{' '}
                %
              </p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Liquidity Provider Fee{' '}
                <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">
                {props.computedOutDetails.fees / 2} {props.tokenIn.name}
              </p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                xPlenty Fee{' '}
                <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">
                {props.computedOutDetails.fees / 2} {props.tokenIn.name}
              </p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Slippage tolerance Fee{' '}
                <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">{props.slippage} %</p>
            </div>
            {props.loading ? (
              <button className="swap-content-btn loader-btn">
                <PuffLoader color={'#fff'} size={28} />
              </button>
            ) : (
              <button
                className="swap-content-btn"
                onClick={props.confirmSwapToken}
              >
                Confirm Swap
              </button>
            )}
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmSwap;
