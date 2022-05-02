import PropTypes from 'prop-types';
import React from 'react';
import SimpleModal from '../Ui/Modals/SimpleModal';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Stableswap } from '../../assets/images/SwapModal/stableswap-white.svg';
import SwapDetailsConfirmSwap from './SwapDetailsConfirmSwap';

const ConfirmSwap = (props) => {
  return (
    <SimpleModal
      className="confirm-swap-modal"
      open={props.show}
      onClose={props.onHide}
      title="Confirm Swap"
      backdrop={true}
      isConfirmSwap={true}
    >
      <>
        <div className="swap-content-box-wrapper">
          <div className="header-line"></div>
          <div className="swap-content-box">
            <div className="swap-token-select-box confirm-swap-input-box">
              <div className="token-selector-balance-wrapper">
                <div className="token-selector stable-swap-token-selector">
                  <img src={props.tokenIn.image} className="button-logo" />
                  {props.tokenIn.name === 'tez'
                    ? 'TEZ'
                    : props.tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenIn.name}{' '}
                </div>
              </div>

              <div className="token-user-input-wrapper" style={{ textAlign: 'right' }}>
                {props.firstTokenAmount}
              </div>
            </div>
          </div>

          <div className="swap-arrow-center">
            <span className="material-icons-round">arrow_downward</span>
          </div>

          <div className="swap-content-box">
            <div className="swap-token-select-box">
              <div className="token-selector-balance-wrapper">
                <button className="token-selector stable-swap-token-selector">
                  <img src={props.tokenOut.image} className="button-logo" />
                  {props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}{' '}
                </button>
              </div>

              <div className="token-user-input-wrapper" style={{ textAlign: 'right' }}>
                {props.computedData?.data?.tokenOutAmount}
              </div>
            </div>
          </div>
          <SwapDetailsConfirmSwap
            computedOutDetails={props.computedData}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            routeData={props.routeData}
            firstTokenAmount={props.firstTokenAmount}
            slippage={props.slippage}
            isConfirmSwap={true}
            isStableSwap={
              (props.tokenIn.name === 'tez' && props.tokenOut.name === 'ctez') ||
              (props.tokenOut.name === 'tez' && props.tokenIn.name === 'ctez')
            }
            theme={props.theme}
          />

          <Button
            onClick={props.confirmSwapToken}
            color={'primary'}
            className="mt-4 w-100"
            loading={props.loading}
          >
            {props.isStableSwap ? (
              <span>
                <Stableswap />
                <span className="ml-2">Confirm Swap</span>
              </span>
            ) : (
              'Confirm Swap'
            )}
          </Button>
        </div>
      </>
    </SimpleModal>
  );
};

export default ConfirmSwap;

ConfirmSwap.propTypes = {
  computedData: PropTypes.any,
  confirmSwapToken: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  loading: PropTypes.any,
  routeData: PropTypes.any,
  onHide: PropTypes.any,
  show: PropTypes.any,
  slippage: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  isStableSwap: PropTypes.any,
  theme: PropTypes.any,
};
