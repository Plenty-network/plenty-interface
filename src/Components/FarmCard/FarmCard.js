import PropTypes from 'prop-types'
import Col from "react-bootstrap/Col";

import styles from "../../assets/scss/partials/_farms.module.scss"
import Image from "react-bootstrap/Image";
import clsx from "clsx";
import FarmCardBottom from "./FarmCardBottom";
import Button from "../Ui/Buttons/Button";

const FarmCard = (props) => {

  const apyCalculate = (apr) => {
    const apy = (
        (Math.pow(1 + apr / 100 / 365, 365) - 1) *
        100
    ).toFixed(0);
    return apy;
};

  return (
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
        <div className={clsx(styles.plentyCardContent, { "pb-0": props.harvested })}> {/* TODO add proper variable */}
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>APY:</p>
            <p className={styles.plentyCardContentTag}>{props.activeFarmData.isPresent === true ?  apyCalculate(props.activeFarmData.data.response[props.CONTRACT].APR.toFixed(2)) : 0}%</p>
          </div>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>APR:</p>
            <p className={styles.plentyCardContentTag}>{props.activeFarmData.isPresent === true ? props.activeFarmData.data.response[props.CONTRACT].APR.toFixed(0) : 0}%</p>
          </div>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>Rewards:</p>
            <p className={styles.plentyCardContentTag}>{props.activeFarmData.isPresent === true ? props.activeFarmData.data.response[props.CONTRACT].rewardRate * 2880 : 0}</p>
          </div>

          <div className={clsx(styles.plentyCardTvlInfo, "flex justify-between align-center mb-4")}>
            <p className={styles.plentyCardContentTag}>TVL:</p>
            <p className={styles.plentyCardContentTag}>${props.activeFarmData.isPresent === true ? props.activeFarmData.data.response[props.CONTRACT].totalLiquidty.toFixed(0) : 0}</p>
          </div>

          {
            props.walletAddress
              ? !props.harvested && <Button onClick={() => props.stakeOnFarm(1,props.identifier,true,props.position)} color={"primary"} className="w-100">Stake</Button>
              : <Button
                  onClick={props.connecthWallet}
                  color={"primary"}
                  className="w-100"
                  startIcon="add"
                >Connect Wallet</Button>
          }
        </div>
        {/* * Content */}

        <FarmCardBottom {...props} />
      </Card>
    </Col>
  )
}

FarmCard.propTypes = {
  image: PropTypes.number,
  multi: PropTypes.string,
  title: PropTypes.string,
  apr: PropTypes.number,
  apy: PropTypes.string,
  earn: PropTypes.string,
  fee: PropTypes.string,
  earned: PropTypes.number,
  deposit: PropTypes.string,
  liquidity: PropTypes.string,
  withdrawalFee: PropTypes.string,
  balance: PropTypes.number,
  userBalance: PropTypes.number,
  URL: PropTypes.string,
  active: PropTypes.bool,
  source: PropTypes.string,
  rewards: PropTypes.string,
  walletAddress: PropTypes.string,
}

export default FarmCard