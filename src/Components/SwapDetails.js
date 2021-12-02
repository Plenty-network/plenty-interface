import PropTypes from 'prop-types';
import { MdChevronRight } from 'react-icons/all';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { useMemo } from 'react';
import config from '../config/config';

const SwapDetails = (props) => {
  const swapRoute = useMemo(() => {
    if (config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]) {
      return null;
    }

    if (props.midTokens === null) {
      return null;
    }

    return [props.tokenIn, ...props.midTokens, props.tokenOut];
  }, [props.tokenIn, props.midTokens, props.tokenOut]);

  if (!props.firstTokenAmount && !swapRoute) {
    return null;
  }

  return (
    <div className="swap-detail-wrapper bg-themed-light">
      {props.firstTokenAmount && (
        <>
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
          {props.computedOutDetails.data.totalFees && props.midTokens?.[0].name ? (
            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">Router Fee </p>
              <p className="swap-detail-amt-details">
                {props.computedOutDetails.data.totalFees.toFixed(5)} {props.midTokens[0].name}
              </p>
            </div>
          ) : null}
        </>
      )}

      {props.firstTokenAmount && swapRoute && <hr />}

      {swapRoute && (
        <>
          <p className="swap-detail-amt-details">Route </p>

          <div className="swap-detail-route-container mt-3">
            {swapRoute.map((token, idx) => (
              <div key={token.name} className="d-flex my-2">
                <Image src={token.image} height={20} width={20} alt={''} />
                <span className="mx-1 my-auto">{token.name}</span>
                {idx < 2 && <MdChevronRight className="mr-1" fontSize={20} />}
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
  midTokens: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
};

export default SwapDetails;
