import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import wdaiImg from '../assets/images/wdai.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import kalamimg from '../assets/images/kalam.png';
import wrapimg from '../assets/images/wrap.png';
import { connect } from 'react-redux';
import * as pondsAction from '../redux/actions/ponds/ponds.action';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import CONFIG from '../config/config';
import { throttle } from 'lodash/function';
import PondCard from '../Components/PondCard/PondCard';
import styles from '../assets/scss/partials/_farms.module.scss';
import Switch from '../Components/Ui/Switch/Switch';
import PondModals from '../Components/PondPage/PondModals';

const Ponds = (props) => {

  useEffect(() => {
    const fetchData = () => {
      renderPonds();
    };

    fetchData();
    const backgroundRefresh = setInterval(() => {
      fetchData()
    }, 30 * 1000);

    return () => clearInterval(backgroundRefresh);
  }, [props.isActiveOpen, props.userAddress]);
  const pondsCardListType = {
    KALAM: {
      image: kalamimg,
      harvestImg: kalamimg,
      title: 'KALAM',
    },
    WRAP: {
      image: wrapimg,
      harvestImg: wrapimg,
      title: 'WRAP',
    },
  };
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

  const renderPonds = () => {
    let pondsToBeRendered = [];
    for (let key in CONFIG.PONDS[CONFIG.NETWORK]) {
      for (let i in CONFIG.PONDS[CONFIG.NETWORK][key][
        props.isActiveOpen === true ? 'active' : 'inactive'
      ]) {
        pondsToBeRendered.push({
          pondData:
            CONFIG.PONDS[CONFIG.NETWORK][key][
              props.isActiveOpen === true ? 'active' : 'inactive'
            ][i],
          properties:
            pondsCardListType[
              CONFIG.PONDS[CONFIG.NETWORK][key][
                props.isActiveOpen === true ? 'active' : 'inactive'
              ][i].CARD_TYPE
            ],
          identifier: key,
          location: i,
          withdrawalFeeStructure:
            CONFIG.withdrawalFeeDistribution[
              CONFIG.PONDS[CONFIG.NETWORK][key][
                props.isActiveOpen === true ? 'active' : 'inactive'
              ][i].withdrawalFeeType
            ],
          title:
            CONFIG.PONDS[CONFIG.NETWORK][key][
              props.isActiveOpen === true ? 'active' : 'inactive'
            ][i].CARD_TYPE,
        });
      }
    }
    props.setPondsToRender(pondsToBeRendered);
  };

  return (
    <div>
      <div className="mt-5 d-flex justify-content-center w-100">
        <Switch
          value={props.isActiveOpen}
          onChange={() => props.togglePondsType(!props.isActiveOpen)}
          trueLabel={'Active'}
          falseLabel={'Inactive'}
          inverted={true}
        />
      </div>
      <div className={styles.cardsContainer}>
        {props.pondsToRender?.map((pond, index) => {
          return (
            <PondCard
              key={index}
              {...pond.properties}
              {...pond.poolData}
              identifier={pond.identifier}
              position={pond.location}
              {...props}
              {...pond}
            />
          );
        })}
        {props.pondsToRender.length <= 0 ? (
          <div style={{ textAlign: 'center' }}>
            <p>No active ponds</p>
            <br />
            <p>
              Stake not visible? Visit{' '}
              <a href="https://old.plentydefi.com/ponds" target="_blank">
                {' '}
                old.plentydefi.com
              </a>{' '}
              to unstake
            </p>
          </div>
        ) : null}
        {/* {pondsList.map(pool => {
          return <PondCard key={pool.title} {...pool} walletAddress={walletAddress} />;
        })} */}
      </div>
      <PondModals />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userAddress: state.wallet.address,
    isActiveOpen: state.ponds.isActiveOpen,
    pondsToRender: state.ponds.pondsToRender,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    togglePondsType: (isActive) =>
      dispatch(pondsAction.togglePondsType(isActive)),
    setPondsToRender: (pondsToBeRender) =>
      dispatch(pondsAction.setPondsToRender(pondsToBeRender)),
  };
};

Ponds.propTypes = {
  walletAddress: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Ponds);
