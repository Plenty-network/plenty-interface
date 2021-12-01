import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.scss';
import clsx from 'clsx';

const QuantityButton = (props) => {
  return (
    <div className="d-flex">
      <button
        className={clsx(styles.quantityBtn, styles.default, 'mr-3')}
        onClick={props.onAdd}
        disabled={props.onAddDisabled}
      >
        <span className="material-icons-round">add</span>
      </button>

      <button
        className={clsx(styles.quantityBtn, styles.default)}
        onClick={props.onRemove}
        disabled={props.onRemoveDisabled}
      >
        <span className="material-icons-round">remove</span>
      </button>
    </div>
  );
};

QuantityButton.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAddDisabled: PropTypes.bool,
  onRemoveDisabled: PropTypes.bool,
};

export default QuantityButton;
