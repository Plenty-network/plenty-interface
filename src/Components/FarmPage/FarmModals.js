import InfoTableModal from "../Modals/InfoTableModal";
import { useDispatch, useSelector } from "react-redux";
import { openCloseFarmsModal } from "../../redux/actions/farms/farms.actions";
import { FARM_PAGE_MODAL } from "../../constants/farmsPage";
import { useCallback, useMemo } from "react";
import InfoModal from "../Ui/Modals/InfoModal";
import Loader from "../loader";

const FarmModals = () => {
  const modalData = useSelector(state => state.farms.modals);
  const dispatch = useDispatch()

  const withDrawalFee = useSelector(
    state => {
      if (modalData.contractAddress == null) {
        return []
      }

      return (
        state.farms.farmsToRender
          ?.find(x => x.farmData.CONTRACT === modalData.contractAddress)
          ?.withdrawalFeeStructure
      ) ?? []
    }
  )

  const roi = useSelector(
    state => {
      if (state.farms.isActiveOpen) {
        return state.farms?.active.data?.response?.[modalData.contractAddress]?.roiTable ?? [];
      }

      return state.farms?.inactive.data?.response?.[modalData.contractAddress]?.roiTable ?? [];
    }
  )

  const stakeOperations = useSelector(state => state.farms.stakeOperation)

  const getTableData = useCallback(() => {
    if (modalData.open === FARM_PAGE_MODAL.WITHDRAWAL) {
      return withDrawalFee
    }

    if (modalData.open === FARM_PAGE_MODAL.ROI) {
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

    return {}
  }, [stakeOperations])

  const onClose = () => {
    dispatch(openCloseFarmsModal({ open: FARM_PAGE_MODAL.NULL, contractAddress: null }))
  }

  return (
    <>
      <InfoTableModal
        type={modalData.open}
        open={modalData.open === FARM_PAGE_MODAL.ROI || modalData.open === FARM_PAGE_MODAL.WITHDRAWAL}
        onClose={onClose}
        tableData={getTableData()}
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
      {
        (modalData.snackbar || stakeOperations.processing) && (<Loader
          loading={stakeOperations.processing}
          loaderMessage={loaderMessage}
        />)
      }
    </>
  )
}

export default FarmModals
