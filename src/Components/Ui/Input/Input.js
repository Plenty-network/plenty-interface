import React from 'react';
import PropTypes from 'prop-types';

import styles from './input.module.scss';
import clsx from 'clsx';

const Input = (props) => {
  return (
    <div className={clsx(styles.inputWrapper, props.className)}>
      <input value={props.value} onChange={props.onChange} />
    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Input;
