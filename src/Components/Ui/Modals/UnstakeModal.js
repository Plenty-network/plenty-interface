import SimpleModal from "./SimpleModal";
import PropTypes from "prop-types";
import Button from "../Buttons/Button";

import styles from './modal.module.scss'
import clsx from "clsx";
import { useState , useEffect } from "react";
import { Collapse } from "react-bootstrap";

// ! TEMP variable
const BUTTON_TEXT = {
  SELECT: 'Select stake',
  CONFIRM: 'Confirm unstake',
}


const UnstakeModal = props => {

  

  console.log(props);
  const [open, setOpen] = useState(false);
  const [buttonText, setButtonText] = useState(BUTTON_TEXT.CONFIRM)
  const [selected, setSelected] = useState([]);
  const [withdrawalFee , setWithdrawalFee] = useState(0);
  const [withdrawDetails,setWithdrawDetails] = useState([]);

  useEffect(() => {
    console.log('by useEffecrt - >',selected);
  },[selected])
  const onStakeSelect = (obj,props) => {
    console.log(obj);
    if(!selected.includes(obj.mapId))
    {   
        // let updatedSelected = selected
        // updatedSelected.push(obj.mapId)
        // console.log(updatedSelected);
        setSelected([ ...selected, obj.mapId ])
        //setSelected(updatedSelected)

    }
    else
    {
      let index = selected.indexOf(obj.mapId);
      let updated = selected.splice(index);
      setSelected(updated);
    }
}

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
                props.userStakes[props.CONTRACT].singularStakes.map((x,index) => (
                  <div key={x.mapId} className={styles.stakedItem} onClick={() => onStakeSelect(x,props)}>
                    <div className="d-flex justify-content-between flex-grow-1">
                      <span>{'Stake ' + x.mapId}</span>
                      <span>{x.amount}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="ml-2"
                      checked={selected.includes(x.mapId)===true}
                      onClick={ev => ev.preventDefault()}
                    />
                  </div>
                ))
              }
            </div>
          </Collapse>

        </div>

        <div className="d-flex justify-content-end mr-2 mb-2">
          <div>Total staked balance: {props.userStakes[props.CONTRACT].stakedAmount}</div>
        </div>

        {
          selected.length > 0 && (
            <>
              <div className="mb-2">Fee Breakdown</div>

              <div className={styles.feeBreakdownWrapper}>
                <div className={clsx(styles.feeBreakdownTable, "pb-2")}>
                  {
                    withdrawDetails.map(token => (
                      <div>
                        <div>{props.tokenData.title}</div>
                        <div>{withdrawDetails.fee}</div>
                        <div>{withdrawDetails.selectedFee}</div>
                      </div>
                    ))
                  }
                </div>
                <div className={clsx(styles.totalRow, "pt-2")}>
                  <div>Total</div>
                  <div />
                  <div>{withdrawalFee}</div>
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