import PropTypes from "prop-types";
import SimpleModal from "./SimpleModal";
import { useMemo, useState } from "react";
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
      parseFloat(props.stakeInputValues),
      props.stakeModalIdentifier,
      props.isActiveOpen,
      props.stakeModalFarmPosition
    )
  }

  const onMaxClick = () => {
    props.handleInput(parseFloat(props.walletBalances?.[props.stakeModalIdentifier] ?? 0))
  }

  const onModalClose = () => {
    setLoading(false);
    props.handleInput("");
    props.onClose();
  }

  const buttonText = useMemo(() => {
    if (!props.stakeInputValues) {
      return BUTTON_TEXT.ENTER_AMT;
    }

    if (props.stakeInputValues > props.walletBalances[props.stakeModalIdentifier]) {
      return BUTTON_TEXT.INSUFF_AMT;
    }

    return BUTTON_TEXT.STAKE;
  }, [props.stakeInputValues, props.stakeModalIdentifier, props.walletBalances])


  return (
    <SimpleModal
      open={props.open}
      onClose={onModalClose}
      title={`Stake ${props.stakeModalTitle} tokens`}
      className={styles.stakeModal}
    >
      <div className={clsx(styles.inputWrapper, "d-flex")}>
        <input value={props.stakeInputValues} onChange={(event) => props.handleInput(event.target.value)} placeholder={"0.0"} />

        <span className="mr-2 ml-2 mt-auto mb-auto">{props.stakeModalTitle}</span>

        <Button onClick={onMaxClick} size="small" color="secondary" className="rounded-pill">max</Button>
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
        disabled={buttonText !== BUTTON_TEXT.STAKE}
        loading={loading}
      >{buttonText}</Button>
    </SimpleModal>
  )
}

StakeModal.propTypes = {
  tokenData: PropTypes.any, // TODO add types
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default StakeModal;