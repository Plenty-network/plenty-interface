import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MdChevronRight } from 'react-icons/all';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useMemo, useState } from 'react';
import { tokens } from '../constants/swapPage';

const SwapDetails = (props) => {
  const [isOpen, setOpen] = useState(false);
  console.log('check');
  console.log(props.routeData.success);
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
    <div className={clsx('swap-detail-wrapper', isOpen ? 'bg-themed-light' : 'closedbg')}>
      {/* {props.routeData.success ? ( */}

      <div className="space-between">
        <div className="flex">
          <p className="price-formula whitespace-prewrap  flex flex-row">
            1 {props.tokenIn.name} ={' '}
            <OverlayTrigger
              placement="auto"
              overlay={
                <Tooltip id="swap-token-out-tooltip" {...props}>
                  {props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn}
                </Tooltip>
              }
            >
              <div>
                {props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn
                  ? props.routeData.bestRouteUntilNoInput.tokenOutPerTokenIn.toFixed(3)
                  : 0}{' '}
                {props.tokenOut.name}
              </div>
            </OverlayTrigger>
          </p>
        </div>
        {isOpen ? (
          <span className="material-icons flex open" onClick={() => setOpen(!isOpen)}>
            keyboard_arrow_up
          </span>
        ) : (
          <span className="material-icons flex open" onClick={() => setOpen(!isOpen)}>
            keyboard_arrow_down
          </span>
        )}
      </div>

      {/* ) : null} */}
      {props.firstTokenAmount &&
        (isOpen ? (
          <>
            <div className="flex flex-row mt-3 align-items-center">
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
                {props.computedOutDetails.data.finalMinimumOut
                  ? props.computedOutDetails.data.finalMinimumOut.toFixed(8)
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
                  <Tooltip id={'price-impact-tooltip'} arrowProps={{ styles: { display: 'none' } }}>
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
                {props.computedOutDetails.data.priceImpact
                  ? props.computedOutDetails.data.priceImpact
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
          </>
        ) : null)}
      {isOpen && props.firstTokenAmount && swapRoute && <hr />}
      {isOpen && swapRoute && (
        <>
          <div className="flex flex-row">
            <p className="swap-detail-amt-details">Route </p>
            <OverlayTrigger
              key="top"
              placement="top"
              overlay={
                <Tooltip id={'route-tooltip'} arrowProps={{ styles: { display: 'none' } }}>
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
              <div key={token.name} className="d-flex my-2">
                <Image src={token.image} height={20} width={20} alt={''} />
                <span className="mx-1 my-auto">{token.name}</span>
                {swapRoute[idx + 1] && <MdChevronRight className="mr-1" fontSize={20} />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
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
};

export default SwapDetails;
