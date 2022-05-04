import PropTypes from 'prop-types';
import clsx from 'clsx';
import fromExponential from 'from-exponential';
import { MdChevronRight } from 'react-icons/all';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useMemo, useState } from 'react';
import { tokens } from '../../constants/swapPage';

const SwapDetailsConfirmSwap = (props) => {
  const [isOpen, setOpen] = useState(false);

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
    <div className={clsx('swap-detail-wrapper-cs', isOpen ? 'bg-themed-light' : 'closedbg')}>
      <div
        className="space-between-confirmswap"
        onClick={() => setOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex">
          <p className="price-formula-cs whitespace-prewrap  flex flex-row">
            1 {props.tokenIn.name} ={' '}
            <OverlayTrigger
              placement="auto"
              overlay={
                <Tooltip id="swap-token-out-tooltip" {...props}>
                  {props.isStableSwap
                    ? Number(props.computedOutDetails.data.exchangeRate).toFixed(6)
                    : fromExponential(props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn)}
                </Tooltip>
              }
            >
              <div>
                {props.isStableSwap
                  ? Number(props.computedOutDetails.data.exchangeRate).toFixed(3)
                  : props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn
                  ? Number(props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn).toFixed(3)
                  : 0}{' '}
                {props.tokenOut.name === 'tez'
                  ? 'TEZ'
                  : props.tokenOut.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenOut.name}
              </div>
            </OverlayTrigger>
          </p>
        </div>
        <span
          className={`material-icons-round buttonanim button--trigger open-confirmswap-details ${
            isOpen ? 'dropdown-open' : 'dropdown-close'
          }`}
        >
          expand_more
        </span>
        {/* {isOpen ? (
          <span className="material-icons-round flex buttonanim button--trigger-todisappear  open-confirmswap-details">
            keyboard_arrow_up
          </span>
        ) : (
          <span className="material-icons-round buttonanim button--trigger flex open-confirmswap-details">
            keyboard_arrow_down
          </span>
        )} */}
      </div>
      <div className="buttonanim button--disapear-cs">
        {props.firstTokenAmount &&
          (isOpen ? (
            <div className="scale-in-animation-confirm-swap">
              <div className="flex flex-row mt-3 align-items-center">
                <p className="swap-detail-amt-details-cs">Minimum received </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id="button-tooltip-swap-details-minimum-received"
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      Your transaction will revert if there is a large, unfavorable price movement
                      before it is confirmed.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details-cs"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details-cs ml-auto">
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
              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details-cs">Price Impact </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id="button-tooltip-swap-details"
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      The difference between the market price and estimated price due to trade size.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details-cs"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details-cs ml-auto">
                  {props.computedOutDetails.data.priceImpact
                    ? props.computedOutDetails.data.priceImpact
                    : '0.00'}{' '}
                  %
                </p>
              </div>
              <div className="flex flex-row align-items-center">
                <p className="swap-detail-amt-details-cs">Fee </p>
                <OverlayTrigger
                  key="top"
                  placement="top"
                  overlay={
                    <Tooltip
                      id="button-tooltip-swap-details"
                      arrowProps={{ styles: { display: 'none' } }}
                    >
                      Fees are 0.35% for each volatile swap and 0.10% for each stable swap.
                    </Tooltip>
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round ml-1 swap-detail-amt-details-cs"
                  >
                    help_outline
                  </span>
                </OverlayTrigger>
                <p className="swap-detail-amt-details-cs ml-auto">
                  {props.isStableSwap ? '0.10' : props.computedOutDetails.data.maxfee} %
                </p>
              </div>
              {/* {props.isConfirmSwap && !props.isStableSwap && (
                <div className="flex flex-row align-items-center">
                  <p className="swap-detail-amt-details-cs">xPlenty Fee </p>
                  <OverlayTrigger
                    key="top"
                    placement="top"
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
                      className="material-icons-round ml-1 swap-detail-amt-details-cs"
                    >
                      help_outline
                    </span>
                  </OverlayTrigger>
                  <p className="swap-detail-amt-details-cs ml-auto">
                    {props.firstTokenAmount / 1000} {props.tokenIn.name}
                  </p>
                </div>
              )} */}
              {props.isConfirmSwap ? (
                <div className="flex flex-row align-items-center">
                  <p className="swap-detail-amt-details-cs">Slippage tolerance </p>
                  <OverlayTrigger
                    key="top"
                    placement="top"
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
                      className="material-icons-round ml-1 swap-detail-amt-details-cs"
                    >
                      help_outline
                    </span>
                  </OverlayTrigger>
                  <p className="swap-detail-amt-details-cs ml-auto">{props.slippage} %</p>
                </div>
              ) : null}
            </div>
          ) : null)}
        {props.firstTokenAmount && swapRoute && <hr />}
        {swapRoute && (
          <>
            <div className="flex flex-row">
              <p className="swap-detail-amt-details-cs">Route </p>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                  <Tooltip
                    id="button-tooltip-swap-details"
                    arrowProps={{ styles: { display: 'none' } }}
                  >
                    Routing through these tokens results in the best price for your trade
                  </Tooltip>
                }
              >
                <span
                  style={{ cursor: 'pointer' }}
                  className="material-icons-round ml-1 swap-detail-amt-details-cs"
                >
                  help_outline
                </span>
              </OverlayTrigger>
            </div>

            <div className="swap-detail-route-container mt-3">
              {swapRoute.map((token, idx) => (
                <div key={token.name} className="d-flex my-2">
                  <Image src={token.image} height={20} width={20} alt={''} />
                  <span className="ml-1 my-auto">{token.name}</span>
                  {swapRoute[idx + 1] && <MdChevronRight className="" fontSize={20} />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

SwapDetailsConfirmSwap.propTypes = {
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
};

export default SwapDetailsConfirmSwap;
