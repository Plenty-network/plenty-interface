import PropTypes from 'prop-types';
import React from 'react';
import InfoIcon from '../../../assets/images/SwapModal/info.svg';
import InfoIconDark from '../../../assets/images/SwapModal/info-dark.svg';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const LiquidityInfo = (props) => {
  return (
    <div className="lq-details d-flex justify-content-between align-items-center">
      <div>
        <img src={props.theme === 'light' ? InfoIcon : InfoIconDark} />
      </div>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="button-tooltip" {...props}>
            {props.isStable ? props.xtztoctez : props.swapData.tokenOutPerTokenIn}
          </Tooltip>
        }
      >
        <div className="details">
          {props.isStable ? props.xtztoctez : props.swapData.tokenOutPerTokenIn?.toFixed(3)}{' '}
          <span className="content">
            {props.tokenOut.name} per {props.tokenOut.name}
          </span>
        </div>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="button-tooltip" {...props}>
            {props.isStable ? props.cteztoxtz : 1 / props.swapData.tokenOutPerTokenIn}
          </Tooltip>
        }
      >
        <div className="details">
          {props.isStable ? props.cteztoxtz : (1 / props.swapData.tokenOutPerTokenIn).toFixed(3)}{' '}
          <span className="content">
            {props.tokenOut.name} per {props.tokenIn.name}
          </span>
        </div>
      </OverlayTrigger>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="button-tooltip" {...props}>
            {props.tokenIn.name === 'tez'
              ? props.poolShare
              : (props.lpTokenAmount.estimatedLpOutput /
                  (props.swapData.lpTokenSupply + props.lpTokenAmount.estimatedLpOutput)) *
                100}
          </Tooltip>
        }
      >
        <div className="details">
          <span className="content">Share of pool:</span>{' '}
          {props.tokenIn.name === 'tez'
            ? props.poolShare
            : (
                (props.lpTokenAmount.estimatedLpOutput /
                  (props.swapData.lpTokenSupply + props.lpTokenAmount.estimatedLpOutput)) *
                100
              ).toFixed(3)}{' '}
          %
        </div>
      </OverlayTrigger>

      <div className="details">
        {props.isStable ? '0.10' : '0.25'}% <span className="content">LP fee</span>
      </div>
    </div>
  );
};

LiquidityInfo.propTypes = {
  swapData: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  poolShare: PropTypes.any,
  lpTokenAmount: PropTypes.any,
  xtztoctez: PropTypes.any,
  cteztoxtz: PropTypes.any,
  isStable: PropTypes.any,
  theme: PropTypes.any,
};

export default LiquidityInfo;
