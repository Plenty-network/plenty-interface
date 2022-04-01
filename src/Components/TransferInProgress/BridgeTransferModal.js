/* eslint-disable no-unused-vars */
import PropTypes, { number } from 'prop-types';
import React, { useState } from 'react';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Tick } from '../../assets/images/bridge/green_tick.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import { ReactComponent as FeeIcon } from '../../assets/images/bridge/fee_icon.svg';
import dummyApiCall from '../../apis/dummyApiCall';
import LoadingRing from '../Ui/LoadingRing/loadingRing';
import './bridge.modules.scss';
import '../../assets/scss/animation.scss';
import { bridgesList } from '../../constants/bridges';
import { ReactComponent as FeeBigIcon } from '../../assets/images/bridge/fee_big_icon.svg';
import { ReactComponent as ProcessSuccess } from '../../assets/images/bridge/process_success.svg';

const BridgeTransferModal = (props) => {
  const [animationCalss,SetAnimationClass]=useState('leftToRightFadeInAnimation-4-bridge');
  //const [currentProgress,SetCurrentProgress]=useState(4);
  const [isButtonLoading,SetIsButtonLoading]=useState(false);
  const isCurrentProgressCompleted=(currentProgres)=>{
      return currentProgres>currentProgres;
  };

  const {
    walletAddress,
    transaction,
    setTransaction,
    fromBridge,
    toBridge,
    tokenIn,
    tokenOut,
    firstTokenAmount,
    secondTokenAmount,
    fee,
    currentProgress,
    operation,
    selectedId,
    setFromBridge,
    setToBridge,
    setTokenIn,
    setTokenOut,
    setFirstTokenAmount,
    setSecondTokenAmount,
    setFee,
    SetCurrentProgress,
    setOperation,
    resetToDefaultStates,
    setTransactionData,
    getTransactionListLength
  } = props;

  const setBack = (value) => {
    SetAnimationClass('rightToLeftFadeInAnimation-4');
    setTimeout(()=>{
      if (value) {
        setTransaction(1);
      }
    },200); 
  };

const bridgeButtonClick=()=>{
  SetIsButtonLoading(true);
    dummyApiCall({currentProgress:currentProgress}).then((res)=>{
      if(res.currentProgress === 0) {
        const newIndex = getTransactionListLength();
        const newProgress = res.currentProgress + 1;
        const newDate = new Date().toLocaleDateString('en-IN');
        const newTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
        const newData = {
          id: newIndex,
          currentProgress: newProgress,
          operation: operation,
          fromBridge: fromBridge.name,
          toBridge: toBridge.name,
          tokenIn: tokenIn.name,
          tokenOut: tokenOut.name,
          firstTokenAmount: firstTokenAmount,
          secondTokenAmount: secondTokenAmount,
          fee: fee,
          date: newDate,
          time: newTime,
        };
        setTransactionData((prevData) => [...prevData, newData]);
      } else {
        setTransactionData((prevData) => prevData.map(transaction => transaction.id === selectedId ? {...transaction, currentProgress: res.currentProgress + 1} : transaction));
      }
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
    return (<p className={styles.progressLabel+' leftToRightFadeInAnimation-4-bridge'}>
      <div className="flex flex-row">
        <span className={styles.defaultRadioButton}></span>
        <span>{buttonText}</span>
      </div>
      <p className={styles.defaultProgressLine}></p>
    </p>);
  };
  const completedTile=(buttonText)=>{
    return(
    <p className={`${styles.completedLabel} ${styles.progressLabel} leftToRightFadeInAnimation-4-bridge`}>
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
     return(<p className={styles.progressLabel+' leftToRightFadeInAnimation-4-bridge'}>
      <div className="flex flex-row">
        <span className={styles.radioButton}></span>
        <span className={styles.activeLabel}>{buttonText}</span>
      </div>
      <p className={styles.progressLine}></p>
    </p>);
  };
  const InSideElement=(p)=>{
    if(currentProgress===numberOfSteps.length-1){
      dummyApiCall({isCompletedtranscation:true}).then((res)=>{
        setTransactionData((prevData) => prevData.map(transaction => transaction.id === selectedId ? {...transaction, currentProgress: currentProgress+1} : transaction));
        if(res.isCompletedtranscation){SetCurrentProgress(currentProgress+1);}
         
      });
      return (
      <>
      <div className='bridge-done_screen'>
      <div className='border-tile shaded'>
            <div className='left-div'>
              <p>You will receive</p>
              <div className='containerwithicon'>
                <img src={tokenOut.image}/>
                <span className='value-text'>{secondTokenAmount} {tokenOut.name}</span>
              </div>
            </div>
            <div className='loading-div'>
              <LoadingRing/>
            </div>
            
      </div>
      <div className='border-tile'>
            <div className='left-div'>
              <div className='containerwithicon'>
                <img src={fromBridge.image}/>
                <div className='right-div'>
                  <span className='fromreceived'>From</span>
                  <span className='value-text'>{fromBridge.name}</span>
                </div>
              </div>
            </div>
      </div>
      <div className='border-tile'>
            <div className='left-div'>
              <div className='containerwithicon'>
                <img src={toBridge.image}/>
                <div className='right-div'>
                  <span className='fromreceived'>To</span>
                  <span className='value-text'>{toBridge.name}</span>
                </div>
              </div>
            </div>
      </div>
      <div className='border-tile'>
            <div className='left-div'>
              <div className='containerwithicon'>
                <FeeBigIcon />
                <div className='right-div'>
                  <span className='fromreceived'>Estimated transaction fee</span>
                  <span className='value-text'>~{p.transactionFees}</span>
                </div>
              </div>
            </div>
      </div>
      </div>
      </>);
    }else if(currentProgress===numberOfSteps.length){
        
        //resetToDefaultStates();
        return (
          <>
            <div className="bridge-done_screen">
              <div className="border-tile success">
                <div className="left-div">
                  <div className="containerwithicon">
                    <img src={tokenOut.image} />
                    <div className="right-div">                     
                      <span className='value-text'>{secondTokenAmount} {tokenOut.name}</span>
                      <span className="fromreceived success-text">Bridging Successful</span>
                    </div>
                  </div>
                </div>
                <div className="loading-div">
                  <ProcessSuccess />
                </div>
              </div>
              <div className="border-tile">
                <div className="left-div">
                  <div className="containerwithicon">
                    <img src={fromBridge.image} />
                    <div className="right-div">
                      <span className="fromreceived">From</span>
                      <span className='value-text'>{fromBridge.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-tile">
                <div className="left-div">
                  <div className="containerwithicon">
                    <img src={toBridge.image} />
                    <div className="right-div">
                      <span className="fromreceived">To</span>
                      <span className='value-text'>{toBridge.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-tile">
                <div className="left-div">
                  <div className="containerwithicon">
                    <FeeBigIcon />
                    <div className="right-div">
                      <span className="fromreceived">Estimated transaction fee</span>
                      <span className='value-text'>~{p.transactionFees}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="borderless mt-3">
                <p
                  className={`mb-1 mt-1 ${styles.discriptionInfo}`}
                  style={{ width: 'max-content' }}
                >
                  <a
                    href="https://forum.plentydefi.com/t/pip-001-minting-rate-reduction/51"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View detailed trasaction
                  </a>
                  <Link className="ml-2 mb-1" />
                </p>
              </div>
            </div>
          </>
        );
    }
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
          <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
          {
            ( currentProgress === 0 && 
              <div className={`${styles.topInfo} my-2`}>
                    Please approve in your wallet to proceed with the tranfer{' '}
              </div>  
            )
          }
          <div className={styles.resultsHeader}>
            {
              currentProgress === 0 ? (
                <>
                  <div style={{width: '50%'}}>
                    <Button
                      color={'default'}
                      className={`mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
                      onClick={() => setBack(1)}
                    >
                      {'Cancel'}
                    </Button>
                  </div>
                  <div style={{width: '50%'}}>
                    <Button
                      color={'primary'}
                      className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
                      onClick={bridgeButtonClick}
                      loading={isButtonLoading}
                    >
                      {numberOfSteps[currentProgress]}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className={`${styles.bottomInfo} ${styles.width}`}>
                    Please approve in your wallet to proceed with the tranfer{' '}
                  </div>
                  <div style={{width: '50%'}}>
                    <Button
                      color={'primary'}
                      className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
                      onClick={(bridgeButtonClick)}
                      loading={isButtonLoading}
                    >
                      {numberOfSteps[currentProgress]}
                    </Button>
                  </div>
                </>
              )
            }
          </div>
          <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
          <div className={styles.feeInfoWrapper}>
            <FeeIcon />
            <p className={styles.bottomInfo}>Estimated Transaction fee</p>
            <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~{p.transactionFees}</p>
          </div>
         
      </>
    );
  };
  return (
    <div
      className={`row justify-content-center mx-auto col-24 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal} leftToRightFadeInAnimation-4-bridge-${isButtonLoading}`}>
          <div className="flex flex-row justify-content-between mb-3">
            <div className={`flex ${styles.headingWrapper}`}>
              {currentProgress === 0 && (
                <p
                  className={styles.arrowback}
                  onClick={() => {
                    setBack(1);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="mr-3 material-icons-round ">arrow_back</span>
                </p>
              )}
              {currentProgress === numberOfSteps.length ? (
                <div className="flex flex-column">
                  <p className={styles.TransferInProgress}>Transaction Details</p>
                  <p className={styles.reviewText}>Review you transaction</p>
                </div>
              ) : (
                <p className={styles.TransferInProgress}>Transfer in progress</p>
              )}
            </div>
            {currentProgress === numberOfSteps.length && (
              <p
                className={styles.res}
                onClick={() => {
                  resetToDefaultStates();
                  setTransaction(2);
                }}
                style={{ cursor: 'pointer' }}
              >
                View History
              </p>
            )}
          </div>
          <div className={`mb-3 mt-2 ${styles.lineBottom} `}></div>
          <div className={styles.resultsHeader}>
            {numberOfSteps.map((currentStep, index) => {
              if (currentProgress > index) {
                return completedTile(currentStep);
              } else if (currentProgress === index) {
                return currentTile(currentStep);
              } else {
                return defaultTile(currentStep);
              }
            })}
          </div>
          <div className={`mb-4 ${styles.lineBottom} `}></div>
          {/*  */}
          {/* code will go here */}
          <InSideElement
            label={numberOfSteps[currentProgress]}
            description={`${fromBridge.name}  transactions can take  longer time to complete based upon the network congestion.`}
            transactionFees={fee}
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
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  fee: PropTypes.any,
  currentProgress: PropTypes.any,
  operation: PropTypes.any,
  setFromBridge: PropTypes.any,
  setToBridge: PropTypes.any,
  setTokenIn: PropTypes.any,
  setTokenOut: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setSecondTokenAmount: PropTypes.any,
  setFee: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  setOperation: PropTypes.any,
  resetToDefaultStates: PropTypes.any,
  setTransactionData: PropTypes.any,
  getTransactionListLength: PropTypes.any,
  selectedId: PropTypes.any
};

export default BridgeTransferModal;
