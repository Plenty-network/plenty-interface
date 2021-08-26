import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import PoolCard from '../Components/PoolCard/PoolCard';
import Switch from '../Components/Ui/Switch/Switch';
import styles from '../assets/scss/partials/_farms.module.scss';
import StakeModal from '../Components/Ui/Modals/StakeModal';
import UnstakeModal from '../Components/Ui/Modals/UnstakeModal';
import CONFIG from '../config/config';
import { connect } from 'react-redux';
import * as poolsAction from '../redux/actions/pools/pools.actions';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import * as userActions from '../redux/actions/user/user.action';
import PoolModals from '../Components/PoolPage/PoolModals';
import { POOLS_CARDS_TYPE_LIST } from "../constants/poolsPage";

const Pools = (props) => {



  useEffect(() => {
    const fetchData = () => {
      renderPools();
      props.getPoolsData(props.isActiveOpen);
      props.getUserStakes(props.userAddress, 'POOLS', props.isActiveOpen);
      props.getHarvestValues(props.userAddress, 'POOLS', props.isActiveOpen);
      props.fetchUserBalances(props.userAddress);
    };

    fetchData()
    const backgroundRefresh = setInterval(() => {
      fetchData()
    }, 60 * 1000);

    return () => clearInterval(backgroundRefresh);
  }, [props.isActiveOpen, props.userAddress]);

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
            POOLS_CARDS_TYPE_LIST[
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
        {props.poolsToRender?.map((pool, index) => {
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
        stakeOperation={props.stakeOperation}
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
      {props.isUnstakeModalOpen ? (
        <UnstakeModal
          unstakeModalwithdrawalFeeStructure={
            props.unstakeModalwithdrawalFeeStructure
          }
          unstakeOperation={props.unstakeOperation}
          unstakeModalTitle={props.unstakeModalTitle}
          unstakeModalFarmPosition={props.unstakeModalPoolPosition}
          unstakeModalContractAddress={props.unstakeModalContractAddress}
          unstakeModalIdentifier={props.unstakeModalIdentifier}
          currentBlock={props.currentBlock}
          open={props.isUnstakeModalOpen}
          onClose={() => {
            props.closePoolsUnstakeModal();
          }}
          userStakes={props.userStakes}
          isActiveOpen={props.isActiveOpen}
          unstakeOnFarm={props.unstakeOnPool}
        />
      ) : null}
      <PoolModals />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userAddress: state.wallet.address,
    isActiveOpen: state.pools.isActiveOpen,
    poolsToRender: state.pools.poolsToRender,
    activePoolsData: state.pools.active,
    inactivePoolsData: state.pools.inactive,
    userStakes: state.user.stakes,
    harvestValueOnPools: state.user.harvestValueOnPools,
    walletBalances: state.user.balances,
    isStakeModalOpen: state.pools.isStakeModalOpen,
    stakeOperation: state.pools.stakeOperation,
    stakeModalIdentifier: state.pools.stakeModalIdentifier,
    stakeModalTitle: state.pools.stakeModalTitle,
    stakeModalPoolPosition: state.pools.stakeModalPoolPosition,
    stakeModalContractAddress: state.pools.stakeModalContractAddress,
    stakeInputValue: state.pools.stakeInputValue,
    isUnstakeModalOpen: state.pools.isUnstakeModalOpen,
    unstakeOperation: state.pools.unstakeOperation,
    unstakeModalIdentifier: state.pools.unstakeModalIdentifier,
    unstakeModalContractAddress: state.pools.unstakeModalContractAddress,
    unstakeModalPoolPosition: state.pools.unstakeModalPoolPosition,
    unstakeModalTitle: state.pools.unstakeModalTitle,
    unstakeModalwithdrawalFeeStructure:
      state.pools.unstakeModalwithdrawalFeeStructure,
    harvestOperation: state.pools.harvestOperation,
    currentBlock: state.user.currentBlock,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    togglePoolsType: (isActive) =>
      dispatch(poolsAction.togglePoolsType(isActive)),
    setPoolsToRender: (poolsToBeRender) =>
      dispatch(poolsAction.setPoolsToRender(poolsToBeRender)),
    getPoolsData: (isActiveOpen) =>
      dispatch(poolsAction.getPoolsData(isActiveOpen)),
    fetchUserBalances: (address) =>
      dispatch(userActions.fetchUserBalances(address)),
    getUserStakes: (address, type, isActive) =>
      dispatch(userActions.getUserStakes(address, type, isActive)),
    getHarvestValues: (address, type, isActive) =>
      dispatch(userActions.getHarvestValues(address, type, isActive)),
    harvestOnPools: (poolIdentifier, isActive, position) =>
      dispatch(poolsAction.harvestOnPool(poolIdentifier, isActive, position)),
    openPoolsStakeModal: (identifier, title, position, contractAddress) =>
      dispatch(
        poolsAction.openPoolsStakeModal(
          identifier,
          title,
          position,
          contractAddress
        )
      ),
    closePoolsStakeModal: () => dispatch(poolsAction.closePoolsStakeModal()),
    handleStakeOfPoolInputValue: (value) =>
      dispatch(poolsAction.handleStakeOfPoolInputValue(value)),
    stakeOnPool: (amount, poolIdentifier, isActive, position) =>
      dispatch(
        poolsAction.stakeOnPool(amount, poolIdentifier, isActive, position)
      ),
    openPoolsUnstakeModal: (
      identifier,
      contractAddress,
      title,
      withdrawalFeeStructure,
      position
    ) =>
      dispatch(
        poolsAction.openPoolsUnstakeModal(
          identifier,
          contractAddress,
          title,
          withdrawalFeeStructure,
          position
        )
      ),
    closePoolsUnstakeModal: () =>
      dispatch(poolsAction.closePoolsUnstakeModal()),
    unstakeOnPool: (stakesToUnstake, poolIdentifier, isActive, position) =>
      dispatch(
        poolsAction.unstakeOnPool(
          stakesToUnstake,
          poolIdentifier,
          isActive,
          position
        )
      ),
  };
};

Pools.propTypes = {
  walletAddress: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Pools);
