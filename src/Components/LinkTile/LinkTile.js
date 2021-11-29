import React from 'react';
import Label from '../Ui/Label/Label';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import styles from '../LinkTile/linktile.module.scss';
import Button from '../Ui/Buttons/Button';

const LinkTile = (props) => {
  return (
    <div
      className={clsx(
        styles.tile,
        'border-themed-dark-none',
        'bg-themed',
        'px-4',
        'py-3',
        'd-flex',
        'flex-column',
      )}
    >
      <div
        className={clsx(
          styles.header,
          props.headerClassName && props.headerClassName,
          'mb-2',
          'mt-4',
          'd-flex',
          'justify-content-center',
        )}
      >
        <Label text={props.headerText} subText={props.headerSubText} icon={props.headerIcon} />
      </div>
      <hr className="w-100" />
      <div className={clsx(styles.text, 'text-center', 'p-3', 'flex-grow-1', 'mb-2')}>
        <p>{props.text}</p>
      </div>
      <div>
        <Link to={props.linkTo} className="text-decoration-none">
          <Button onClick={() => null} color={'primary'} className={'w-100'}>
            {props.linkText}
          </Button>
          {/*<button className={clsx(*/}
          {/*    styles.btn,*/}
          {/*    styles[color],*/}
          {/*    "w-100",*/}
          {/*    "font-weight-bold"*/}
          {/*)}>*/}
          {/*</button>*/}
        </Link>
      </div>
    </div>
  );
};

LinkTile.propTypes = {
  headerIcon: PropTypes.string,
  headerText: PropTypes.string,
  headerSubText: PropTypes.string,
  headerClassName: PropTypes.string,
  text: PropTypes.string.isRequired,
  linkTo: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['default']),
};

export default LinkTile;
