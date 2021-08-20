import React, { useEffect } from 'react';
import wrapImg from '../assets/images/wrap.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import PoolCard from '../Components/PoolCard/PoolCard';
import plentyToken from '../assets/images/logo_small.png';
import plentyPoolIcon from '../assets/images/logo-icon.png';
import hdao from '../assets/images/hdao.png';
import kalam from '../assets/images/kalam-pool.png';
import wlink from '../assets/images/wlink.png'
import ethtz from '../assets/images/ethtz.png'
import wmatic  from '../assets/images/wmatic.png'
import usdtz from '../assets/images/usdtz.png';
import wrap from '../assets/images/wrap.png'
import Switch from "../Components/Ui/Switch/Switch";
import styles from "../assets/scss/partials/_farms.module.scss";
import StakeModal from '../Components/Ui/Modals/StakeModal';
import CONFIG from '../config/config';
import { connect } from 'react-redux';
import * as poolsAction from '../redux/actions/pools/pools.actions';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import * as userActions from '../redux/actions/user/user.action';
import { throttle } from 'lodash/function';

const Pools = (props) => {
  // ! TEMP
  // useEffect(() => {
  //   renderPools();
  // },[])

  const fetchData = () => {
    renderPools();
    props.getPoolsData(props.isActiveOpen);
    props.getUserStakes(props.userAddress, 'POOLS', props.isActiveOpen);
    props.getHarvestValues(props.userAddress, 'POOLS', props.isActiveOpen);
    props.fetchUserBalances(props.userAddress);
  };

  useEffect(() => {
    const backgroundRefresh = throttle(fetchData, 1000, { trailing: true });

    backgroundRefresh();
  }, [props.isActiveOpen, props.userAddress]);

  const poolsCardsTypeList = {
    PLENTY : {
      image: plentyPoolIcon,
      harvestImg: plentyToken,
      title: 'PLENTY',
    },
    hDAO : {
      image: hdao,
      harvestImg: plentyToken,
      title : 'hDAO'
    },
    ETHtz : {
      image: ethtz,
      harvestImg: plentyToken,
      title : 'ETHtz'
    },
    wMATIC : {
      image: wmatic,
      harvestImg: plentyToken,
      title : 'wMATIC'
    },
    wLINK : {
      image: wlink,
      harvestImg: plentyToken,
      title : 'wLINK'
    },
    USDtz : {
      image: usdtz,
      harvestImg: plentyToken,
      title : 'USDtz'
    },
    WRAP : {
      image: wrap,
      harvestImg: plentyToken,
      title : 'USDtz'
    }

  }
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
  const renderPools = () => {
    let poolsToBeRendered = [];
    for (let key in CONFIG.POOLS[CONFIG.NETWORK]) {
      for (let i in CONFIG.POOLS[CONFIG.NETWORK][key][
        props.isActiveOpen === true ? 'active' : 'inactive'
      ]) {
        poolsToBeRendered.push({
          poolData:
            CONFIG.POOLS[CONFIG.NETWORK][key][
              props.isActiveOpen === true ? 'active' : 'inactive'
            ][i],
          properties:
          poolsCardsTypeList[
              CONFIG.POOLS[CONFIG.NETWORK][key][
                props.isActiveOpen === true ? 'active' : 'inactive'
              ][i].CARD_TYPE
            ],
          identifier: key,
          location: i,
          withdrawalFeeStructure:
            CONFIG.withdrawalFeeDistribution[
              CONFIG.POOLS[CONFIG.NETWORK][key][
                props.isActiveOpen === true ? 'active' : 'inactive'
              ][i].withdrawalFeeType
            ],
          title:
            CONFIG.POOLS[CONFIG.NETWORK][key][
              props.isActiveOpen === true ? 'active' : 'inactive'
            ][i].CARD_TYPE,
        });
      }
    }
    //console.log(poolsToBeRendered)
    props.setPoolsToRender(poolsToBeRendered);
  };
  return (
    <div>
      <div className="mt-5 d-flex justify-content-center w-100">
        <Switch
          value={props.isActiveOpen}
          onChange={() => props.togglePoolsType(!props.isActiveOpen)}
          trueLabel={'Active'}
          falseLabel={'Inactive'}
          inverted={true}
        />
      </div>
      <div className={styles.cardsContainer}>
        {props.poolsToRender?.map((pool,index) => {
          return (
          <PoolCard
          key={index}
          {...pool.properties}
          {...pool.poolData}
          identifier={pool.identifier}
          position={pool.location}
          withdrawalFeeStructure={[]}
          {...props}
          {...pool}
          />
          );
        })}
        {/* {poolsList.map((pool) => {
          return (
            <PoolCard
              key={pool.title}
              {...pool}
              walletAddress={'walletAddress'}
            />
          );
        })} */}
      </div>
      <StakeModal
        walletBalances={props.walletBalances}
        isActiveOpen={props.isActiveOpen}
        stakeModalContractAddress={props.stakeModalContractAddress}
        stakeModalFarmPosition={props.stakeModalPoolPosition}
        stakeModalTitle={props.stakeModalTitle}
        stakeModalIdentifier={props.stakeModalIdentifier}
        open={props.isStakeModalOpen}
        onClose={() => props.closePoolsStakeModal()}
        handleInput={props.handleStakeOfPoolInputValue}
        stakeInputValues={props.stakeInputValue}
        stakeOnFarm={props.stakeOnPool}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userAddress: state.wallet.address,
    isActiveOpen: state.pools.isActiveOpen,
    poolsToRender : state.pools.poolsToRender,
    activePoolsData : state.pools.active,
    inactivePoolsData : state.pools.inactive,
    userStakes: state.user.stakes,
    harvestValueOnPools: state.user.harvestValueOnPools,
    walletBalances: state.user.balances,
    isStakeModalOpen : state.pools.isStakeModalOpen,
    stakeModalIdentifier :state.pools.stakeModalIdentifier,
    stakeModalTitle : state.pools.stakeModalTitle,
    stakeModalPoolPosition : state.pools.stakeModalPoolPosition,
    stakeModalContractAddress : state.pools.stakeModalContractAddress,
    stakeInputValue : state.pools.stakeInputValue
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    togglePoolsType: (isActive) =>
      dispatch(poolsAction.togglePoolsType(isActive)),
    setPoolsToRender : (poolsToBeRender) => dispatch(poolsAction.setPoolsToRender(poolsToBeRender)),
    getPoolsData : (isActiveOpen) => dispatch(poolsAction.getPoolsData(isActiveOpen)),
    fetchUserBalances: (address) =>
      dispatch(userActions.fetchUserBalances(address)),
    getUserStakes: (address, type, isActive) =>
      dispatch(userActions.getUserStakes(address, type, isActive)),
    getHarvestValues: (address, type, isActive) =>
      dispatch(userActions.getHarvestValues(address, type, isActive)),
    harvestOnPools : (poolIdentifier, isActive, position) => dispatch(poolsAction.harvestOnPool(poolIdentifier, isActive, position)),
    openPoolsStakeModal : (identifier,
      title,
      position,
      contractAddress) => dispatch(poolsAction.openPoolsStakeModal(identifier,
        title,
        position,
        contractAddress)),
        closePoolsStakeModal : () => dispatch(poolsAction.closePoolsStakeModal()),
    handleStakeOfPoolInputValue : (value) => dispatch(poolsAction.handleStakeOfPoolInputValue(value)),
    stakeOnPool : (amount, poolIdentifier, isActive, position) => dispatch(poolsAction.stakeOnPool(amount, poolIdentifier, isActive, position))
  };
};

Pools.propTypes = {
  walletAddress: PropTypes.string.isRequired,
};

export default connect(mapStateToProps,mapDispatchToProps)(Pools);
