import PropTypes from 'prop-types';
import React from 'react';
import styles from './Transaction.module.scss';
import Ctez from '../../assets/images/ctez.png';

const TransactionHistory = (props) => {
  const setBack = (value) => {
    if (value) {
      props.setTransaction(false);
    }
  };
  return (
    <div
      className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal}`}>
          <div className="flex flex-row">
            <p
              className={styles.arrowback}
              onClick={() => {
                setBack(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="mt-1 mr-3 material-icons-round ">arrow_back</span>
            </p>
            <p className={styles.heading}>Transaction history</p>
          </div>
          <div className={`mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
          <div className={`mt-2 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
          <div className={`mt-2 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
          <div className={`mt-2 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
          <div className={`mt-2 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
          <div className={`mt-2 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
          <div className={`mt-2 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <div className={styles.tokenbg}>
              <img src={Ctez} className={styles.tokens}></img>
            </div>
            <div>
              <p className={styles.value}>22.3930 USDC.a</p>
              <p className={styles.amt}>Completed</p>
            </div>
            <div>
              <p className={styles.details}>View Details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionHistory.propTypes = {
  transaction: PropTypes.any,
  setTransaction: PropTypes.any,
};

export default TransactionHistory;
