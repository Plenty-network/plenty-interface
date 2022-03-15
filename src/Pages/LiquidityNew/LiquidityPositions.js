import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import StableSwap from '../../assets/images/lq-stableswap.svg';
import Button from '../../Components/Ui/Buttons/Button';
import { Link, createSearchParams } from 'react-router-dom';
import {
  getLiquidityPositionDetails,
  getLiquidityPositionsForUser,
} from '../../apis/Liquidity/Liquidity';

export const LiquidityPositions = (props) => {
  const [positions, setPositions] = useState([]);
  const [positionDetails, setPositionDetails] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [indexPosition, setIndex] = useState(-1);

  useEffect(async () => {
    const res = await getLiquidityPositionsForUser(props.walletAddress);
    setPositions(res.data);
  }, [props]);

  const openManage = async (value, index, flag) => {
    setOpen(flag);
    setIndex(index);
    const ress = await getLiquidityPositionDetails(
      value.tokenA.name,
      value.tokenB.name,
      props.walletAddress,
    );

    setPositionDetails(ress.data);
  };

  return (
    <>
      {positions.length > 0 ? (
        positions.map((position, index) => {
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
                  <img width="44" height="44" src={position.tokenA.image} />
                  <img width="44" height="44" className="ml-1 mr-3" src={position.tokenB.image} />
                  {position.tokenA.name} / {position.tokenB.name}
                </div>
                <div className="lp-fee">
                  <span className="lp-fee-value mr-1">{position.isStable ? '0.10' : '0.25'}</span>{' '}
                  LP fee
                  {position.isStable && (
                    <>
                      <span className="divider-lq mx-2"></span>
                      <img src={StableSwap} />
                    </>
                  )}
                </div>
                <div className="manage-label" onClick={() => openManage(position, index, !isOpen)}>
                  Manage
                  <span className="material-icons-round manage-arrow ">keyboard_arrow_down</span>
                </div>
              </div>
              {isOpen && indexPosition === index && (
                <div className={clsx('position-details ', isOpen && 'openLqDetails-manage')}>
                  <div className=" d-flex justify-content-between">
                    <div>
                      <div className="pooled">
                        POOLED {position.tokenA.name}:{' '}
                        <span className="value">
                          {positionDetails ? positionDetails.tokenAPoolBalance?.toFixed(8) : '0.00'}{' '}
                          {position.tokenA.name}
                        </span>
                      </div>
                      <div className="pooled mt-1">
                        POOLED {position.tokenB.name}:{' '}
                        <span className="value">
                          {positionDetails ? positionDetails.tokenBPoolBalance?.toFixed(8) : '0.00'}{' '}
                          {position.tokenB.name}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="lq-details-right">
                        <div className="label">Your pool share</div>
                        <div className="value">
                          {positionDetails ? positionDetails.lpTokenShare?.toFixed(10) : '0.00'} %
                        </div>
                      </div>
                      <div className="ml-2 lq-details-right">
                        <div className="label">Your total pool tokens</div>
                        <div className="value">
                          {positionDetails ? positionDetails.lpBalance?.toFixed(10) : '0.00'}
                        </div>
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
                          tokenA: position.tokenA.name,
                          tokenB: position.tokenB.name,
                        })}`,
                      }}
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
                          tokenA: position.tokenA.name,
                          tokenB: position.tokenB.name,
                        })}`,
                      }}
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
          <div className="header d-flex">
            <div className="shimmer-circle">999</div>
            <div className="ml-3 shimmer-circle">999</div>
            <div className="ml-3 shimmer">99999999999999</div>
            <div className="ml-3 shimmer">99999999</div>
            <div className="ml-4 shimmer">999</div>
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
};
