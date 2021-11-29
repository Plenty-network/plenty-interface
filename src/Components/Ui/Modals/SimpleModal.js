import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import styles from './modal.module.scss';
import clsx from 'clsx';

const SimpleModal = (props) => {
  return (
    <Modal
      show={props.open}
      onHide={props.onClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={clsx(styles.simpleModal, props.className)}
      centered={true}
    >
      {/* * Header */}
      <div
        className={clsx(styles.header, 'd-flex', {
          [styles.noTitle]: !props.title,
        })}
      >
        <div className={clsx(styles.title, 'flex-grow-1')}>{props.title}</div>

        <div className={styles.closeBtn} onClick={props.onClose}>
          <span className="material-icons-round">close</span>
        </div>
      </div>
      {/* * Header */}

      {/* * Body */}
      <div
        className={clsx(styles.content, {
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
};

export default SimpleModal;
