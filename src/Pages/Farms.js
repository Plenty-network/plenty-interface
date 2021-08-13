import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import FarmCard from '../Components/FarmCard/FarmCard';

import plentyXtz from '../assets/images/farms/plenty-xtz.png';
import { connect } from 'react-redux';
import * as farmsActions from '../redux/actions/farms/farms.actions'
import * as userActions from '../redux/actions/user/user.action'
import CONFIG from '../config/config';

import PropTypes from "prop-types";


const Farms = (props) => {
  // TODO add redux state prop here
  useEffect(() => {
    renderFarms();
    console.log(props.userAddress);
    props.getFarmsData(props.isActiveOpen)
    
  },[])

  useEffect(() => {
    props.getUserStakes(props.userAddress,'FARMS',props.isActiveOpen)
    props.getHarvestValues(props.userAddress,'FARMS',props.isActiveOpen)
  },[props.userAddress])


  const farmsCardTypeList = {
    'PLENTY / XTZ LP' :{
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
    'KALAM / XTZ LP' :{
      image: plentyXtz,
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
    'hDAO / PLENTY LP' : {
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
    'KALAM / PLENTY LP' : {
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
  };

  const renderFarms = () => {
    let farmsToBeRendered = []
    for(let key in CONFIG.FARMS[CONFIG.NETWORK])
    {
      for(let farms in CONFIG.FARMS[CONFIG.NETWORK][key][props.isActiveOpen === true ? 'active' : 'inactive'])
      {
        farmsToBeRendered.push({
          farmData : CONFIG.FARMS[CONFIG.NETWORK][key][props.isActiveOpen === true ? 'active' : 'inactive'][farms],
          properties : farmsCardTypeList[CONFIG.FARMS[CONFIG.NETWORK][key][props.isActiveOpen === true ? 'active' : 'inactive'][farms].CARD_TYPE],
          identifier : key,
          location : farms,
          title : CONFIG.FARMS[CONFIG.NETWORK][key][props.isActiveOpen === true ? 'active' : 'inactive'][farms].CARD_TYPE
        })
      }
    }
    props.setFarmsToRender(farmsToBeRendered)
    //setFarmsToRender(farmsToBeRendered)
  }

  return (
    <>
    <div>
    <Container fluid className="page-layout-container">
      <Row>
        {
          props.farmsToRender.map((farm, index) => {
            return <FarmCard 
              handleStakeOfFarmInputValue = {props.handleStakeOfFarmInputValue}
              harvestOnFarm = {props.harvestOnFarm}
              stakeInputValues={props.stakeInputValues} 
              stakeOnFarm = {props.stakeOnFarm}
              openFarmsStakeModal = {props.openFarmsStakeModal}
              closeFarmsStakeModal={props.closeFarmsStakeModal}

              isActiveOpen = {props.isActiveOpen}
              activeFarmData = {props.activeFarmData}
              userStakes = {props.userStakes}
              harvestValueOnFarms = {props.harvestValueOnFarms}
              isStakeModalOpen={props.isStakeModalOpen}

              key={index} 
              {...farm.properties} 
              {...farm.farmData} 
              identifier={farm.identifier} 
              position={farm.location} 
              {...props}
            />;
        })}
      </Row>
    </Container>
    </div>
    </>
  );
};


Farms.propTypes = {
  walletAddress: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    userAddress : state.wallet.address,
    isActiveOpen : state.farms.isActiveOpen,
    stakeInputValues : state.farms.stakeInputValues,
    activeFarmData : state.farms.active,
    farmsToRender : state.farms.farmsToRender,
    userStakes : state.user.stakes,
    harvestValueOnFarms : state.user.harvestValueOnFarms,
    isStakeModalOpen : state.farms.isStakeModalOpen

  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleFarmsType : () => (dispatch(farmsActions.toggleFarmsType)),
    stakeOnFarm : (amount, farmIdentifier , isActive, position) => dispatch(farmsActions.stakeOnFarm(amount, farmIdentifier , isActive, position)),
    harvestOnFarm : (farmIdentifier, isActive, position) => dispatch(farmsActions.harvestOnFarm(farmIdentifier, isActive, position)),
    handleStakeOfFarmInputValue : (address,value) => dispatch(farmsActions.handleStakeOfFarmInputValue(address,value)),
    getFarmsData : (isActive) => (dispatch(farmsActions.getFarmsData(isActive))),
    setFarmsToRender  : (farmsToBeRender) => (dispatch(farmsActions.setFarmsToRender(farmsToBeRender))),
    getUserStakes : (address , type , isActive) => (dispatch(userActions.getUserStakes(address , type , isActive))),
    getHarvestValues : (address , type , isActive) => (dispatch(userActions.getHarvestValues(address , type , isActive))),
    openFarmsStakeModal : () => (dispatch(farmsActions.openFarmsStakeModal())),
    closeFarmsStakeModal : () => (dispatch(farmsActions.closeFarmsStakeModal())) 
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(Farms);

