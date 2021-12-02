import React, { useEffect, useState, useMemo } from 'react';
import FarmCard from '../Components/FarmCard/FarmCard';
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user/user.action';
import PropTypes from 'prop-types';
import { BsSearch } from 'react-icons/bs';
import styles1 from './Tokens/tokens.module.scss';
import { FormControl, InputGroup } from 'react-bootstrap';
import { Tab, Tabs } from 'react-bootstrap';
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
  openFarmsUnstakeModal,
  populateEmptyFarmsData,
  toggleFarmsType,
} from '../redux/slices/farms/farms.slice';
import {
  getFarmsDataThunk,
  harvestOnFarmThunk,
  stakeOnFarmThunk,
  unstakeOnFarmThunk,
} from '../redux/slices/farms/farms.thunk';
import { populateFarmsWithoutData } from '../utils/farmsPageUtils';

const Farms = (props) => {
  const [showActiveFarms, setShowActiveFarms] = useState([]);
  const [showInActiveFarms, setShowInActiveFarms] = useState([]);
  const [sortValue, setSortValue] = useState('APR');
  const [searchValue, setSearchValue] = useState('');
  const [tabchange, setTabchange] = useState(false);

  // * Initial Call
  useEffect(() => {
    if (props.activeFarms.length === 0 || props.inactiveFarms.length === 0) {
      const farmsWithoutData = populateFarmsWithoutData();
      props.populateEmptyFarmsData(farmsWithoutData);
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      props.getFarmsData(props.isActiveOpen);
      props.getUserStakes(props.userAddress, 'FARMS', props.isActiveOpen);
      props.getHarvestValues(props.userAddress, 'FARMS', props.isActiveOpen);
      props.fetchUserBalances(props.userAddress);
    };

    fetchData();
    const backgroundRefresh = setInterval(() => {
      fetchData();
    }, 60 * 1000);

    return () => clearInterval(backgroundRefresh);
  }, [props.isActiveOpen, props.userAddress, props.rpcNode]);

  const useSearchedFarmsList = (farms, searchText) => {
    if (searchText === '') {
      props.isActiveOpen ? setShowActiveFarms(farms) : setShowInActiveFarms(farms);
    }
    if (props.isActiveOpen) {
      const searchResults = farms?.filter((farm) =>
        farm.farmData.CARD_TYPE.toLowerCase().includes(searchText.toLowerCase()),
      );
      setShowActiveFarms(searchResults);
    } else {
      const searchResults = farms?.filter((farm) =>
        farm.farmData.CARD_TYPE.toLowerCase().includes(searchText.toLowerCase()),
      );
      setShowInActiveFarms(searchResults);
    }
  };

  const useSortedFarmsList = (farms, sortByOption) => {
    if (farms == null) {
      return null;
    }

    if (sortByOption === 'APR') {
      return farms.slice().sort((a, b) => (Number(a.values?.APR) < Number(b.values?.APR) ? 1 : -1));
    }

    if (sortByOption === 'TVL') {
      return farms
        .slice()
        .sort((a, b) =>
          Number(a.values?.totalLiquidty) < Number(b.values?.totalLiquidty) ? 1 : -1,
        );
    }

    if (sortByOption === 'Rewards') {
      return farms.slice().sort((a, b) => {
        const a1 = Number(a.values?.rewardRate * 2880);
        const b1 = Number(b.values?.rewardRate * 2880);
        return a1 < b1 ? 1 : -1;
      });
    }
    return farms;
  };

  useEffect(() => {
    if (searchValue === '') {
      const results = useSortedFarmsList(
        props.isActiveOpen ? props.activeFarms : props.inactiveFarms,
        sortValue,
      );
      props.isActiveOpen ? setShowActiveFarms(results) : setShowInActiveFarms(results);
    }
    if (searchValue) {
      useSearchedFarmsList(
        props.isActiveOpen
          ? showActiveFarms
            ? showActiveFarms
            : props.activeFarms
          : showInActiveFarms
          ? showInActiveFarms
          : props.inactiveFarms,
        searchValue,
      );
    }
  }, [searchValue]);

  useEffect(() => {
    if (sortValue) {
      if (showActiveFarms.length === 0 && showInActiveFarms.length === 0) {
        const sortresults = useSortedFarmsList(
          props.isActiveOpen ? props.activeFarms : props.inactiveFarms,
          sortValue,
        );

        props.isActiveOpen ? setShowActiveFarms(sortresults) : setShowInActiveFarms(sortresults);
      } else {
        const sortresults = useSortedFarmsList(
          props.isActiveOpen ? showActiveFarms : showInActiveFarms,
          sortValue,
        );
        props.isActiveOpen ? setShowActiveFarms(sortresults) : setShowInActiveFarms(sortresults);
      }
    }
  }, [sortValue, tabchange, props.activeFarms, props.inactiveFarms, props.isActiveOpen]);

  const storeActiveTab = (elem) => {
    setTabchange(!tabchange);

    if (elem === 'allfarms') {
      const results = useSortedFarmsList(
        props.isActiveOpen ? props.activeFarms : props.inactiveFarms,
        sortValue,
      );
      props.isActiveOpen ? setShowActiveFarms(results) : setShowInActiveFarms(results);
    }
    if (elem === 'youfarms') {
      const searchResults = (props.isActiveOpen ? props.activeFarms : props.inactiveFarms)?.filter(
        (farm) => farm.farmData.message?.includes('YOU rewards'),
      );

      props.isActiveOpen ? setShowActiveFarms(searchResults) : setShowInActiveFarms(searchResults);
    }
    if (elem === 'ctez') {
      const searchResults = (props.isActiveOpen ? props.activeFarms : props.inactiveFarms)?.filter(
        (farm) => farm.farmData.CARD_TYPE.toLowerCase().includes('ctez'),
      );
      props.isActiveOpen ? setShowActiveFarms(searchResults) : setShowInActiveFarms(searchResults);
    }
  };

  const farmsToRender = useMemo(() => {
    if (props.isActiveOpen && showActiveFarms.length === 0) {
      const results = useSortedFarmsList(props.activeFarms, sortValue);
      return results;
    }
    if (showActiveFarms.length !== 0) {
      if (props.isActiveOpen) {
        return showActiveFarms;
      }
    }
    if (!props.isActiveOpen && showInActiveFarms.length !== 0) {
      const results = useSortedFarmsList(showInActiveFarms, sortValue);
      return results;
    } else {
      const results = useSortedFarmsList(props.inactiveFarms, sortValue);
      return results;
    }
  }, [
    props.activeFarms,
    showInActiveFarms,
    showActiveFarms,
    props.inactiveFarms,
    props.isActiveOpen,
  ]);

  return (
    <>
      <div>
        <div>
          <div className={styles.header}>
            <Tabs
              className={`swap-container-tab ${styles.farmstab}`}
              mountOnEnter={true}
              unmountOnExit={true}
              onSelect={(e) => storeActiveTab(e)}
            >
              <Tab eventKey="allfarms" title="All farms"></Tab>
              <Tab eventKey="youfarms" title="YOU farms"></Tab>
              <Tab eventKey="ctez" title="🔥 Ctez Extravaganza 🔥"></Tab>
            </Tabs>
            <div className={styles.selectForm}>
              <span className={styles.sortby}>Sort by:</span>
              <select className={styles.formcontrol} onChange={(e) => setSortValue(e.target.value)}>
                <option value="APR">APR</option>
                <option value="TVL">TVL</option>
                <option value="Rewards">Rewards</option>
              </select>
            </div>
          </div>
          <div className={` mt-5 justify-between  ${styles.header2}`}>
            <div className={styles.leftDiv}>
              <InputGroup className={styles1.searchBar}>
                <InputGroup.Prepend>
                  <InputGroup.Text className="search-icon border-right-0">
                    <BsSearch />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="Search"
                  className={`shadow-none border-left-0 ${styles1.searchBox}`}
                  value={searchValue}
                  onChange={(ev) => setSearchValue(ev.target.value)}
                />
              </InputGroup>
            </div>
            <div className={styles.selectForm1}>
              <span className={styles.sortby}>Sort by:</span>
              <select className={styles.formcontrol} onChange={(e) => setSortValue(e.target.value)}>
                <option value="APR">APR</option>
                <option value="TVL">TVL</option>
                <option value="Rewards">Rewards</option>
              </select>
            </div>
            <div>
              <div className={styles.rightDiv}>
                <div>
                  <Switch
                    value={props.isActiveOpen}
                    onChange={() => props.toggleFarmsType(!props.isActiveOpen)}
                    trueLabel={'Active'}
                    falseLabel={'Inactive'}
                    inverted={true}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.cardsContainer}>
            {farmsToRender?.map((farm) => {
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
  activeFarms: PropTypes.any,
  closeFarmsStakeModal: PropTypes.any,
  closeFarmsUnstakeModal: PropTypes.any,
  connectWallet: PropTypes.any,
  currentBlock: PropTypes.any,
  fetchUserBalances: PropTypes.any,
  getFarmsData: PropTypes.any,
  getHarvestValues: PropTypes.any,
  getUserStakes: PropTypes.any,
  harvestOnFarm: PropTypes.any,
  harvestOperation: PropTypes.any,
  harvestValueOnFarms: PropTypes.any,
  inactiveFarms: PropTypes.any,
  isActiveOpen: PropTypes.any,
  openFarmsStakeModal: PropTypes.any,
  openFarmsUnstakeModal: PropTypes.any,
  populateEmptyFarmsData: PropTypes.any,
  rpcNode: PropTypes.any,
  stakeModal: PropTypes.any,
  stakeOnFarm: PropTypes.any,
  stakeOperation: PropTypes.any,
  toggleFarmsType: PropTypes.any,
  unstakeModal: PropTypes.any,
  unstakeOnFarm: PropTypes.any,
  unstakeOperation: PropTypes.any,
  userAddress: PropTypes.any,
  userStakes: PropTypes.any,
  walletAddress: PropTypes.string.isRequired,
  walletBalances: PropTypes.any,
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
    rpcNode: state.settings.rpcNode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    populateEmptyFarmsData: (farms) => dispatch(populateEmptyFarmsData(farms)),
    toggleFarmsType: (isActive) => dispatch(toggleFarmsType(isActive)),
    stakeOnFarm: (amount, farmIdentifier, isActive, position) =>
      dispatch(stakeOnFarmThunk(amount, farmIdentifier, isActive, position)),
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
          position,
        }),
      ),
    closeFarmsStakeModal: () => dispatch(closeFarmsStakeModal()),
    openFarmsUnstakeModal: (identifier, contractAddress, title, withdrawalFeeStructure, position) =>
      dispatch(
        openFarmsUnstakeModal({
          identifier,
          contractAddress,
          title,
          withdrawalFeeStructure,
          position,
        }),
      ),
    closeFarmsUnstakeModal: () => dispatch(closeFarmsUnstakeModal()),
    unstakeOnFarm: (stakesToUnstake, farmIdentifier, isActive, position) =>
      dispatch(unstakeOnFarmThunk(stakesToUnstake, farmIdentifier, isActive, position)),
    fetchUserBalances: (address) => dispatch(userActions.fetchUserBalances(address)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Farms);
