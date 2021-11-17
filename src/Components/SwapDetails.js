import { MdChevronRight } from 'react-icons/all';
import { Image } from 'react-bootstrap';
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
          <div className="swap-detail-amt-wrapper">
            <p className="swap-detail-amt-details">Minimum received </p>
            <p className="swap-detail-amt-details">
              {props.computedOutDetails.minimum_Out
                ? props.computedOutDetails.minimum_Out.toFixed(8)
                : '0.00'}{' '}
              {props.tokenOut.name}
            </p>
          </div>
          <div className="swap-detail-amt-wrapper">
            <p className="swap-detail-amt-details">Price Impact </p>
            <p className="swap-detail-amt-details">
              {props.computedOutDetails.priceImpact ? props.computedOutDetails.priceImpact : '0.00'}{' '}
              %
            </p>
          </div>
          <div className="swap-detail-amt-wrapper">
            <p className="swap-detail-amt-details">Fee </p>
            <p className="swap-detail-amt-details">
              {props.firstTokenAmount / 400} {props.tokenIn.name}
            </p>
          </div>
          {props.computedOutDetails.addtPlentyFee ? (
            <div className="swap-detail-amt-wrapper">
              <p className="swap-detail-amt-details">Router Fee </p>
              <p className="swap-detail-amt-details">
                {props.computedOutDetails.addtPlentyFee.toFixed(5)} {'PLENTY'}
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
              <div className="d-flex my-2">
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

export default SwapDetails;
