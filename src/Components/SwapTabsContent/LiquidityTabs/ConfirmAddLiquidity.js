import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Ui/Buttons/Button';

const ConfirmAddLiquidity = (props) => {
  return (
    <Modal
      show={props.showConfirmAddSupply}
      onHide={props.onHide}
      className="confirm-swap-modal confirm-add-liquidity-modal "
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
          <div className="swap-content-box-wrapper">
            <div className="header-line"></div>
            <div className="swap-content-box">
              <div className="swap-token-select-box">
                <div className="token-selector-balance-wrapper">
                  <button className="token-selector">
                    <img src={props.tokenIn.image} className="button-logo" />
                    <img src={props.tokenOut.image} className="button-logo" />
                  </button>
                </div>

                <div className="token-user-input-wrapper">
                  <p className="lp-token-info-desc">
                    {props.tokenIn.name === 'tez'
                      ? props.lpTokenAmount
                      : props.lpTokenAmount.estimatedLpOutput}
                  </p>
                  <p className="lp-token-info-desc">
                    {props.tokenIn.name}/{props.tokenOut.name} LP Tokens
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="swap-detail-wrapper">
            <div className="swap-detail-rates-wrapper flex justify-between">
              <p className="swap-detail-amt-details">Rates</p>
              <div className="token-user-input-wrapper">
                {props.swapData ? (
                  <p className="swap-detail-amt-details">
                    1 {props.tokenIn.name} ={' '}
                    {props.isStableSwap
                      ? props.xtztoctez
                      : props.swapData.tokenOutPerTokenIn?.toFixed(10)}{' '}
                    {props.tokenOut.name}
                  </p>
                ) : null}

                {props.swapData ? (
                  <p className="swap-detail-amt-details">
                    1 {props.tokenOut.name} ={' '}
                    {props.isStableSwap
                      ? props.cteztoxtz
                      : (1 / props.swapData.tokenOutPerTokenIn).toFixed(10)}{' '}
                    {props.tokenIn.name}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">{props.tokenIn.name} deposited </p>
              <p className="swap-detail-amt-details">
                {props.firstTokenAmount} {props.tokenIn.name}
              </p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">{props.tokenOut.name} deposited </p>
              <p className="swap-detail-amt-details">
                {props.secondTokenAmount
                  ? props.secondTokenAmount
                  : props.estimatedTokenAmout.otherTokenAmount}{' '}
                {props.tokenOut.name}
              </p>
            </div>

            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">Share of Pool </p>
              <p className="swap-detail-amt-details">
                {props.tokenIn.name === 'tez'
                  ? props.poolShare
                  : (
                      (props.lpTokenAmount.estimatedLpOutput /
                        (props.swapData.lpTokenSupply + props.lpTokenAmount.estimatedLpOutput)) *
                      100
                    ).toFixed(5)}{' '}
                %
              </p>
            </div>

            <Button
              onClick={props.CallConfirmAddLiquidity}
              color={'primary'}
              className={'mt-4 w-100'}
              loading={props.loading}
            >
              Confirm Supply
            </Button>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

ConfirmAddLiquidity.propTypes = {
  CallConfirmAddLiquidity: PropTypes.any,
  estimatedTokenAmout: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  loading: PropTypes.any,
  lpTokenAmount: PropTypes.any,
  onHide: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  showConfirmAddSupply: PropTypes.any,
  swapData: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  poolShare: PropTypes.any,
  slippage: PropTypes.any,
  isStableSwap: PropTypes.any,
  xtztoctez: PropTypes.any,
  cteztoxtz: PropTypes.any,
};

export default ConfirmAddLiquidity;
