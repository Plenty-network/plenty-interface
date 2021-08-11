import React from "react";
import wrapImg from "../assets/images/wrap.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PropTypes from "prop-types";
import PoolCard from "../Components/PoolCard/PoolCard";

const Pools = ({ walletAddress }) => {
  // ! TEMP
  const poolsList = [
    {
      image: wrapImg,
      multi: '100',
      title: 'PLENTY',
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
      image: wrapImg,
      multi: '100',
      title: 'hDAO',
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
      image: wrapImg,
      multi: '100',
      title: 'KALAM',
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
        {poolsList.map(pool => {
          return <PoolCard key={pool.title} {...pool} walletAddress={walletAddress} />;
        })}
      </Row>
    </Container>
  );
};


Pools.propTypes = {
  walletAddress: PropTypes.string.isRequired
}

export default Pools;
