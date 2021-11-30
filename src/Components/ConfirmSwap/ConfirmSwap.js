import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'react-bootstrap';

const ConfirmSwap = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      animation={false}
      className="confirm-swap-modal"
      centered
    >
      <Modal.Header>
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

                <div className="token-user-input-wrapper">1.00</div>
              </div>
            </div>

            <div className="swap-arrow-center">
              <span className="material-icons-round">south</span>
            </div>

            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <button className="token-selector">
                    <img src={props.tokenIn.image} className="button-logo" />
                    {props.tokenIn.name}{' '}
                  </button>
                </div>

                <div className="token-user-input-wrapper">1.00</div>
              </div>
            </div>
          </div>

          <div className="swap-detail-wrapper">
            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Minimum received <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">1 kalam</p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Price Impact <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">0%</p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Liquidity Provider Fee <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">0.16plenty</p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                xPlenty Fee <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">0.16 plenty</p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">
                Slippage tolerance Fee <span className="material-icons-round">help_outline</span>
              </p>
              <p className="swap-detail-amt-details">0.50%</p>
            </div>
            <button className="swap-content-btn">Confirm Swap</button>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

ConfirmSwap.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  tokenIn: PropTypes.object,
};

export default ConfirmSwap;
