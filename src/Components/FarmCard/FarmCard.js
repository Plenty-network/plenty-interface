import PropTypes from 'prop-types'
import Col from "react-bootstrap/Col";

import styles from "../../assets/scss/partials/_farms.module.scss"
import Image from "react-bootstrap/Image";
import clsx from "clsx";
import FarmCardBottom from "./FarmCardBottom";
import Button from "../Ui/Buttons/Button";

const FarmCard = (props) => {

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
            <p className={styles.plentyCardContentTag}>{props.apy}%</p>
          </div>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>APR:</p>
            <p className={styles.plentyCardContentTag}>{props.apr}%</p>
          </div>
          <div className={clsx(styles.plentyCardContentInfo, "flex justify-between")}>
            <p className={styles.plentyCardContentTag}>Rewards:</p>
            <p className={styles.plentyCardContentTag}>{props.rewards}</p>
          </div>

          <div className={clsx(styles.plentyCardTvlInfo, "flex justify-between align-center mb-4")}>
            <p className={styles.plentyCardContentTag}>TVL:</p>
            <p className={styles.plentyCardContentTag}>${props.liquidity}</p>
          </div>

          {
            props.walletAddress
              ? !props.harvested && <Button onClick={() => null} color={"primary"} className="w-100">Stake</Button>
              : <Button
                  onClick={props.connecthWallet}
                  color={"primary"}
                  className="w-100"
                  startIcon="add"
                >Connect Wallet</Button>
          }
        </div>
        {/* * Content */}

        <FarmCardBottom title={props.title} />
      </div>
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