import React, { useEffect } from 'react';

import FarmCard from '../Components/FarmCard/FarmCard';

import plentyXtz from '../assets/images/farms/plenty-xtz.png';
import plentyWBUSD from '../assets/images/farms/PLENTY-wBUSD.png';
import plentyWUSDC from '../assets/images/farms/PLENTY-wUSDC.png';
import plentyWWBTC from '../assets/images/farms/PLENTY-wWBTC.png';

import plentyToken from '../assets/images/logo_small.png';
import { connect } from 'react-redux';
import * as farmsActions from '../redux/actions/farms/farms.actions';
import * as userActions from '../redux/actions/user/user.action';
import CONFIG from '../config/config';
import PropTypes from 'prop-types';
import * as walletActions from '../redux/actions/wallet/wallet.action';
import Switch from '../Components/Ui/Switch/Switch';
import StakeModal from '../Components/Ui/Modals/StakeModal';
import UnstakeModal from '../Components/Ui/Modals/UnstakeModal';

import styles from '../assets/scss/partials/_farms.module.scss';
import FarmModals from '../Components/FarmPage/FarmModals';
import { throttle } from 'lodash/function';

const Farms = (props) => {
  const fetchData = () => {
    renderFarms();
    props.getFarmsData(props.isActiveOpen);
    props.getUserStakes(props.userAddress, 'FARMS', props.isActiveOpen);
    props.getHarvestValues(props.userAddress, 'FARMS', props.isActiveOpen);
    props.fetchUserBalances(props.userAddress);
  };

  useEffect(() => {
    const backgroundRefresh = throttle(fetchData, 2000, { trailing: true });

    backgroundRefresh();
  }, [props.isActiveOpen, props.userAddress]);

  const farmsCardTypeList = {
    'PLENTY / XTZ LP': {
      image: plentyXtz,
      harvestImg: plentyToken,
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
    'KALAM / XTZ LP': {
      image: plentyXtz,
      harvestImg: plentyToken,
      multi: '100',
      title: 'KALAM / XTZ LP',
      apr: 3,
      apy: '1111',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
      deposit: 'KALAM - XTZ LP',
      liquidity: '100000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Quipuswap LP',
      rewards: '1000 KALAM / DAY',
    },
    'hDAO / PLENTY LP': {
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
      source: 'Plenty LP',
      rewards: '1000 PLENTY / DAY',
    },
    'KALAM / PLENTY LP': {
      image: plentyXtz,
      harvestImg: plentyToken,
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
      source: 'Plenty LP',
      rewards: '1000 PLENTY / DAY',
    },
    'PLENTY / wUSDC LP': {
      image: plentyWUSDC,
      harvestImg: plentyToken,
      multi: '100',
      title: 'PLENTY / wUSDC LP',
      apr: 0,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
      deposit: 'PLENTY / wUSDC LP',
      liquidity: '5000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Plenty LP',
      rewards: '1000 PLENTY / DAY',
    },
    'PLENTY / wBUSD LP': {
      image: plentyWBUSD,
      harvestImg: plentyToken,
      multi: '100',
      title: 'PLENTY / wBUSD LP',
      apr: 0,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
      deposit: 'PLENTY / wBUSD LP',
      liquidity: '5000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Plenty LP',
      rewards: '1000 PLENTY / DAY',
    },
    'PLENTY / wWBTC LP': {
      image: plentyWWBTC,
      harvestImg: plentyToken,
      multi: '100',
      title: 'PLENTY / wWBTC LP',
      apr: 0,
      apy: '2621',
      earn: 'PLENTY',
      fee: '0%',
      earned: 0,
      deposit: 'PLENTY / wWBTC LP',
      liquidity: '5000',
      withdrawalFee: '0%',
      balance: 0,
      userBalance: 0,
      URL: '',
      active: true,
      source: 'Plenty LP',
      rewards: '1000 PLENTY / DAY',
    },
  };

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
            farmsCardTypeList[
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
    currentBlock: state.user.currentBlock,
    walletBalances: state.user.balances,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    toggleFarmsType: (isActive) =>
      dispatch(farmsActions.toggleFarmsType(isActive)),
    stakeOnFarm: (amount, farmIdentifier, isActive, position) =>
      dispatch(
        farmsActions.stakeOnFarm(amount, farmIdentifier, isActive, position)
      ),
    harvestOnFarm: (farmIdentifier, isActive, position) =>
      dispatch(farmsActions.harvestOnFarm(farmIdentifier, isActive, position)),
    handleStakeOfFarmInputValue: (value) =>
      dispatch(farmsActions.handleStakeOfFarmInputValue(value)),
    getFarmsData: (isActive) => dispatch(farmsActions.getFarmsData(isActive)),
    setFarmsToRender: (farmsToBeRender) =>
      dispatch(farmsActions.setFarmsToRender(farmsToBeRender)),
    getUserStakes: (address, type, isActive) =>
      dispatch(userActions.getUserStakes(address, type, isActive)),
    getHarvestValues: (address, type, isActive) =>
      dispatch(userActions.getHarvestValues(address, type, isActive)),
    openFarmsStakeModal: (identifier, title, position, contractAddress) =>
      dispatch(
        farmsActions.openFarmsStakeModal(
          identifier,
          title,
          position,
          contractAddress
        )
      ),
    closeFarmsStakeModal: () => dispatch(farmsActions.closeFarmsStakeModal()),
    openFarmsUnstakeModal: (
      identifier,
      contractAddress,
      title,
      withdrawalFeeStructure,
      postion
    ) =>
      dispatch(
        farmsActions.openFarmsUnstakeModal(
          identifier,
          contractAddress,
          title,
          withdrawalFeeStructure,
          postion
        )
      ),
    closeFarmsUnstakeModal: () =>
      dispatch(farmsActions.closeFarmsUnstakeModal()),
    unstakeOnFarm: (stakesToUnstake, farmIdentifier, isActive, position) =>
      dispatch(
        farmsActions.unstakeOnFarm(
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
