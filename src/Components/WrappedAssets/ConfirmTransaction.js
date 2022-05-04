import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import SimpleModal from '../Ui/Modals/SimpleModal';
import Button from '../Ui/Buttons/Button';
import lottieWeb from 'lottie-web';

const ConfirmTransaction = (props) => {
  const container = useRef(null);

  useEffect(() => {
    props.show && props.theme === 'light'
      ? lottieWeb.loadAnimation({
          container: container.current,
          path: '/loader.json',
          renderer: 'svg',
          loop: true,
          autoplay: true,
          name: 'Demo Animation',
        })
      : lottieWeb.loadAnimation({
          container: container.current,
          path: '/loader-dark.json',
          renderer: 'svg',
          loop: true,
          autoplay: true,
          name: 'Demo Animation',
        });
  }, [props.show]);
  return (
    <>
      <SimpleModal
        className="confirm-swap-modal"
        open={props.show}
        onClose={props.onHide}
        title="Confirm Transaction"
        backdrop={true}
        isConfirmSwap={true}
        isConfirmTransaction={true}
      >
        <>
          <div className="swap-content-box-wrapper">
            <div className="header-line"></div>
            {props.show && <div id="container" ref={container}></div>}

            <Button
              onClick={props.confirmSwapToken}
              color={'outline-button'}
              className="mt-4 w-100 confirm-transaction-button-text"
              style={{ cursor: 'default' }}
            >
              {props.content}
            </Button>
            <div className="footer-confirm-transaction">Confirm the transaction in your wallet</div>
          </div>
        </>
      </SimpleModal>
    </>
  );
};

export default ConfirmTransaction;

ConfirmTransaction.propTypes = {
  confirmSwapToken: PropTypes.any,
  onHide: PropTypes.any,
  show: PropTypes.any,
  theme: PropTypes.any,
  content: PropTypes.any,
};
