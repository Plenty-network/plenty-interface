import PropTypes from 'prop-types';
// import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Transaction.module.scss';
import '../../assets/scss/animation.scss';
import actionHistory from '../../assets/images/bridge/action_history.svg';
import actionRequired from '../../assets/images/bridge/action_required_arrow.svg';
import downArrow from '../../assets/images/bridge/down_history_arrow.svg';
import upArrowDark from '../../assets/images/bridge/up_history_arrow_dark.svg';
import downArrowDark from '../../assets/images/bridge/down_history_arrow_dark.svg';
import upArrow from '../../assets/images/bridge/up_history_arrow.svg';
import filterSelected from '../../assets/images/bridge/filter_selected.svg';
import filterNotSelected from '../../assets/images/bridge/filter_unselected.svg';
import filterApplied from '../../assets/images/bridge/filter_applied.svg';
import sortSelected from '../../assets/images/bridge/sort_selected.svg';
import sortNotSelected from '../../assets/images/bridge/sort_deselected.svg';
import filterSelectedDark from '../../assets/images/bridge/filter_selected_dark.svg';
import filterNotSelectedDark from '../../assets/images/bridge/filter_unselected_dark.svg';
import filterAppliedDark from '../../assets/images/bridge/filter_applied_dark.svg';
import sortSelectedDark from '../../assets/images/bridge/sort_selected_dark.svg';
import sortNotSelectedDark from '../../assets/images/bridge/sort_deselected_dark.svg';
//import TransactionHistoryFilter from '../Bridges/TransactionHistoryFilter';
import { FILTER_OPTIONS, TransactionHistoryFilter } from '../Bridges/TransactionHistoryFilter';
import { TransactionHistorySort } from '../Bridges/TransactionHistorySort';
import { bridgesList } from '../../constants/bridges';
import { allTokens } from '../../constants/bridges';
import { getHistory } from '../../apis/bridge/bridgeAPI';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import { changeNetwork } from '../../apis/bridge/bridgeAPI';
import { CHANGE_NETWORK_PROMPT_DELAY } from '../../constants/bridges';

