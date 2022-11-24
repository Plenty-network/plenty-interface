import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import styles from './Transfer.module.scss';
import { ReactComponent as Tick } from '../../assets/images/bridge/green_tick.svg';
import './bridge.modules.scss';
import '../../assets/scss/animation.scss';
import HistoryIcon from '../../assets/images/bridge/history_icon.svg';
import HomeIcon from '../../assets/images/bridge/home_icon.svg';
import HistoryIconDark from '../../assets/images/bridge/history_icon_dark.svg';
import HomeIconDark from '../../assets/images/bridge/home_icon_dark.svg';
import BridgeUnbridgeModal from './BridgeUnbridgeModal';
import MintReleaseModal from './MintReleaseModal';
import DoneModal from './DoneModal';
import CONFIG from '../../config/config';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import {
  mintTokens,
  releaseTokens,
} from '../../apis/bridge/bridgeAPI';
const BridgeTransferModal = (props) => {
  const [animationClass, setAnimationClass] = useState('rightToLeftFadeInAnimation-4');
  const [isMintLoading, setIsMintLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [mintReleaseSubmitted, setMintReleaseSubmitted] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const approveHash = useRef(null);
  const wrappedUnwrappedData = useRef(null);
  const dispatch = useDispatch();

  const setWrapUnwrapData = (data) => {
    wrappedUnwrappedData.current = data;
  };

  const setApproveHash = (hash) => {
    approveHash.current = hash;
  };


  useEffect(() => {
    if(isMintLoading && mintReleaseSubmitted) {
      setIsMintLoading(false);
      setMintReleaseSubmitted(false);
      SetCurrentProgress((prevProgress) => prevProgress + 1);
    }
  }, [mintReleaseSubmitted]);


  const {
    walletAddress,
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
    SetCurrentProgress,
    resetToDefaultStates,
    theme,
    mintUnmintOpHash,
    setMintUnmintOpHash,
    finalOpHash,
    setFinalOpHash,
    openingFromHistory,
    displayMessage,
    setOpeningFromHistory,
    isApproved,
    setIsApproved,
    setOpeningFromTransaction,
    transactionTime,
    setTransactionTime,
  } = props;

  const setBack = (value) => {
    setAnimationClass('leftToRightFadeOutAnimation-4');
    setTimeout(() => {
      if (value) {
        setTransaction(1);
      }
    }, 600);
  };

  const mintButtonClick = async () => {
    setIsMintLoading(true);
    dispatch(setLoader(true));
    if (operation === 'BRIDGE') {
      const mintResult = await mintTokens(wrappedUnwrappedData.current, fromBridge.name, setMintReleaseSubmitted);
      if (mintResult.success) {
        if(transactionTime !== null) {
          const bridgingTime = new Date().getTime() - new Date(transactionTime).getTime();
          bridgingTime <= 300000 ? setShowTwitter(true) : setShowTwitter(false);
        }
        setFinalOpHash(mintResult.transactionHash);
        setOpeningFromHistory(false);
        displayMessage({
          type: 'success',
          duration: FLASH_MESSAGE_DURATION,
          title: `${Number(secondTokenAmount).toFixed(3)} ${tokenOut.name} mint successful`,
          content: 'View on explorer',
          isFlashMessageALink: true,
          flashMessageLink: `${CONFIG.EXPLORER_LINKS.TEZOS}${mintResult.transactionHash}`,
        });
        localStorage.setItem('recentTransHash', mintUnmintOpHash);
        SetCurrentProgress((prevProgress) => prevProgress + 1);
      } else {
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Minting failed',
          content: 'Failed to mint tokens. Please try again.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        setIsMintLoading(false);
        dispatch(setLoader(false));
        setMintReleaseSubmitted(false);
        SetCurrentProgress((prevProgress) => prevProgress === numberOfSteps.length - 1 ? prevProgress - 1 : prevProgress);
      }
    } else {
      const releaseResult = await releaseTokens(wrappedUnwrappedData.current, toBridge.name, setMintReleaseSubmitted);
      if (releaseResult.success) {
        if(transactionTime !== null) {
          const bridgingTime = new Date().getTime() - new Date(transactionTime).getTime();
          bridgingTime <= 300000 ? setShowTwitter(true) : setShowTwitter(false);
        }
        setFinalOpHash(releaseResult.transactionHash);
        setOpeningFromHistory(false);
        displayMessage({
          type: 'success',
          duration: FLASH_MESSAGE_DURATION,
          title: `${Number(secondTokenAmount).toFixed(3)} ${tokenOut.name} release successful`,
          content: 'View on explorer',
          isFlashMessageALink: true,
          flashMessageLink: `${CONFIG.EXPLORER_LINKS[toBridge.name]}${
            releaseResult.transactionHash
          }`,
        });
        localStorage.setItem('recentTransHash', mintUnmintOpHash);
        SetCurrentProgress((prevProgress) => prevProgress + 1);
      } else {
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Release failed',
          content: 'Failed to release tokens. Please try again.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        setIsMintLoading(false);
        dispatch(setLoader(false));
        setMintReleaseSubmitted(false);
        SetCurrentProgress((prevProgress) => prevProgress === numberOfSteps.length - 1 ? prevProgress - 1 : prevProgress);
      }
    }
  };

  const numberOfSteps = [
    { BRIDGE: 'Lock', UNBRIDGE: 'Burn' },
    { BRIDGE: 'Mint', UNBRIDGE: 'Release' },
    { BRIDGE: 'Complete', UNBRIDGE: 'Complete' },
  ];
  const defaultTile = (buttonText, index) => {
    return (
      <p className={styles.progressLabel} key={index}>
        <div className="flex flex-row">
          <span className={styles.defaultRadioButton}></span>
          <span>{buttonText}</span>
        </div>
        <p className={styles.defaultProgressLine}></p>
      </p>
    );
  };
  const completedTile = (buttonText, index) => {
    return (
      <p
        className={`${styles.completedLabel} ${styles.progressLabel}`}
        key={index}
      >
        <div className="flex flex-row">
          <span className={styles.greenTick}>
            <Tick />
          </span>
          <span>{buttonText}</span>
        </div>
        <p className={styles.completedProgress}></p>
      </p>
    );
  };
  const currentTile = (buttonText, index) => {
    return (
      <p className={styles.progressLabel} key={index}>
        <div className="flex flex-row">
          <span className={styles.radioButton}></span>
          <span className={styles.activeLabel}>{buttonText}</span>
        </div>
        <p className={styles.progressLine}></p>
      </p>
    );
  };

  return (
    <div
      className={`row justify-content-center mx-auto col-24 col-md-10 col-lg-10 col-xl-10 ${styles.gov} ${animationClass}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal}`}>
          <div>
            <div className="flex flex-row justify-content-between mb-3">
              <div className={`flex ${styles.headingWrapper}`}>
                {(currentProgress === 0 || (currentProgress === 1 && openingFromHistory)) && (
                  <p
                    className={styles.arrowback}
                    onClick={
                      currentProgress === 1 && openingFromHistory
                        ? () => {
                            setAnimationClass('leftToRightFadeOutAnimation-4');
                            setOpeningFromTransaction(true);
                            setTimeout(() => {
                              resetToDefaultStates();
                              setTransaction(2);
                            }, 600);
                          }
                        : isApproveLoading
                        ? null
                        : () => {
                            setBack(1);
                          }
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="mr-3 material-icons-round ">arrow_back</span>
                  </p>
                )}
                {currentProgress === numberOfSteps.length ? (
                  <p className={styles.TransferInProgress}>Transaction details</p>
                ) : currentProgress === numberOfSteps.length - 1 ? (
                  <p className={styles.TransferInProgress}>
                    {operation === 'BRIDGE' ? 'Minting' : 'Release'} in progress
                  </p>
                ) : (
                  <p className={styles.TransferInProgress}>Transfer in progress</p>
                )}
              </div>
              {(currentProgress === numberOfSteps.length || currentProgress === 1) && (
                <div>
                  {currentProgress === numberOfSteps.length && (
                    <img
                      src={theme === 'light' ? HistoryIcon : HistoryIconDark}
                      alt="History"
                      className={`${styles.historyIcon} ${styles.transactionIcons}`}
                      onClick={() => {
                        setAnimationClass('leftToRightFadeOutAnimation-4');
                        setOpeningFromTransaction(true);
                        setTimeout(() => {
                          resetToDefaultStates();
                          setTransaction(2);
                        }, 600);
                      }}
                    ></img>
                  )}
                  <img
                    src={theme === 'light' ? HomeIcon : HomeIconDark}
                    alt="Home"
                    className={styles.transactionIcons}
                    onClick={() => {
                      setAnimationClass('leftToRightFadeOutAnimation-4');
                      setTimeout(() => {
                        resetToDefaultStates();
                        setTransaction(1);
                      }, 600);
                    }}
                  ></img>
                </div>
              )}
            </div>
            <div className={`mb-4 mt-2 ${styles.lineBottom} `}></div>
            <div className={`${styles.resultsHeader}`}>
              {numberOfSteps.map((currentStep, index) => {
                if (currentProgress > index) {
                  return completedTile(currentStep[operation], index);
                } else if (currentProgress === index) {
                  return currentTile(currentStep[operation], index);
                } else {
                  return defaultTile(currentStep[operation], index);
                }
              })}
            </div>
            <div className={`mb-4 ${styles.lineBottom} `}></div>
            {currentProgress === 0 && (
              <BridgeUnbridgeModal
                currentProgress={currentProgress}
                operation={operation}
                fromBridge={fromBridge}
                toBridge={toBridge}
                tokenIn={tokenIn}
                firstTokenAmount={firstTokenAmount}
                SetCurrentProgress={SetCurrentProgress}
                walletAddress={walletAddress}
                setMintUnmintOpHash={setMintUnmintOpHash}
                displayMessage={displayMessage}
                setApproveHash={setApproveHash}
                isApproveLoading={isApproveLoading}
                setIsApproveLoading={setIsApproveLoading}
                isApproved={isApproved}
                setIsApproved={setIsApproved}
                setTransactionTime={setTransactionTime}
              />
            )}
            {currentProgress === 1 && (
              <MintReleaseModal
                operation={operation}
                mintUnmintOpHash={mintUnmintOpHash}
                fromBridge={fromBridge}
                setWrapUnwrapData={setWrapUnwrapData}
                toBridge={toBridge}
                mintButtonClick={mintButtonClick}
                isMintLoading={isMintLoading}
              />
            )}
            {currentProgress > 1 && (
              <DoneModal
                transactionFees={fee}
                currentProgress={currentProgress}
                numberOfSteps={numberOfSteps}
                tokenOut={tokenOut}
                secondTokenAmount={secondTokenAmount}
                fromBridge={fromBridge}
                toBridge={toBridge}
                operation={operation}
                finalOpHash={finalOpHash}
                openingFromHistory={openingFromHistory}
                tokenIn={tokenIn}
                showTwitter={showTwitter}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BridgeTransferModal.propTypes = {
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
  SetCurrentProgress: PropTypes.any,
  resetToDefaultStates: PropTypes.any,
  theme: PropTypes.any,
  mintUnmintOpHash: PropTypes.any,
  setMintUnmintOpHash: PropTypes.any,
  finalOpHash: PropTypes.any,
  setFinalOpHash: PropTypes.any,
  openingFromHistory: PropTypes.any,
  displayMessage: PropTypes.any,
  setOpeningFromHistory: PropTypes.any,
  isApproved: PropTypes.any,
  setIsApproved: PropTypes.any,
  setOpeningFromTransaction: PropTypes.any,
  transactionTime: PropTypes.any,
  setTransactionTime: PropTypes.any,
};

export default BridgeTransferModal;
