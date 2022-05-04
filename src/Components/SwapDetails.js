import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MdChevronRight } from 'react-icons/all';
import fromExponential from 'from-exponential';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useMemo, useState } from 'react';
import { tokens } from '../constants/swapPage';
import { ReactComponent as Stableswap } from '../assets/images/SwapModal/stableswap-light.svg';
import { ReactComponent as StableswapDark } from '../assets/images/SwapModal/stableswap-dark.svg';
import { ReactComponent as Router } from '../assets/images/router-tooltip.svg';
import { ReactComponent as Bracket } from '../assets/images/bracket.svg';
import '../assets/scss/animation.scss';
import { ReactComponent as RouterDark } from '../assets/images/router-tooltip-dark.svg';
import { ReactComponent as BracketDark } from '../assets/images/bracket-dark.svg';
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
  const ratesConvert = (e) => {
    e.stopPropagation();
    setConvert(!isConvert);
  };

  return (
    <>
      <div
        className={clsx(
          'swap-detail-wrapper',
          !isOpen && 'closedbg',
          isOpen && 'open-swap-detail-wrapper-first',
        )}
        onClick={() => setOpen(!isOpen)}
        id="topdiv"
      >
        <div className="space-between justify-content-between" style={{ cursor: 'pointer' }}>
          <div className="flex">
            <p className="price-formula whitespace-prewrap  flex flex-row">
              1{' '}
              {isConvert
                ? props.tokenOut.name === 'tez'
                  ? 'TEZ'
                  : props.tokenOut.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenOut.name
                : props.tokenIn.name === 'tez'
                ? 'TEZ'
                : props.tokenIn.name === 'ctez'
                ? 'CTEZ'
                : props.tokenIn.name}{' '}
              ={' '}
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {props.isStableSwap
                      ? fromExponential(Number(props.computedOutDetails.data.exchangeRate))
                      : fromExponential(
                          Number(props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn),
                        )}
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
                  {isConvert
                    ? props.tokenIn.name === 'tez'
                      ? 'TEZ'
                      : props.tokenIn.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenIn.name
                    : props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}
                </div>
              </OverlayTrigger>
              <span
                className="material-icons-round convert ml-1"
                onClick={(e) => ratesConvert(e)}
                style={{ cursor: 'pointer' }}
              >
                cached
              </span>
            </p>
          </div>
          <span
            className={`material-icons-round buttonanim button--trigger open ${
              props.firstTokenAmount > 0 && isOpen ? 'dropdown-open' : 'dropdown-close'
            }`}
            style={{ cursor: 'pointer' }}
          >
            expand_more
          </span>
          {/* {props.firstTokenAmount > 0 && isOpen ? (
            <span
              className="material-icons-round buttonanim button--trigger-todisappear flex open"
              style={{ cursor: 'pointer' }}
            >
              keyboard_arrow_up
            </span>
          ) : (
            <span
              className="material-icons-round buttonanim button--trigger flex open"
              style={{ cursor: 'pointer' }}
            >
              keyboard_arrow_down
            </span>
          )} */}
        </div>
      </div>
      {props.firstTokenAmount > 0}
      {isOpen && (
        <div className={clsx('swap-detail-wrapper-open', 'buttonanim button--disapear')}>
          <div className="scale-in-animation">
            {/* {isOpen ? ( */}
            <>
              <div className="flex flex-row  align-items-center swap-sub-details">
                {' '}
                <p className="swap-detail-amt-details">Minimum received </p>
                <OverlayTrigger
                  placement="top"
                  key="top"
                  overlay={
                    <Tooltip id="button-tooltip-swap-details-minimum-received" {...props}>
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
                <p className="swap-detail-amt-details-value ml-auto">
                  {props.computedOutDetails.data.finalMinimumOut
                    ? props.computedOutDetails.data.finalMinimumOut
                    : '0.00'}{' '}
                  {props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}
                </p>
              </div>
              <div className="flex flex-row align-items-center swap-sub-details">
                <p className="swap-detail-amt-details">Price Impact </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip-swap-details" {...props}>
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
                  key="top"
                  overlay={
                    <Tooltip id="button-tooltip-swap-details" {...props}>
                      Fees are 0.35% for each volatile swap and 0.10% for each stable swap.
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
                  {props.isStableSwap ? '0.10' : props.computedOutDetails.data.maxfee} %
                </p>
              </div>
              {props.isConfirmSwap && !props.isStableSwap && (
                <div className="flex flex-row align-items-center">
                  <p className="swap-detail-amt-details">xPlenty Fee </p>
                  <OverlayTrigger
                    placement="top"
                    key="top"
                    overlay={
                      <Tooltip
                        id="button-tooltip-swap-details"
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
                    {props.firstTokenAmount / 1000}{' '}
                    {props.tokenIn.name === 'tez'
                      ? 'TEZ'
                      : props.tokenIn.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenIn.name}
                  </p>
                </div>
              )}
              {props.isConfirmSwap ? (
                <div className="flex flex-row align-items-center">
                  <p className="swap-detail-amt-details">Slippage tolerance </p>
                  <OverlayTrigger
                    placement="top"
                    key="top"
                    overlay={
                      <Tooltip
                        id="button-tooltip-swap-details"
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
            </>
            {/* ) : null} */}
            {props.firstTokenAmount && swapRoute && <hr className="swap-details-divider" />}
            {props.firstTokenAmount && swapRoute && (
              <>
                <div className="flex flex-row">
                  <p className="swap-detail-amt-details route-heading">Route </p>
                  <OverlayTrigger
                    placement="top"
                    key="top"
                    overlay={
                      <Tooltip id="button-tooltip-swap-details-router" {...props}>
                        Routing through these tokens results in the best price for your trade.
                        <div className="flex flex-row">
                          {props.theme === 'light' ? <Router /> : <RouterDark />}
                          {props.theme === 'light' ? (
                            <Bracket className="router-bracket" />
                          ) : (
                            <BracketDark className="router-bracket" />
                          )}
                          <MdChevronRight className={clsx('router-arrow', 'ml-1')} fontSize={20} />
                          <span className="router-text">Stable pair</span>
                        </div>
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
                          <span className="ml-1 my-auto token-name-route">
                            {token.name === 'tez'
                              ? 'TEZ'
                              : token.name === 'ctez'
                              ? 'CTEZ'
                              : token.name}
                          </span>
                        </div>
                      </div>
                      {swapRoute[idx + 1] && (
                        <MdChevronRight
                          className={clsx(
                            idx !== 0 && props.stableList[idx - 1] === true
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
        </div>
      )}
    </>
  );
};

SwapDetails.propTypes = {
  computedOutDetails: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  routeData: PropTypes.any,
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
