import PropTypes from 'prop-types';
// import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Transaction.module.scss';
import '../../assets/scss/animation.scss';
import actionHistory from '../../assets/images/bridge/action_history.svg';
import actionRequired from '../../assets/images/bridge/action_required_arrow.svg';
import downArrow from '../../assets/images/bridge/down_history_arrow.svg';
import upArrow from '../../assets/images/bridge/up_history_arrow.svg';
import filterSelected from '../../assets/images/bridge/filter_selected.svg';
import filterNotSelected from '../../assets/images/bridge/filter_unselected.svg';
import filterApplied from '../../assets/images/bridge/filter_applied.svg';
import sortSelected from '../../assets/images/bridge/sort_selected.svg';
import sortNotSelected from '../../assets/images/bridge/sort_deselected.svg';
//import TransactionHistoryFilter from '../Bridges/TransactionHistoryFilter';
import { FILTER_OPTIONS, TransactionHistoryFilter } from '../Bridges/TransactionHistoryFilter';
import { TransactionHistorySort } from '../Bridges/TransactionHistorySort';
import { bridgesList, tokensList } from '../../constants/bridges';

const TransactionHistory = (props) => {
  const [animationCalss, SetAnimationClass] = useState('leftToRightFadeInAnimation-4-bridge');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

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
        if (`${a.date} ${a.time}` > `${b.date} ${b.time}`) {
          return -1;
        } else if (`${a.date} ${a.time}` < `${b.date} ${b.time}`) {
          return 1;
        }
        return 0;
      } else if (radioSelected === 'OLDEST') {
        if (`${a.date} ${a.time}` < `${b.date} ${b.time}`) {
          return -1;
        } else if (`${a.date} ${a.time}` > `${b.date} ${b.time}`) {
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
    () => filterData(props.transactionData, checkBoxesState, checkedCount),
    [props.transactionData, checkBoxesState],
  );

  const sortedData = useMemo(
    () => sortData(filteredData, radioButtonSelected),
    [filteredData, radioButtonSelected],
  );

  //const [filteredData, setFilteredData] = useState(props.transactionData);

  const setBack = (value) => {
    SetAnimationClass('rightToLeftFadeInAnimation-4');
    setTimeout(() => {
      if (value) {
        props.setTransaction(1);
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
    //console.log(props.transactionData.find((item) => item.id === Number(id)));
    const selectedData = props.transactionData.find((item) => item.id === Number(id));
    props.setFirstTokenAmount(selectedData.firstTokenAmount);
    props.setSecondTokenAmount(selectedData.secondTokenAmount);
    const currentFromBridge = bridgesList.find((bridge) => bridge.name === selectedData.fromBridge);
    props.setFromBridge({
      name: currentFromBridge.name,
      image: currentFromBridge.bigIcon,
      buttonImage: currentFromBridge.buttonImage,
    });
    const currentToBridge = bridgesList.find((bridge) => bridge.name === selectedData.toBridge);
    props.setToBridge({
      name: currentToBridge.name,
      image: currentToBridge.bigIcon,
      buttonImage: currentToBridge.buttonImage,
    });
    const currentTokenIn = tokensList[currentFromBridge.name].find(
      (token) => token.name === selectedData.tokenIn,
    );
    const currentTokenOut = tokensList[currentToBridge.name].find(
      (token) => token.name === selectedData.tokenOut,
    );
    //console.log(currentTokenIn);
    setTimeout(() => {
      props.setTokenIn({
        name: currentTokenIn.name,
        image: currentTokenIn.image,
      });
      props.setTokenOut({
        name: `${currentTokenOut.name}`,
        image: currentTokenOut.image, //Change after creating config.
      });
    }, 100);
    props.setSelectedId(Number(id));
    props.setFee(selectedData.fee);
    props.SetCurrentProgress(selectedData.currentProgress);
    props.setOperation(selectedData.operation);
    setTimeout(() => {
      props.setTransaction(3);
    }, 200);
  };

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
                src={showSort ? sortSelected : sortNotSelected}
                onClick={sortClickHandler}
                style={{ cursor: 'pointer' }}
              ></img>
              <img
                src={
                  checkedCount > 0 ? filterApplied : showFilter ? filterSelected : filterNotSelected
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
          {sortedData.map((data, index) => {
            return (
              <>
                <div key={index} className={styles.resultsHeader}>
                  <div className={styles.resultsInfoWrapper}>
                    <div className={styles.tokenbg}>
                      <img
                        src={
                          data.currentProgress === 4
                            ? data.operation === 'BRIDGE'
                              ? downArrow
                              : upArrow
                            : actionHistory
                        }
                        className={styles.tokens}
                      ></img>
                    </div>
                    <div>
                      <p className={styles.value}>
                        {data.secondTokenAmount} {data.tokenOut}
                      </p>
                      <p className={styles.amt}>
                        {data.date} ; {data.time}
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
          })}
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
};

export default TransactionHistory;
