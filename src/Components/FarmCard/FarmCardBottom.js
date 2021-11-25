import React, { useMemo, useRef, useState } from 'react';
import Button from '../Ui/Buttons/Button';
import PropTypes from 'prop-types';

import styles from '../../assets/scss/partials/_farms.module.scss';
import clsx from 'clsx';
import QuantityButton from '../Ui/Buttons/QuantityButton';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FARM_PAGE_MODAL } from '../../constants/farmsPage';
import { useDispatch } from 'react-redux';
import { openCloseFarmsModal } from '../../redux/slices/farms/farms.slice';

const FarmCardBottom = (props) => {
  const dispatch = useDispatch();
  const { properties, farmData, values } = props.farmCardData;
  const [isExpanded, toggleExpand] = useState(false);
  const target = useRef(null);

  const onWithdrawalFeeClick = () => {
    dispatch(
      openCloseFarmsModal({
        open: FARM_PAGE_MODAL.WITHDRAWAL,
        contractAddress: farmData.CONTRACT,
        withdrawalFeeType: farmData.withdrawalFeeType,
      }),
    );
  };

  const stakedAmount = useMemo(() => {
    return Object.prototype.hasOwnProperty.call(props.userStakes,farmData.CONTRACT)
      ? props.userStakes[farmData.CONTRACT].stakedAmount
      : 0;
  }, [farmData.CONTRACT, props.userStakes, props.userAddress]);

  return (
    <>
      <div
        className={clsx(styles.plentyCardContent, {
          'mt-4': isExpanded,
          'pt-0': !isExpanded,
          [styles.topBorder]: isExpanded,
          [styles.bottomBorder]: isExpanded,
        })}
      >
        {(stakedAmount > 0 || isExpanded) && (
          <div className="d-flex">
            {properties.isDualFarm ? (
              <div
                className={`${styles.harvestStakeAmt} mr-2 d-flex justify-content-between align-center`}
                style={{ paddingRight: '8px' }}
              >
                <div
                  style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.04)',
                    paddingRight: '16%',
                  }}
                >
                  <Image
                    height={17}
                    src={properties.harvestImg}
                    fuild
                    className="mt-auto mb-auto ml-2"
                  />
                  <span style={{ fontSize: '10px', marginLeft: '6px' }}>
                    {values &&
                    props.userAddress !== null &&
                    Object.prototype.hasOwnProperty.call(props.harvestValueOnFarms, props.isActiveOpen) &&
                    Object.prototype.hasOwnProperty.call(props.harvestValueOnFarms[props.isActiveOpen],
                      farmData.CONTRACT,
                    ) &&
                    props.harvestValueOnFarms[props.isActiveOpen][farmData.CONTRACT]
                      .totalRewards[0] > 0 ? (
                        props.harvestValueOnFarms[props.isActiveOpen][
                          farmData.CONTRACT
                        ].totalRewards[0].toFixed(4)
                      ) : (
                        <span className="shimmer">99999</span>
                      )}
                  </span>
                </div>

                <div>
                  <Image
                    height={17}
                    src={properties.harvestImg1}
                    fuild
                    className="mt-auto mb-auto ml-2"
                  />
                  <span style={{ fontSize: '10px', marginLeft: '6px' }}>
                    {values &&
                    props.userAddress !== null &&
                    Object.prototype.hasOwnProperty.call(
                      props.harvestValueOnFarms,
                      props.isActiveOpen,
                    ) &&
                    Object.prototype.hasOwnProperty.call(
                      props.harvestValueOnFarms[props.isActiveOpen],
                      farmData.CONTRACT,
                    ) &&
                    props.harvestValueOnFarms[props.isActiveOpen][farmData.CONTRACT]
                      .totalRewards[1] > 0 ? (
                        props.harvestValueOnFarms[props.isActiveOpen][
                          farmData.CONTRACT
                        ].totalRewards[1].toFixed(4)
                      ) : (
                        <span className="shimmer">99999</span>
                      )}
                  </span>
                </div>
              </div>
            ) : (
              <div className={clsx(styles.harvestStakeAmt, 'mr-2 justify-content-between')}>
                <Image
                  height={31}
                  src={properties.harvestImg}
                  fuild
                  className="mt-auto mb-auto ml-2"
                />
                <span>
                  {values &&
                  props.userAddress !== null &&
                  Object.prototype.hasOwnProperty.call(
                    props.harvestValueOnFarms,
                    props.isActiveOpen,
                  ) &&
                  Object.prototype.hasOwnProperty.call(
                    props.harvestValueOnFarms[props.isActiveOpen],
                    farmData.CONTRACT,
                  ) &&
                  props.harvestValueOnFarms[props.isActiveOpen][farmData.CONTRACT].totalRewards >
                    0 ? (
                      props.harvestValueOnFarms[props.isActiveOpen][
                        farmData.CONTRACT
                      ].totalRewards.toFixed(6)
                    ) : (
                      <span className="shimmer">99999999</span>
                    )}
                </span>
              </div>
            )}

            <Button
              onClick={() => {
                props.harvestOnFarm(
                  props.farmCardData.identifier,
                  props.isActiveOpen,
                  props.farmCardData.position,
                );
              }}
              color={stakedAmount > 0 ? 'primary' : 'default'}
              loading={
                props.harvestOperation.tokenPair === props.identifier &&
                props.harvestOperation.isLoading
              }
            >
              Harvest
            </Button>
          </div>
        )}

        {isExpanded && (
          <>
            <div className="mt-3 mb-2">{props.title}</div>

            <div className="d-flex">
              <div
                className={clsx(styles.harvestStakeAmt, 'mr-2 justify-content-end', {
                  [styles.empty]: !stakedAmount,
                })}
              >
                <span>{stakedAmount?.toFixed(5)}</span>
              </div>
              <span />
              {stakedAmount > 0 || !props.isActiveOpen ? (
                <QuantityButton
                  onAddDisabled={!props.isActiveOpen}
                  onRemoveDisabled={stakedAmount <= 0}
                  onAdd={() =>
                    props.openFarmsStakeModal(
                      props.farmCardData.identifier,
                      properties.title,
                      farmData.CONTRACT,
                      props.farmCardData.position,
                    )
                  }
                  onRemove={() =>
                    props.openFarmsUnstakeModal(
                      props.farmCardData.identifier,
                      farmData.CONTRACT,
                      properties.title,
                      farmData.withdrawalFeeType,
                      props.farmCardData.position,
                    )
                  }
                />
              ) : (
                props.isActiveOpen && (
                  <Button
                    onClick={() =>
                      props.openFarmsStakeModal(
                        props.farmCardData.identifier,
                        properties.title,
                        farmData.CONTRACT,
                        props.farmCardData.position,
                      )
                    }
                    color={'default'}
                  >
                    Stake
                  </Button>
                )
              )}
            </div>
          </>
        )}
      </div>

      {isExpanded && (
        <>
          <div className={clsx(styles.plentyCardContent, styles.bottomBorder, 'd-flex')}>
            <div className={clsx(styles.rightBorder, 'w-50 text-center')}>
              <div>Deposit Fee</div>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                  <Tooltip id={'deposit-fee-tooltip'} arrowProps={{ styles: { display: 'none' } }}>
                    No deposit fee
                  </Tooltip>
                }
              >
                <Button
                  id={'deposit-fee'}
                  ref={target}
                  size="small"
                  color="mute"
                  startIcon="help_outline"
                  className="mt-1 ml-auto mr-auto"
                  rounded={false}
                  onClick={undefined}
                >
                  0%
                </Button>
              </OverlayTrigger>
            </div>

            <div className={'w-50 text-center'}>
              <div>Withdrawal Fee</div>
              <Button
                size="small"
                color="mute"
                startIcon="help_outline"
                className="mt-1 ml-auto mr-auto"
                rounded={false}
                onClick={onWithdrawalFeeClick}
              >
                Variable
              </Button>
            </div>
          </div>

          <div className={styles.plentyCardContent}>
            <Button
              className="w-100"
              color={'default'}
              onClick={() =>
                window.open(
                  `https://better-call.dev/mainnet/${farmData.CONTRACT}/operations`,
                  '_blank',
                )
              }
            >
              View On Tezos
            </Button>
          </div>
        </>
      )}
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => toggleExpand(!isExpanded)}
          isIconBtn={true}
          startIcon={isExpanded ? 'expand_less' : 'expand_more'}
          color={'mute'}
        />
      </div>
    </>
  );
};

FarmCardBottom.propTypes = {
  farmCardData: PropTypes.object.isRequired,
  harvestOnFarm: PropTypes.func.isRequired,
  harvestOperation: PropTypes.any.isRequired,
  harvestValueOnFarms: PropTypes.any.isRequired,
  identifier: PropTypes.any.isRequired,
  isActiveOpen: PropTypes.bool.isRequired,
  openFarmsStakeModal: PropTypes.func.isRequired,
  openFarmsUnstakeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  userAddress: PropTypes.oneOf().isRequired,
  userStakes: PropTypes.string.isRequired,
};

export default FarmCardBottom;
