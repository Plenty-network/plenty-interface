import React from "react";
import PropTypes from "prop-types";
import wdaiImg from "../assets/images/wdai.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PondCard from "../Components/PondCard/PondCard";
import styles from "../assets/scss/partials/_farms.module.scss";
import Switch from "../Components/Ui/Switch/Switch";

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
    <div>
      <Row className="mt-5 justify-content-center">
        <Switch
          trueLabel={'Active'}
          falseLabel={'Inactive'}
          inverted={true}
        />
      </Row>
      <div className={styles.cardsContainer}>
        {pondsList.map(pool => {
          return <PondCard key={pool.title} {...pool} walletAddress={walletAddress} />;
        })}
      </div>
    </div>
  );
};


Ponds.propTypes = {
  walletAddress: PropTypes.string.isRequired,
}

export default Ponds;
