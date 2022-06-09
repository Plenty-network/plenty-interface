import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import StableSwap from '../../../assets/images/lq-stableswap.svg';
import Feetooltip from '../../../assets/images/fee-tooltip.svg';
import FeetooltipDark from '../../../assets/images/fee-tooltip-dark.svg';
import Stableswapwhite from '../../../assets/images/stableswapwhite.svg';
import StableSwapDark from '../../../assets/images/lq-stableswap-dark.svg';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useMediaQuery from '../../../hooks/mediaQuery';
import config from '../../../config/config';

const LiquidityInfo = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  return (
    <div className="lq-details d-flex flex-wrap justify-content-start align-items-center">
      <div className={clsx(isMobile && 'order-1')}>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip" {...props}>
              {config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                ?.type === 'xtz'
                ? props.cteztoxtz
                : config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                    ?.type === 'veStableAMM'
                ? props.tokenBrate
                : 1 / props.swapData.tokenOutPerTokenIn}
            </Tooltip>
          }
        >
          <div className="details">
            {(props.isStable ? !isNaN(props.cteztoxtz) : 1 / props.swapData.tokenOutPerTokenIn) ? (
              config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                ?.type === 'xtz' ? (
                props.cteztoxtz
              ) : config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                  ?.type === 'veStableAMM' ? (
                Number(props.tokenBrate).toFixed(4)
              ) : (
                (1 / props.swapData.tokenOutPerTokenIn).toFixed(4)
              )
            ) : (
              <span className="shimmer">99999</span>
            )}{' '}
            <span className="content">
              {props.tokenIn.name === 'tez'
                ? 'TEZ'
                : props.tokenIn.name === 'ctez'
                ? 'CTEZ'
                : props.tokenIn.name}{' '}
              per{' '}
              {props.tokenOut.name === 'tez'
                ? 'TEZ'
                : props.tokenOut.name === 'ctez'
                ? 'CTEZ'
                : props.tokenOut.name}
            </span>
          </div>
        </OverlayTrigger>
      </div>
      <div className={clsx(isMobile && 'order-3', isMobile && 'mt-2 ', !isMobile && 'ml-2')}>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="button-tooltip" {...props}>
              {config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                ?.type === 'xtz'
                ? props.xtztoctez
                : config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                    ?.type === 'veStableAMM'
                ? props.tokenArate
                : props.swapData.tokenOutPerTokenIn}
            </Tooltip>
          }
        >
          <div className="details">
            {(props.isStable ? !isNaN(props.xtztoctez) : props.swapData.tokenOutPerTokenIn) ? (
              config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                ?.type === 'xtz' ? (
                props.xtztoctez
              ) : config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                  ?.type === 'veStableAMM' ? (
                Number(props.tokenArate).toFixed(4)
              ) : (
                props.swapData.tokenOutPerTokenIn.toFixed(4)
              )
            ) : (
              <span className="shimmer">99999</span>
            )}{' '}
            <span className="content">
              {props.tokenOut.name === 'tez'
                ? 'TEZ'
                : props.tokenOut.name === 'ctez'
                ? 'CTEZ'
                : props.tokenOut.name}{' '}
              per{' '}
              {props.tokenIn.name === 'tez'
                ? 'TEZ'
                : props.tokenIn.name === 'ctez'
                ? 'CTEZ'
                : props.tokenIn.name}
            </span>
          </div>
        </OverlayTrigger>
      </div>
      <div className={clsx(isMobile && 'order-2', 'ml-2')}>
        {(props.tokenIn.name === 'tez' ? props.poolShare : props.lpTokenAmount.estimatedLpOutput) >
        0 ? (
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
        ) : (
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
        )}
      </div>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="button-tooltip" {...props}>
            <>
              <span className="fee-tooltip-heading">Stable pair</span>
              <div>
                <span className="material-icons-round">expand_less</span>
              </div>
              <img
                className="fee-tooltip-bracket"
                src={props.theme === 'light' ? Feetooltip : FeetooltipDark}
              />
              <div className="flex flex-row fee-tooltip-center">
                0.10 % <span className="content ml-1"> LP fee</span>
                <span className="divider-lq-tooltip mx-2"></span>
                <img src={props.theme === 'light' ? Stableswapwhite : StableSwap} />
              </div>
            </>
          </Tooltip>
        }
      >
        <div className={clsx(isMobile && 'order-4', 'details', isMobile && 'mt-2', 'ml-2')}>
          {config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
            'xtz' ||
          config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
            'veStableAMM'
            ? '0.10'
            : '0.25'}
          % <span className="content">LP fee</span>
          {(config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
            'xtz' ||
            config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
              'veStableAMM') && (
            <>
              <span className="divider-lq mx-2"></span>
              <img src={props.theme === 'light' ? StableSwap : StableSwapDark} />
            </>
          )}
        </div>
      </OverlayTrigger>
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
  tokenArate: PropTypes.any,
  tokenBrate: PropTypes.any,
};

export default LiquidityInfo;
