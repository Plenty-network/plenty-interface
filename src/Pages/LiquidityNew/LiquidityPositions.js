import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import StableSwap from '../../assets/images/lq-stableswap.svg';
import StableSwapDark from '../../assets/images/lq-stableswap-dark.svg';
import Button from '../../Components/Ui/Buttons/Button';
import { Link, createSearchParams } from 'react-router-dom';
import {
  getLiquidityPositionDetails,
  getLiquidityPositionDetailsStable,
  getLiquidityPositionsForUser,
} from '../../apis/Liquidity/Liquidity';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import useMediaQuery from '../../hooks/mediaQuery';

export const LiquidityPositions = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');
  const [positions, setPositions] = useState([]);
  const [positionDetails, setPositionDetails] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [indexPosition, setIndex] = useState(-1);
  const [isEmpty, setEmpty] = useState(false);

  useEffect(async () => {
    const res = await getLiquidityPositionsForUser(props.walletAddress);

    if (res.success) {
      setEmpty(false);
      setPositions(res.data);
    } else {
      setEmpty(true);
    }
  }, [props]);

  const openManage = async (value, index, flag, isStable) => {
    if (index !== indexPosition) {
      setOpen(true);
    } else {
      setOpen(flag);
    }
    setIndex(index);
    let ress = {};
    if (isStable) {
      ress = await getLiquidityPositionDetailsStable(
        value.tokenA.name,
        value.tokenB.name,
        props.walletAddress,
      );
    } else {
      ress = await getLiquidityPositionDetails(
        value.tokenA.name,
        value.tokenB.name,
        props.walletAddress,
      );
    }

    setPositionDetails(ress.data);
  };

  return (
    <>
      {isEmpty ? (
        <div className="no-positions">No Liquidity positions!</div>
      ) : positions.length > 0 ? (
        positions?.map((position, index) => {
          return (
            <>
              <div
                className={clsx(
                  'position d-flex justify-content-between align-items-center',
                  isOpen && indexPosition === index && 'openLqDetails',
                )}
                key={index}
              >
                <div className="token-label">
                  <img className="token-img" src={position.tokenA.image} />
                  <img className="ml-1 mr-sm-3 mr-2 token-img" src={position.tokenB.image} />
                  {position.tokenA.name} / {position.tokenB.name}
                </div>
                <div className="d-flex">
                  <div className="lp-fee">
                    <span className="lp-fee-value mr-1">{position.isStable ? '0.10' : '0.25'}</span>
                    % LP fee
                    {position.isStable && (
                      <>
                        <span className="divider-lq mx-2"></span>
                        <img src={props.theme === 'light' ? StableSwap : StableSwapDark} />
                      </>
                    )}
                  </div>
                  <div
                    className="manage-label"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openManage(position, index, !isOpen, position.isStable)}
                  >
                    {!isMobile && 'Manage'}
                    <span
                      className={clsx('material-icons-round', 'manage-arrow', {
                        rotate: indexPosition === index && isOpen,
                      })}
                    >
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
              {isOpen && indexPosition === index && (
                <div className={clsx('position-details ', isOpen && 'openLqDetails-manage')}>
                  <div className=" d-sm-flex justify-content-between">
                    <div>
                      <div className="pooled">
                        POOLED {position.tokenA.name}:{' '}
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip" {...props}>
                              {positionDetails ? positionDetails.tokenAPoolBalance : '0.00'}
                            </Tooltip>
                          }
                        >
                          <span className="value">
                            {positionDetails.tokenAPoolBalance ? (
                              positionDetails.tokenAPoolBalance?.toFixed(4)
                            ) : (
                              <span className="shimmer">99999</span>
                            )}{' '}
                            {position.tokenA.name}
                          </span>
                        </OverlayTrigger>
                      </div>
                      <div className="pooled mt-1">
                        POOLED {position.tokenB.name}:{' '}
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip" {...props}>
                              {positionDetails ? positionDetails.tokenBPoolBalance : '0.00'}
                            </Tooltip>
                          }
                        >
                          <span className="value">
                            {positionDetails.tokenBPoolBalance ? (
                              positionDetails.tokenBPoolBalance?.toFixed(4)
                            ) : (
                              <span className="shimmer">99999</span>
                            )}{' '}
                            {position.tokenB.name}
                          </span>
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="lq-details-right">
                        <div className="label">Pool share</div>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip" {...props}>
                              {positionDetails ? positionDetails.lpTokenShare : '0.00'}
                            </Tooltip>
                          }
                        >
                          <div className="value">
                            {positionDetails.lpTokenShare ? (
                              positionDetails.lpTokenShare?.toFixed(4)
                            ) : (
                              <span className="shimmer">99999</span>
                            )}{' '}
                            %
                          </div>
                        </OverlayTrigger>
                      </div>
                      <div className="ml-2 lq-details-right">
                        <div className="label">Pool tokens</div>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="button-tooltip" {...props}>
                              {positionDetails ? positionDetails.lpBalance : '0.00'}
                            </Tooltip>
                          }
                        >
                          <div className="value">
                            {positionDetails.lpBalance ? (
                              positionDetails.lpBalance?.toFixed(4)
                            ) : (
                              <span className="shimmer">99999</span>
                            )}
                          </div>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                  <div className="divider-lq-manage"></div>
                  <div className="d-flex justify-content-between ">
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={{
                        pathname: '/liquidity/remove',
                        search: `?${createSearchParams({
                          tokenA: position.isStable ? position.tokenB.name : position.tokenA.name,
                          tokenB: position.isStable ? position.tokenA.name : position.tokenB.name,
                        })}`,
                      }}
                      className="w-100"
                    >
                      <Button color={'primaryOutline'} className={'mr-3 w-100  '}>
                        Remove
                      </Button>
                    </Link>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={{
                        pathname: '/liquidity/add',
                        search: `?${createSearchParams({
                          tokenA: position.isStable ? position.tokenB.name : position.tokenA.name,
                          tokenB: position.isStable ? position.tokenA.name : position.tokenB.name,
                        })}`,
                      }}
                      className="w-100"
                    >
                      <Button color={'primary'} className={' w-100 ml-3 '}>
                        Add
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          );
        })
      ) : (
        <div className="loading-positions">
          <div className="header-lq d-flex">
            <div className="shimmer-circle">999</div>
            <div className="ml-3 shimmer-circle">999</div>
            <div className="ml-3 shimmer">99999999999999</div>
            {!isMobile && (
              <>
                <div className="ml-3 shimmer">99999999</div>
                <div className="ml-4 shimmer">999</div>
              </>
            )}
          </div>
          <div className="content flex justify-content-center align-items-center">
            Loading Positions...
          </div>
        </div>
      )}
    </>
  );
};

LiquidityPositions.propTypes = {
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
};
