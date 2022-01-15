import React from 'react';
import PropTypes from 'prop-types';
import styles from './switch.module.scss';
import clsx from 'clsx';

const Switch = (props) => {
  const getValue = () => {
    return props.inverted ? !props.value : props.value;
  };

  const getLabelFor = (side) => {
    return side === 'left'
      ? props.inverted
        ? props.trueLabel
        : props.falseLabel
      : props.inverted
      ? props.falseLabel
      : props.trueLabel;
  };

  return (
    <div>
      <span className={clsx(styles.label, 'mr-2', { [styles.active]: !getValue() })}>
        {getLabelFor('left')}
      </span>
      <span className={clsx(styles.label, 'mr-2', { [styles.active]: getValue() })}>
        {getLabelFor('right')}
      </span>

      <label className={styles.switch}>
        <input type="checkbox" checked={getValue()} onClick={props.onChange} />
        <span className={styles.slider} />
      </label>
    </div>
  );
};

Switch.propTypes = {
  value: PropTypes.bool,
  trueLabel: PropTypes.string.isRequired,
  falseLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  inverted: PropTypes.bool,
};

export default Switch;
