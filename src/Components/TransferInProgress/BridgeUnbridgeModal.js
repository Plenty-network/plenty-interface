/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';

import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import GasIcon from '../../assets/images/bridge/gas_fee_icon.svg';
import GasIconDark from '../../assets/images/bridge/gas_fee_icon_dark.svg';
import { useState } from 'react';
import { wrap, unwrap } from '../../apis/bridge/bridgeAPI';
import CONFIG from '../../config/config';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';

const BridgeUnbridgeModal = (props) => {
  const [isButtonLoading, SetIsButtonLoading] = useState(false);
  const {
    description,
    gasFees,
    currentProgress,
    // eslint-disable-next-line
    getTransactionListLength,
    operation,
    fromBridge,
    toBridge,
    tokenIn,
    // eslint-disable-next-line
    tokenOut,
    firstTokenAmount,
    // eslint-disable-next-line
    secondTokenAmount,
    // eslint-disable-next-line
    setTransactionData,
    // eslint-disable-next-line
    selectedId,
    SetCurrentProgress,
    walletAddress,
    setMintUnmintOpHash,
    // eslint-disable-next-line
    setSelectedId,
    approveHash,
    theme,
    displayMessage,
  } = props;

  const bridgeButtonClick = async () => {
    SetIsButtonLoading(true);
    if (operation === 'BRIDGE') {
      const bridgeUnbridgeResult = await wrap(
        tokenIn,
        fromBridge.name,
        firstTokenAmount,
        walletAddress,
      );
      console.log(operation + ' Results: ');
      console.log(bridgeUnbridgeResult);
      if (bridgeUnbridgeResult.success) {
        setMintUnmintOpHash(bridgeUnbridgeResult.transactionHash);
        displayMessage({
          type: 'success',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Lock call Successful',
          content: `${Number(firstTokenAmount).toFixed(3)} ${tokenIn.name} locked successfully.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
        SetCurrentProgress(currentProgress + 1);
      } else {
        console.log(bridgeUnbridgeResult.error);
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Lock Failed',
          content: 'Failed to lock tokens. Please try again.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
      }
    } else {
      const bridgeUnbridgeResult = await unwrap(toBridge.name, firstTokenAmount, tokenIn);
      console.log(operation + ' Results: ');
      console.log(bridgeUnbridgeResult);
      if (bridgeUnbridgeResult.success) {
        setMintUnmintOpHash(bridgeUnbridgeResult.txHash);
        displayMessage({
          type: 'success',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Unwrap Successful',
          content: `${Number(firstTokenAmount).toFixed(3)} ${tokenIn.name} unwrapped successfully.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
        SetCurrentProgress(currentProgress + 1);
      } else {
        console.log(bridgeUnbridgeResult.error);
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Unwrap Failed',
          content: 'Failed to unwrap tokens. Please try again.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        SetIsButtonLoading(false);
      }
    }

    /* dummyApiCall({ currentProgress: currentProgress }).then((res) => {
      if (operation === 'UNBRIDGE') {
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
      } else {
        setTransactionData((prevData) =>
          prevData.map((transaction) =>
            transaction.id === selectedId
              ? { ...transaction, currentProgress: res.currentProgress + 1 }
              : transaction,
          ),
        );
      }
      SetIsButtonLoading(false);
      SetCurrentProgress(res.currentProgress + 1);
    }); */
  };

  return (
    <>
      <p className={styles.contentLabel}>{operation === 'BRIDGE' ? 'Locking' : 'Unbridging'}</p>
      <p className={styles.contentDes}>{description}</p>
      {/* {operation === 'BRIDGE' && approveHash && (
        <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
          <a
            href={`${CONFIG.EXPLORER_LINKS[fromBridge.name]}${approveHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Block Explorer
          </a>
          <Link className="ml-2 mb-1" />
        </p>
      )} */}
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.resultsHeader}>
        <div className={`${styles.bottomInfo} ${styles.width}`}>
          Please approve in your wallet to proceed with the tranfer{' '}
        </div>
        <div className={styles.mainButtonWrapper}>
          <Button
            color={'primary'}
            className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={bridgeButtonClick}
            loading={isButtonLoading}
          >
            {operation === 'BRIDGE' ? 'Lock' : 'Unbridge'}
          </Button>
        </div>
      </div>
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.feeInfoWrapper}>
        {/* <img
          src={theme === 'light' ? GasIcon : GasIconDark}
          alt="GasIcon"
          style={{ height: '20px' }}
        ></img> */}
        <p className={styles.bottomInfo}>Review your gas fee in your wallet</p>
        {/* <p className={`${styles.bottomInfo} ${styles.feeValue}`}>~{Number(gasFees).toFixed(6)}</p> */}
      </div>
    </>
  );
};

BridgeUnbridgeModal.propTypes = {
  description: PropTypes.any,
  gasFees: PropTypes.any,
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
  selectedId: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  walletAddress: PropTypes.any,
  setMintUnmintOpHash: PropTypes.any,
  setSelectedId: PropTypes.any,
  approveHash: PropTypes.any,
  theme: PropTypes.any,
  displayMessage: PropTypes.any,
};

export default BridgeUnbridgeModal;
