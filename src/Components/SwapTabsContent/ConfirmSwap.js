import { Modal } from 'react-bootstrap';
import PuffLoader from 'react-spinners/PuffLoader';
import React from 'react';
import Button from '../Ui/Buttons/Button';

const ConfirmSwap = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide} className="confirm-swap-modal">
      <Modal.Header>
        <Modal.Title>Confirm Swap</Modal.Title>
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
          <div className="swap-content-box-wrapper">
            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <div className="token-selector">
                    <img src={props.tokenIn.image} className="button-logo" />
                    {props.tokenIn.name}{' '}
                  </div>
                </div>

                <div className="token-user-input-wrapper" style={{ textAlign: 'right' }}>
                  {props.firstTokenAmount}
                </div>
              </div>
            </div>

            <div className="swap-arrow-center">
              <span className="material-icons-round">arrow_downward</span>
            </div>

            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <button className="token-selector">
                    <img src={props.tokenOut.image} className="button-logo" />
                    {props.tokenOut.name}{' '}
                  </button>
                </div>

                <div className="token-user-input-wrapper" style={{ textAlign: 'right' }}>
                  {props.computedOutDetails.tokenOut_amount}
                </div>
              </div>
            </div>

            <div className="swap-detail-wrapper bg-themed-light">
              <div className="swap-detail-amt-wrapper">
                {/*<span className="material-icons-round">help_outline</span>*/}
                <p className="swap-detail-amt-details">Minimum received </p>
                <p className="swap-detail-amt-details">
                  {props.computedOutDetails.minimum_Out
                    ? props.computedOutDetails.minimum_Out.toFixed(8)
                    : '0.00'}{' '}
                  {props.tokenOut.name}
                </p>
              </div>

              <div className="swap-detail-amt-wrapper">
                <p className="swap-detail-amt-details">Price Impact </p>
                <p className="swap-detail-amt-details">
                  {props.computedOutDetails.priceImpact
                    ? props.computedOutDetails.priceImpact
                    : '0.00'}{' '}
                  %
                </p>
              </div>

              <div className="swap-detail-amt-wrapper">
                <p className="swap-detail-amt-details">Fee </p>
                <p className="swap-detail-amt-details">
                  {props.firstTokenAmount / 400} {props.tokenIn.name}
                </p>
              </div>

              {props.computedOutDetails.addtPlentyFee ? (
                <div className="swap-detail-amt-wrapper">
                  <p className="swap-detail-amt-details">Router Fee </p>
                  <p className="swap-detail-amt-details">
                    {props.computedOutDetails.addtPlentyFee.toFixed(5)} {props.midTokens[0].name}
                  </p>
                </div>
              ) : null}

              <div className="swap-detail-amt-wrapper">
                <p className="swap-detail-amt-details">xPlenty Fee </p>
                <p className="swap-detail-amt-details">
                  {props.firstTokenAmount / 1000} {props.tokenIn.name}
                </p>
              </div>

              <div className="swap-detail-amt-wrapper">
                <p className="swap-detail-amt-details">Slippage tolerance </p>
                <p className="swap-detail-amt-details">{props.slippage} %</p>
              </div>
            </div>
            <Button
              onClick={props.confirmSwapToken}
              color={'primary'}
              className="mt-4 w-100"
              loading={props.loading}
            >
              Confirm Swap
            </Button>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmSwap;
