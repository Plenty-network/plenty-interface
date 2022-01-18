import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FarmCard from '../Components/FarmCard/FarmCard';
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user/user.action';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { BsSearch } from 'react-icons/bs';
import styles1 from '../assets/scss/tokens.module.scss';
import { FormControl, InputGroup, Tabs, Tab } from 'react-bootstrap';
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
  toggleStakedFarmsOnly,
} from '../redux/slices/farms/farms.slice';
import {
  getFarmsDataThunk,
  harvestOnFarmThunk,
  stakeOnFarmThunk,
  unstakeOnFarmThunk,
} from '../redux/slices/farms/farms.thunk';
import { populateFarmsWithoutData } from '../utils/farmsPageUtils';
import { FARM_SORT_OPTIONS, FARM_TAB } from '../constants/farmsPage';

const Farms = (props) => {
  const [sortValue, setSortValue] = useState(FARM_SORT_OPTIONS.APR);
  const [searchValue, setSearchValue] = useState('');
  const [tabChange, setTabChange] = useState(FARM_TAB.ALL);
  const [isSelected, setIsSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function toggleHidden() {
    setIsOpen(!isOpen);
  }
  function setSelectTitle(e) {
    setSortValue(e.target.value);
    toggleHidden();
  }

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

  const sortFarmsFunc = useCallback(
    (a, b) => {
      if (sortValue === FARM_SORT_OPTIONS.APR) {
        return Number(a.values?.APR) < Number(b.values?.APR) ? 1 : -1;
      }

      if (sortValue === FARM_SORT_OPTIONS.TVL) {
        return Number(a.values?.totalLiquidty) < Number(b.values?.totalLiquidty) ? 1 : -1;
      }

      if (sortValue === FARM_SORT_OPTIONS.REWARDS) {
        const a1 = Number(a.values?.rewardRate * 2880);
        const b1 = Number(b.values?.rewardRate * 2880);
        return a1 < b1 ? 1 : -1;
      }

      return 0;
    },
    [sortValue],
  );

  const filterBySearch = useCallback(
    (farm) => farm.farmData.CARD_TYPE.toLowerCase().includes(searchValue.toLowerCase()),
    [searchValue],
  );

  const filterByTab = useCallback(
    (farm) => {
      if (tabChange === FARM_TAB.CTEZ) {
        return farm.farmData.CARD_TYPE.toLowerCase().includes('ctez');
      }

      if (tabChange === FARM_TAB.YOU) {
        return props.userStakes[farm.farmData.CONTRACT]?.stakedAmount > 0;
      }

      return true;
    },
    [tabChange, props.userStakes],
  );

  const filterByStaked = useCallback(
    (farm) => {
      if (!props.isStakedOnlyOpen) return true;

      return props.userStakes[farm.farmData.CONTRACT]?.stakedAmount > 0;
    },
    [props.isStakedOnlyOpen, props.userStakes],
  );

  const farmsToRender = useMemo(() => {
    const farmsInView = props.isActiveOpen
      ? props.activeFarms.slice()
      : props.inactiveFarms.slice();

    return farmsInView
      .filter(filterBySearch)
      .filter(filterByTab)
      .filter(filterByStaked)
      .sort(sortFarmsFunc);
  }, [
    filterBySearch,
    filterByTab,
    filterByStaked,
    sortFarmsFunc,
    props.activeFarms,
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
              onSelect={(e) => setTabChange(e)}
            >
              <Tab eventKey={FARM_TAB.ALL} title={FARM_TAB.ALL} />
              <Tab eventKey={FARM_TAB.YOU} title={FARM_TAB.YOU} />
            </Tabs>

            <div className={styles.selectForm}>
              <div className={styles.selectgroup}>
                <label htmlFor="button"> Sort by:</label>
                <button
                  id="button"
                  onClick={(ev) => toggleHidden(ev)}
                  className={`button ${styles.sortLabel}
                `}
                >
                  <span id="select-label">{sortValue}</span>
                  <span className={`material-icons ${styles.arrow} `}>keyboard_arrow_down</span>
                </button>

                <div
                  className={clsx(styles.dropdown, isOpen ? styles.show : styles.hidden)}
                  id="dropdown"
                >
                  <label className={` ${styles.sortby} ${styles.sortby} `}>SORT BY:</label>
                  <div className={styles.selectOption}>
                    <label className={styles.selectItem} htmlFor="select-apr">
                      {FARM_SORT_OPTIONS.APR}
                    </label>
                    <input
                      className={`option ${styles.option}`}
                      id="select-apr"
                      type="radio"
                      name="where"
                      value={FARM_SORT_OPTIONS.APR}
                      onClick={(ev) => setSelectTitle(ev)}
                    />
                  </div>
                  <div className={styles.selectOption}>
                    <label className={styles.selectItem} htmlFor="select-tvl">
                      {FARM_SORT_OPTIONS.TVL}
                    </label>
                    <input
                      className={`option ${styles.option}`}
                      id="select-tvl"
                      type="radio"
                      name="where"
                      value={FARM_SORT_OPTIONS.TVL}
                      onClick={(ev) => setSelectTitle(ev)}
                    />
                  </div>
                  <div className={styles.selectOption}>
                    <label className={styles.selectItem} htmlFor="select-rewards">
                      {FARM_SORT_OPTIONS.REWARDS}
                    </label>
                    <input
                      className={`option ${styles.option}`}
                      name="where"
                      id="select-rewards"
                      type="radio"
                      value={FARM_SORT_OPTIONS.REWARDS}
                      onClick={(ev) => setSelectTitle(ev)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={` mt-4 justify-between  ${styles.header2}`}>
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
              <span className={styles.sortButton} onClick={() => setIsSelected(!isSelected)}>
                Sort
                <span className={clsx('material-icons', styles.arrow, isSelected && styles.rotate)}>
                  keyboard_arrow_up
                </span>
              </span>
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
                {/* <div className={styles.stakedSwitch}>
                  <Form.Switch
                    id="switch-staked"
                    label="Staked Only"
                    checked={props.isStakedOnlyOpen}
                    onChange={() => props.toggleStakedFarmsOnly(!props.isStakedOnlyOpen)}
                  />
                </div> */}
              </div>
            </div>
          </div>
          {isSelected && (
            <div className={`justify-between flex ${styles.mobileSort}`}>
              <div
                onClick={() => setSortValue(FARM_SORT_OPTIONS.APR)}
                className={clsx(
                  styles.sortButton,
                  sortValue === FARM_SORT_OPTIONS.APR ? styles.addbg : styles.removebg,
                )}
              >
                {FARM_SORT_OPTIONS.APR}
              </div>
              <div
                onClick={() => setSortValue(FARM_SORT_OPTIONS.TVL)}
                className={clsx(
                  styles.sortButton,
                  sortValue === FARM_SORT_OPTIONS.TVL ? styles.addbg : styles.removebg,
                )}
              >
                {FARM_SORT_OPTIONS.TVL}
              </div>
              <div
                onClick={() => setSortValue(FARM_SORT_OPTIONS.REWARDS)}
                className={clsx(
                  styles.sortButton,
                  sortValue === FARM_SORT_OPTIONS.REWARDS ? styles.addbg : styles.removebg,
                )}
              >
                {FARM_SORT_OPTIONS.REWARDS}
              </div>
            </div>
          )}
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
                  theme={props.theme}
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
  isStakedOnlyOpen: PropTypes.bool,
  openFarmsStakeModal: PropTypes.any,
  openFarmsUnstakeModal: PropTypes.any,
  populateEmptyFarmsData: PropTypes.any,
  rpcNode: PropTypes.any,
  stakeModal: PropTypes.any,
  stakeOnFarm: PropTypes.any,
  stakeOperation: PropTypes.any,
  toggleFarmsType: PropTypes.any,
  toggleStakedFarmsOnly: PropTypes.any,
  unstakeModal: PropTypes.any,
  unstakeOnFarm: PropTypes.any,
  unstakeOperation: PropTypes.any,
  userAddress: PropTypes.any,
  userStakes: PropTypes.any,
  walletAddress: PropTypes.string.isRequired,
  walletBalances: PropTypes.any,
  theme: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    userAddress: state.wallet.address,
    isActiveOpen: state.farms.isActiveOpen,
    isStakedOnlyOpen: state.farms.isStakedOnlyOpen,
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
    toggleStakedFarmsOnly: (isActive) => dispatch(toggleStakedFarmsOnly(isActive)),
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
