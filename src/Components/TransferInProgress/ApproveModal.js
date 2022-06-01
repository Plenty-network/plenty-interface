import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { approveToken } from '../../apis/bridge/bridgeAPI';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';

const ApproveModal = (props) => {

  const {
    description,
    gasFees,
    setBack,
    currentProgress,
    getTransactionListLength,
    operation,
    fromBridge,
    toBridge,
    tokenIn,
    tokenOut,
    firstTokenAmount,
    secondTokenAmount,
    setTransactionData,
    SetCurrentProgress,
    setSelectedId,
    setApproveHash,
    theme,
    displayMessage,
    resetToDefaultStates,
    isApproveLoading,
    setIsApproveLoading,
  } = props;


  const approveButtonClick = async () => {
    setIsApproveLoading(true);
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
      SetCurrentProgress(currentProgress + 1);
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
    }
  };

  return (
    <>
      <p className={styles.contentLabel}>Approve</p>
      <p className={styles.contentDes}>{description}</p>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={`${styles.topInfo} my-2`}>
        Grant permission to allow the bridge to interact with the token you want to bridge.  {' '}
      </div>
      <div className={styles.resultsHeader}>
        <div style={{ width: '50%' }}>
          <Button
            color={'default'}
            className={`mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={isApproveLoading ? null : () => {
              resetToDefaultStates();
              setBack(1);
            }}
          >
            Cancel
          </Button>
        </div>
        <div style={{ width: '50%' }}>
          <Button
            color={'primary'}
            className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={approveButtonClick}
            loading={isApproveLoading}
          >
            Approve
          </Button>
        </div>
      </div>

      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.feeInfoWrapper}>
      </div>
    </>
  );
};

ApproveModal.propTypes = {
  description: PropTypes.any,
  gasFees: PropTypes.any,
  setBack: PropTypes.any,
  currentProgress: PropTypes.any,
  getTransactionListLength: PropTypes.any,
  operation: PropTypes.any,
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  setTransactionData: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  setSelectedId: PropTypes.any,
  setApproveHash: PropTypes.any,
  theme: PropTypes.any,
  displayMessage: PropTypes.any,
  resetToDefaultStates: PropTypes.any,
  isApproveLoading: PropTypes.any,
  setIsApproveLoading: PropTypes.any,
};

export default ApproveModal;
