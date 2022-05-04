import React from 'react';
import PropTypes from 'prop-types';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

import styles from './modal.module.scss';
import clsx from 'clsx';

const SimpleModal = (props) => {
  return (
    <Modal
      show={props.open}
      onHide={props.onClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={clsx(
        styles.simpleModal,
        props.className,
        props.isConfirmSwap && styles.confirmSwap,
        props.title === 'Transaction Submitted' && 'centerAlign',
        props.isConfirmTransaction && 'removeCloseIcon',
      )}
      centered={true}
    >
      {/* * Header */}
      <div
        className={clsx('d-flex', props.isConfirmSwap ? styles.confirmSwapHeader : styles.header, {
          [styles.noTitle]: !props.title,
        })}
      >
        <div className={clsx(styles.title, 'flex-grow-1')}>
          {props.title}
          {props.title === 'Transaction Submitted' && (
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="button-tooltip-ts" {...props}>
                  Your transaction has been added to the mempool. It can take up to 30 seconds
                  before your transaction is confirmed.
                </Tooltip>
              }
            >
              <span
                style={{ cursor: 'pointer' }}
                className="material-icons-round ml-1  info-transaction-submitted"
              >
                help_outline
              </span>
            </OverlayTrigger>
          )}
        </div>
        {!props.isConfirmTransaction && (
          <div className={styles.closeBtn} onClick={props.onClose}>
            <span className="material-icons-round">close</span>
          </div>
        )}
      </div>
      {/* * Header */}

      {/* * Body */}
      <div
        className={clsx(props.isConfirmSwap ? styles.confirmSwapContent : styles.content, {
          [styles.noTopPadding]: !props.title,
        })}
      >
        {props.children}
      </div>
      {/* * Body */}
    </Modal>
  );
};

SimpleModal.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  isConfirmSwap: PropTypes.any,
  infoModal: PropTypes.any,
  isConfirmTransaction: PropTypes.any,
};

export default SimpleModal;
