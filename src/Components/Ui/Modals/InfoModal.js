import React from 'react';
import SimpleModal from './SimpleModal';
import PropTypes from 'prop-types';

import styles from './modal.module.scss';

import TransactionSuccessImg from '../../../assets/images/icons/transaction-success.svg';
import clsx from 'clsx';

const InfoModal = (props) => {
  return (
    <SimpleModal open={props.open} onClose={props.onClose}>
      <div className={styles.infoModal}>
        <img
          className={clsx(styles.image, 'mb-4')}
          src={TransactionSuccessImg}
          alt={props.message}
        />

        <div className={clsx(styles.message, 'mb-3')}>{props.message}</div>

        {props.buttonText && (
          <div onClick={props.onBtnClick} className={clsx(styles.button, 'font-weight-bold')}>
            {props.buttonText}
          </div>
        )}
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
