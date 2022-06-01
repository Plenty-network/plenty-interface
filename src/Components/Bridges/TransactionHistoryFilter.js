import PropTypes from 'prop-types';
import styles from './styles/TransactionHistoryFilter.module.scss';

export const FILTER_OPTIONS = [
  {
    checkboxId: 'FROM_TEZOS',
    checkboxLabel: 'Bridge from tezos',
    labelImageClass: styles.filterLabelUpImage,
  },
  {
    checkboxId: 'TO_TEZOS',
    checkboxLabel: 'Bridge to tezos',
    labelImageClass: styles.filterLabelDownImage,
  },
  {
    checkboxId: 'ACTION_REQUIRED',
    checkboxLabel: 'Action required',
    labelImageClass: styles.filterLabelActionImage,
  },
];

export const TransactionHistoryFilter = (props) => {
  const checkBoxChangeHandler = (checkBoxId) => {
    props.setCheckBoxesState((prevState) => ({
      ...prevState,
      [checkBoxId]: !prevState[checkBoxId],
    }));
  };

  const clearAllFiltersHandler = () => {
    Object.keys(props.checkBoxesState).forEach((checkBoxId) => {
      props.setCheckBoxesState((prevState) => ({
        ...prevState,
        [checkBoxId]: false,
      }));
    });
  };

  return (
    <div className={styles.filterBox} ref={props.filterDivisionRef}>
      <div className="flex flex-row" style={{ padding: '20px 14px 0px' }}>
        <p className={styles.filterHeading}>FILTER</p>
      </div>
      <div className={`mt-1 mx-auto ${styles.lineBottom} `}></div>
      {FILTER_OPTIONS.map((option, index) => {
        return (
          <label key={index} className={styles.filterOptionContainer}>
            <span className={option.labelImageClass}></span>
            <span className={styles.filterLabelText}>{option.checkboxLabel}</span>
            <input
              id={option.checkboxId}
              name="filter-history-option"
              type="checkbox"
              checked={props.checkBoxesState[option.checkboxId]}
              onChange={(event) => checkBoxChangeHandler(event.target.id)}
            />
            <span className={styles.checkmark}></span>
          </label>
        );
      })}
      <div className={styles.clearButtonWrapper}>
        <p className={styles.clearButtonText} onClick={clearAllFiltersHandler}>
          Clear all
        </p>
      </div>
    </div>
  );
};

TransactionHistoryFilter.propTypes = {
  checkBoxesState: PropTypes.any,
  setCheckBoxesState: PropTypes.any,
  filterDivisionRef: PropTypes.any,
};
