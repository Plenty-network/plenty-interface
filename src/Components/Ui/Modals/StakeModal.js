import PropTypes from 'prop-types';
import SimpleModal from './SimpleModal';
import React, { useEffect, useMemo, useState } from 'react';
import Button from '../Buttons/Button';

import styles from './modal.module.scss';
import clsx from 'clsx';

const BUTTON_TEXT = {
  ENTER_AMT: 'Enter an amount',
  STAKE: 'Confirm Stake',
  INSUFF_AMT: 'Insufficient balance',
};

const StakeModal = (props) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!props.open) {
      setInputValue('');
    }
  }, [props.open]);

  const onStake = () => {
    props.stakeOnFarm(
      parseFloat(inputValue),
      props.modalData.identifier,
      props.isActiveOpen,
      props.modalData.position,
    );
  };

  const onMaxClick = () => {
    const value =
      props.walletBalances?.[props.modalData.identifier].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    setInputValue(value.substring(0, value.length - 1));
  };

  const onModalClose = () => {
    setInputValue('');
    props.onClose();
  };

  const buttonText = useMemo(() => {
    if (!inputValue) {
      return BUTTON_TEXT.ENTER_AMT;
    }

    if (inputValue > props.walletBalances[props.modalData.identifier]) {
      return BUTTON_TEXT.INSUFF_AMT;
    }

    return BUTTON_TEXT.STAKE;
  }, [inputValue, props.modalData.identifier, props.walletBalances]);

  return (
    <SimpleModal
      open={props.open}
      onClose={onModalClose}
      title={`Stake ${props.modalData.title} tokens`}
      className={styles.stakeModal}
    >
      <div className={clsx(styles.inputWrapper, 'd-flex')}>
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={'0.0'}
          type="text"
        />

        <span className="mr-2 ml-2 mt-auto mb-auto">{props.modalData.title}</span>

        <Button onClick={onMaxClick} size="small" color="secondary" className="rounded-pill">
          max
        </Button>
      </div>

      <div className="d-flex flex-row-reverse">
        <div className="mb-3 mr-3">
          <span>Balance: {props.walletBalances[props.modalData.identifier]}</span>
        </div>
      </div>

      <Button
        onClick={onStake}
        color="primary"
        className="w-100"
        disabled={buttonText !== BUTTON_TEXT.STAKE}
        loading={props.stakeOperation?.isLoading}
      >
        {buttonText}
      </Button>
    </SimpleModal>
  );
};

StakeModal.propTypes = {
  isActiveOpen: PropTypes.any,
  modalData: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  stakeOnFarm: PropTypes.any,
  stakeOperation: PropTypes.shape({
    isLoading: PropTypes.bool,
    processing: PropTypes.bool,
    completed: PropTypes.bool,
    failed: PropTypes.bool,
  }),
  walletBalances: PropTypes.any,
};

export default StakeModal;
