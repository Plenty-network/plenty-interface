import React from 'react';
import wrapImg from '../assets/images/wrap.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import PoolCard from '../Components/PoolCard/PoolCard';
import plentyToken from '../assets/images/logo_small.png';
import plentyPoolIcon from '../assets/images/logo-icon.png';
import hdao from '../assets/images/hdao.png';
import kalam from '../assets/images/kalam-pool.png';
import Switch from "../Components/Ui/Switch/Switch";
import styles from "../assets/scss/partials/_farms.module.scss";

const Pools = ({ walletAddress }) => {
  // ! TEMP
  const poolsList = [
    {
      image: plentyPoolIcon,
      multi: '100',
      harvestImg: plentyToken,
      title: 'PLENTY',
      apr: 0,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 100,
      deposit: 'PLENTY - XTZ LP',
      liquidity: '100000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Quipuswap LP',
      rewards: '1000 PLENTY / DAY',
    },
    {
      image: hdao,
      multi: '100',
      title: 'hDAO',
      apr: 0,
      harvestImg: plentyToken,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
      deposit: 'PLENTY - XTZ LP',
      liquidity: '1000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Plenty',
      rewards: '1000 PLENTY / DAY',
    },
    {
      image: kalam,
      multi: '100',
      title: 'KALAM',
      harvestImg: plentyToken,
      apr: 0,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
      deposit: 'PLENTY - XTZ LP',
      liquidity: '5000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Plenty',
      rewards: '1000 PLENTY / DAY',
    },
  ];

  return (
    <div>
      <Row className="mt-5 justify-content-center">
        <Switch
          trueLabel={'Active'}
          falseLabel={'Inactive'}
          inverted={true}
        />
      </Row>
      <div className={styles.cardsContainer}>
        {poolsList.map((pool) => {
          return (
            <PoolCard
              key={pool.title}
              {...pool}
              walletAddress={walletAddress}
            />
          );
        })}
      </div>
    </div>
  );
};

Pools.propTypes = {
  walletAddress: PropTypes.string.isRequired,
};

export default Pools;
