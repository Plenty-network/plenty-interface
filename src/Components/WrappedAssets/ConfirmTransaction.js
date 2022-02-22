import PropTypes from 'prop-types';
import React from 'react';
import SimpleModal from '../Ui/Modals/SimpleModal';
import Button from '../Ui/Buttons/Button';
import '../../assets/scss/animation.scss';

const ConfirmTransaction = (props) => {
  return (
    <>
      <SimpleModal
        className="confirm-swap-modal"
        open={props.show}
        onClose={props.onHide}
        title="Confirm Transaction"
        backdrop={true}
        isConfirmSwap={true}
      >
        <>
          <div className="swap-content-box-wrapper">
            <div className="header-line"></div>
            {/* <button id="containerrr"></button> */}
            <div className="lds-default">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <Button
              onClick={props.confirmSwapToken}
              color={'outline-button'}
              className="mt-4 w-100"
            >
              Swap {props.firstTokenAmount} {props.tokenIn.name} for{' '}
              {Number(props.computedData?.data.tokenOutAmount).toFixed(3)} {props.tokenOut.name}
            </Button>
            <div className="footer-confirm-transaction">
              Confirm this transaction on your wallet
            </div>
          </div>
        </>
      </SimpleModal>
    </>
  );
};

export default ConfirmTransaction;

ConfirmTransaction.propTypes = {
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
};
