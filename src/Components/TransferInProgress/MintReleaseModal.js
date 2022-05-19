/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import { ReactComponent as FeeIcon } from '../../assets/images/bridge/fee_icon.svg';
import GasIcon from '../../assets/images/bridge/gas_fee_icon.svg';
import GasIconDark from '../../assets/images/bridge/gas_fee_icon_dark.svg';
import dummyApiCall from '../../apis/dummyApiCall';
import { useEffect, useRef, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import { getMintStatus, getReleaseStatus } from '../../apis/bridge/bridgeAPI';
import CONFIG from '../../config/config';

const MintReleaseModal = (props) => {
  const [isButtonLoading, SetIsButtonLoading] = useState(false);
  const [isReadyToMintRelease, setIsReadyToMintRelease] = useState(false);
  const [signaturesRequired, setSignaturesRequired] = useState(0);
  const [signaturesCount, setSignaturesCount] = useState(0);
  const [confirmationsRequired, setConfirmationsRequired] = useState(0);
  const [confirmationsCount, setConfirmationsCount] = useState(0);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(true);
  const delay = useRef(5000);
  const dots = useRef(['.','.','.']);

  const {
    description,
    gasFees,
    currentProgress,
    operation,
    setTransactionData,
    selectedId,
    SetCurrentProgress,
    mintUnmintOpHash,
    fromBridge,
    setWrapUnwrapData,
    toBridge,
    theme,
    displayMessage,
  } = props;

  useInterval(async ()=>{
    console.log('Checking mint/relese ready status..');
    if(operation === 'BRIDGE') {
      const mintingResult = await getMintStatus(mintUnmintOpHash, fromBridge.name);
      console.log('Get Mint Status Results: ');
      console.log(mintingResult);
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
      console.log('Get Release Status Results: ');
      console.log(releaseResult);
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
    /* setConfirmationsRequired(5);
    setSignaturesRequired(5);
    setAwaitingConfirmation(false);
    dummyApiCall({ confirmationsCount: 5 }).then((res) => {
      setConfirmationsCount(res.confirmationsCount);
      dummyApiCall({ confirmationsCount: 5 }).then((res) => {
        setSignaturesCount(res.confirmationsCount);
        dummyApiCall({ confirmationsCount: 5 }).then((res) => {
          setIsReadyToMintRelease(true);
        });
      });
    }); */
    
  }, !isReadyToMintRelease ? delay.current : null);

  const mintButtonClick = () => {
    //SetIsButtonLoading(true);
    SetCurrentProgress(currentProgress + 1);
    //console.log(`${operation === 'BRIDGE' ? 'Mint' : 'Release'}`);
    /* dummyApiCall({ currentProgress: currentProgress }).then((res) => {
      setTransactionData((prevData) =>
        prevData.map((transaction) =>
          transaction.id === selectedId
            ? { ...transaction, currentProgress: res.currentProgress + 1 }
            : transaction,
        ),
      );
      SetIsButtonLoading(false);
      SetCurrentProgress(res.currentProgress + 1); 
    });*/
  };
  return (
    <>
      <p className={styles.contentLabel}>{operation === 'BRIDGE' ? 'Minting' : 'Releasing'}</p>
      <p className={styles.contentDes}>{description}</p>
      {/* <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
        <a
          href={`${
            operation === 'BRIDGE'
              ? CONFIG.EXPLORER_LINKS[fromBridge.name]
              : CONFIG.EXPLORER_LINKS.TEZOS
          }${mintUnmintOpHash}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Block Explorer
        </a>
        <Link className="ml-2 mb-1" />
      </p> */}
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.resultsHeader} style={{ alignItems: 'center' }}>
        <div className={`${styles.confirmTextWrapper}`}>
          {awaitingConfirmation ? (
            <p className={styles.fetchingText}>
              Fetching Data
              {dots.current.map((char, index) => {
                const style = {animationDelay: (0.5 + index / 5) + 's'};
                return <span key={index} style={style}>{char}</span>;
              })}
            </p>
          ) : (
            /* confirmationsCount !== 0 && confirmationsRequired !== 0 && confirmationsCount >= confirmationsRequired ? (
              <p>
                Waiting for signatures <span className={styles.feeValue}>{signaturesCount}/{signaturesRequired}</span>
              </p>
            ) : (
              <p>
                Waiting for confirmations <span className={styles.feeValue}>{confirmationsCount}/{confirmationsRequired}</span>
              </p>
            ) */
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
                  {signaturesCount}/{signaturesRequired}
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
            onClick={isReadyToMintRelease ? mintButtonClick : null}
            style={{ cursor: !isReadyToMintRelease ? 'not-allowed' : 'pointer' }}
            disabled={!isReadyToMintRelease}
          >
            {operation === 'BRIDGE' ? 'Mint' : 'Release'}
          </Button>
        </div>
      </div>
      <div className={`mt-3 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.feeInfoWrapper}>
        {/* <img
          src={theme === 'light' ? GasIcon : GasIconDark}
          alt="GasIcon"
          style={{ height: '20px' }}
        ></img> */}
        {/* <p className={styles.bottomInfo}>Review your gas fee in your wallet</p> */}
        {/* <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~{Number(gasFees).toFixed(6)}</p> */}
      </div>
    </>
  );
};

MintReleaseModal.propTypes = {
  description: PropTypes.any,
  gasFees: PropTypes.any,
  currentProgress: PropTypes.any,
  operation: PropTypes.any,
  setTransactionData: PropTypes.any,
  selectedId: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  mintUnmintOpHash: PropTypes.any,
  fromBridge: PropTypes.any,
  setWrapUnwrapData: PropTypes.any,
  toBridge: PropTypes.any,
  theme: PropTypes.any,
  displayMessage: PropTypes.any,
};

export default MintReleaseModal;
