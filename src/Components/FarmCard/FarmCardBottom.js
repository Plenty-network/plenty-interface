import { useMemo, useRef, useState } from 'react';
import Button from '../Ui/Buttons/Button';
import PropTypes from 'prop-types';

import styles from '../../assets/scss/partials/_farms.module.scss';
import clsx from 'clsx';
import QuantityButton from '../Ui/Buttons/QuantityButton';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  FARM_PAGE_MODAL,
  FARMS_CARD_DATA_PROPTYPES,
} from '../../constants/farmsPage';
import { useDispatch } from 'react-redux';
import { openCloseFarmsModal } from '../../redux/slices/farms/farms.slice';

const FarmCardBottom = (props) => {
  const dispatch = useDispatch();
  const { properties, farmData } = props.farmCardData;
  const [isExpanded, toggleExpand] = useState(false);
  const target = useRef(null);

  const onWithdrawalFeeClick = () => {
    dispatch(
      openCloseFarmsModal({
        open: FARM_PAGE_MODAL.WITHDRAWAL,
        contractAddress: farmData.CONTRACT,
        withdrawalFeeType: farmData.withdrawalFeeType,
      })
    );
  };

  const stakedAmount = useMemo(() => {
    return props.userStakes.hasOwnProperty(farmData.CONTRACT)
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
            <div
              className={clsx(
                styles.harvestStakeAmt,
                'mr-2 justify-content-between'
              )}
            >
              <Image
                height={31}
                src={props.harvestImg}
                fuild
                className="mt-auto mb-auto ml-2"
              />
              <span>
                {props.userAddress !== null &&
                props.harvestValueOnFarms.hasOwnProperty(props.isActiveOpen) &&
                props.harvestValueOnFarms[props.isActiveOpen].hasOwnProperty(
                  farmData.CONTRACT
                ) &&
                props.harvestValueOnFarms[props.isActiveOpen][farmData.CONTRACT]
                  .totalRewards > 0
                  ? props.harvestValueOnFarms[props.isActiveOpen][
                      farmData.CONTRACT
                    ].totalRewards.toFixed(6)
                  : 0}
              </span>
            </div>

            <Button
              onClick={() => {
                props.harvestOnFarm(
                  props.farmCardData.identifier,
                  props.isActiveOpen,
                  props.farmCardData.position
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
                className={clsx(
                  styles.harvestStakeAmt,
                  'mr-2 justify-content-end',
                  {
                    [styles.empty]: !stakedAmount,
                  }
                )}
              >
                <span>{stakedAmount?.toFixed(5)}</span>
              </div>
              <span />
              {!props.isActiveOpen ? (
                <>
                  {stakedAmount > 0 ? (
                    <QuantityButton
                      onRemove={() =>
                        props.openFarmsUnstakeModal(
                          props.farmCardData.identifier,
                          farmData.CONTRACT,
                          properties.title,
                          farmData.withdrawalFeeType,
                          props.farmCardData.position
                        )
                      }
                    />
                  ) : (
                    <QuantityButton />
                  )}
                </>
              ) : stakedAmount > 0 ? (
                <QuantityButton
                  onAdd={() =>
                    props.openFarmsStakeModal(
                      props.farmCardData.identifier,
                      properties.title,
                      farmData.CONTRACT,
                      props.farmCardData.position
                    )
                  }
                  onRemove={() =>
                    props.openFarmsUnstakeModal(
                      props.farmCardData.identifier,
                      farmData.CONTRACT,
                      properties.title,
                      farmData.withdrawalFeeType,
                      props.farmCardData.position
                    )
                  }
                />
              ) : (
                <Button
                  disabled={props.isActiveOpen === false}
                  onClick={() =>
                    props.openFarmsStakeModal(
                      props.farmCardData.identifier,
                      properties.title,
                      farmData.CONTRACT,
                      props.farmCardData.position
                    )
                  }
                  color={'default'}
                >
                  Stake
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {isExpanded && (
        <>
          <div
            className={clsx(
              styles.plentyCardContent,
              styles.bottomBorder,
              'd-flex'
            )}
          >
            <div className={clsx(styles.rightBorder, 'w-50 text-center')}>
              <div>Deposit Fee</div>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                  <Tooltip
                    id={`deposit-fee-tooltip`}
                    arrowProps={{ styles: { display: 'none' } }}
                  >
                    No deposit fee
                  </Tooltip>
                }
              >
                <Button
                  id={`deposit-fee`}
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
                  '_blank'
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
  title: PropTypes.string.isRequired,
  farmCardData: FARMS_CARD_DATA_PROPTYPES,
};

export default FarmCardBottom;
