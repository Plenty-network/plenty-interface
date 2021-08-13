import { useState } from "react";
import Button from "../Ui/Buttons/Button";
import PropTypes from 'prop-types'


import styles from "../../assets/scss/partials/_farms.module.scss"
import clsx from "clsx";
import Input from "../Ui/Input/Input";
import QuantityButton from "../Ui/Buttons/QuantityButton";
import StakeModal from "../Ui/Modals/StakeModal";
const FarmCardBottom = (props) => {
  const [ isExpanded, toggleExpand ] = useState(false);
  console.log({props});
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

        {((props.userStakes.hasOwnProperty(props.CONTRACT) && props.userStakes[props.CONTRACT].stakedAmount >0)|| isExpanded) && ( // TODO add proper variable
          <div className="d-flex">
            <div className={clsx(styles.harvestStakeAmt, "mr-2")}>
              <span>{( props.userAddress !== null && props.harvestValueOnFarms[props.isActiveOpen].hasOwnProperty(props.CONTRACT) && props.harvestValueOnFarms[props.isActiveOpen][props.CONTRACT].totalRewards > 0) ? props.harvestValueOnFarms[props.isActiveOpen][props.CONTRACT].totalRewards.toFixed(6) : 0}</span>
            </div>

            <Button
              onClick={() => {
                props.harvestOnFarm(
                  props.identifier,
                  props.isActiveOpen,
                  props.position
                )
              }}
              color={props.harvested ? "primary" : "default"}
            >
              Harvest
            </Button>
          </div>
        )}

        {isExpanded && (
          <>
            <div className="mt-3 mb-2">{props.title}</div>

            <div className="d-flex">

              <div className={clsx(styles.harvestStakeAmt, "mr-2")}>
                <span>{props.userStakes.hasOwnProperty(props.CONTRACT) ? props.userStakes[props.CONTRACT].stakedAmount : 0}</span>
              </div>
              {/*<Input*/}
              {/*  onChange={(event) => {*/}
              {/*    props.handleStakeOfFarmInputValue(props.CONTRACT , parseFloat(event.target.value))*/}
              {/*  }}*/}
              {/*  className="mr-2 w-100"*/}
              {/*/>*/}
              {
                 (props.userStakes.hasOwnProperty(props.CONTRACT) && props.userStakes[props.CONTRACT].stakedAmount > 0 ) // TODO add proper variable
                  ? <QuantityButton onAdd={() => props.openFarmsStakeModal()} onRemove={() => null}/> 
                  : <Button onClick={() => props.stakeOnFarm(props.stakeInputValues[props.CONTRACT],props.identifier,true,props.position) } color={"default"}>Stake</Button>
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
      <StakeModal open={props.isStakeModalOpen} onClose={() => props.closeFarmsStakeModal()} tokenData={{title: props.title}} handleInput = {props.handleStakeOfFarmInputValue} CONTRACT = {props.CONTRACT} stakeInputValues={props.stakeInputValues} stakeOnFarm={props.stakeOnFarm} identifier={props.identifier} position={props.position}/>
    </>
  )
};

FarmCardBottom.propTypes = {
  title: PropTypes.string.isRequired
}

export default FarmCardBottom;
