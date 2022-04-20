import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MdChevronRight } from 'react-icons/all';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useMemo, useState } from 'react';
import { tokens } from '../constants/swapPage';
import { ReactComponent as Stableswap } from '../assets/images/SwapModal/stableswap-light.svg';
import { ReactComponent as StableswapDark } from '../assets/images/SwapModal/stableswap-dark.svg';
import '../assets/scss/animation.scss';

const SwapDetails = (props) => {
  const [isOpen, setOpen] = useState(false);
  const [isConvert, setConvert] = useState(false);

  const swapRoute = useMemo(() => {
    if (props.routePath?.length > 2) {
      return props.routePath.map((tokenName) => tokens.find((token) => token.name === tokenName));
    }

    return null;
  }, [props.routePath]);

  if (!props.firstTokenAmount && !swapRoute) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(
          'swap-detail-wrapper',
          !isOpen && 'closedbg',
          isOpen && 'open-swap-detail-wrapper-first',
        )}
      >
        <div className="space-between">
          <div className="flex">
            <p className="price-formula whitespace-prewrap  flex flex-row">
              1 {isConvert ? props.tokenOut.name : props.tokenIn.name} ={' '}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {props.isStableSwap
                      ? Number(props.computedOutDetails.data.exchangeRate).toFixed(6)
                      : props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn}
                  </Tooltip>
                }
              >
                <div>
                  {props.isStableSwap
                    ? isConvert
                      ? Number(1 / props.computedOutDetails.data.exchangeRate).toFixed(3)
                      : Number(props.computedOutDetails.data.exchangeRate).toFixed(3)
                    : props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn
                    ? isConvert
                      ? Number(
                          1 / props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn,
                        ).toFixed(3)
                      : Number(props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn).toFixed(3)
                    : 0}{' '}
                  {isConvert ? props.tokenIn.name : props.tokenOut.name}
                </div>
              </OverlayTrigger>
              <span
                className="material-icons-round convert"
                onClick={() => setConvert(!isConvert)}
                style={{ cursor: 'pointer' }}
              >
                cached_rounded_icon
              </span>
            </p>
          </div>

          {props.firstTokenAmount > 0 && isOpen ? (
            <span
              className="material-icons-round flex open"
              onClick={() => setOpen(!isOpen)}
              style={{ cursor: 'pointer' }}
            >
              keyboard_arrow_up
            </span>
          ) : (
            <span
              className="material-icons-round flex open"
              onClick={() => setOpen(!isOpen)}
              style={{ cursor: 'pointer' }}
            >
              keyboard_arrow_down
            </span>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className={clsx(
            'swap-detail-wrapper-open',

            isOpen && 'topToBottomFadeInAnimation-4-floater',
            !isOpen && 'bottomToTopFadeInAnimation-4-floater',
          )}
        >
          {isOpen ? (
            <div className="open-swap-details ">
              <div className="flex flex-row  align-items-center swap-sub-details">
                {' '}
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip-swap-details" {...props}>
                      Your transaction will revert if there is a large, unfavorable price movement
                      before it is confirmed.
                    </Tooltip>
                  }
                >
                  <p className="swap-detail-amt-details">Minimum received </p>
                </OverlayTrigger>
                <span
                  style={{ cursor: 'pointer' }}
                  className="material-icons-round ml-1 swap-detail-amt-details"
                >
                  help_outline
                </span>
                <p className="swap-detail-amt-details-value ml-auto">
                  {props.computedOutDetails.data.finalMinimumOut
                    ? props.computedOutDetails.data.finalMinimumOut
                    : '0.00'}{' '}
                  {props.tokenOut.name}
                </p>
              </div>
              <div className="flex flex-row align-items-center swap-sub-details">
                <p className="swap-detail-amt-details">Price Impact </p>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip-3" {...props}>
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
                <p
                  className={clsx(
                    'swap-detail-amt-details-value ml-auto',
                    props.computedOutDetails.data?.priceImpact > 3 && 'error-text-color',
                  )}
                >
                  {props.computedOutDetails.data.priceImpact
                    ? props.computedOutDetails.data.priceImpact
                    : '0.00'}{' '}
                  %
                </p>
              </div>
              <div className="flex flex-row align-items-center  swap-sub-details-padding">
                <p className="swap-detail-amt-details">Fee </p>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip-4" {...props}>
                      {props.isStableSwap
                        ? 'A portion of each trade (0.10%) goes to liquidity providers as a protocol incentive.'
                        : 'A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive.'}
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
                <p className="swap-detail-amt-details-value ml-auto">
                  {props.isStableSwap
                    ? props.computedOutDetails.data.fees.toFixed(6)
                    : props.firstTokenAmount / 400}{' '}
                  {props.isStableSwap ? props.tokenOut.name : props.tokenIn.name}
                </p>
              </div>
              {props.isConfirmSwap && !props.isStableSwap && (
                <div className="flex flex-row align-items-center">
                  <p className="swap-detail-amt-details">xPlenty Fee </p>
                  <OverlayTrigger
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
                  <p className="swap-detail-amt-details-value ml-auto">
                    {props.firstTokenAmount / 1000} {props.tokenIn.name}
                  </p>
                </div>
              )}
              {props.isConfirmSwap ? (
                <div className="flex flex-row align-items-center">
                  <p className="swap-detail-amt-details">Slippage tolerance </p>
                  <OverlayTrigger
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
              ) : null}
            </div>
          ) : null}

          {isOpen && props.firstTokenAmount && swapRoute && <hr />}
          {isOpen && props.firstTokenAmount && swapRoute && (
            <>
              <div className="flex flex-row">
                <p className="swap-detail-amt-details route-heading">Route </p>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip-5" {...props}>
                      Routing through these tokens results in the best price for your trade
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
              </div>

              <div className="swap-detail-route-container mt-3">
                {swapRoute.map((token, idx) => (
                  <div key={token.name} className="d-flex my-2 align-self-center">
                    <div
                      className={clsx(
                        idx !== 0 &&
                          props.stableList[idx - 1] === true &&
                          'outer-border-stableswap d-flex',
                      )}
                    >
                      {idx !== 0 && props.stableList[idx - 1] === true && (
                        <div>
                          <span className="stableswap-img">
                            {props.theme === 'light' ? <Stableswap /> : <StableswapDark />}
                          </span>
                        </div>
                      )}
                      <div
                        className={clsx(
                          idx !== 0 && props.stableList[idx - 1] === true
                            ? 'stablepair-outline'
                            : 'route-Outline',
                        )}
                      >
                        <Image src={token.image} height={18} width={18} alt={''} />
                        <span className="ml-1 my-auto token-name-route">{token.name}</span>
                      </div>
                    </div>
                    {swapRoute[idx + 1] && (
                      <MdChevronRight
                        className={clsx(
                          token.name === 'tez' || token.name === 'ctez'
                            ? 'route-arrow-stable'
                            : 'route-arrow',
                        )}
                        fontSize={20}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

SwapDetails.propTypes = {
  computedOutDetails: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  routeData: PropTypes.any,
  // midTokens: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  routePath: PropTypes.any,
  isStableSwap: PropTypes.any,
  slippage: PropTypes.any,
  isConfirmSwap: PropTypes.any,
  theme: PropTypes.any,
  stableList: PropTypes.any,
};

export default SwapDetails;
