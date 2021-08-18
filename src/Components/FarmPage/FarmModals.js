import InfoTableModal from "../Modals/InfoTableModal";
import { useDispatch, useSelector } from "react-redux";
import { openCloseFarmsModal } from "../../redux/actions/farms/farms.actions";
import { FARM_PAGE_MODAL } from "../../constants/farmsPage";
import { useCallback } from "react";

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

      return state.farms?.inactive[modalData.contractAddress]?.roi ?? [];
    }
  )

  const getTableData = useCallback(() => {
    console.log({withDrawalFee, roi, modalData})
    if (modalData.open === FARM_PAGE_MODAL.WITHDRAWAL) {
      return withDrawalFee
    }

    if (modalData.open === FARM_PAGE_MODAL.ROI) {
      return roi
    }

    return []
  }, [modalData, withDrawalFee, roi])



  const onClose = () => {
    dispatch(openCloseFarmsModal({ open: FARM_PAGE_MODAL.NULL, contractAddress: null }))
  }

  return (
    <>
      {
        (modalData.open === FARM_PAGE_MODAL.ROI || modalData.open === FARM_PAGE_MODAL.WITHDRAWAL) &&
          <InfoTableModal
            type={modalData.open}
            open={!!modalData.open}
            onClose={onClose}
            tableData={getTableData()}
          />
      }
    </>
  )
}

export default FarmModals
