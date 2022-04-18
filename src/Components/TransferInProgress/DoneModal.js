import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import LoadingRing from '../Ui/LoadingRing/loadingRing';
import { ReactComponent as FeeBigIcon } from '../../assets/images/bridge/new_trans_fee_icon.svg';
import { ReactComponent as ProcessSuccess } from '../../assets/images/bridge/process_success.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import { useEffect } from 'react';
import { mintTokens, releaseTokens } from '../../apis/bridge/bridgeAPI';
import CONFIG from '../../config/config';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';

const DoneModal = (props) => {
  const {
    transactionFees,
    currentProgress,
    numberOfSteps,
    operation,
    fromBridge,
    toBridge,
    tokenOut,
    secondTokenAmount,
    SetCurrentProgress,
    wrappedUnwrappedData,
    // eslint-disable-next-line
    selectedId,
    // eslint-disable-next-line
    setTransactionData,
    finalOpHash,
    setFinalOpHash,
    openingFromHistory,
    displayMessage
  } = props;

  useEffect(async () => {
    if (currentProgress === numberOfSteps.length - 1) {
      if (operation === 'BRIDGE') {
        const mintResult = await mintTokens(wrappedUnwrappedData, fromBridge.name);
        console.log('Mint Results: ');
        console.log(mintResult);
        if (mintResult.success) {
          setFinalOpHash(mintResult.transactionHash);
          displayMessage({
            type: 'success',
            duration: FLASH_MESSAGE_DURATION,
            title: `${secondTokenAmount.toFixed(3)} ${tokenOut.name} minted successfully`,
            content: 'View on explorer.',
            isFlashMessageALink: true,
            flashMessageLink: `${CONFIG.EXPLORER_LINKS.TEZOS}${mintResult.transactionHash}`,
          });
          SetCurrentProgress(currentProgress + 1);
        } else {
          console.log(mintResult.error);
          displayMessage({
            type: 'error',
            duration: FLASH_MESSAGE_DURATION,
            title: 'Minting Failed',
            content: 'Failed to mint tokens. Please try again.',
            isFlashMessageALink: false,
            flashMessageLink: '#',
          });
          SetCurrentProgress(currentProgress - 1);
        }
      } else {
        const releaseResult = await releaseTokens(wrappedUnwrappedData, toBridge.name);
        console.log('Release Results: ');
        console.log(releaseResult);
        if (releaseResult.success) {
          setFinalOpHash(releaseResult.transactionHash);
          displayMessage({
            type: 'success',
            duration: FLASH_MESSAGE_DURATION,
            title: `${secondTokenAmount.toFixed(3)} ${tokenOut.name} released successfully`,
            content: 'View on explorer.',
            isFlashMessageALink: true,
            flashMessageLink: `${CONFIG.EXPLORER_LINKS[toBridge.name]}${releaseResult.transactionHash}`,
          });
          SetCurrentProgress(currentProgress + 1);
        } else {
          console.log(releaseResult.error);
          displayMessage({
            type: 'error',
            duration: FLASH_MESSAGE_DURATION,
            title: 'Release Failed',
            content: 'Failed to release tokens. Please try again.',
            isFlashMessageALink: false,
            flashMessageLink: '#',
          });
          SetCurrentProgress(currentProgress - 1);
        }
      }
    }
  }, []);

  return (
    <>
      <div className="bridge-done_screen">
        {currentProgress === numberOfSteps.length - 1 ? (
          <div className="border-tile shaded">
            <div className="left-div">
              <p className={styles.youWillReceive}>You will receive</p>
              <div className="containerwithicon">
                <img src={tokenOut.image} />
                <span className="value-text">
                  {secondTokenAmount} {tokenOut.name}
                </span>
              </div>
            </div>
            <div className="loading-div">
              <LoadingRing />
            </div>
          </div>
        ) : (
          <div className="border-tile success">
            <div className="left-div">
              <div className="containerwithicon">
                <img src={tokenOut.image} />
                <div className="right-div">
                  <span className="value-text">
                    {secondTokenAmount} {tokenOut.name}
                  </span>
                  <span className="fromreceived success-text">
                    {operation === 'BRIDGE' ? 'Bridging' : 'Unbridging'} Successful
                  </span>
                </div>
              </div>
            </div>
            <div className="loading-div">
              <ProcessSuccess />
            </div>
          </div>
        )}
        <div className="border-tile">
          <div className="left-div">
            <div className="containerwithicon">
              <img src={fromBridge.image} />
              <div className="right-div">
                <span className="fromreceived">From</span>
                <span className="value-text">{fromBridge.name}</span>
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
                <span className="value-text">{toBridge.name}</span>
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
                <span className="value-text">~{transactionFees}</span>
              </div>
            </div>
          </div>
        </div>
        {currentProgress === numberOfSteps.length && (
          <div className="borderless mt-3">
            <p className={`mb-1 mt-1 ${styles.discriptionInfo}`} style={{ width: 'max-content' }}>
              <a
                href={`${
                  operation === 'BRIDGE'
                    ? openingFromHistory
                      ? CONFIG.EXPLORER_LINKS[fromBridge.name]
                      : CONFIG.EXPLORER_LINKS.TEZOS
                    : openingFromHistory
                    ? CONFIG.EXPLORER_LINKS.TEZOS
                    : CONFIG.EXPLORER_LINKS[toBridge.name]
                }${finalOpHash}`}
                target="_blank"
                rel="noreferrer"
              >
                View detailed trasaction
              </a>
              <Link className="ml-2 mb-1" />
            </p>
          </div>
        )}
      </div>
    </>
  );
};

DoneModal.propTypes = {
  transactionFees: PropTypes.any,
  currentProgress: PropTypes.any,
  numberOfSteps: PropTypes.any,
  operation: PropTypes.any,
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  tokenOut: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  wrappedUnwrappedData: PropTypes.any,
  selectedId: PropTypes.any,
  setTransactionData: PropTypes.any,
  finalOpHash: PropTypes.any,
  setFinalOpHash: PropTypes.any,
  openingFromHistory: PropTypes.any,
  displayMessage: PropTypes.any,
};

export default DoneModal;
