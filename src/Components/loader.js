import PropTypes from 'prop-types';
import React from 'react';
import { PuffLoader } from 'react-spinners';
import { ReactComponent as SuccessImg } from '../assets/images/status.svg';
import '../assets/scss/animation.scss';

const Loader = (props) => {
  if (props.loading) {
    return (
      <div className="loading-data-wrapper">
        <PuffLoader color="var(--theme-primary-1)" size={36} />
      </div>
    );
  }

  if (props.loaderMessage.type) {
    const loaderMessage = props.loaderMessage.message;
    return (
      <div
        className={`loader-message-wrapper rightToLeftFadeInAnimation-4-floater ${props.loaderMessage.type}`}
      >
        {props.loaderMessage.type === 'success' ? (
          props.tokenIn ? (
            <div className="flex flex-row">
              <div>
                <SuccessImg />
              </div>
              <div className="ml-3">
                <span className="status-text">
                  Swap of {props.firstTokenAmount} {props.tokenIn} for {props.secondTokenAmount}{' '}
                  {props.tokenOut}{' '}
                </span>
                <div className="view-tezos">View on tezos</div>
              </div>
              <div>
                <span className="material-icons-round ml-3">close</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-row">
              <div>
                <SuccessImg />
              </div>
              <div className="ml-3">
                <span className="status-text">Swap of 2 wUSDC for 2.293 USDC.e </span>
                <div className="view-tezos">View on tezos</div>
              </div>
              <div>
                <span className="material-icons-round ml-3">close</span>
              </div>
            </div>
          )
        ) : (
          <>
            <span className="material-icons-round">cancel</span>
            {loaderMessage}
          </>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default Loader;

Loader.propTypes = {
  loaderMessage: PropTypes.object,
  loading: PropTypes.bool,
  tokenIn: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  tokenOut: PropTypes.any,
  secondTokenAmount: PropTypes.any,
};
