import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/scss/partials/_farms.module.scss';
import Image from 'react-bootstrap/Image';
import clsx from 'clsx';
import FarmCardBottom from './FarmCardBottom';
import Button from '../Ui/Buttons/Button';

import CalculatorSvg from '../../assets/images/icons/calculator.svg';
import CalculatorSvgLight from '../../assets/images/icons/calculator-light.svg';
import { numberWithCommas } from '../../utils/formatNumbers';
import { useDispatch } from 'react-redux';
import { FARM_PAGE_MODAL } from '../../constants/farmsPage';
import { openCloseFarmsModal } from '../../redux/slices/farms/farms.slice';

const FarmCard = (props) => {
  const dispatch = useDispatch();
  const { farmData, properties, values } = props.farmCardData;

  const apyCalculate = (apr) => ((Math.pow(1 + apr / 100 / 365, 365) - 1) * 100).toFixed(0);
  const tokens = useMemo(() => {
    return props.farmCardData.identifier.split(' - ');
  }, [props.farmCardData.identifier]);
  const getAPR = () => {
    try {
      const apr = values?.APR ?? 0;
      return numberWithCommas(Math.round(apr));
    } catch (e) {
      return 0;
    }
  };

  const getAPY = () => {
    const apy = apyCalculate(values?.APR ?? 0);

    return numberWithCommas(Math.round(apy));
  };

  const getReward = () => {
    if (farmData.isDualFarm) {
      return (
        <>
          {`${parseInt((values?.rewardRate[0] ?? 0) * 2880)} PLENTY | ${parseInt(
            (values?.rewardRate[1] ?? 0) * 2880,
          )} GIF`}{' '}
          <span
            style={{
              display: 'block',
              textAlign: 'right',
              fontSize: '10px',
            }}
          >
            / DAY
          </span>
        </>
      );
    } else if (
      farmData.CARD_TYPE === 'uUSD / YOU LP' ||
      farmData.CARD_TYPE === 'uUSD / wUSDC LP' ||
      farmData.CARD_TYPE === 'uUSD / uDEFI LP'
    ) {
      return `${parseInt((values?.rewardRate ?? 0) * 2880)} YOU / DAY`;
    } else {
      return `${parseInt((values?.rewardRate ?? 0) * 2880)} PLENTY / DAY`;
    }
  };

  const getTotalLiquidity = () => {
    return numberWithCommas(values?.totalLiquidty?.toFixed(0) ?? 0, {
      plain: true,
    });
  };

  const hasStakedAmount = () => {
    return (
      Object.prototype.hasOwnProperty.call(props.userStakes, farmData.CONTRACT) &&
      props.userStakes[farmData.CONTRACT]?.stakedAmount > 0
    );
  };

  const onRoiClick = () => {
    dispatch(
      openCloseFarmsModal({
        open: FARM_PAGE_MODAL.ROI,
        contractAddress: farmData.CONTRACT,
        roiTable: values.roiTable,
        secondToken: farmData.dualInfo ? farmData.dualInfo.tokenSecond.symbol : null,
      }),
    );
  };

  return (
    <>
      <div>
        <div className={styles.plentyCard}>
          {/* * Header */}
          {farmData.message && (
            <div className={`pool-card-top-banner ${farmData.bannerType}`}>
              <p className="pool-card-top-banner-text">{farmData.message}</p>
            </div>
          )}
          <div
            className={clsx(
              styles.plentyCardHeader,
              'flex justify-between align-center p-26 pb-20',
            )}
          >
            <div className={styles.imageWrapper}>
              <Image src={properties.image} fluid />
            </div>
            <div className="text-right">
              <p className={styles.title}>{properties.title}</p>
              <a
                href={`/liquidity?tokenA=${tokens[0]}&tokenB=${tokens[1]}`}
                target="_blank"
                className={clsx(
                  styles.titleBadge,
                  properties.source === 'Plenty LP' ? styles.badgePlenty : styles.badgeOther,
                )}
                rel="noreferrer"
              >
                {properties.source}
              </a>
            </div>
          </div>
          {/* * Header */}

          {/* * Content */}
          <div className={clsx(styles.plentyCardContent, 'pb-0')}>
            <div className={clsx(styles.plentyCardContentInfo, 'flex justify-between')}>
              <p className={styles.plentyCardContentTag}>APY:</p>
              <p className={styles.plentyCardContentTag}>
                {values == null ? <span className="shimmer">99999999</span> : `${getAPY(props)}%`}
              </p>
            </div>
            <div className={clsx(styles.plentyCardContentInfo, 'flex justify-between')}>
              <p className={styles.plentyCardContentTag}>APR:</p>
              <p className={styles.plentyCardContentTag}>
                {values && (
                  <img
                    src={props.theme === 'light' ? CalculatorSvgLight : CalculatorSvg}
                    alt={'Check ROI'}
                    className={styles.roiInfoImg}
                    onClick={onRoiClick}
                  />
                )}
                {values == null ? <span className="shimmer">99999999</span> : `${getAPR(props)}%`}
              </p>
            </div>
            <div className={clsx(styles.plentyCardContentInfo, 'flex justify-between')}>
              <p className={styles.plentyCardContentTag}>Rewards:</p>
              <p className={styles.plentyCardContentTag}>
                {values == null ? <span className="shimmer">99999999</span> : getReward()}
              </p>
            </div>

            <div
              className={clsx(styles.plentyCardTvlInfo, 'flex justify-between align-center mb-4')}
            >
              <p className={styles.plentyCardContentTag}>TVL:</p>
              <p className={styles.plentyCardContentTag}>
                {values == null ? (
                  <span className="shimmer">99999999</span>
                ) : (
                  `$ ${getTotalLiquidity()}`
                )}
              </p>
            </div>

            {props.userAddress ? (
              !hasStakedAmount() ? (
                <Button
                  disabled={!props.isActiveOpen}
                  onClick={() =>
                    props.openFarmsStakeModal(
                      props.farmCardData.identifier,
                      properties.title,
                      farmData.CONTRACT,
                      props.farmCardData.position,
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
  connectWallet: PropTypes.func.isRequired,
  farmCardData: PropTypes.object.isRequired,
  isActiveOpen: PropTypes.bool.isRequired,
  openFarmsStakeModal: PropTypes.func.isRequired,
  userAddress: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]).isRequired,
  userStakes: PropTypes.number.isRequired,
  theme: PropTypes.any,
};

export default FarmCard;
