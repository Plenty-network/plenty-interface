import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import FarmCard from '../Components/FarmCard/FarmCard';

import plentyXtz from '../assets/images/farms/plenty-xtz.png';
import PropTypes from "prop-types";

const Farms = ({ walletAddress }) => {
  const farmsList = [
    {
      image: plentyXtz,
      multi: '100',
      title: 'PLENTY / XTZ LP',
      apr: 0,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
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
      image: plentyXtz,
      multi: '100',
      title: 'hDAO / PLENTY LP',
      apr: 0,
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
      image: plentyXtz,
      multi: '100',
      title: 'KALAM / PLENTY LP',
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
    <Container fluid className="page-layout-container">
      <Row>
        {farmsList.map((farm, index) => {
          return <FarmCard key={index} {...farm} walletAddress={walletAddress} />;
        })}
      </Row>
    </Container>
  );
};

Farms.propTypes = {
  walletAddress: PropTypes.string.isRequired
}

export default Farms;
