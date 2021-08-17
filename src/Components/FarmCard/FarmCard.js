import Col from "react-bootstrap/Col";
import styles from "../../assets/scss/partials/_farms.module.scss"
import Image from "react-bootstrap/Image";
import clsx from "clsx";
import FarmCardBottom from "./FarmCardBottom";
import Button from "../Ui/Buttons/Button";

import CalculatorSvg from '../../assets/images/icons/calculator.svg';
import { numberWithCommas } from "../../utils/formatNumbers";

const FarmCard = (props) => {
  console.log({props});
  const apyCalculate = (apr) => (
      (Math.pow(1 + apr / 100 / 365, 365) - 1) *
      100
    ).toFixed(0);


const getAPR = (props) => {
  try {
    if(props.isActiveOpen === true)
    {
      if(props.activeFarmData.isPresent == true)
      {
        return props.activeFarmData.data.response[props.CONTRACT]?.APR.toFixed(2) ?? 0;
      }
      else
      {
        return 0;
      }
    }
    else
    {
      return 0;
    }
  }
  catch(e)
  {
    return 0;
  }
}

const getAPY = (props) => {
  
  if(props.isActiveOpen === true)
  {
    if(props.activeFarmData.isPresent == true)
    {
      return apyCalculate(props.activeFarmData.data.response[props.CONTRACT]?.APR.toFixed(2) ?? 0);
    }
    else
    {
      return 0;
    }
  }
  else
  {
    return 0;
  }
}

const getReward = () => {
  if(props.isActiveOpen === true)
  {
    if(props.activeFarmData.isPresent == true)
    {
      return (props.activeFarmData.data.response[props.CONTRACT]?.rewardRate ?? 0) * 2880;
    }
    else
    {
      return 0;
    }
  }
  else
  {
    return 0;
  }
}

const getTotalLiquidity = () => {
  if (props.isActiveOpen === true) {
    if (props.activeFarmData.isPresent === true) {
      return numberWithCommas(props.activeFarmData.data.response[props.CONTRACT]?.totalLiquidty.toFixed(0) ?? 0);
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
}

  const hasStakedAmount = () => {
    return props.userStakes.hasOwnProperty(props.CONTRACT) && props.userStakes[props.CONTRACT]?.stakedAmount > 0;
  }
  return (
    <>
    <Col sm={12} md={4}>
      <div className={styles.plentyCard}>

        {/* * Header */}
        <div className={clsx(styles.plentyCardHeader, "flex justify-between align-center p-26 pb-20")}>
          <div className={styles.imageWrapper}>
            <Image src={props.image} fluid />
          </div>
          <div className="text-right">
            <p className={styles.title}>{props.title}</p>
            <p
              className={clsx(
                styles.titleBadge,
                props.source === 'Plenty' ? styles.badgePlenty : styles.badgeOther
              )}
            >
              {props.source}
            </p>
          </div>
        </div>
        {/* * Header */}

        {/* * Content */}
        <div className={clsx(styles.plentyCardContent, "pb-0")}>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>APY:</p>
            <p className={styles.plentyCardContentTag}>
              {
                getAPY(props)
                
              }%
            </p>
          </div>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>APR:</p>
            <p className={styles.plentyCardContentTag}>

              <img
                src={CalculatorSvg}
                alt={'Check ROI'}
                className={styles.roiInfoImg}
                onClick={() => null}
              />
              {
                getAPR(props)
              }%
            </p>
          </div>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>Rewards:</p>
            <p className={styles.plentyCardContentTag}>
              {getReward()} PLENTY / DAY
            </p>
          </div>

          <div className={clsx(styles.plentyCardTvlInfo, "flex justify-between align-center mb-4")}>
            <p className={styles.plentyCardContentTag}>TVL:</p>
            <p className={styles.plentyCardContentTag}>
              ${
                getTotalLiquidity()
              }
            </p>
          </div>

          {
            props.userAddress
              ? !hasStakedAmount() ? (
                <Button
                  onClick={() => props.openFarmsStakeModal(props.identifier,props.title,props.position,props.CONTRACT)}
                  color={"primary"}
                  className="w-100"
                >Stake</Button>
              ) : null
              : <Button
                  onClick={props.connectWallet}
                  color={"primary"}
                  className="w-100"
                  startIcon="add"
                >Connect Wallet</Button>
          }
        </div>
        {/* * Content */}

        <FarmCardBottom {...props} />
      </div>
    </Col>
    {/* <StakeModal open={props.isStakeModalOpen} onClose={() => props.closeFarmsStakeModal()} tokenData={{title: props.title}} /> */}
    </>

  )
}


export default FarmCard