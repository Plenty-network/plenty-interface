import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useMediaQuery from '../../../hooks/mediaQuery';

const LiquidityInfo = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  return (
    <div className="lq-details d-flex flex-wrap justify-content-start align-items-center">
      <div className={clsx(isMobile && 'order-1')}>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip" {...props}>
              {props.isStable ? props.xtztoctez : props.swapData.tokenOutPerTokenIn}
            </Tooltip>
          }
        >
          <div className="details">
            {props.isStable ? props.xtztoctez : props.swapData.tokenOutPerTokenIn?.toFixed(4)}{' '}
            <span className="content">
              {props.tokenIn.name} per {props.tokenOut.name}
            </span>
          </div>
        </OverlayTrigger>
      </div>
      <div className={clsx(isMobile && 'order-3', isMobile && 'mt-2', 'ml-2')}>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip" {...props}>
              {props.isStable ? props.cteztoxtz : 1 / props.swapData.tokenOutPerTokenIn}
            </Tooltip>
          }
        >
          <div className="details">
            {props.isStable ? props.cteztoxtz : (1 / props.swapData.tokenOutPerTokenIn).toFixed(4)}{' '}
            <span className="content">
              {props.tokenOut.name} per {props.tokenIn.name}
            </span>
          </div>
        </OverlayTrigger>
      </div>
      <div className={clsx(isMobile && 'order-2', 'ml-2')}>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip" {...props}>
              {props.tokenIn.name === 'tez'
                ? props.poolShare
                : props.lpTokenAmount.estimatedLpOutput
                ? (props.lpTokenAmount.estimatedLpOutput /
                    (props.swapData.lpTokenSupply + props.lpTokenAmount.estimatedLpOutput)) *
                  100
                : '0'}
            </Tooltip>
          }
        >
          <div className="details">
            <span className="content">Share of pool:</span>{' '}
            {props.tokenIn.name === 'tez'
              ? Number(props.poolShare) > 0
                ? Number(props.poolShare).toFixed(4)
                : '0'
              : props.lpTokenAmount.estimatedLpOutput
              ? (
                  (props.lpTokenAmount.estimatedLpOutput /
                    (props.swapData.lpTokenSupply + props.lpTokenAmount.estimatedLpOutput)) *
                  100
                ).toFixed(4)
              : '0'}{' '}
            %
          </div>
        </OverlayTrigger>
      </div>
      <div className={clsx(isMobile && 'order-4', 'details', isMobile && 'mt-2', 'ml-2')}>
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
