import PropTypes from 'prop-types';
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
import { FILTER_OPTIONS, TransactionHistoryFilter } from '../Bridges/TransactionHistoryFilter';
import { TransactionHistorySort } from '../Bridges/TransactionHistorySort';
import { bridgesList } from '../../constants/bridges';
import { allTokens } from '../../constants/bridges';
import { getHistory } from '../../apis/bridge/bridgeAPI';
import { FLASH_MESSAGE_DURATION } from '../../constants/global';
import { changeNetwork } from '../../apis/bridge/bridgeAPI';
import { CHANGE_NETWORK_PROMPT_DELAY } from '../../constants/bridges';
import ReactTimeAgo from 'react-time-ago';
import { filterData, sortData, titleCase } from './helpers';
import fromExponential from 'from-exponential';
import { useInterval } from '../../hooks/useInterval';

const TransactionHistory = (props) => {
  
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
  const [radioButtonSelected, setRadioButtonSelected] = useState('MOST_RECENT');

  const dummyLoadingDivisions = useRef([0, 0, 0, 0, 0, 0, 0]);
  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);
  const filterDivisionRef = useRef(null);
  const sortDivisionRef = useRef(null);
  const delay = useRef(10000);

  const {
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
    theme,
    setTransactionData,
    setMintUnmintOpHash,
    setFinalOpHash,
    setOpeningFromHistory,
    walletAddress,
    metamaskAddress,
    currentChain,
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
    openingFromTransaction,
    setOpeningFromTransaction,
    setTransactionTime,
  } = props;

  const [animationClass, setAnimationClass] = useState(openingFromTransaction ? 'leftToRightFadeInAnimation-4-bridge' : 'rightToLeftFadeInAnimation-4');

  const filteredData = useMemo(
    () => filterData(transactionData, checkBoxesState),
    [transactionData, checkBoxesState],
  );

  const sortedData = useMemo(
    () => sortData(filteredData, radioButtonSelected),
    [filteredData, radioButtonSelected],
  );


  const setBack = (value) => {
    setAnimationClass('leftToRightFadeOutAnimation-4');
    setTimeout(() => {
      if (value) {
        setTransaction(1);
      }
    }, 600);
  };

  const filterClickHandler = () => {
    setShowSort((prevState) => (prevState ? !prevState : prevState));
    setShowFilter((prevState) => !prevState);
  };

  const sortClickHandler = () => {
    setShowFilter((prevState) => (prevState ? !prevState : prevState));
    setShowSort((prevState) => !prevState);
  };

  useEffect(() => {
    const countOfChecked = Object.values(checkBoxesState).filter(
      (checkBoxState) => checkBoxState,
    ).length;
    setCheckedCount(countOfChecked);
  }, [checkBoxesState]);

  const actionClickHandler = (id) => {
    const selectedData = transactionData.find((item) => item.id === id);
    const prevFromBridge = fromBridge;
    const prevToBridge = toBridge;
    const prevOperation = operation;
    setFirstTokenAmount(selectedData.firstTokenAmount);
    setSecondTokenAmount(selectedData.secondTokenAmount);
    const currentFromBridge = bridgesList[selectedData.fromBridge];
    setFromBridge({
      name: currentFromBridge.name,
      image: currentFromBridge.bigIcon,
      buttonImage: currentFromBridge.buttonImage,
    });
    const currentToBridge = bridgesList[selectedData.toBridge];
    setToBridge({
      name: currentToBridge.name,
      image: currentToBridge.bigIcon,
      buttonImage: currentToBridge.buttonImage,
    });
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
    setTimeout(() => {
      setTokenIn({
        name: currentTokenIn.name,
        image: currentTokenIn.image,
        tokenData: tokenOneData,
      });
      setTokenOut({
        name: `${currentTokenOut.name}`,
        image: currentTokenOut.image,
      });
      if(selectedData.currentProgress === 3) {
        setSavedFromBridge(prevFromBridge);
        setSavedToBridge(prevToBridge);
        setSavedOperation(prevOperation);
      }
    }, 200);
    setFee(selectedData.fee);
    SetCurrentProgress(selectedData.currentProgress);
    setOperation(selectedData.operation);
    setMintUnmintOpHash(selectedData.txHash);
    setFinalOpHash(selectedData.txHash);
      setOpeningFromHistory(true);
    setTransactionTime(selectedData.timestamp);
    if(selectedData.currentProgress !== 3 && selectedData.chain !== metamaskChain) {
      displayMessage({
        type: 'warning',
        duration: FLASH_MESSAGE_DURATION,
        title: 'Chain mismatch',
        content: `Please change wallet chain to ${titleCase(selectedData.chain)}.`,
        isFlashMessageALink: false,
        flashMessageLink: '#',
      });
      
        setTimeout(async () => {
          try {
            await changeNetwork({ networkName: selectedData.chain });
          } catch (error) {
            displayMessage({
              type: 'error',
              duration: FLASH_MESSAGE_DURATION,
              title: 'Chain change failed',
              content: 'Failed to force change the chain. Please change in wallet.',
              isFlashMessageALink: false,
              flashMessageLink: '#',
            });
          }
        }, CHANGE_NETWORK_PROMPT_DELAY);
      
      resetToDefaultStates();
    } else {
      setAnimationClass('rightToLeftFadeOutAnimation-4');
      setTimeout(() => {
        setTransaction(3);
      }, 600);
    }
    
  };

  useInterval(async () => {
    if (metamaskAddress && walletAddress) {
      const data = await getHistory({ ethereumAddress: metamaskAddress, tzAddress: walletAddress });
      if (data.success) {
        setTransactionData(data.history);
      }
    }
  }, delay.current);

  useEffect(async () => {
    if (walletAddress && metamaskAddress) {
      setIsLoading(true);
      setOpeningFromTransaction(false);
      const data = await getHistory({ ethereumAddress: metamaskAddress, tzAddress: walletAddress });
      if (data.success) {
        setTransactionData(data.history);
        setIsLoading(false);
      } else {
        setTransactionData([]);
        displayMessage({
          type: 'error',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Fetch error',
          content:
            'Failed to fetch transaction history. Please retry after some time.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
        setIsLoading(false);
      }
    } else {
      if (!walletAddress && !metamaskAddress) {
        displayMessage({
          type: 'info',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Connect wallet',
          content: 'Connect both the wallets.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
      } else if (!walletAddress && metamaskAddress) {
        displayMessage({
          type: 'info',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Connect wallet',
          content: 'Please connect to tezos wallet.',
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
      } else if (!metamaskAddress && walletAddress) {
        displayMessage({
          type: 'info',
          duration: FLASH_MESSAGE_DURATION,
          title: 'Connect wallet',
          content: `Please connect to ${titleCase(currentChain)} wallet.`,
          isFlashMessageALink: false,
          flashMessageLink: '#',
        });
      }
    }
  }, [walletAddress, metamaskAddress]);

  // Handle closing of filter and sort components on clicking of outside of them.
  useEffect(() => {
    setTransactionTime(null);
    function handleClickOutsideDiv(event) {
      if (filterButtonRef.current && filterDivisionRef.current && !filterButtonRef.current.contains(event.target) && !filterDivisionRef.current.contains(event.target)) {
        setShowFilter((prevState) => (prevState ? !prevState : prevState));
      }
      if (sortButtonRef.current && sortDivisionRef.current && !sortButtonRef.current.contains(event.target) && !sortDivisionRef.current.contains(event.target)) {
        setShowSort((prevState) => (prevState ? !prevState : prevState));
      }
    }
    document.addEventListener('mousedown', handleClickOutsideDiv);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDiv);
    };
  }, []);

  return (
    <div
      className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov} ${animationClass}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal}`}>
          <div
            className={`flex flex-row justify-content-between mb-3 ${styles.topWrapper} `}
          >
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
            {!isLoading && sortedData.length > 0 && (
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
                  ref={sortButtonRef}
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
                  ref={filterButtonRef}
                  onClick={filterClickHandler}
                  style={{ cursor: 'pointer' }}
                ></img>
              </div>
            )}
            {showFilter ? (
              <TransactionHistoryFilter
                checkBoxesState={checkBoxesState}
                setCheckBoxesState={setCheckBoxesState}
                filterDivisionRef={filterDivisionRef}
              />
            ) : null}
            {showSort ? (
              <TransactionHistorySort
                radioButtonSelected={radioButtonSelected}
                setRadioButtonSelected={setRadioButtonSelected}
                sortDivisionRef={sortDivisionRef}
              />
            ) : null}
          </div>
          <div
            className={`mb-3 ${styles.lineBottom} ${styles.width}`}
          ></div>
          <div className={`${styles.transactionDataWrapper}`}>
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
                  <React.Fragment key={index}>
                    <div className={styles.resultsHeader}>
                      <div className={styles.resultsInfoWrapper}>
                        <div className={styles.tokenbg}>
                          <img
                            src={
                              data.currentProgress === 3
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
                          <p className={styles.value} title={fromExponential(data.secondTokenAmount)}>
                            {fromExponential(Number(Number(data.secondTokenAmount).toFixed(10)))} {data.tokenOut}
                          </p>
                          <p className={styles.amt}>
                            <ReactTimeAgo date={data.timestamp} locale="en-US" />
                          </p>
                        </div>
                      </div>
                      {data.currentProgress === 3 ? (
                        <div className={styles.detailWrapper}>
                          <p
                            id={data.id}
                            className={styles.details}
                            onClick={(e) => actionClickHandler(e.target.id)}
                          >
                            View details
                          </p>
                        </div>
                      ) : (
                        <div className={styles.detailWrapper}>
                          <p
                            id={data.id}
                            className={styles.action}
                            onClick={(e) => actionClickHandler(e.target.id)}
                          >
                            Action required <img src={actionRequired}></img>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={`mt-3 mb-3 ${styles.lineBottom} `}></div>
                  </React.Fragment>
                );
              })
            ) : (
              <div className={styles.noDataDiv}>
                <p className={styles.value}>No transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionHistory.propTypes = {
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
  openingFromTransaction: PropTypes.any,
  setOpeningFromTransaction: PropTypes.any,
  setTransactionTime: PropTypes.any,
};

export default TransactionHistory;
