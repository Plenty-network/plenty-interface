import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { useState } from 'react';
import { wrap, unwrap, approveToken } from '../../apis/bridge/bridgeAPI';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../redux/slices/settings/settings.slice';

const BridgeUnbridgeModal = (props) => {
  const [isButtonLoading, SetIsButtonLoading] = useState(false);
  const {
    currentProgress,
    operation,
    fromBridge,
    toBridge,
    tokenIn,
    firstTokenAmount,
    SetCurrentProgress,
    walletAddress,
    setMintUnmintOpHash,
    displayMessage,
    setApproveHash,
    isApproveLoading,
    setIsApproveLoading,
    isApproved,
    setIsApproved,
    setTransactionTime,
  } = props;
  const dispatch = useDispatch();

  const bridgeButtonClick = async () => {
    SetIsButtonLoading(true);
    dispatch(setLoader(true));
    if (operation === 'BRIDGE') {
      const bridgeUnbridgeResult = await wrap(
        tokenIn,
        fromBridge.name,
        firstTokenAmount,
        walletAddress,
      );
      if (bridgeUnbridgeResult.success) {
        setMintUnmintOpHash(bridgeUnbridgeResult.transactionHash);
        setTransactionTime(bridgeUnbridgeResult.timeStamp);
        displayMessage({
          type: 'success',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Lock call successful',
          content: `${Number(firstTokenAmount).toFixed(3)} ${tokenIn.name} locked successfully.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
        dispatch(setLoader(false));
        SetCurrentProgress(currentProgress + 1);
      } else {
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Lock call failed',
          content: 'Failed to lock tokens. Please try again.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
        dispatch(setLoader(false));
      }
    } else {
      const bridgeUnbridgeResult = await unwrap(toBridge.name, firstTokenAmount, tokenIn);
      if (bridgeUnbridgeResult.success) {
        setMintUnmintOpHash(bridgeUnbridgeResult.txHash);
        setTransactionTime(bridgeUnbridgeResult.timeStamp);
        displayMessage({
          type: 'success',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Burn call successful',
          content: `${Number(firstTokenAmount).toFixed(3)} ${tokenIn.name} burned successfully.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
        dispatch(setLoader(false));
        SetCurrentProgress(currentProgress + 1);
      } else {
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Burn call failed',
          content: 'Failed to burn tokens. Please try again.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
        dispatch(setLoader(false));
      }
    }
  };

  const approveButtonClick = async () => {
    setIsApproveLoading(true);
    dispatch(setLoader(true));
    const approveResult = await approveToken(tokenIn, fromBridge.name, firstTokenAmount);
    if (approveResult.success) {
      setApproveHash(approveResult.transactionHash);
      displayMessage({
        type: 'success',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Transaction approved',
        content: `${Number(firstTokenAmount).toFixed(3)} ${
          tokenIn.name
        } approved to bridge.`,
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      setIsApproveLoading(false);
      dispatch(setLoader(false));
      setIsApproved(true);
    } else {
      displayMessage({
        type: 'error',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Approval failed',
        content: 'Failed to approve transaction. Please try again.',
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      setIsApproveLoading(false);
      dispatch(setLoader(false));
      setIsApproved(false);
    }
  };

  return (
    <>
      <p className={styles.contentLabel}>{operation === 'BRIDGE' ? 'Locking' : 'Burning'}</p>
      <p className={styles.contentDes}>
        The Plenty bridge operates under a trusted federation model.{' '}
        {operation === 'BRIDGE' ? 'Lock' : 'Burn'} events on a {operation === 'BRIDGE' && 'non-'}
        Tezos chain are detected by a trusted set of off-chain signers. Each signer will sign, and
        publish the result on IPFS.
      </p>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      {operation === 'BRIDGE' && (
        <div className={`${styles.topInfo} my-2`}>
          Grant permission to allow the bridge to interact with the token you want to bridge.{' '}
        </div>
      )}
      <div className={styles.resultsHeader}>
        {operation === 'UNBRIDGE' && (
          <>
            <div style={{ width: '50%' }}></div>
            <div style={{ width: '50%' }}>
              <Button
                color={'primary'}
                className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
                onClick={bridgeButtonClick}
                loading={isButtonLoading}
              >
                Burn
              </Button>
            </div>
          </>
        )}
        {operation === 'BRIDGE' &&
          (!isApproved ? (
            <>
              <div style={{ width: '50%' }}>
                <Button
                  color={'primary'}
                  className={`xplenty-btn mt-2 flex align-items-center justify-content-center ${styles.progressButtons}`}
                  onClick={approveButtonClick}
                  loading={isApproveLoading}
                >
                  Approve
                </Button>
              </div>
              <div style={{ width: '50%' }}>
                <Button
                  color={'primary'}
                  className={`xplenty-btn mt-2 flex align-items-center justify-content-center ${styles.progressButtons}`}
                  style={{ cursor: 'not-allowed' }}
                  disabled={true}
                >
                  Lock
                </Button>
              </div>
            </>
          ) : (
            <>
              <div style={{ width: '50%' }}>
                <Button
                  color={'default'}
                  className={`xplenty-btn mt-2 flex align-items-center justify-content-center ${styles.progressButtons} ${styles.approvedButton}`}
                  style={{ cursor: 'not-allowed' }}
                  disabled={true}
                >
                  <div className="flex">
                    <span>Approve</span>
                    <span
                      className={`material-icons-round ${styles.checkMark}`}
                      style={{ display: 'inline-block', marginLeft: '10px', fontSize: '20px' }}
                    >
                      check_circle
                    </span>
                  </div>
                </Button>
              </div>
              <div style={{ width: '50%' }}>
                <Button
                  color={'primary'}
                  className={`xplenty-btn mt-2 flex align-items-center justify-content-center ${styles.progressButtons}`}
                  onClick={bridgeButtonClick}
                  loading={isButtonLoading}
                >
                  Lock
                </Button>
              </div>
            </>
          ))}
      </div>

      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.feeInfoWrapper}>
      </div>
    </>
  );
};

BridgeUnbridgeModal.propTypes = {
  currentProgress: PropTypes.any,
  operation: PropTypes.any,
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  tokenIn: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  walletAddress: PropTypes.any,
  setMintUnmintOpHash: PropTypes.any,
  displayMessage: PropTypes.any,
  setApproveHash: PropTypes.any,
  isApproveLoading: PropTypes.any,
  setIsApproveLoading: PropTypes.any,
  isApproved: PropTypes.any,
  setIsApproved: PropTypes.any,
  setTransactionTime: PropTypes.any,
};

export default BridgeUnbridgeModal;
