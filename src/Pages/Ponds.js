import React from "react";
import PropTypes from "prop-types";
import wdaiImg from "../assets/images/wdai.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PondCard from "../Components/PondCard/PondCard";

const Ponds = ({ walletAddress }) => {
  // ! TEMP
  const pondsList = [
    {
      image: wdaiImg,
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
      image: wdaiImg,
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
      image: wdaiImg,
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
        {pondsList.map(pool => {
          return <PondCard key={pool.title} {...pool} walletAddress={walletAddress} />;
        })}
      </Row>
    </Container>
  );
};


Ponds.propTypes = {
  walletAddress: PropTypes.string.isRequired,
}

export default Ponds;
