import React, { useEffect, useMemo } from 'react';

import FarmCard from '../Components/FarmCard/FarmCard';

import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user/user.action';
import PropTypes from 'prop-types';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import Switch from '../Components/Ui/Switch/Switch';
import StakeModal from '../Components/Ui/Modals/StakeModal';
import UnstakeModal from '../Components/Ui/Modals/UnstakeModal';

import styles from '../assets/scss/partials/_farms.module.scss';
import FarmModals from '../Components/FarmPage/FarmModals';
import {
  closeFarmsStakeModal,
  closeFarmsUnstakeModal,
  openFarmsStakeModal,
  openFarmsUnstakeModal, populateEmptyFarmsData,
  setFarmsToRender,
  toggleFarmsType
} from "../redux/slices/farms/farms.slice";
import { getFarmsDataThunk, harvestOnFarmThunk, stakeOnFarmThunk, unstakeOnFarmThunk } from "../redux/slices/farms/farms.thunk";
import { populateFarmsWithoutData } from "../utils/farmsPageUtils";

const Farms = (props) => {
  // * Initial Call
  useEffect(() => {
    if (props.activeFarms.length === 0 || props.inactiveFarms.length === 0) {
      const farmsWithoutData = populateFarmsWithoutData();
      props.populateEmptyFarmsData(farmsWithoutData);
    }
  }, [])

  useEffect(() => {
    const fetchData = () => {
      props.getFarmsData(props.isActiveOpen);
      props.getUserStakes(props.userAddress, 'FARMS', props.isActiveOpen);
      props.getHarvestValues(props.userAddress, 'FARMS', props.isActiveOpen);
      props.fetchUserBalances(props.userAddress);
    };

    fetchData();
    const backgroundRefresh = setInterval(() => {
      fetchData()
    }, 60 * 1000)

    return () => clearInterval(backgroundRefresh)
  }, [props.isActiveOpen, props.userAddress]);

  const farmsToRender = useMemo(() => {
    if (props.isActiveOpen) {
      return props.activeFarms
    }

    return props.inactiveFarms
  }, [props.activeFarms, props.inactiveFarms, props.isActiveOpen])

  return (
    <>
      <div>
        <div>
          <div className="mt-5 d-flex justify-content-center w-100">
            <Switch
              value={props.isActiveOpen}
              onChange={() => props.toggleFarmsType(!props.isActiveOpen)}
              trueLabel={'Active'}
              falseLabel={'Inactive'}
              inverted={true}
            />
          </div>
          <div className={styles.cardsContainer}>
            {farmsToRender?.map(farm => {
              return (
                <FarmCard
                  key={`${farm.identifier}${props.isActiveOpen ? ' active' : ''}`}
                  harvestOnFarm={props.harvestOnFarm}
                  stakeOnFarm={props.stakeOnFarm}
                  openFarmsStakeModal={props.openFarmsStakeModal}
                  openFarmsUnstakeModal={props.openFarmsUnstakeModal}
                  connectWallet={props.connectWallet}
                  unstakeOnFarm={props.unstakeOnFarm}
                  isActiveOpen={props.isActiveOpen}
                  farmCardData={farm}
                  userStakes={props.userStakes}
                  harvestValueOnFarms={props.harvestValueOnFarms}
                  userAddress={props.userAddress}
                  currentBlock={props.currentBlock}
                  harvestOperation={props.harvestOperation}
                />
              );
            })}
          </div>
        </div>
      </div>
      <StakeModal
        walletBalances={props.walletBalances}
        isActiveOpen={props.isActiveOpen}
        modalData={props.stakeModal}
        open={props.stakeModal.open}
        onClose={() => props.closeFarmsStakeModal()}
        stakeOnFarm={props.stakeOnFarm}
        stakeOperation={props.stakeOperation}
      />
      <UnstakeModal
        modalData={props.unstakeModal}
        currentBlock={props.currentBlock}
        open={props.unstakeModal.open}
        onClose={() => {
          props.closeFarmsUnstakeModal();
        }}
        userStakes={props.userStakes}
        isActiveOpen={props.isActiveOpen}
        unstakeOnFarm={props.unstakeOnFarm}
        unstakeOperation={props.unstakeOperation}
      />
      <FarmModals />
    </>
  );
};

Farms.propTypes = {
  walletAddress: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {
    userAddress: state.wallet.address,
    isActiveOpen: state.farms.isActiveOpen,
    stakeOperation: state.farms.stakeOperation,
    activeFarms: state.farms.data.active,
    inactiveFarms: state.farms.data.inactive,
    activeFarmData: state.farms.active,
    inactiveFarmsData: state.farms.inactive,
    userStakes: state.user.stakes,
    harvestValueOnFarms: state.user.harvestValueOnFarms,
    unstakeOperation: state.farms.unstakeOperation,
    harvestOperation: state.farms.harvestOperation,
    currentBlock: state.user.currentBlock,
    walletBalances: state.user.balances,
    stakeModal: state.farms.stakeModal,
    unstakeModal: state.farms.unstakeModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    populateEmptyFarmsData: (farms) => dispatch(populateEmptyFarmsData(farms)),
    toggleFarmsType: (isActive) =>
      dispatch(toggleFarmsType(isActive)),
    stakeOnFarm: (amount, farmIdentifier, isActive, position) =>
      dispatch(
        stakeOnFarmThunk(amount, farmIdentifier, isActive, position)
      ),
    harvestOnFarm: (farmIdentifier, isActive, position) =>
      dispatch(harvestOnFarmThunk(farmIdentifier, isActive, position)),
    getFarmsData: (isActive) => dispatch(getFarmsDataThunk(isActive)),
    getUserStakes: (address, type, isActive) =>
      dispatch(userActions.getUserStakes(address, type, isActive)),
    getHarvestValues: (address, type, isActive) =>
      dispatch(userActions.getHarvestValues(address, type, isActive)),
    openFarmsStakeModal: (identifier, title, contractAddress, position) =>
      dispatch(
        openFarmsStakeModal({
            identifier,
            title,
            contractAddress,
            position
          })
      ),
    closeFarmsStakeModal: () => dispatch(closeFarmsStakeModal()),
    openFarmsUnstakeModal: (
      identifier,
      contractAddress,
      title,
      withdrawalFeeStructure,
      position
    ) =>
      dispatch(
        openFarmsUnstakeModal({
          identifier,
          contractAddress,
          title,
          withdrawalFeeStructure,
          position
        })
      ),
    closeFarmsUnstakeModal: () =>
      dispatch(closeFarmsUnstakeModal()),
    unstakeOnFarm: (stakesToUnstake, farmIdentifier, isActive, position) =>
      dispatch(
        unstakeOnFarmThunk(
          stakesToUnstake,
          farmIdentifier,
          isActive,
          position
        )
      ),
    fetchUserBalances: (address) =>
      dispatch(userActions.fetchUserBalances(address)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Farms);
