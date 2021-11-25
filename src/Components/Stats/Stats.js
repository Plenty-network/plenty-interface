import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import Label from '../Ui/Label/Label';
import greenBullet from '../../assets/images/stats/greenbullet.svg';
import dollar from '../../assets/images/stats/dollar.svg';
import plentyInWallet from '../../assets/images/stats/plentyinwallet.svg';
import plentyToHarvest from '../../assets/images/stats/plentytoharvest.svg';
import styles from './stats.module.scss';
import Button from '../Ui/Buttons/Button';
import NumericLabel from 'react-pretty-numbers';
import xplentyIcon from '../../assets/images/stats/xplentyIcon.svg';
import { currencyOptionsWithSymbol } from '../../constants/global';

const Stats = (props) => {
  const loading = useMemo(() => {
    return (
      props.valueLocked == null || props.plentyInWallet == null || props.plentyToHarvest == null
    );
  }, [props.plentyInWallet, props.plentyToHarvest, props.valueLocked]);

  return (
    <div className={clsx('p-3', 'bg-themed', styles.container)}>
      <Row className="p-1">
        <Col xs={12}>
          <span className="d-flex font-weight-bold m-0 py-3">
            Your Stats
            <Image className="ml-2" src={greenBullet} />
          </span>
          <hr />
        </Col>
      </Row>

      <Row className="p-1">
        <Col xs={6}>
          <Label
            text={
              loading ? null : (
                <NumericLabel params={currencyOptionsWithSymbol}>
                  {props.valueLocked.toFixed(0)}
                </NumericLabel>
              )
            }
            subText={'Total value locked'}
            icon={dollar}
            iconClass={'mt-1'}
            className={'pt-1'}
          />
        </Col>
        <Col xs={6}>
          <Label
            text={loading ? null : `${props.plentyToHarvest?.toFixed(5)}`}
            subText={'PLENTY to harvest'}
            icon={plentyToHarvest}
            iconClass={'mt-1'}
          />
        </Col>
      </Row>

      <hr className="mt-0" />
      <Row className="p-1">
        <Col xs={6}>
          <Label
            text={loading ? null : `${props.plentyInWallet?.toFixed(5)}`}
            subText={'PLENTY in wallet'}
            icon={plentyInWallet}
            iconClass={'mt-1'}
          />
        </Col>
        <Col xs={6}>
          <Label
            text={loading ? null : `${props.xplentyBalance?.toFixed(5)}`}
            subText={'xPLENTY in wallet'}
            icon={xplentyIcon}
            iconClass={'mt-1'}
          />
        </Col>
      </Row>
      <Row className="p-1 mt-1">
        <Col>
          <Button
            onClick={props.harvestAll}
            color={'primary'}
            className={'w-100'}
            disabled={false}
            loading={props.harvestAllOperations.loading}
          >
            Harvest all
          </Button>
        </Col>
      </Row>
    </div>
  );
};

Stats.propTypes = {
  harvestAll: PropTypes.any,
  harvestAllOperations: PropTypes.any,
  plentyEarned: PropTypes.number,
  plentyInWallet: PropTypes.number,
  plentyToHarvest: PropTypes.number,
  valueLocked: PropTypes.number,
  xplentyBalance: PropTypes.any,
};

export default Stats;
