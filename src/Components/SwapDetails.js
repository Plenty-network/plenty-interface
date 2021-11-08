import { MdChevronRight } from 'react-icons/all';
import { Image } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';

const tokenRoute = [
  {
    name: 'PLENTY',
  },
  {
    name: 'PLENTY',
  },
  {
    name: 'PLENTY',
  },
  {
    name: 'PLENTY',
  },
  {
    name: 'PLENTY',
  },
];

const SwapDetails = (props) => {
  const [imgPaths, setImgPath] = useState({});

  const loadImageFor = useCallback(
    (token) => {
      // ? if token exists, abort
      if (!!imgPaths[token]) {
        return;
      }

      setImgPath((prev) => ({
        ...prev,
        [token]: {
          ...prev[token],
          loading: true,
        },
      }));

      import(`../assets/images/tokens/${token}.png`).then((image) => {
        setImgPath((prev) => ({
          ...prev,
          [token]: {
            url: image['default'] ?? image,
            loading: false,
          },
        }));
      });
    },
    [imgPaths],
  );

  useEffect(() => {
    tokenRoute.forEach((token) => {
      loadImageFor(token.name);
    });
  }, []);

  return (
    <div className="swap-detail-wrapper bg-themed-light">
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
          {props.computedOutDetails.priceImpact ? props.computedOutDetails.priceImpact : '0.00'} %
        </p>
      </div>

      <div className="swap-detail-amt-wrapper">
        <p className="swap-detail-amt-details">Fee </p>
        <p className="swap-detail-amt-details">
          {props.firstTokenAmount / 400} {props.tokenIn.name}
        </p>
      </div>

      <hr />

      <p className="swap-detail-amt-details">Route </p>

      <div className="swap-detail-route-container mt-3">
        {tokenRoute.map((token, idx) => (
          <div className="d-flex my-2">
            <Image src={imgPaths[token.name]?.url} height={20} width={20} alt={''} />
            <span className="mx-1 my-auto">{token.name}</span>
            {tokenRoute[idx + 1] && <MdChevronRight className="mr-1" fontSize={20} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwapDetails;
