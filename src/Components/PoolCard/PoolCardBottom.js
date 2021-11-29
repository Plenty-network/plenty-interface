import React, { useMemo, useRef, useState } from 'react';
import Button from '../Ui/Buttons/Button';
import PropTypes from 'prop-types';

import styles from '../../assets/scss/partials/_farms.module.scss';
import clsx from 'clsx';
import QuantityButton from '../Ui/Buttons/QuantityButton';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { openClosePoolsModal } from '../../redux/actions/pools/pools.actions';
import { POOL_PAGE_MODAL } from '../../constants/poolsPage';

const PoolCardBottom = (props) => {
  const [isExpanded, toggleExpand] = useState(false);
  const target = useRef(null);
  const dispatch = useDispatch();

  const hasStakedAmount = () => {
    return (
      Object.prototype.hasOwnProperty.call(props.userStakes, props.CONTRACT) &&
      props.userStakes[props.CONTRACT].stakedAmount > 0
    );
    //return false
  };

  const onWithdrawalFeeClick = () => {
    dispatch(
      openClosePoolsModal({
        open: POOL_PAGE_MODAL.WITHDRAWAL,
        contractAddress: props.CONTRACT,
      }),
    );
  };

  const stakedAmount = useMemo(() => {
    return Object.prototype.hasOwnProperty.call(props.userStakes, props.CONTRACT)
      ? props.userStakes[props.CONTRACT].stakedAmount
      : 0;
  }, [props.CONTRACT, props.userStakes, props.userAddress]);

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
        {(hasStakedAmount() || isExpanded) && (
          <div className="d-flex">
            <div className={clsx(styles.harvestStakeAmt, 'mr-2 justify-content-between')}>
              <Image height={31} src={props.harvestImg} fuild className="mt-auto mb-auto ml-2" />
              <span>
                {
                  props.userAddress !== null &&
                  Object.prototype.hasOwnProperty.call(
                    props.harvestValueOnPools,
                    props.isActiveOpen,
                  ) &&
                  Object.prototype.hasOwnProperty.call(
                    props.harvestValueOnPools[props.isActiveOpen],
                    props.CONTRACT,
                  ) &&
                  props.harvestValueOnPools[props.isActiveOpen][props.CONTRACT].totalRewards > 0
                    ? props.harvestValueOnPools[props.isActiveOpen][
                      props.CONTRACT
                    ].totalRewards.toFixed(6)
                    : 0
                  //0
                }
              </span>
            </div>

            <Button
              onClick={() =>
                props.harvestOnPools(props.identifier, props.isActiveOpen, props.position)
              }
              color={hasStakedAmount() ? 'primary' : 'default'}
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
              <div className={clsx(styles.harvestStakeAmt, 'mr-2 justify-content-end')}>
                <span>{stakedAmount?.toFixed(5)}</span>
              </div>
              <span />
              {stakedAmount > 0 || !props.isActiveOpen ? (
                <QuantityButton
                  onAddDisabled={!props.isActiveOpen}
                  onRemoveDisabled={stakedAmount <= 0}
                  onAdd={() =>
                    props.openPoolsStakeModal(
                      props.identifier,
                      props.title,
                      props.position,
                      props.CONTRACT,
                    )
                  }
                  onRemove={() =>
                    props.openPoolsUnstakeModal(
                      props.identifier,
                      props.CONTRACT,
                      props.title,
                      props.withdrawalFeeStructure,
                      props.position,
                    )
                  }
                />
              ) : (
                props.isActiveOpen && (
                  <Button
                    onClick={() =>
                      props.openPoolsStakeModal(
                        props.identifier,
                        props.title,
                        props.position,
                        props.CONTRACT,
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
            <Button className="w-100" color={'default'} onClick={() => null}>
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

PoolCardBottom.propTypes = {
  CONTRACT: PropTypes.any,
  harvestImg: PropTypes.any,
  harvestOnPools: PropTypes.any,
  harvestOperation: PropTypes.any,
  harvestValueOnPools: PropTypes.any,
  identifier: PropTypes.any,
  isActiveOpen: PropTypes.any,
  openPoolsStakeModal: PropTypes.any,
  openPoolsUnstakeModal: PropTypes.any,
  position: PropTypes.any,
  title: PropTypes.string.isRequired,
  userAddress: PropTypes.any,
  userStakes: PropTypes.any,
  withdrawalFeeStructure: PropTypes.any,
};

export default PoolCardBottom;
