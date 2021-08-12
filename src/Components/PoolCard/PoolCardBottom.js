import { useState } from "react";
import Button from "../Ui/Buttons/Button";
import PropTypes from 'prop-types'


import styles from "../../assets/scss/partials/_farms.module.scss"
import clsx from "clsx";
import Input from "../Ui/Input/Input";
import QuantityButton from "../Ui/Buttons/QuantityButton";

const PoolCardBottom = (props) => {
  const [ isExpanded, toggleExpand ] = useState(false);

  const renderHarvest = () => (
    <div className="d-flex">
      <Input className="mr-2 w-100"/>

      <Button onClick={() => null} color={"default"}>Harvest</Button>
    </div>
  );


  return (
    <>

      <div className={clsx(
        styles.plentyCardContent,
        {
          "pt-0": !isExpanded,
          [styles.topBorder]: isExpanded,
          [styles.bottomBorder]: isExpanded
        }
      )}>

        {(props.harvested || isExpanded) && ( // TODO add proper variable
          <div className="d-flex">
            <Input className="mr-2 w-100"/>

            <Button onClick={() => null} color={props.harvested ? "primary" : "default"}> {/* TODO add proper variable */}
              Harvest
            </Button>
          </div>
        )}

        {isExpanded && (
          <>
            <div className="mt-3 mb-2">{props.title}</div>

            <div className="d-flex">
              <Input className="mr-2 w-100"/>
              {
                props.staked // TODO add proper variable
                  ? <QuantityButton onAdd={() => null} onRemove={() => null}/>
                  : <Button onClick={() => null} color={"default"}>Stake</Button>
              }
            </div>
          </>
        )}

      </div>

      {
        isExpanded && (
          <>

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
      <div className="d-flex justify-content-center">
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

PoolCardBottom.propTypes = {
  title: PropTypes.string.isRequired
}

export default PoolCardBottom;
