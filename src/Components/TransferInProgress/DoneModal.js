/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
// eslint-disable-next-line
import LoadingRing from '../Ui/LoadingRing/loadingRing';
import { ReactComponent as FeeBigIcon } from '../../assets/images/bridge/new_trans_fee_icon.svg';
import { ReactComponent as ProcessSuccess } from '../../assets/images/bridge/process_success.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import React, { useEffect } from 'react';
import { mintTokens, releaseTokens } from '../../apis/bridge/bridgeAPI';
import CONFIG from '../../config/config';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import '../../assets/scss/animation.scss';
import useMediaQuery from '../../hooks/mediaQuery';
// import { PuffLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import Lottie from 'lottie-react';
import loader from '../../assets/images/bridge/loaders/loader_big.json';

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
    displayMessage,
    tokenIn,
    setOpeningFromHistory,
  } = props;
  const isMobile = useMediaQuery('(max-width: 991px)');
  const dispatch = useDispatch();

  useEffect(() => {
    if(currentProgress === numberOfSteps.length - 1) {
      dispatch(setLoader(true));
    } else {
      dispatch(setLoader(false));
    }
  }, [currentProgress]);

  useEffect(async () => {
    console.log('rendering done modal use effect.');
    /* if (currentProgress === numberOfSteps.length - 1) {
      console.log(`Current progress: ${currentProgress}`);
      if (operation === 'BRIDGE') {
        const mintResult = await mintTokens(wrappedUnwrappedData, fromBridge.name);
        console.log('Mint Results: ');
        console.log(mintResult);
        if (mintResult.success) {
          setFinalOpHash(mintResult.transactionHash);
          setOpeningFromHistory(false);
          displayMessage({
            type: 'success',
            duration: FLASH_MESSAGE_DURATION,
            title: `${Number(secondTokenAmount).toFixed(3)} ${tokenOut.name} minted successfully`,
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
          setOpeningFromHistory(false);
          displayMessage({
            type: 'success',
            duration: FLASH_MESSAGE_DURATION,
            title: `${Number(secondTokenAmount).toFixed(3)} ${tokenOut.name} released successfully`,
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
    } */
    return () => dispatch(setLoader(false));
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
                  {Number(secondTokenAmount).toFixed(8)} {tokenOut.name}
                </span>
              </div>
            </div>
            {/* <div className="loading-div">
              <LoadingRing />
            </div> */}
            {/* <div className={styles.completeSpinLoader}></div> */}
            <Lottie animationData={loader} loop={true} style={{height: '45px', width: '45px'}} />
          </div>
        ) : (
          <div
            className={`border-tile success ${
              !openingFromHistory ? 'topToBottomFadeInAnimation-4' : ''
            }`}
          >
            <div className="left-div">
              <div className="containerwithicon">
                <img src={tokenOut.image} />
                <div className="right-div">
                  <span className="value-text">
                    {Number(secondTokenAmount).toFixed(8)} {tokenOut.name}
                  </span>
                  <span className="fromreceived success-text">Received</span>
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
                <span className="fromreceived">Bridge fee</span>
                <span className="value-text">
                  {Number(transactionFees).toFixed(6)}
                  {` ${operation === 'BRIDGE' ? tokenOut.name : tokenIn.name}`}
                </span>
              </div>
            </div>
          </div>
        </div>
        {currentProgress === numberOfSteps.length && (
          <div
            className="borderless mt-3"
            onClick={() =>
              window.open(
                `${
                  operation === 'BRIDGE'
                    ? openingFromHistory
                      ? CONFIG.EXPLORER_LINKS[fromBridge.name]
                      : CONFIG.EXPLORER_LINKS.TEZOS
                    : openingFromHistory
                    ? CONFIG.EXPLORER_LINKS.TEZOS
                    : CONFIG.EXPLORER_LINKS[toBridge.name]
                }${finalOpHash}`,
                '_blank',
              )
            }
          >
            <p className={`mb-1 mt-1 ${styles.discriptionInfo}`} style={{ width: 'max-content' }}>
              {/* <a
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
                View on explorer
              </a> */}
              <span>View on explorer</span>
              <Link className="ml-2 mb-1" />
            </p>
          </div>
        )}
      </div>
      {/* {currentProgress === numberOfSteps.length - 1 && !isMobile && (
        <div className="loading-data-wrapper">
          <PuffLoader color="var(--theme-primary-1)" size={36} />
        </div>
      )} */}
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
  tokenIn: PropTypes.any,
  setOpeningFromHistory: PropTypes.any,
};

export default DoneModal;
