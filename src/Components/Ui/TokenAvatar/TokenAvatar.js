import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import styles from './token-avatar.module.scss';

const TokenAvatar = (props) => {
  if (!props.imgPath1) {
    return <Image src={null} height={32} width={32} alt={''} />;
  }

  if (props.imgPath2) {
    return (
      <div className={styles.root}>
        <Image src={props.imgPath1.url} height={32} width={32} alt={''} className={styles.token1} />
        <Image src={props.imgPath2.url} height={32} width={32} alt={''} className={styles.token2} />
      </div>
    );
  }

  return <Image src={props.imgPath1.url} height={32} width={32} alt={''} />;
};

TokenAvatar.propTypes = {
  imgPath1: PropTypes.shape({
    loading: PropTypes.bool,
    url: PropTypes.string,
  }),
  imgPath2: PropTypes.shape({
    loading: PropTypes.bool,
    url: PropTypes.string,
  }),
};

export default TokenAvatar;
