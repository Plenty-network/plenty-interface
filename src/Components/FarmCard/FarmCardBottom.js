import { useState } from "react";
import Button from "../Ui/Buttons/Button";
import PropTypes from 'prop-types'


import styles from "../../assets/scss/partials/_farms.module.scss"
import clsx from "clsx";

const FarmCardBottom = (props) => {
  const [ isExpanded, toggleExpand ] = useState(false);


  return (
    <>
      {
        isExpanded && (
          <>
            <div className={clsx(styles.plentyCardContent, styles.topBorder, styles.bottomBorder)}>
              <div className="d-flex">
                <input />

                <Button onClick={() => null} color={"default"}>Harvest</Button>
              </div>

              <div><p>{ props.title }</p></div>

              <div className="d-flex">
                <input />

                <Button onClick={() => null} color={"default"}>Stake</Button>
              </div>
            </div>

            <div className={clsx(styles.plentyCardContent, styles.bottomBorder, "d-flex")}>
              <div className={clsx(styles.rightBorder, "w-50 text-center")}>
                <div>Deposit Fee</div>
                <div>0%</div>
              </div>

              <div className={"w-50 text-center"}>
                <div>Withdrawal Fee</div>
                <div>0%</div>
              </div>
            </div>

            <div className={styles.plentyCardContent}>
              <Button className="w-100" color={"default"} onClick={() => null}>
                View On Tezos
              </Button>
            </div>
          </>
        )
      }
      <div className="expand-more-btn-wrapper">
        <Button
          onClick={() => toggleExpand(!isExpanded)}
          isIconBtn={true}
          startIcon={isExpanded ? 'expand_less' : 'expand_more'}
          color={"mute"}
        />
      </div>
    </>
  )
};

FarmCardBottom.propTypes = {
  title: PropTypes.string.isRequired
}

export default FarmCardBottom;
