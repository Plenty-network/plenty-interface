import React, { useRef, useEffect } from 'react';
import SimpleModal from './SimpleModal';
import PropTypes from 'prop-types';
import styles from './modal.module.scss';
import { ReactComponent as Link } from '../../../assets/images/linkIcon.svg';
import clsx from 'clsx';
import Button from '../Buttons/Button';
import '../../../assets/scss/animation.scss';
import lottieWeb from 'lottie-web';

const InfoModal = (props) => {
  const container = useRef(null);
  useEffect(() => {
    props.open && props.theme === 'light'
      ? lottieWeb.loadAnimation({
          container: container.current,
          path: 'animation-light.json',
          renderer: 'svg',
          loop: false,
          autoplay: true,
          name: 'Demo Animation',
        })
      : lottieWeb.loadAnimation({
          container: container.current,
          path: 'animation-dark.json',
          renderer: 'svg',
          loop: false,
          autoplay: true,
          name: 'Demo Animation',
        });
  }, [props.open]);
  return (
    <>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.7/lottie.min.js"
        integrity="sha512-HDCfX3BneBQMfloBfluMQe6yio+OfXnbKAbI0SnfcZ4YfZL670nc52Aue1bBhgXa+QdWsBdhMVR2hYROljf+Fg=="
        crossOrigin="anonymous"
      ></script>
      <SimpleModal
        className="confirm-swap-modal"
        title="Transaction Submitted"
        open={props.open}
        onClose={props.onClose}
      >
        <div className={styles.infoModal}>
          {props.open && <div id="transactionSubmitted" ref={container}></div>}

          {props.buttonText && (
            <div onClick={props.onBtnClick} className={clsx(styles.button, 'font-weight-bold')}>
              {props.buttonText} <Link className="ml-2 mb-1" />
            </div>
          )}
          <Button color={'outline-button'} className="mt-3 w-100 submitted-text">
            {props.InfoMessage}
          </Button>
        </div>
      </SimpleModal>
    </>
  );
};

InfoModal.propTypes = {
  type: PropTypes.oneOf(['transaction-success']),
  img: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onBtnClick: PropTypes.func,
  theme: PropTypes.any,
  InfoMessage: PropTypes.any,
};

export default InfoModal;
