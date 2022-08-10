import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { useEffect, useRef, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import { getMintStatus, getReleaseStatus } from '../../apis/bridge/bridgeAPI';
import GasInformationPopup from '../Bridges/GasInformationPopup';

const MintReleaseModal = (props) => {
  const [isReadyToMintRelease, setIsReadyToMintRelease] = useState(false);
  const [signaturesRequired, setSignaturesRequired] = useState(0);
  const [signaturesCount, setSignaturesCount] = useState(0);
  const [confirmationsRequired, setConfirmationsRequired] = useState(0);
  const [confirmationsCount, setConfirmationsCount] = useState(0);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(true);
  const [displayPopup, setDisplayPopup] = useState(false);
  const [isPopupViewed, setIsPopupViewed] = useState(false);
  const delay = useRef(5000);
  const dots = useRef(['.','.','.']);

  const {
    operation,
    mintUnmintOpHash,
    fromBridge,
    setWrapUnwrapData,
    toBridge,
    mintButtonClick,
    isMintLoading,
  } = props;

  useEffect(async () => {
    if(operation === 'BRIDGE') {
      const mintingResult = await getMintStatus(mintUnmintOpHash, fromBridge.name);
      if (mintingResult.data !== null) {
        setAwaitingConfirmation(false);
        setSignaturesRequired(mintingResult.signaturesReq);
        setSignaturesCount(mintingResult.signaturesCount);
        setConfirmationsRequired(mintingResult.confirmationsRequired);
        setConfirmationsCount(mintingResult.confirmations);
        setWrapUnwrapData(mintingResult.data);
        setIsReadyToMintRelease(mintingResult.readyToMint);
      } else {
        setAwaitingConfirmation(true);
      }
    } else {
      const releaseResult = await getReleaseStatus(mintUnmintOpHash, toBridge.name);
      if (releaseResult.data !== null) {
        setAwaitingConfirmation(false);
        setSignaturesRequired(releaseResult.signaturesReq);
        setSignaturesCount(releaseResult.signaturesCount);
        setConfirmationsRequired(releaseResult.confirmationsRequired);
        setConfirmationsCount(releaseResult.confirmations);
        setWrapUnwrapData(releaseResult.data);
        setIsReadyToMintRelease(releaseResult.readyToRelease);
      } else {
        setAwaitingConfirmation(true);
      }
    }
  }, []);

  useInterval(async ()=>{
    if(operation === 'BRIDGE') {
      const mintingResult = await getMintStatus(mintUnmintOpHash, fromBridge.name);
      if (mintingResult.data !== null) {
        setAwaitingConfirmation(false);
        setSignaturesRequired(mintingResult.signaturesReq);
        setSignaturesCount(mintingResult.signaturesCount);
        setConfirmationsRequired(mintingResult.confirmationsRequired);
        setConfirmationsCount(mintingResult.confirmations);
        setWrapUnwrapData(mintingResult.data);
        setIsReadyToMintRelease(mintingResult.readyToMint);
      } else {
        setAwaitingConfirmation(true);
      }
    } else {
      const releaseResult = await getReleaseStatus(mintUnmintOpHash, toBridge.name);
      if (releaseResult.data !== null) {
        setAwaitingConfirmation(false);
        setSignaturesRequired(releaseResult.signaturesReq);
        setSignaturesCount(releaseResult.signaturesCount);
        setConfirmationsRequired(releaseResult.confirmationsRequired);
        setConfirmationsCount(releaseResult.confirmations);
        setWrapUnwrapData(releaseResult.data);
        setIsReadyToMintRelease(releaseResult.readyToRelease);
      } else {
        setAwaitingConfirmation(true);
      }
    }
  }, !isReadyToMintRelease ? delay.current : null);

  const showPopup = () => {
    setDisplayPopup(true);
  };

  const hidePopup = () => {
    setDisplayPopup(false);
    setIsPopupViewed(true);
  };

  return (
    <>
      <p className={styles.contentLabel}>{operation === 'BRIDGE' ? 'Minting' : 'Releasing'}</p>
      <p className={styles.contentDes}>
        {operation === 'BRIDGE' ? 'Minting' : 'Releasing'} is enabled when the threshold for block
        confirmations is reached and five out of seven signers have published their signature on
        IPFS.{' '}
      </p>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.resultsHeader} style={{ alignItems: 'center' }}>
        <div className={`${styles.confirmTextWrapper}`}>
          {awaitingConfirmation ? (
            <p className={styles.fetchingText}>
              Fetching data
              {dots.current.map((char, index) => {
                const style = { animationDelay: 0.5 + index / 5 + 's' };
                return (
                  <span key={index} style={style}>
                    {char}
                  </span>
                );
              })}
            </p>
          ) : (
            <>
              <p className={`${styles.processTextContainer} ${styles.processing}`}>
                Waiting for confirmations{' '}
                <span className={styles.processingValue} style={{ marginLeft: '2px' }}>
                  {confirmationsCount <= confirmationsRequired
                    ? confirmationsCount
                    : confirmationsRequired}
                  /{confirmationsRequired}
                </span>
                {confirmationsCount < confirmationsRequired ? (
                  <span
                    className={styles.spinLoader}
                    style={{ display: 'inline-block', marginLeft: '10px' }}
                  ></span>
                ) : (
                  <span
                    className={`material-icons-round ${styles.checkMark}`}
                    style={{ display: 'inline-block', marginLeft: '10px' }}
                  >
                    check_circle
                  </span>
                )}
              </p>
              <p
                className={`${styles.processTextContainer} ${
                  confirmationsCount < confirmationsRequired ? styles.waiting : styles.processing
                }`}
              >
                Waiting for signatures{' '}
                <span
                  className={
                    confirmationsCount < confirmationsRequired
                      ? styles.waitingValue
                      : styles.processingValue
                  }
                  style={{ marginLeft: '2px' }}
                >
                  {signaturesCount <= signaturesRequired ? signaturesCount : signaturesRequired}/
                  {signaturesRequired}
                </span>
                {confirmationsCount >= confirmationsRequired &&
                  (signaturesCount < signaturesRequired ? (
                    <span
                      className={styles.spinLoader}
                      style={{ display: 'inline-block', marginLeft: '10px' }}
                    ></span>
                  ) : (
                    <span
                      className={`material-icons-round ${styles.checkMark}`}
                      style={{ display: 'inline-block', marginLeft: '10px' }}
                    >
                      check_circle
                    </span>
                  ))}
              </p>
            </>
          )}
        </div>
        <div className={styles.mainButtonWrapper}>
          <Button
            color={'primary'}
            className={`xplenty-btn flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={
              isReadyToMintRelease
                ? operation === 'BRIDGE'
                  ? mintButtonClick
                  : toBridge.name === 'ETHEREUM' && !isPopupViewed
                  ? showPopup
                  : mintButtonClick
                : null
            }
            style={{ cursor: !isReadyToMintRelease ? 'not-allowed' : 'pointer' }}
            disabled={!isReadyToMintRelease}
            loading={isReadyToMintRelease && isMintLoading}
          >
            {operation === 'BRIDGE' ? 'Mint' : 'Release'}
          </Button>
        </div>
      </div>
      <div className={`mt-3 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.feeInfoWrapper}></div>
      <GasInformationPopup show={displayPopup} onHide={hidePopup} />
    </>
  );
};

MintReleaseModal.propTypes = {
  operation: PropTypes.any,
  mintUnmintOpHash: PropTypes.any,
  fromBridge: PropTypes.any,
  setWrapUnwrapData: PropTypes.any,
  toBridge: PropTypes.any,
  mintButtonClick: PropTypes.any,
  isMintLoading: PropTypes.any,
};

export default MintReleaseModal;
