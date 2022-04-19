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
    
  }, !isReadyToMintRelease ? delay.current : null);

  const mintButtonClick = () => {
    //SetIsButtonLoading(true);
    SetCurrentProgress(currentProgress + 1);
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
      <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
        <a
          href={`${operation === 'BRIDGE' ? CONFIG.EXPLORER_LINKS[fromBridge.name] : CONFIG.EXPLORER_LINKS.TEZOS}${mintUnmintOpHash}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Block Explorer
        </a>
        <Link className="ml-2 mb-1" />
      </p>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.resultsHeader}>
        <div className={`${styles.bottomInfo} ${styles.width}`}>
          {awaitingConfirmation ? (
            <p>Awating confirmation..</p>
          ) : (
            confirmationsCount !== 0 && confirmationsRequired !== 0 && confirmationsCount >= confirmationsRequired ? (
              <p>
                Waiting for signatures {signaturesCount}/{signaturesRequired}
              </p>
            ) : (
              <p>
                Waiting for confirmations {confirmationsCount}/{confirmationsRequired}
              </p>
            )
          )}
        </div>
        <div style={{ width: '50%' }}>
          <Button
            color={'primary'}
            className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={mintButtonClick}
            loading={isReadyToMintRelease ? false : true}
          >
            {operation === 'BRIDGE' ? 'Mint' : 'Release'}
          </Button>
        </div>
      </div>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.feeInfoWrapper}>
        <img
          src={theme === 'light' ? GasIcon : GasIconDark}
          alt="GasIcon"
          style={{ height: '20px' }}
        ></img>
        <p className={styles.bottomInfo}>Estimated Gas fee</p>
        <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~{Number(gasFees).toFixed(6)}</p>
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
