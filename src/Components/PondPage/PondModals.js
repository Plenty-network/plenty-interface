import InfoTableModal from "../Modals/InfoTableModal";
import { useDispatch, useSelector } from "react-redux";


import { useCallback, useMemo } from "react";
import InfoModal from "../Ui/Modals/InfoModal";
import Loader from "../loader";
import { POND_PAGE_MODAL } from "../../constants/pondsPage";
import { openClosePondsModal } from "../../redux/actions/ponds/ponds.action";

const PondModals = () => {
  const modalData = useSelector(state => state.ponds.modals);
  const dispatch = useDispatch()

  const withDrawalFee = useSelector(
    state => {
      if (modalData.contractAddress == null) {
        return []
      }

      return (
        state.ponds.pondsToRender
          ?.find(x => x.pondData.CONTRACT === modalData.contractAddress)
          ?.withdrawalFeeStructure
      ) ?? []
    }
  )

  const roi = useSelector(
    state => {
      if (state.ponds.isActiveOpen) {
        return state.ponds?.active.data?.response?.[modalData.contractAddress]?.roiTable ?? [];
      }

      return state.ponds?.inactive.data?.response?.[modalData.contractAddress]?.roiTable ?? [];
    }
  )

  const stakeOperations = useSelector(state => state.ponds.stakeOperation)
  const unstakeOperations = useSelector(state => state.ponds.unstakeOperation)

  const getTableData = useCallback(() => {
    if (modalData.open === POND_PAGE_MODAL.WITHDRAWAL) {
      return withDrawalFee
    }

    if (modalData.open === POND_PAGE_MODAL.ROI) {
      return roi
    }

    return []
  }, [modalData, withDrawalFee, roi])

  const loaderMessage = useMemo(() => {
    if (stakeOperations.completed || stakeOperations.failed) {
      return {
        message: stakeOperations.completed
          ? 'Transaction confirmed'
          : 'Transaction failed',
        type: stakeOperations.completed ? 'success' : 'error'
      }
    }

    if (unstakeOperations.completed || unstakeOperations.failed) {
      return {
        message: unstakeOperations.completed
          ? 'Transaction confirmed'
          : 'Transaction failed',
        type: unstakeOperations.completed ? 'success' : 'error'
      }
    }

    return {}
  }, [stakeOperations, unstakeOperations])

  const showSnackbar = useMemo(() => {
    return modalData.snackbar || stakeOperations.processing || unstakeOperations.processing
  }, [modalData.snackbar, stakeOperations.processing, unstakeOperations.processing])

  const onClose = () => {
    dispatch(openClosePondsModal({ open: POND_PAGE_MODAL.NULL, contractAddress: null }))
  }

  return (
    <>
      <InfoTableModal
        type={modalData.open}
        open={modalData.open === POND_PAGE_MODAL.ROI || modalData.open === POND_PAGE_MODAL.WITHDRAWAL}
        onClose={onClose}
        tableData={getTableData()}
      />
      <InfoModal
        open={modalData.open === POND_PAGE_MODAL.TRANSACTION_SUCCESS}
        onClose={onClose}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          !modalData.transactionId
            ? undefined
            : () => window.open(`https://tzkt.io/${modalData.transactionId}`, '_blank')
        }
      />
      {
        showSnackbar && (
          <Loader
            loading={stakeOperations.processing || unstakeOperations.processing}
            loaderMessage={loaderMessage}
          />
        )
      }
    </>
  )
}

export default PondModals
