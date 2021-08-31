import styles from '../../assets/scss/partials/_farms.module.scss';
import Image from 'react-bootstrap/Image';
import clsx from 'clsx';
import FarmCardBottom from './FarmCardBottom';
import Button from '../Ui/Buttons/Button';

import CalculatorSvg from '../../assets/images/icons/calculator.svg';
import { numberWithCommas } from '../../utils/formatNumbers';
import { useDispatch } from 'react-redux';
import { FARM_PAGE_MODAL, FARMS_CARD_DATA_PROPTYPES } from '../../constants/farmsPage';
import { openCloseFarmsModal } from "../../redux/slices/farms/farms.slice";


const FarmCard = (props) => {
  const dispatch = useDispatch();
  const { farmData, properties, values } = props.farmCardData

  const apyCalculate = (apr) =>
    ((Math.pow(1 + apr / 100 / 365, 365) - 1) * 100).toFixed(0);

  const getAPR = () => {
    try {
      const apr = values?.APR ?? 0;
      return numberWithCommas(Math.round(apr));

    } catch (e) {
      return 0;
    }
  };

  const getAPY = () => {
    const apy = apyCalculate(
      values?.APR ?? 0
    );

    return numberWithCommas(Math.round(apy));
  };

  const onStakeButtonClicked = (props) => {

    if(props.isActiveOpen === true)
    {
      props.openFarmsStakeModal(
        props.farmCardData.identifier,
        properties.title,
        farmData.CONTRACT,
        props.farmCardData.position
      )
    }
  }

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
      props.userStakes.hasOwnProperty(farmData.CONTRACT) &&
      props.userStakes[farmData.CONTRACT]?.stakedAmount > 0
    );
  };

  const onRoiClick = () => {
    dispatch(
      openCloseFarmsModal({
        open: FARM_PAGE_MODAL.ROI,
        contractAddress: farmData.CONTRACT,
        roiTable: values.roiTable
      })
    );
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
              <Image src={properties.image} fluid />
            </div>
            <div className="text-right">
              <p className={styles.title}>{properties.title}</p>
              <p
                className={clsx(
                  styles.titleBadge,
                  properties.source === 'Plenty LP'
                    ? styles.badgePlenty
                    : styles.badgeOther
                )}
              >
                {properties.source}
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
                    onStakeButtonClicked(props)
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
  farmCardData: FARMS_CARD_DATA_PROPTYPES
}

export default FarmCard;
