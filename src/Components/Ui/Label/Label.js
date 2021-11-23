import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';
import clsx from 'clsx';
import styles from '../../Ui/Label/label.module.scss';

const Label = (props) => {
  return (
    <div className={clsx('d-flex', props.className && props.className)}>
      {props.icon && (
        <div className={clsx('mr-2', 'm-0', props.iconClass && props.iconClass)}>
          <Image src={props.icon} />
        </div>
      )}
      <div className={clsx(props.divClassName ? props.divClassName : 'text-left')}>
        <p className={clsx('font-weight-bold', 'm-0')}>
          {props.text === null ? <span className="shimmer">999999999</span> : props.text}
        </p>
        {props.subText && <p className={styles.subText}>{props.subText}</p>}
      </div>
    </div>
  );
};

Label.propTypes = {
  text: PropTypes.string.isRequired || PropTypes.number.isRequired,
  subText: PropTypes.string,
  icon: PropTypes.string,
  iconClass: PropTypes.string,
  className: PropTypes.string,
  divClassName: PropTypes.string,
};

export default Label;
