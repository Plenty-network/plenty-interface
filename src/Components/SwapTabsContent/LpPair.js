import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Link, createSearchParams } from 'react-router-dom';
import '../../assets/scss/animation.scss';
import useMediaQuery from '../../hooks/mediaQuery';

const LpPair = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  const closeFlashMessage = () => {
    props.setShowLpPair(false);
  };

  if (props.isLpPairAvailable && props.showLpPair) {
    return (
      <div
        className={clsx(
          'lppair-wrapper',
          isMobile
            ? 'bottomToTopFadeInAnimation-4-floater'
            : 'rightToLeftFadeInAnimation-4-floater',
        )}
      >
        <div className="d-flex lp-header">
          <div>Liquidity pairs</div>
          <div className="ml-auto">
            <span
              className=" material-icons-round "
              onClick={closeFlashMessage}
              style={{ cursor: 'pointer' }}
            >
              close
            </span>
          </div>
        </div>
        {props.pairs?.map((pair, index) => {
          return (
            <div className="d-flex " key={index}>
              <div>
                <img src={pair.tokenA.image} width="26.47" height="26.47" />
                <img src={pair.tokenB.image} width="26.47" height="26.47" />
              </div>
              <div className="floater-text">
                <span className="status-text">
                  {pair.tokenA.name === 'tez'
                    ? 'TEZ'
                    : pair.tokenA.name === 'ctez'
                    ? 'CTEZ'
                    : pair.tokenA.name}
                  /
                  {pair.tokenB.name === 'tez'
                    ? 'TEZ'
                    : pair.tokenB.name === 'ctez'
                    ? 'CTEZ'
                    : pair.tokenB.name}
                </span>
              </div>
              <div className="ml-auto ">
                <Link
                  style={{ textDecoration: 'none' }}
                  to={{
                    pathname: '/liquidity/add',
                    search: `?${createSearchParams({
                      tokenA: pair.tokenA.name,
                      tokenB: pair.tokenB.name,
                    })}`,
                  }}
                  className="w-100"
                >
                  <div className=" add-lp">
                    <span className={clsx('material-icons-round', 'add-icon')}>add</span>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};

export default LpPair;

LpPair.propTypes = {
  loaderMessage: PropTypes.object,
  loading: PropTypes.bool,
  tokenIn: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  tokenOut: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  setLoaderMessage: PropTypes.func,
  content: PropTypes.any,
  isLpPairAvailable: PropTypes.any,
  pairs: PropTypes.any,
  showLpPair: PropTypes.any,
  setShowLpPair: PropTypes.any,
};
