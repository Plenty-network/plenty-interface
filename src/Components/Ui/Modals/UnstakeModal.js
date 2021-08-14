import SimpleModal from "./SimpleModal";
import PropTypes from "prop-types";
import Button from "../Buttons/Button";

import styles from './modal.module.scss'
import clsx from "clsx";
import { useState } from "react";
import { Collapse } from "react-bootstrap";

// ! TEMP variable
const stakedTokens = Array(10)
  .fill(0)
  .map((_, i) => ({ name: `Stake ${i + 1}`, stake: (Math.random() * 10).toFixed(3) }))

const BUTTON_TEXT = {
  SELECT: 'Select stake',
  CONFIRM: 'Confirm unstake',
}

const UnstakeModal = props => {
  const [open, setOpen] = useState(false);
  const [buttonText, setButtonText] = useState(BUTTON_TEXT.CONFIRM)
  const [selected, setSelected] = useState([]);

  const onStakeSelect = (stake) => {
    if (selected.findIndex(x => x.name === stake.name) >= 0) {
      setSelected(selected.filter(x => x.name !== stake.name))
    } else {
      setSelected([ ...selected, stake ])
    }
  }

  const getTotalStakedAmt = () =>
    selected.reduce((acc, cur) => acc + Number(cur.stake), 0)

  return (
    <SimpleModal
      open={props.open}
      onClose={props.onClose}
      title={`Unstake ${props.tokenData.title} tokens`}
    >
      <div className={styles.unStakeModal}>

        <div className={styles.unstakeSelectWrapper}>
          <div
            className={clsx(
              styles.unstakeSelect,
              "d-flex justify-content-between",
              {[styles.active]: open})}
          >
            <span>Select stake</span>
            <Button
              className={(clsx(styles.collapseBtn, { [styles.active]: open }))}
              isIconBtn={true}
              color="secondary"
              startIcon="expand_more"
              onClick={() => setOpen(!open)}
            />
          </div>

          <Collapse in={open}>
            <div className={styles.collapsedContent}>
              {
                stakedTokens.map(x => (
                  <div key={x.name} className={styles.stakedItem} onClick={() => onStakeSelect(x)}>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <span>{x.name}</span>
                      <span>{x.stake}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="ml-2"
                      checked={selected.findIndex(y => y.name === x.name) >= 0}
                      onClick={ev => ev.preventDefault()}
                    />
                  </div>
                ))
              }
            </div>
          </Collapse>

        </div>

        <div className="d-flex justify-content-end mr-2 mb-2">
          <div>Total staked balance: {getTotalStakedAmt()}</div>
        </div>

        {
          selected.length > 0 && (
            <>
              <div className="mb-2">Fee Breakdown</div>

              <div className={styles.feeBreakdownWrapper}>
                <div className={clsx(styles.feeBreakdownTable, "pb-2")}>
                  {
                    selected.map(token => (
                      <div>
                        <div>{token.name}</div>
                        <div>4%</div>
                        <div>{token.stake}</div>
                      </div>
                    ))
                  }
                </div>
                <div className={clsx(styles.totalRow, "pt-2")}>
                  <div>Total</div>
                  <div />
                  <div>{getTotalStakedAmt()}</div>
                </div>
              </div>
            </>
          )
        }

        <Button onClick={() => null} color="primary" className="w-100 mt-4">{buttonText}</Button>
      </div>
    </SimpleModal>
  )
}


UnstakeModal.propTypes = {
  tokenData: PropTypes.any, // TODO add types
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default UnstakeModal;
