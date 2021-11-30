import InfoTableModal from '../Modals/InfoTableModal';
import { useDispatch, useSelector } from 'react-redux';
import { FARM_PAGE_MODAL } from '../../constants/farmsPage';
import React, { useMemo } from 'react';
import InfoModal from '../Ui/Modals/InfoModal';
import Loader from '../loader';
import { openCloseFarmsModal } from '../../redux/slices/farms/farms.slice';

const FarmModals = () => {
  const modalData = useSelector((state) => state.farms.modals);
  const dispatch = useDispatch();

  const stakeOperations = useSelector((state) => state.farms.stakeOperation);
  const unstakeOperations = useSelector((state) => state.farms.unstakeOperation);

  const tableData = useMemo(() => {
    if (modalData.open === FARM_PAGE_MODAL.WITHDRAWAL) {
      return modalData.withdrawalFeeType;
    }

    if (modalData.open === FARM_PAGE_MODAL.ROI) {
      return modalData.roiTable;
    }

    return [];
  }, [modalData.open, modalData.roiTable, modalData.withdrawalFeeType]);

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
    dispatch(
      openCloseFarmsModal({
        open: FARM_PAGE_MODAL.NULL,
        contractAddress: null,
        withdrawalFeeType: [],
        roiTable: [],
      }),
    );
  };

  return (
    <>
      <InfoTableModal
        type={modalData.open}
        open={
          modalData.open === FARM_PAGE_MODAL.ROI || modalData.open === FARM_PAGE_MODAL.WITHDRAWAL
        }
        onClose={onClose}
        tableData={tableData}
        secondToken={modalData.secondToken}
        contractAddress={modalData.contractAddress}
      />
      <InfoModal
        open={modalData.open === FARM_PAGE_MODAL.TRANSACTION_SUCCESS}
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

export default FarmModals;
