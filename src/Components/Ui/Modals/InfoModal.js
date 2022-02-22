import React from 'react';
import SimpleModal from './SimpleModal';
import PropTypes from 'prop-types';

import styles from './modal.module.scss';

import TransactionSuccessImg from '../../../assets/images/icons/transaction-success.svg';
import { ReactComponent as Link } from '../../../assets/images/linkIcon.svg';
import clsx from 'clsx';
import Button from '../Buttons/Button';
import '../../../assets/scss/animation.scss';

const InfoModal = (props) => {
  return (
    <SimpleModal
      className="confirm-swap-modal"
      title="Transaction Submitted"
      open={props.open}
      onClose={props.onClose}
    >
      <div className={styles.infoModal}>
        <img
          className={clsx(styles.image, 'mb-4')}
          src={TransactionSuccessImg}
          alt={props.message}
        />

        {/* <div className={clsx(styles.message, 'mb-3')}>{props.message}</div> */}

        {props.buttonText && (
          <div onClick={props.onBtnClick} className={clsx(styles.button, 'font-weight-bold')}>
            {props.buttonText} <Link className="ml-2 mb-1" />
          </div>
        )}
        <Button color={'outline-button'} className="mt-3 w-100">
          Swap 2.3wUSDC for 0.3949 USDC.e
        </Button>
      </div>
    </SimpleModal>
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
};

export default InfoModal;
