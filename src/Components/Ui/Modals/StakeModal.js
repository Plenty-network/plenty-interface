import PropTypes from "prop-types";
import SimpleModal from "./SimpleModal";
import { useState } from "react";
import Button from "../Buttons/Button";

const BUTTON_TEXT = {
  ENTER_AMT: 'Enter an amount',
  STAKE: 'Confirm Stake',
  INSUFF_AMT: 'Insufficient balance'
}

const StakeModal = props => {
  console.log({'stakemodal' : props});
  return (
    <SimpleModal
      open={props.open}
      onClose={props.onClose}
      title={`Stake ${props.stakeModalTitle} tokens`}
    >
      <div className="input-wrapper d-flex">
        <input onChange={(event) => props.handleInput(parseFloat(event.target.value))} />

        <span className="mr-2 ml-2">{props.stakeModalTitle}</span>

        <Button onClick={() => null} size="small" color="secondary" className="rounded-pill">max</Button>
      </div>

      <div className="d-flex flex-row-reverse">
        <div className="mb-3 mr-3">
          <span>Balance: {0 /* TODO add proper prop */}</span>
        </div>
      </div>

      <Button onClick={() => props.stakeOnFarm(props.stakeInputValues,props.stakeModalIdentifier,props.isActiveOpen,props.stakeModalFarmPosition)} color="primary" className="w-100">{BUTTON_TEXT.STAKE}</Button>
    </SimpleModal>
  )
}

StakeModal.propTypes = {
  tokenData: PropTypes.any, // TODO add types
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default StakeModal;