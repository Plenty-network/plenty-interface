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
              <div className="confirm-supply-token-box">
                <div className="confirm-supply-tokens">
                  <img height="37" width="37" src={props.tokenIn.image} />
                  <img height="37" width="37" src={props.tokenOut.image} className="ml-1" />
                </div>

                <div className="lp-token-details">
                  <p className="lp-token-info-desc">
                    {props.tokenIn.name === 'tez'
                      ? props.lpTokenAmount
                      : props.lpTokenAmount.estimatedLpOutput}
                  </p>
                  <p className="mt-2 lp-token-info-desc-bottom">
                    {props.tokenIn.name === 'tez'
                      ? 'TEZ'
                      : props.tokenIn.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenIn.name}
                    /
                    {props.tokenOut.name === 'tez'
                      ? 'TEZ'
                      : props.tokenOut.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenOut.name}{' '}
                    LP Tokens
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rates-confirm-supply flex justify-between">
            <p className="rates-label">Rates</p>
            <div className="">
              {props.swapData ? (
                <p className="confirm-supply-amt-details">
                  1{' '}
                  {props.tokenIn.name === 'tez'
                    ? 'TEZ'
                    : props.tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenIn.name}{' '}
                  ={' '}
                  {props.isStableSwap
                    ? props.xtztoctez
                    : props.swapData.tokenOutPerTokenIn?.toFixed(10)}{' '}
                  {props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}
                </p>
              ) : null}

              {props.swapData ? (
                <p className="mt-1 confirm-supply-amt-details">
                  1{' '}
                  {props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}{' '}
                  ={' '}
                  {props.isStableSwap
                    ? props.cteztoxtz
                    : (1 / props.swapData.tokenOutPerTokenIn).toFixed(10)}{' '}
                  {props.tokenIn.name === 'tez'
                    ? 'TEZ'
                    : props.tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenIn.name}
                </p>
              ) : null}
            </div>
          </div>
          <div className="confirm-supply-bottom">
            <div className="swap-detail-amt-wrapper">
              <div className="confirm-supply-details-label">
                {props.tokenIn.name === 'tez'
                  ? 'TEZ'
                  : props.tokenIn.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenIn.name}{' '}
                deposited{' '}
              </div>
              <div className="confirm-supply-details-value">
                {props.firstTokenAmount}{' '}
                {props.tokenIn.name === 'tez'
                  ? 'TEZ'
                  : props.tokenIn.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenIn.name}
              </div>
            </div>

            <div className="swap-detail-amt-wrapper mb-0">
              <div className="confirm-supply-details-label">
                {props.tokenOut.name === 'tez'
                  ? 'TEZ'
                  : props.tokenOut.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenOut.name}{' '}
                deposited{' '}
              </div>
              <div className="confirm-supply-details-value">
                {props.secondTokenAmount
                  ? props.secondTokenAmount
                  : props.estimatedTokenAmout.otherTokenAmount}{' '}
                {props.tokenOut.name === 'tez'
                  ? 'TEZ'
                  : props.tokenOut.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenOut.name}
              </div>
            </div>
          </div>
          <div className="share-pool flex justify-between">
            <div className="share-pool-label">Your pool share</div>
            <div className="confirm-supply-details-sharevalue">
              {props.tokenIn.name === 'tez'
                ? props.poolShare
                : (
                    (props.lpTokenAmount.estimatedLpOutput /
                      (props.swapData.lpTokenSupply + props.lpTokenAmount.estimatedLpOutput)) *
                    100
                  ).toFixed(5)}{' '}
              %
            </div>
          </div>
          <div className="confirm-supply-button">
            <Button
              onClick={props.CallConfirmAddLiquidity}
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
