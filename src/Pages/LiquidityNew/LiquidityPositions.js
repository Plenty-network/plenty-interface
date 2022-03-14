import PropTypes from 'prop-types';
import React from 'react';

export const LiquidityPositions = () => {
  const positions = [
    {
      tokenA: 'ctez',
      tokenB: 'ctez',
      fee: '0.2',
    },
    {
      tokenA: 'ctez',
      tokenB: 'ctez',
      fee: '0.2',
    },
    {
      tokenA: 'ctez',
      tokenB: 'ctez',
      fee: '0.2',
    },
    {
      tokenA: 'ctez',
      tokenB: 'ctez',
      fee: '0.2',
    },
  ];
  return (
    <>
      {positions.map((position, index) => {
        return (
          <div className="position" key={index}>
            <div className="d-flex">
              {position.tokenA} {position.tokenB}
            </div>
          </div>
        );
      })}
    </>
  );
};

LiquidityPositions.propTypes = {
  toggleNodeSelectorHandler: PropTypes.func,
};
