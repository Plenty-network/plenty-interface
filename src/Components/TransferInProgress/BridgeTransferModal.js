/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React from 'react';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Tick } from '../../assets/images/bridge/green_tick.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';

const BridgeModal = () => {
  return (
    <div
      className={`row justify-content-center mx-auto col-24 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal}`}>
          <div className={styles.resultsHeader}>
            <p className={styles.TransferInProgress}>Transfer in progress..</p>
          </div>
          <div className={`mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <p className={`${styles.completedLabel} ${styles.progressLabel}`}>
              <div className="flex flex-row">
                {/* <span className={styles.defaultRadioButton}></span> */}
                <span className={styles.greenTick}>
                  <Tick />
                </span>
                <span>Approve</span>
              </div>
              <p className={styles.completedProgress}></p>
            </p>
            <p className={styles.progressLabel}>
              <div className="flex flex-row">
                <span className={styles.radioButton}></span>
                <span className={styles.activeLabel}>Bridge</span>
              </div>
              <p className={styles.progressLine}></p>
            </p>
            <p className={styles.progressLabel}>
              <div className="flex flex-row">
                <span className={styles.defaultRadioButton}></span>
                <span>Mint</span>
              </div>
              <p className={styles.defaultProgressLine}></p>
            </p>
            <p className={styles.progressLabel}>
              <div className="flex flex-row">
                <span className={styles.defaultRadioButton}></span>
                <span>Done</span>
              </div>
              <p className={styles.defaultProgressLine}></p>
            </p>
          </div>
          <div className={`mb-4 ${styles.lineBottom} `}></div>
          <p className={styles.contentLabel}>Bridge</p>
          <p className={styles.contentDes}>
            Ethereum transactions can take longer time to complete based upon the network
            congestion.
          </p>
          <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
            <a
              href="https://forum.plentydefi.com/t/pip-001-minting-rate-reduction/51"
              target="_blank"
              rel="noreferrer"
            >
              View on Block Explorer
            </a>
            <Link className="ml-2 mb-1" />
          </p>
          <div className={`mt-4 mb-2 ${styles.lineBottom} `}></div>

          <div className={styles.resultsHeader}>
            <div className={`${styles.bottomInfo} ${styles.width}`}>
              Lorem Ipsum is simply dummy text of the printing{' '}
            </div>
            <div>
              <Button
                color={'primary'}
                className={'xplenty-btn mt-2  flex align-items-center justify-content-center'}
              >
                Bridge
              </Button>
            </div>
          </div>
          <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <p className={styles.bottomInfo}>Estimated Transaction fee</p>
            <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~$3.12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

BridgeModal.propTypes = {
  transaction: PropTypes.any,
  setTransaction: PropTypes.any,
  walletAddress: PropTypes.any,
};

export default BridgeModal;
