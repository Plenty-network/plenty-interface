/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as FeeIcon } from '../../assets/images/bridge/fee_icon.svg';
import GasIcon from '../../assets/images/bridge/gas_fee_icon.svg';
import GasIconDark from '../../assets/images/bridge/gas_fee_icon_dark.svg';
import dummyApiCall from '../../apis/dummyApiCall';
import { useState } from 'react';
import { approveToken } from '../../apis/bridge/bridgeAPI';

//import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';

const ApproveModal = (props) => {
  const [isButtonLoading, SetIsButtonLoading] = useState(false);

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
  } = props;

  const approveButtonClick = async () => {
    SetIsButtonLoading(true);
    const approveResult = await approveToken(tokenIn, fromBridge.name, firstTokenAmount);
    console.log('Approve Results: ');
    console.log(approveResult);
    if (approveResult.success) {
      setApproveHash(approveResult.transactionHash);
      SetIsButtonLoading(false);
      SetCurrentProgress(currentProgress + 1);
    } else {
      console.log(approveResult.error);
      SetIsButtonLoading(false);
    }
    /* dummyApiCall({ currentProgress: currentProgress }).then((res) => {
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
        fee: gasFees,
        date: newDate,
        time: newTime,
      };
      setTransactionData((prevData) => [...prevData, newData]);
      SetIsButtonLoading(false);
      SetCurrentProgress(res.currentProgress + 1);
    }); */
  };

  return (
    <>
      <p className={styles.contentLabel}>Approving</p>
      <p className={styles.contentDes}>{description}</p>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={`${styles.topInfo} my-2`}>
        Please approve in your wallet to proceed with the tranfer{' '}
      </div>
      <div className={styles.resultsHeader}>
        <div style={{ width: '50%' }}>
          <Button
            color={'default'}
            className={`mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={() => setBack(1)}
          >
            Cancel
          </Button>
        </div>
        <div style={{ width: '50%' }}>
          <Button
            color={'primary'}
            className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={approveButtonClick}
            loading={isButtonLoading}
          >
            Approve
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
        <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~{gasFees}</p>
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
};

export default ApproveModal;