const TransactionHistory = (props) => {
  const [animationCalss, SetAnimationClass] = useState('leftToRightFadeInAnimation-4-bridge');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [checkBoxesState, setCheckBoxesState] = useState(
    FILTER_OPTIONS.reduce((checkBoxesState, option) => {
      return {
        ...checkBoxesState,
        [option.checkboxId]: false,
      };
    }, {}),
  );
  const [checkedCount, setCheckedCount] = useState(0);
  //Currently default sort option is by most recent transaction. Need to change this if default sort option changes.
  const [radioButtonSelected, setRadioButtonSelected] = useState('MOST_RECENT');

  const dummyLoadingDivisions = useRef([0, 0, 0, 0, 0, 0, 0]);

  const {
    // eslint-disable-next-line
    transaction,
    setTransaction,
    transactionData,
    setFromBridge,
    setToBridge,
    setFirstTokenAmount,
    setSecondTokenAmount,
    setFee,
    SetCurrentProgress,
    setOperation,
    setTokenIn,
    setTokenOut,
    setSelectedId,
    theme,
    setTransactionData,
    setMintUnmintOpHash,
    setFinalOpHash,
    setOpeningFromHistory,
    walletAddress,
    metamaskAddress,
    // currentChain,
    metamaskChain,
    loadedTokensList,
    setSavedFromBridge,
    setSavedToBridge,
    setSavedOperation,
    fromBridge,
    toBridge,
    operation,
    resetToDefaultStates,
    displayMessage,
  } = props;

  const filterData = (originalData, checkBoxesState) => {
    const checkedCount = Object.values(checkBoxesState).filter(
      (checkBoxState) => checkBoxState,
    ).length;
    const dataToFilter = [...originalData];
    if (checkedCount === 0 || checkedCount === 3) {
      return dataToFilter;
    } else if (checkedCount === 1) {
      // Have to add conditions if any other filters introduced in future.
      return dataToFilter.filter((transaction) => {
        if (checkBoxesState['TO_TEZOS']) {
          return transaction.operation === 'BRIDGE' && transaction.currentProgress === 4;
        } else if (checkBoxesState['FROM_TEZOS']) {
          return transaction.operation === 'UNBRIDGE' && transaction.currentProgress === 4;
        } else if (checkBoxesState['ACTION_REQUIRED']) {
          return transaction.currentProgress !== 4;
        }
        return true;
      });
    } else {
      if (checkBoxesState['TO_TEZOS'] && checkBoxesState['FROM_TEZOS']) {
        return dataToFilter.filter(
          (transaction) =>
            (transaction.operation === 'BRIDGE' || transaction.operation === 'UNBRIDGE') &&
            transaction.currentProgress === 4,
        );
      } else if (checkBoxesState['TO_TEZOS'] && checkBoxesState['ACTION_REQUIRED']) {
        return dataToFilter.filter(
          (transaction) => transaction.operation === 'BRIDGE' || transaction.currentProgress !== 4,
        );
      } else if (checkBoxesState['FROM_TEZOS'] && checkBoxesState['ACTION_REQUIRED']) {
        return dataToFilter.filter(
          (transaction) =>
            transaction.operation === 'UNBRIDGE' || transaction.currentProgress !== 4,
        );
      }
    }
  };

  const sortData = (filteredData, radioSelected) => {
    const dataToSort = filteredData;
    // Change the date comparison method anf format.
    return dataToSort.sort((a, b) => {
      if (radioSelected === 'MOST_RECENT') {
        if (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()) {
          return -1;
        } else if (new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime()) {
          return 1;
        }
        return 0;
      } else if (radioSelected === 'OLDEST') {
        if (new Date(a.timestamp).getTime() < new Date(b.timestamp).getTime()) {
          return -1;
        } else if (new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime()) {
          return 1;
        }
        return 0;
      } else if (radioSelected === 'INCREASING_VALUE') {
        if (a.secondTokenAmount < b.secondTokenAmount) {
          return -1;
        } else if (a.secondTokenAmount > b.secondTokenAmount) {
          return 1;
        }
        return 0;
      } else if (radioSelected === 'DECREASING_VALUE') {
        if (a.secondTokenAmount > b.secondTokenAmount) {
          return -1;
        } else if (a.secondTokenAmount < b.secondTokenAmount) {
          return 1;
        }
        return 0;
      }
    });
  };

  const filteredData = useMemo(
    () => filterData(transactionData, checkBoxesState, checkedCount),
    [transactionData, checkBoxesState],
  );

  const sortedData = useMemo(
    () => sortData(filteredData, radioButtonSelected),
    [filteredData, radioButtonSelected],
  );

  //const [filteredData, setFilteredData] = useState(transactionData);

  const setBack = (value) => {
    SetAnimationClass('rightToLeftFadeInAnimation-4');
    setTimeout(() => {
      if (value) {
        setTransaction(1);
      }
    }, 200);
  };

  const filterClickHandler = () => {
    setShowSort((prevState) => (prevState ? !prevState : prevState));
    setShowFilter((prevState) => !prevState);
  };

  const sortClickHandler = () => {
    setShowFilter((prevState) => (prevState ? !prevState : prevState));
    setShowSort((prevState) => !prevState);
  };

  //CheckBox component related
  useEffect(() => {
    const countOfChecked = Object.values(checkBoxesState).filter(
      (checkBoxState) => checkBoxState,
    ).length;
    setCheckedCount(countOfChecked);
  }, [checkBoxesState]);

  const actionClickHandler = (id) => {
    //console.log(id);
    //console.log(transactionData.find((item) => item.id === Number(id)));
    const selectedData = transactionData.find((item) => item.id === id);
    const prevFromBridge = fromBridge;
    const prevToBridge = toBridge;
    const prevOperation = operation;
    setFirstTokenAmount(selectedData.firstTokenAmount);
    setSecondTokenAmount(selectedData.secondTokenAmount);
    const currentFromBridge = bridgesList.find((bridge) => bridge.name === selectedData.fromBridge);
    setFromBridge({
      name: currentFromBridge.name,
      image: currentFromBridge.bigIcon,
      buttonImage: currentFromBridge.buttonImage,
    });
    const currentToBridge = bridgesList.find((bridge) => bridge.name === selectedData.toBridge);
    setToBridge({
      name: currentToBridge.name,
      image: currentToBridge.bigIcon,
      buttonImage: currentToBridge.buttonImage,
    });
    //const currentTokenIn = tokensList[currentFromBridge.name].find((token) => token.name === selectedData.tokenIn);
    //const currentTokenOut = tokensList[currentToBridge.name].find((token) => token.name === selectedData.tokenOut);
    const currentTokenIn = {
      name: selectedData.tokenIn,
      image: Object.prototype.hasOwnProperty.call(allTokens, selectedData.tokenIn)
        ? allTokens[selectedData.tokenIn]
        : allTokens.fallback,
    };
    const currentTokenOut = {
      name: selectedData.tokenOut,
      image: Object.prototype.hasOwnProperty.call(allTokens, selectedData.tokenOut)
        ? allTokens[selectedData.tokenOut]
        : allTokens.fallback,
    };
    const tokenOneData =
      selectedData.operation === 'BRIDGE'
        ? loadedTokensList[selectedData.chain].find((token) => token.name === selectedData.tokenIn)
            .tokenData
        : loadedTokensList.TEZOS[selectedData.chain].find(
            (token) => token.name === selectedData.tokenIn,
          ).tokenData;
    //console.log(currentTokenIn);
    setTimeout(() => {
      setTokenIn({
        name: currentTokenIn.name,
        image: currentTokenIn.image,
        tokenData: tokenOneData,
      });
      setTokenOut({
        name: `${currentTokenOut.name}`,
        image: currentTokenOut.image, //Change after creating config.
      });
      if(selectedData.currentProgress === 4) {
        console.log(prevFromBridge, prevToBridge, prevOperation);
        setSavedFromBridge(prevFromBridge);
        setSavedToBridge(prevToBridge);
        setSavedOperation(prevOperation);
      }
    }, 100);
    setSelectedId(id);
    setFee(selectedData.fee);
    SetCurrentProgress(selectedData.currentProgress);
    setOperation(selectedData.operation);
    setMintUnmintOpHash(selectedData.txHash);
    setFinalOpHash(selectedData.txHash);
    if (selectedData.currentProgress === 4) {
      setOpeningFromHistory(true);
    }
    // console.log(prevFromBridge, prevToBridge, prevOperation);
    // setSavedFromBridge(prevFromBridge);
    // setSavedToBridge(prevToBridge);
    // setSavedOperation(prevOperation);
    if(selectedData.currentProgress !== 4 && selectedData.chain !== metamaskChain) {
      //alert(`Chain for this operation is ${selectedData.chain} and the chain selected in metamask wallet is ${metamaskChain}. Please change the chain to ${selectedData.chain} in metamask wallet to proceed.`);
      console.log(`Please change metamask wallet chain to ${selectedData.chain}.`);
      displayMessage({
        type: 'warning',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Chain Mismatch',
        content: `Please change metamask wallet chain to ${selectedData.chain}.`,
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      
        setTimeout(async () => {
          try {
            await changeNetwork({ networkName: selectedData.chain });
          } catch (error) {
            console.log(error.message);
          }
        }, CHANGE_NETWORK_PROMPT_DELAY);
      
      resetToDefaultStates();
    } else {
      setTimeout(() => {
        setTransaction(3);
      }, 200);
    }
    
  };

  useEffect(async () => {
    setIsLoading(true);
    // const data = await getHistory({ ethereumAddress:'0xb96E3B80D52Fed6Aa53bE5aE282a4DDA06db8122', tzAddress: 'tz1QNjbsi2TZEusWyvdH3nmsCVE3T1YqD9sv' });
    console.log(metamaskAddress,walletAddress);
    const data = await getHistory({ ethereumAddress: metamaskAddress, tzAddress: walletAddress });
    console.log(data);
    if (data.success) {
      setTransactionData(data.history);
      setIsLoading(false);
    } else {
      setTransactionData([]);
      displayMessage({
        type: 'error',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Fetch Error',
        content: 'Failed to fetch transaction history. Please retry after some time.',
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      setIsLoading(false);
    }
  }, []);

  /* api call example 
  const fetchData = async () => {
    const res = await axios.get(
      'https://api.hangzhou2net.tzkt.io/v1/accounts/KT1X6MCugcwqhS8oikqHDQvAdVjVvtxZ3tUF/operations?type=transaction&limit=999&entrypoint=mint&sender=KT1X6MCugcwqhS8oikqHDQvAdVjVvtxZ3tUF&status=applied',
    );
    console.log(res);
  };
  fetchData();
*/
  return (
    <div
      className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal} ${animationCalss}`}>
          <div className="flex flex-row justify-content-between mb-3">
            <div className={`flex ${styles.headingWrapper}`}>
              <p
                className={styles.arrowback}
                onClick={() => {
                  setBack(1);
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className="mr-3 material-icons-round ">arrow_back</span>
              </p>
              <p className={styles.heading}>Transaction history</p>
            </div>
            <div className={styles.filterImageWrapper}>
              <img
                src={
                  theme === 'light'
                    ? showSort
                      ? sortSelected
                      : sortNotSelected
                    : showSort
                    ? sortSelectedDark
                    : sortNotSelectedDark
                }
                onClick={sortClickHandler}
                style={{ cursor: 'pointer' }}
              ></img>
              <img
                src={
                  theme === 'light'
                    ? checkedCount > 0
                      ? filterApplied
                      : showFilter
                      ? filterSelected
                      : filterNotSelected
                    : checkedCount > 0
                    ? filterAppliedDark
                    : showFilter
                    ? filterSelectedDark
                    : filterNotSelectedDark
                }
                onClick={filterClickHandler}
                style={{ cursor: 'pointer' }}
              ></img>
            </div>
            {showFilter ? (
              <TransactionHistoryFilter
                checkBoxesState={checkBoxesState}
                setCheckBoxesState={setCheckBoxesState}
              />
            ) : null}
            {showSort ? (
              <TransactionHistorySort
                radioButtonSelected={radioButtonSelected}
                setRadioButtonSelected={setRadioButtonSelected}
              />
            ) : null}
          </div>
          <div className={`mb-3 ${styles.lineBottom} `}></div>
          {isLoading ? (
            dummyLoadingDivisions.current.map((box, index) => {
              return (
                <div
                  key={index}
                  className={`mb-2 ${styles.shimmerEffect}`}
                  style={{ height: '50px', width: '100%' }}
                ></div>
              );
            })
          ) : sortedData.length > 0 ? (
            sortedData.map((data, index) => {
              return (
                <>
                  <div key={index} className={styles.resultsHeader}>
                    <div className={styles.resultsInfoWrapper}>
                      <div className={styles.tokenbg}>
                        <img
                          src={
                            data.currentProgress === 4
                              ? data.operation === 'BRIDGE'
                                ? theme === 'light'
                                  ? downArrow
                                  : downArrowDark
                                : theme === 'light'
                                ? upArrow
                                : upArrowDark
                              : actionHistory
                          }
                          className={styles.tokens}
                        ></img>
                      </div>
                      <div>
                        <p className={styles.value}>
                          {Number(data.secondTokenAmount).toFixed(4)} {data.tokenOut}
                        </p>
                        <p className={styles.amt}>
                          {new Date(data.timestamp).toLocaleDateString('en-IN')} ;{' '}
                          {('0' + new Date(data.timestamp).getHours()).slice(-2)}:
                          {('0' + new Date(data.timestamp).getMinutes()).slice(-2)}
                        </p>
                      </div>
                    </div>
                    {data.currentProgress === 4 ? (
                      <div className={styles.detailWrapper}>
                        <p
                          id={data.id}
                          className={styles.details}
                          onClick={(e) => actionClickHandler(e.target.id)}
                        >
                          View Details
                        </p>
                      </div>
                    ) : (
                      <div className={styles.detailWrapper}>
                        <p
                          id={data.id}
                          className={styles.action}
                          onClick={(e) => actionClickHandler(e.target.id)}
                        >
                          Action Required <img src={actionRequired}></img>
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`mt-3 mb-3 ${styles.lineBottom} `}></div>
                </>
              );
            })
          ) : (
            <div className={styles.noDataDiv}>
              <p className={styles.value}>No trasaction history data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TransactionHistory.propTypes = {
  transaction: PropTypes.any,
  setTransaction: PropTypes.any,
  transactionData: PropTypes.any,
  setFromBridge: PropTypes.any,
  setToBridge: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setSecondTokenAmount: PropTypes.any,
  setFee: PropTypes.any,
  SetCurrentProgress: PropTypes.any,
  setOperation: PropTypes.any,
  setTokenIn: PropTypes.any,
  setTokenOut: PropTypes.any,
  setSelectedId: PropTypes.any,
  theme: PropTypes.any,
  setTransactionData: PropTypes.any,
  setMintUnmintOpHash: PropTypes.any,
  setFinalOpHash: PropTypes.any,
  setOpeningFromHistory: PropTypes.any,
  walletAddress: PropTypes.any,
  metamaskAddress: PropTypes.any,
  currentChain: PropTypes.any,
  metamaskChain: PropTypes.any,
  loadedTokensList: PropTypes.any,
  setSavedFromBridge: PropTypes.any,
  setSavedToBridge: PropTypes.any,
  setSavedOperation: PropTypes.any,
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  operation: PropTypes.any,
  resetToDefaultStates: PropTypes.any,
  displayMessage: PropTypes.any,
};

export default TransactionHistory;
