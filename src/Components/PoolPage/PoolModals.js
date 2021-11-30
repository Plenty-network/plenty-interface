import InfoTableModal from '../Modals/InfoTableModal';
import { useDispatch, useSelector } from 'react-redux';
import { openClosePoolsModal } from '../../redux/actions/pools/pools.actions';
import { POOL_PAGE_MODAL } from '../../constants/poolsPage';
import React, { useCallback, useMemo } from 'react';
import InfoModal from '../Ui/Modals/InfoModal';
import Loader from '../loader';

const PoolModals = () => {
  const modalData = useSelector((state) => state.pools.modals);
  const dispatch = useDispatch();

  const withDrawalFee = useSelector((state) => {
    if (modalData.contractAddress == null) {
      return [];
    }

    return (
      state.pools.poolsToRender?.find((x) => x.poolData.CONTRACT === modalData.contractAddress)
        ?.withdrawalFeeStructure ?? []
    );
  });

  const roi = useSelector((state) => {
    if (state.pools.isActiveOpen) {
      return state.pools?.active.data?.response?.[modalData.contractAddress]?.roiTable ?? [];
    }

    return state.pools?.inactive.data?.response?.[modalData.contractAddress]?.roiTable ?? [];
  });

  const stakeOperations = useSelector((state) => state.pools.stakeOperation);
  const unstakeOperations = useSelector((state) => state.pools.unstakeOperation);

  const getTableData = useCallback(() => {
    if (modalData.open === POOL_PAGE_MODAL.WITHDRAWAL) {
      return withDrawalFee;
    }

    if (modalData.open === POOL_PAGE_MODAL.ROI) {
      return roi;
    }

    return [];
  }, [modalData, withDrawalFee, roi]);

  const loaderMessage = useMemo(() => {
    if (stakeOperations.completed || stakeOperations.failed) {
      return {
        message: stakeOperations.completed ? 'Transaction confirmed' : 'Transaction failed',
        type: stakeOperations.completed ? 'success' : 'error',
      };
    }

    if (unstakeOperations.completed || unstakeOperations.failed) {
      return {
        message: unstakeOperations.completed ? 'Transaction confirmed' : 'Transaction failed',
        type: unstakeOperations.completed ? 'success' : 'error',
      };
    }

    return {};
  }, [stakeOperations, unstakeOperations]);

  const showSnackbar = useMemo(() => {
    return modalData.snackbar || stakeOperations.processing || unstakeOperations.processing;
  }, [modalData.snackbar, stakeOperations.processing, unstakeOperations.processing]);

  const onClose = () => {
    dispatch(openClosePoolsModal({ open: POOL_PAGE_MODAL.NULL, contractAddress: null }));
  };

  return (
    <>
      <InfoTableModal
        type={modalData.open}
        open={
          modalData.open === POOL_PAGE_MODAL.ROI || modalData.open === POOL_PAGE_MODAL.WITHDRAWAL
        }
        onClose={onClose}
        tableData={getTableData()}
      />
      <InfoModal
        open={modalData.open === POOL_PAGE_MODAL.TRANSACTION_SUCCESS}
        onClose={onClose}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          !modalData.transactionId
            ? undefined
            : () => window.open(`https://tzkt.io/${modalData.transactionId}`, '_blank')
        }
      />
      {showSnackbar && (
        <Loader
          loading={stakeOperations.processing || unstakeOperations.processing}
          loaderMessage={loaderMessage}
        />
      )}
    </>
  );
};

export default PoolModals;
