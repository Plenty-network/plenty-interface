import SimpleModal from './SimpleModal';
import PropTypes from 'prop-types';
import Button from '../Buttons/Button';

import styles from './modal.module.scss';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { Collapse } from 'react-bootstrap';

const BUTTON_TEXT = {
  SELECT: 'Select stake',
  CONFIRM: 'Confirm unstake',
};

const SELECT_LABEL_TEXT = {
  SELECT: 'Select stake',
  UNSTAKE_AMT: 'Unstake amount',
};

const UnstakeModal = (props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!props.open) {
      setOpen(false);
      setSelected([]);
    }
  }, [props.open]);

  const buttonText = useMemo(() => {
    if (selected.length > 0) {
      return BUTTON_TEXT.CONFIRM;
    }

    return BUTTON_TEXT.SELECT;
  }, [selected.length]);

  const userStakes = useMemo(() => {
    return props.userStakes?.[props.modalData.contractAddress]?.singularStakes ?? [];
  }, [props.modalData.contractAddress, props.userStakes]);

  const selectLabelText = useMemo(() => {
    if (selected.length > 0 && !open) {
      return (
        <div className="d-flex justify-content-between w-100 mr-4">
          <span>{SELECT_LABEL_TEXT.UNSTAKE_AMT}</span>
          <span>{selected.reduce((acc, cur) => acc + cur.amount, 0)}</span>
        </div>
      );
    }

    return <span>{SELECT_LABEL_TEXT.SELECT}</span>;
  }, [selected, open]);

  const calculateFee = (difference, obj) => {
    const feeObj = { mapId: obj.mapId };
    let fee;

    const matchingFeeType = props.modalData.withdrawalFeeStructure.find(
      (x) => difference < x.block,
    );

    if (matchingFeeType) {
      fee = ((obj.amount * matchingFeeType.rate) / 100).toFixed(10);
      fee = parseFloat(fee);
      feeObj['rate'] = matchingFeeType.rate;
      feeObj['fee'] = fee;
      feeObj['amount'] = obj.amount;

      return feeObj;
    }

    const lastFeeType =
      props.modalData.withdrawalFeeStructure[props.modalData.withdrawalFeeStructure.length - 1];
    fee = ((obj.amount * lastFeeType.rate) / 100).toFixed(10);
    fee = parseFloat(fee);
    feeObj.rate = lastFeeType.rate;
    feeObj.fee = fee;
    feeObj.amount = obj.amount;

    return feeObj;
  };

  const onStakeSelect = (obj) => {
    if (selected.findIndex((sel) => sel.mapId === obj.mapId) === -1) {
      const difference = props.currentBlock - parseInt(obj.block);
      const calculatedFee = calculateFee(difference, obj);
      setSelected([...selected, calculatedFee]);
    } else {
      setSelected(selected.filter((x) => x.mapId !== obj.mapId));
    }
  };

  const onUnstake = () => {
    props.unstakeOnFarm(
      selected,
      props.modalData.identifier,
      props.isActiveOpen,
      props.modalData.position,
    );
  };

  const onClose = () => {
    setSelected([]);
    setOpen(false);
    props.onClose();
  };

  return (
    <SimpleModal
      open={props.open}
      onClose={onClose}
      title={`Unstake ${props.modalData.title} tokens`}
    >
      <div className={styles.unStakeModal}>
        <div className={styles.unstakeSelectWrapper}>
          <div
            className={clsx(styles.unstakeSelect, 'd-flex justify-content-between', {
              [styles.active]: open,
              [styles.selectedStakes]: !open && selected.length > 0,
            })}
          >
            {selectLabelText}
            <Button
              className={clsx(styles.collapseBtn, { [styles.active]: open })}
              isIconBtn={true}
              color="secondary"
              startIcon="expand_more"
              onClick={() => setOpen(!open)}
            />
          </div>

          <Collapse in={open}>
            <div className={styles.collapsedContent}>
              {userStakes.map((x) => (
                <label key={x.mapId} className={styles.stakedItem}>
                  <div className="d-flex justify-content-between flex-grow-1">
                    <span>{'Stake ' + x.mapId}</span>
                    <span>{x.amount}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="ml-2"
                    checked={selected.findIndex((sel) => sel.mapId === x.mapId) >= 0}
                    onChange={() => onStakeSelect(x, props)}
                  />
                </label>
              ))}
            </div>
          </Collapse>
        </div>

        <div className="d-flex justify-content-end mr-2 mb-2">
          <div>
            Total staked balance:{' '}
            {props.userStakes?.[props.modalData.contractAddress]?.stakedAmount}
          </div>
        </div>

        {selected.length > 0 && (
          <>
            <div className="mb-2">Fee Breakdown</div>

            <div className={styles.feeBreakdownWrapper}>
              <div className={clsx(styles.feeBreakdownTable, 'pb-2')}>
                {selected.map((x) => (
                  <div key={x.mapId}>
                    <div>{'Stake ' + x.mapId}</div>
                    <div>{x.rate + '%'}</div>
                    <div>{x.fee}</div>
                  </div>
                ))}
              </div>
              <div className={clsx(styles.totalRow, 'pt-2')}>
                <div>Total</div>
                <div />
                <div>{Number(selected.reduce((acc, cur) => acc + cur.fee, 0).toFixed(12))}</div>
              </div>
            </div>
          </>
        )}

        <Button
          onClick={onUnstake}
          color="primary"
          className="w-100 mt-4"
          loading={props.unstakeOperation?.isLoading}
          disabled={buttonText !== BUTTON_TEXT.CONFIRM}
        >
          {buttonText}
        </Button>
      </div>
    </SimpleModal>
  );
};

UnstakeModal.propTypes = {
  currentBlock: PropTypes.any,
  isActiveOpen: PropTypes.any,
  modalData: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  unstakeOnFarm: PropTypes.any,
  unstakeOperation: PropTypes.shape({
    isLoading: PropTypes.bool,
    processing: PropTypes.bool,
    completed: PropTypes.bool,
    failed: PropTypes.bool,
  }),
  userStakes: PropTypes.any,
};

export default UnstakeModal;
