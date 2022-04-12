import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import Button from '../Ui/Buttons/Button';

import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import GasIcon from '../../assets/images/bridge/gas_fee_icon.svg';
import GasIconDark from '../../assets/images/bridge/gas_fee_icon_dark.svg';
import { useState } from 'react';
import { wrap, unwrap } from '../../apis/bridge/bridgeAPI';
import CONFIG from '../../config/config';

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
        SetIsButtonLoading(false);
        SetCurrentProgress(currentProgress + 1);
      } else {
        console.log(bridgeUnbridgeResult.error);
        SetIsButtonLoading(false);
      }
    } else {
      const bridgeUnbridgeResult = await unwrap(toBridge.name, firstTokenAmount, tokenIn);
      console.log(operation + ' Results: ');
      console.log(bridgeUnbridgeResult);
      if (bridgeUnbridgeResult.success) {
        setMintUnmintOpHash(bridgeUnbridgeResult.txHash);
        SetIsButtonLoading(false);
        SetCurrentProgress(currentProgress + 1);
      } else {
        console.log(bridgeUnbridgeResult.error);
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
      <p className={styles.contentLabel}>Approving</p>
      <p className={styles.contentDes}>{description}</p>
      {operation === 'BRIDGE' && (
        <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
          <a
            href={`${CONFIG.BRIDGES_INDEXER_LINKS[fromBridge.name]}${approveHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on Block Explorer
          </a>
          <Link className="ml-2 mb-1" />
        </p>
      )}
      <div className={`mt-4 mb-3 ${styles.lineBottom} `}></div>
      <div className={styles.resultsHeader}>
        <div className={`${styles.bottomInfo} ${styles.width}`}>
          Please approve in your wallet to proceed with the tranfer{' '}
        </div>
        <div style={{ width: '50%' }}>
          <Button
            color={'primary'}
            className={`xplenty-btn mt-2  flex align-items-center justify-content-center ${styles.progressButtons}`}
            onClick={bridgeButtonClick}
            loading={isButtonLoading}
          >
            {operation === 'BRIDGE' ? 'Bridge' : 'Unbridge'}
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
};

export default BridgeUnbridgeModal;
