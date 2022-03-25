import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '../../Ui/Buttons/Button';
import React from 'react';

const ConfirmRemoveLiquidity = (props) => {
  return (
    <Modal
      show={props.showConfirmRemoveSupply}
      onHide={props.onHide}
      className="confirm-swap-modal confirm-add-liquidity-modal"
    >
      <Modal.Header>
        <Modal.Title>You will receive</Modal.Title>
        <Modal.Title className={'float-right'}>
          <span
            onClick={props.onHide}
            style={{ cursor: 'pointer' }}
            className="material-icons-round"
          >
            close
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="swap-content-box-wrapper pb-0">
            <div className="header-line"></div>
            <div className="swap-content-box">
              <div className=" removing-padding-confirm-supply">
                <div className="confirm-supply-remove">
                  <button className="token-left">
                    <img src={props.tokenIn.image} className="button-logo" />
                    {props.tokenIn.name}{' '}
                  </button>
                </div>

                <div className="token-user-input-wrapper add-padding">
                  {props.removableTokens.tokenFirst_Out
                    ? props.removableTokens.tokenFirst_Out.toFixed(6)
                    : '0.00'}
                </div>
              </div>
            </div>

            <div className="arrow-center-remove-lq">
              <span className="material-icons-round">add</span>
            </div>

            <div className="swap-content-box add-margin-b">
              <div className="removing-padding-confirm-supply">
                <div className="confirm-supply-remove">
                  <button className="token-left">
                    <img src={props.tokenOut.image} className="button-logo" />
                    {props.tokenOut.name}{' '}
                  </button>
                </div>

                <div className="token-user-input-wrapper add-padding">
                  {props.removableTokens.tokenSecond_Out
                    ? props.removableTokens.tokenSecond_Out.toFixed(6)
                    : '0.00'}
                </div>
              </div>
            </div>
          </div>
          <div className="slippage-info">
            Output is estimated. If the price changes by more than {props.slippage}% your
            transaction will revert.
          </div>
          <div className="rates-confirm-supply-remove flex justify-between ">
            <p className="rates-label">Rates</p>
            <div className="">
              {props.swapData ? (
                <p className="confirm-supply-amt-details">
                  1 {props.tokenIn.name} ={' '}
                  <span className="rates-value">
                    {props.isStableSwap
                      ? props.xtztoctez
                      : props.swapData.tokenOutPerTokenIn?.toFixed(10)}{' '}
                    {props.tokenOut.name}
                  </span>
                </p>
              ) : null}

              {props.swapData ? (
                <p className="mt-1 confirm-supply-amt-details">
                  1 {props.tokenOut.name} ={' '}
                  <span className="rates-value">
                    {props.isStableSwap
                      ? props.cteztoxtz
                      : (1 / props.swapData.tokenOutPerTokenIn).toFixed(10)}{' '}
                    {props.tokenIn.name}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="divider-confirm-supply-remove"></div>
          <div className="flex justify-content-between remove-footer">
            <div className="lp-pair-remove">
              {props.tokenIn.name} / {props.tokenOut.name}
            </div>
            <div className="lp-pair-value">0.00</div>
          </div>
          <div className="confirm-supply-button">
            <Button
              onClick={props.confirmRemoveLiquidity}
              color={'primary'}
              className={'mt-4 w-100 '}
              loading={props.loading}
            >
              Confirm
            </Button>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

ConfirmRemoveLiquidity.propTypes = {
  confirmRemoveLiquidity: PropTypes.any,
  loading: PropTypes.any,
  onHide: PropTypes.any,
  removableTokens: PropTypes.any,
  showConfirmRemoveSupply: PropTypes.any,
  slippage: PropTypes.any,
  swapData: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  isStableSwap: PropTypes.any,
  xtztoctez: PropTypes.any,
  cteztoxtz: PropTypes.any,
};

export default ConfirmRemoveLiquidity;
