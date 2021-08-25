import React, { useEffect } from 'react';

import FarmCard from '../Components/FarmCard/FarmCard';

import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user/user.action';
import CONFIG from '../config/config';
import PropTypes from 'prop-types';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import Switch from '../Components/Ui/Switch/Switch';
import StakeModal from '../Components/Ui/Modals/StakeModal';
import UnstakeModal from '../Components/Ui/Modals/UnstakeModal';

import styles from '../assets/scss/partials/_farms.module.scss';
import FarmModals from '../Components/FarmPage/FarmModals';
import { FARMS_CARD_TYPE_LIST } from "../constants/farmsPage";
import {
  closeFarmsStakeModal,
  closeFarmsUnstakeModal,
  openFarmsStakeModal,
  openFarmsUnstakeModal,
  setFarmsToRender,
  toggleFarmsType
} from "../redux/slices/farms/farms.slice";
import { getFarmsDataThunk, harvestOnFarmThunk, stakeOnFarmThunk, unstakeOnFarmThunk } from "../redux/slices/farms/farms.thunk";

const Farms = (props) => {

  useEffect(() => {
    const fetchData = () => {
      renderFarms();
      props.getFarmsData(props.isActiveOpen);
      props.getUserStakes(props.userAddress, 'FARMS', props.isActiveOpen);
      props.getHarvestValues(props.userAddress, 'FARMS', props.isActiveOpen);
      props.fetchUserBalances(props.userAddress);
    };

    fetchData();
    const backgroundRefresh = setInterval(() => {
      fetchData()
    }, 30 * 1000)

    return () => clearInterval(backgroundRefresh)
  }, [props.isActiveOpen, props.userAddress]);

  const renderFarms = () => {
    let farmsToBeRendered = [];
    for (let key in CONFIG.FARMS[CONFIG.NETWORK]) {
      for (let farms in CONFIG.FARMS[CONFIG.NETWORK][key][
        props.isActiveOpen === true ? 'active' : 'inactive'
      ]) {
        farmsToBeRendered.push({
          farmData:
            CONFIG.FARMS[CONFIG.NETWORK][key][
              props.isActiveOpen === true ? 'active' : 'inactive'
            ][farms],
          properties:
            FARMS_CARD_TYPE_LIST[
              CONFIG.FARMS[CONFIG.NETWORK][key][
                props.isActiveOpen === true ? 'active' : 'inactive'
              ][farms].CARD_TYPE
            ],
          identifier: key,
          location: farms,
          withdrawalFeeStructure:
            CONFIG.withdrawalFeeDistribution[
              CONFIG.FARMS[CONFIG.NETWORK][key][
                props.isActiveOpen === true ? 'active' : 'inactive'
              ][farms].withdrawalFeeType
            ],
          title:
            CONFIG.FARMS[CONFIG.NETWORK][key][
              props.isActiveOpen === true ? 'active' : 'inactive'
            ][farms].CARD_TYPE,
        });
      }
    }
    props.setFarmsToRender(farmsToBeRendered);
    //setFarmsToRender(farmsToBeRendered)
  };

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
            {props.farmsToRender?.map((farm, index) => {
              return (
                <FarmCard
                  handleStakeOfFarmInputValue={
                    props.handleStakeOfFarmInputValue
                  }
                  harvestOnFarm={props.harvestOnFarm}
                  stakeInputValues={props.stakeInputValues}
                  stakeOnFarm={props.stakeOnFarm}
                  openFarmsStakeModal={props.openFarmsStakeModal}
                  closeFarmsStakeModal={props.closeFarmsStakeModal}
                  openFarmsUnstakeModal={props.openFarmsUnstakeModal}
                  closeFarmsUnstakeModal={props.closeFarmsUnstakeModal}
                  connectWallet={props.connectWallet}
                  unstakeOnFarm={props.unstakeOnFarm}
                  isActiveOpen={props.isActiveOpen}
                  activeFarmData={props.activeFarmData}
                  inactiveFarmData={props.inactiveFarmData}
                  userStakes={props.userStakes}
                  harvestValueOnFarms={props.harvestValueOnFarms}
                  isStakeModalOpen={props.isStakeModalOpen}
                  userAddress={props.userAddress}
                  isUnstakeModalOpen={props.isUnstakeModalOpen}
                  currentBlock={props.currentBlock}
                  key={index}
                  {...farm.properties}
                  {...farm.farmData}
                  identifier={farm.identifier}
                  position={farm.location}
                  withdrawalFeeStructure={farm.withdrawalFeeStructure}
                  {...props}
                />
              );
            })}
          </div>
        </div>
      </div>
      <StakeModal
        walletBalances={props.walletBalances}
        isActiveOpen={props.isActiveOpen}
        stakeModalContractAddress={props.stakeModalContractAddress}
        stakeOperation={props.stakeOperation}
        stakeModalFarmPosition={props.stakeModalFarmPosition}
        stakeModalTitle={props.stakeModalTitle}
        stakeModalIdentifier={props.stakeModalIdentifier}
        open={props.isStakeModalOpen}
        onClose={() => props.closeFarmsStakeModal()}
        handleInput={props.handleStakeOfFarmInputValue}
        CONTRACT={props.CONTRACT}
        stakeInputValues={props.stakeInputValues}
        stakeOnFarm={props.stakeOnFarm}
      />
      {props.isUnstakeModalOpen ? (
        <UnstakeModal
          unstakeModalwithdrawalFeeStructure={
            props.unstakeModalwithdrawalFeeStructure
          }
          unstakeModalTitle={props.unstakeModalTitle}
          unstakeOperation={props.unstakeOperation}
          unstakeModalFarmPosition={props.unstakeModalFarmPosition}
          unstakeModalContractAddress={props.unstakeModalContractAddress}
          unstakeModalIdentifier={props.unstakeModalIdentifier}
          currentBlock={props.currentBlock}
          open={props.isUnstakeModalOpen}
          onClose={() => {
            props.closeFarmsUnstakeModal();
          }}
          userStakes={props.userStakes}
          isActiveOpen={props.isActiveOpen}
          unstakeOnFarm={props.unstakeOnFarm}
        />
      ) : null}
      {/* identifier={props.identifier} */}
      {/* withdrawalFeeStructure={props.withdrawalFeeStructure} */}
      {/* tokenData={{title: props.title}} */}
      {/* CONTRACT={props.CONTRACT} position={props.position} identifier={props.identifier} */}
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
    stakeInputValues: state.farms.stakeInputValues,
    stakeOperation: state.farms.stakeOperation,
    activeFarmData: state.farms.active,
    inactiveFarmsData: state.farms.inactive,
    farmsToRender: state.farms.farmsToRender,
    userStakes: state.user.stakes,
    harvestValueOnFarms: state.user.harvestValueOnFarms,
    isStakeModalOpen: state.farms.isStakeModalOpen,
    stakeModalIdentifier: state.farms.stakeModalIdentifier,
    stakeModalTitle: state.farms.stakeModalTitle,
    stakeModalFarmPosition: state.farms.stakeModalFarmPosition,
    stakeModalContractAddress: state.farms.stakeModalContractAddress,
    isUnstakeModalOpen: state.farms.isUnstakeModalOpen,
    unstakeOperation: state.farms.unstakeOperation,
    unstakeModalIdentifier: state.farms.unstakeModalIdentifier,
    unstakeModalContractAddress: state.farms.unstakeModalContractAddress,
    unstakeModalFarmPosition: state.farms.unstakeModalFarmPosition,
    unstakeModalTitle: state.farms.unstakeModalTitle,
    unstakeModalwithdrawalFeeStructure:
      state.farms.unstakeModalwithdrawalFeeStructure,
    harvestOperation: state.farms.harvestOperation,
    currentBlock: state.user.currentBlock,
    walletBalances: state.user.balances,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    toggleFarmsType: (isActive) =>
      dispatch(toggleFarmsType(isActive)),
    stakeOnFarm: (amount, farmIdentifier, isActive, position) =>
      dispatch(
        stakeOnFarmThunk(amount, farmIdentifier, isActive, position)
      ),
    harvestOnFarm: (farmIdentifier, isActive, position) =>
      dispatch(harvestOnFarmThunk(farmIdentifier, isActive, position)),
    // handleStakeOfFarmInputValue: (value) =>
    //   dispatch(handleStakeOfFarmInputValue(value)),
    getFarmsData: (isActive) => dispatch(getFarmsDataThunk(isActive)),
    setFarmsToRender: (farmsToBeRender) =>
      dispatch(setFarmsToRender(farmsToBeRender)),
    getUserStakes: (address, type, isActive) =>
      dispatch(userActions.getUserStakes(address, type, isActive)),
    getHarvestValues: (address, type, isActive) =>
      dispatch(userActions.getHarvestValues(address, type, isActive)),
    openFarmsStakeModal: (identifier, title, position, contractAddress) =>
      dispatch(
        openFarmsStakeModal(
          identifier,
          title,
          position,
          contractAddress
        )
      ),
    closeFarmsStakeModal: () => dispatch(closeFarmsStakeModal()),
    openFarmsUnstakeModal: (
      identifier,
      contractAddress,
      title,
      withdrawalFeeStructure,
      postion
    ) =>
      dispatch(
        openFarmsUnstakeModal(
          identifier,
          contractAddress,
          title,
          withdrawalFeeStructure,
          postion
        )
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
