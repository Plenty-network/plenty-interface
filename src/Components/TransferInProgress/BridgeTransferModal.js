/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Tick } from '../../assets/images/bridge/green_tick.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import dummyApiCall from '../../apis/dummyApiCall';

const BridgeTransferModal = () => {
  const [currentProgress,SetCurrentProgress]=useState(0);
  const [isButtonLoading,SetIsButtonLoading]=useState(false);
  const isCurrentProgressCompleted=(currentProgres)=>{
      return currentProgres>currentProgres;
  };

const bridgeButtonClick=()=>{
  SetIsButtonLoading(true);
    dummyApiCall({currentProgress:currentProgress}).then((res)=>{
      SetIsButtonLoading(false);
      SetCurrentProgress(res.currentProgress+1);
    });
};
  const numberOfSteps=[
    'Approve',
    'Bridge',
    'Mint',
    'Done'
  ];
  const defaultTile=(buttonText)=>{
    return (<p className={styles.progressLabel}>
      <div className="flex flex-row">
        <span className={styles.defaultRadioButton}></span>
        <span>{buttonText}</span>
      </div>
      <p className={styles.defaultProgressLine}></p>
    </p>);
  };
  const completedTile=(buttonText)=>{
    return(<p className={`${styles.completedLabel} ${styles.progressLabel}`}>
    <div className="flex flex-row">
      {/* <span className={styles.defaultRadioButton}></span> */}
      <span className={styles.greenTick}>
        <Tick />
      </span>
      <span>{buttonText}</span>
    </div>
    <p className={styles.completedProgress}></p>
  </p>);
  };
  const currentTile=(buttonText)=>{
     return(<p className={styles.progressLabel}>
      <div className="flex flex-row">
        <span className={styles.radioButton}></span>
        <span className={styles.activeLabel}>{buttonText}</span>
      </div>
      <p className={styles.progressLine}></p>
    </p>);
  };
  const InSideElement=(p)=>{
    console.log(p);
    return(
      <>
       <p className={styles.contentLabel}>{p.label}</p>
          <p className={styles.contentDes}>
            {p.description}
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
            Please approve in your wallet to proceed with the tranfer{' '}
            </div>
            <div>
              <Button
                color={'primary'}
                className={'xplenty-btn mt-2  flex align-items-center justify-content-center'}
                onClick={bridgeButtonClick}
                loading={isButtonLoading}
              >
                {numberOfSteps[currentProgress]}
              </Button>
            </div>
          </div>
          <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            <p className={styles.bottomInfo}>Estimated Transaction fee</p>
            <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~${p.transactionFees}</p>
          </div>
         
      </>
    );
  };
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
            {numberOfSteps.map((currentStep,index)=>{
              if(currentProgress>index){
                return completedTile(currentStep);
              }
              else if(currentProgress===index){
                return currentTile(currentStep);
              }
              else{
                return defaultTile(currentStep);
              }
            })
            }
          </div>
          <div className={`mb-4 ${styles.lineBottom} `}></div>
          {/*  */}
          {/* code will go here */}
          <InSideElement 
          label={numberOfSteps[currentProgress]} 
          description='Ethereum  transactions can take  longer time to complete based upon the network congestion.'
          transactionFees={'300'}
           />
          {/*  */}
        </div>
      </div>
    </div>
  );
};

BridgeTransferModal.propTypes = {
  transaction: PropTypes.any,
  setTransaction: PropTypes.any,
  walletAddress: PropTypes.any,
};

export default BridgeTransferModal;
