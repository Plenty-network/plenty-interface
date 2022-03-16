import PropTypes from 'prop-types';
import React from 'react';
import SimpleModal from '../Ui/Modals/SimpleModal';
import Button from '../Ui/Buttons/Button';

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
                  {props.tokenIn.name}{' '}
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
                  {props.tokenOut.name}{' '}
                </button>
              </div>

              <div className="token-user-input-wrapper" style={{ textAlign: 'right' }}>
                {props.secondTokenAmount}
              </div>
            </div>
          </div>

          <Button
            onClick={props.confirmSwapToken}
            color={'primary'}
            className="mt-4 w-100"
            loading={props.loading}
          >
            Confirm Swap
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
  showConfirmTransaction: PropTypes.any,
  setShowConfirmTransaction: PropTypes.any,
  secondTokenAmount: PropTypes.any,
};
