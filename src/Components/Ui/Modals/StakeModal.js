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
  const [stakeAmt, setStakeAmt] = useState()
  const [btnText, setBtnTxt] = useState(BUTTON_TEXT.ENTER_AMT)

  return (
    <SimpleModal
      open={props.open}
      onClose={props.onClose}
      title={`Stake ${props.tokenData.title} tokens`}
    >
      <div className="input-wrapper d-flex">
        <input value={stakeAmt} onChange={ev => setStakeAmt(ev.target.value)} />

        <span className="mr-2 ml-2">{props.tokenData.title}</span>

        <Button onClick={() => null} size="small" color="secondary">max</Button>
      </div>

      <div className="d-flex flex-row-reverse">
        <div className="mb-3 mr-3">
          <span>Balance: {5.1224 /* TODO add proper prop */}</span>
        </div>
      </div>

      <Button onClick={() => null} color="primary" className="w-100">{btnText}</Button>
    </SimpleModal>
  )
}

StakeModal.propTypes = {
  tokenData: PropTypes.any, // TODO add types
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default StakeModal;