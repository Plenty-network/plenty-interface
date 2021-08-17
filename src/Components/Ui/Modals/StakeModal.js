import PropTypes from "prop-types";
import SimpleModal from "./SimpleModal";
import { useState } from "react";
import Button from "../Buttons/Button";

import styles from "./modal.module.scss";
import clsx from "clsx";

const BUTTON_TEXT = {
  ENTER_AMT: 'Enter an amount',
  STAKE: 'Confirm Stake',
  INSUFF_AMT: 'Insufficient balance'
}

const StakeModal = props => {
  const [loading, setLoading] = useState(false);

  const onStake = () => {
    setLoading(true)
    props.stakeOnFarm(
      props.stakeInputValues,
      props.stakeModalIdentifier,
      props.isActiveOpen,
      props.stakeModalFarmPosition
    )
  }


  return (
    <SimpleModal
      open={props.open}
      onClose={props.onClose}
      title={`Stake ${props.stakeModalTitle} tokens`}
      className={styles.stakeModal}
    >
      <div className={clsx(styles.inputWrapper, "d-flex")}>
        <input onChange={(event) => props.handleInput(parseFloat(event.target.value))} placeholder={"0.0"} />

        <span className="mr-2 ml-2 mt-auto mb-auto">{props.stakeModalTitle}</span>

        <Button onClick={() => null} size="small" color="secondary" className="rounded-pill">max</Button>
      </div>

      <div className="d-flex flex-row-reverse">
        <div className="mb-3 mr-3">
          <span>Balance: {props.walletBalances[props.stakeModalIdentifier]}</span>
        </div>
      </div>

      <Button
        onClick={onStake}
        color="primary"
        className="w-100"
        loading={loading}
      >{BUTTON_TEXT.STAKE}</Button>
    </SimpleModal>
  )
}

StakeModal.propTypes = {
  tokenData: PropTypes.any, // TODO add types
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default StakeModal;