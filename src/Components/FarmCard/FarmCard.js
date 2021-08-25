import styles from '../../assets/scss/partials/_farms.module.scss';
import Image from 'react-bootstrap/Image';
import clsx from 'clsx';
import PropTypes from "prop-types";
import FarmCardBottom from './FarmCardBottom';
import Button from '../Ui/Buttons/Button';

import CalculatorSvg from '../../assets/images/icons/calculator.svg';
import { numberWithCommas } from '../../utils/formatNumbers';
import { useDispatch } from 'react-redux';
import { FARM_PAGE_MODAL } from '../../constants/farmsPage';


const FarmCard = (props) => {
  const dispatch = useDispatch();
  const { properities, values } = props.farmCardData

  const apyCalculate = (apr) =>
    ((Math.pow(1 + apr / 100 / 365, 365) - 1) * 100).toFixed(0);

  const getAPR = (props) => {
    try {
      const apr = values?.APR ?? 0;
      return numberWithCommas(Math.round(apr));

    } catch (e) {
      return 0;
    }
  };

  const getAPY = (props) => {
    const apy = apyCalculate(
      values?.APR ?? 0
    );

    return numberWithCommas(Math.round(apy));
  };

  const getReward = () => {

    return (values?.rewardRate ?? 0) * 2880

  };

  const getTotalLiquidity = () => {

    return numberWithCommas(
      values?.totalLiquidty?.toFixed(0) ?? 0,
      {plain: true}
    );

  }


  const hasStakedAmount = () => {
    return (
      props.userStakes.hasOwnProperty(props.CONTRACT) &&
      props.userStakes[props.CONTRACT]?.stakedAmount > 0
    );
  };

  const onRoiClick = () => {
    // dispatch(
    //   openCloseFarmsModal({
    //     open: FARM_PAGE_MODAL.ROI,
    //     contractAddress: props.CONTRACT,
    //   })
    // );
  };

  return (
    <>
      <div>
        <div className={styles.plentyCard}>
          {/* * Header */}
          {props.message && (
            <div className="pool-card-top-banner">
              <p className="pool-card-top-banner-text">{props.message}</p>
            </div>
          )}
          <div
            className={clsx(
              styles.plentyCardHeader,
              'flex justify-between align-center p-26 pb-20'
            )}
          >
            <div className={styles.imageWrapper}>
              <Image src={properities.image} fluid />
            </div>
            <div className="text-right">
              <p className={styles.title}>{properities.title}</p>
              <p
                className={clsx(
                  styles.titleBadge,
                  properities.source === 'Plenty LP'
                    ? styles.badgePlenty
                    : styles.badgeOther
                )}
              >
                {properities.source}
              </p>
            </div>
          </div>
          {/* * Header */}

          {/* * Content */}
          <div className={clsx(styles.plentyCardContent, 'pb-0')}>
            <div
              className={clsx(
                styles.plentyCardContentInfo,
                'flex justify-between'
              )}
            >
              <p className={styles.plentyCardContentTag}>APY:</p>
              <p className={styles.plentyCardContentTag}>{getAPY(props)}%</p>
            </div>
            <div
              className={clsx(
                styles.plentyCardContentInfo,
                'flex justify-between'
              )}
            >
              <p className={styles.plentyCardContentTag}>APR:</p>
              <p className={styles.plentyCardContentTag}>
                <img
                  src={CalculatorSvg}
                  alt={'Check ROI'}
                  className={styles.roiInfoImg}
                  onClick={onRoiClick}
                />
                {getAPR(props)}%
              </p>
            </div>
            <div
              className={clsx(
                styles.plentyCardContentInfo,
                'flex justify-between'
              )}
            >
              <p className={styles.plentyCardContentTag}>Rewards:</p>
              <p className={styles.plentyCardContentTag}>
                {getReward()} PLENTY / DAY
              </p>
            </div>

            <div
              className={clsx(
                styles.plentyCardTvlInfo,
                'flex justify-between align-center mb-4'
              )}
            >
              <p className={styles.plentyCardContentTag}>TVL:</p>
              <p className={styles.plentyCardContentTag}>
                ${getTotalLiquidity()}
              </p>
            </div>

            {props.userAddress ? (
              !hasStakedAmount() ? (
                <Button
                  onClick={() =>
                    props.openFarmsStakeModal(
                      props.identifier,
                      props.title,
                      props.position,
                      props.CONTRACT
                    )
                  }
                  color={'primary'}
                  className="w-100"
                >
                  Stake
                </Button>
              ) : null
            ) : (
              <Button
                onClick={props.connectWallet}
                color={'primary'}
                className="w-100"
                startIcon="add"
              >
                Connect Wallet
              </Button>
            )}
          </div>
          {/* * Content */}

          <FarmCardBottom {...props} />
        </div>
      </div>
      {/* <StakeModal open={props.isStakeModalOpen} onClose={() => props.closeFarmsStakeModal()} tokenData={{title: props.title}} /> */}
    </>
  );
};

FarmCard.propTypes = {
  farmCardData: PropTypes.shape({
    farmData: PropTypes.shape({
      LP_TOKEN: PropTypes.string,
      CONTRACT: PropTypes.string,
      DEX: PropTypes.string,
      TOKEN_ADDRESS: PropTypes.string,
      CARD_TYPE: PropTypes.string,
      TOKEN_DECIMAL: 6,
      TYPE: PropTypes.string,
      LP_DECIMAL: 18,
      TEMP_ADDRESS: PropTypes.string,
      DECIMAL: 18,
      withdrawalFeeType: PropTypes.string, // TODO add withdrawal Fee Data
    }).isRequired,
    properities: PropTypes.shape({
      image: PropTypes.string,
      harvestImg: PropTypes.string,
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
    }).isRequired,
    identifier: PropTypes.string.isRequired,
    values: PropTypes.shape({
      identifier: PropTypes.string,
      APR: PropTypes.number,
      totalLiquidty: PropTypes.number,
      roiTable: PropTypes.arrayOf(
        PropTypes.shape({
          roi: PropTypes.number,
          PlentyPer1000dollar: PropTypes.number,
        })
      ),
      totalSupply: PropTypes.number,
      rewardRate: PropTypes.number,
    })
  })
}

export default FarmCard;
