import PropTypes from 'prop-types';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
                  {props.computedData?.data?.tokenOutAmount}
                </div>
              </div>
            </div>

            <div className="swap-detail-wrapper bg-themed-light">
              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details">Minimum received </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id={'minimum-received-tooltip'}
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      Your transaction will revert if there is a large, unfavorable price movement
                      before it is confirmed.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details ml-auto">
                  {props.computedData?.data?.finalMinimumOut
                    ? props.computedData.data.finalMinimumOut.toFixed(8)
                    : '0.00'}{' '}
                  {props.tokenOut.name}
                </p>
              </div>

              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details">Price Impact </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id={'price-impact-tooltip'}
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      The difference between the market price and estimated price due to trade size.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details ml-auto">
                  {props.computedData?.data?.priceImpact
                    ? props.computedData.data.priceImpact
                    : '0.00'}{' '}
                  %
                </p>
              </div>

              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details">Fee </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip id={'fee-tooltip'} arrowProps={{ styles: { display: 'none' } }}>
                      A portion of each trade (0.25%) goes to liquidity providers as a protocol
                      incentive.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details ml-auto">
                  {props.firstTokenAmount / 400} {props.tokenIn.name}
                </p>
              </div>

              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details">xPlenty Fee </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id={'xplenty-fee-tooltip'}
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      A portion of each trade (0.09%) goes to xPLENTY holders as a protocol
                      incentive.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details ml-auto">
                  {props.firstTokenAmount / 1000} {props.tokenIn.name}
                </p>
              </div>

              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details">Slippage tolerance </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id={'slippage-tolerance-tooltip'}
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      Change the slippage tolerance in the transaction settings.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details ml-auto">{props.slippage} %</p>
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

ConfirmSwap.propTypes = {
  // computedOutDetails: PropTypes.any,
  computedData: PropTypes.any,
  confirmSwapToken: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  loading: PropTypes.any,
  // midTokens: PropTypes.any,
  routeData: PropTypes.any,
  onHide: PropTypes.any,
  show: PropTypes.any,
  slippage: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
};
