import PropTypes from 'prop-types';
import styles from './styles/TransactionHistorySort.module.scss';

export const SORT_OPTIONS = [
  {
    radioButtonValue: 'MOST_RECENT',
    radioButtonLabel: 'Most recent',
  },
  {
    radioButtonValue: 'OLDEST',
    radioButtonLabel: 'Oldest',
  },
  {
    radioButtonValue: 'INCREASING_VALUE',
    radioButtonLabel: 'Increasing value',
  },
  {
    radioButtonValue: 'DECREASING_VALUE',
    radioButtonLabel: 'Decreasing value',
  },
];

export const TransactionHistorySort = (props) => {
  const radioButtonChangeHandler = (radioButtonValue) => {
    props.setRadioButtonSelected(radioButtonValue);
  };

  return (
    <div className={styles.sortBox} ref={props.sortDivisionRef}>
      <div className="flex flex-row" style={{ padding: '20px 14px 0px' }}>
        <p className={styles.sortHeading}>SORT</p>
      </div>
      <div className={`mt-1 mx-auto ${styles.lineBottom} `}></div>
      {SORT_OPTIONS.map((option, index) => {
        return (
          <label key={index} className={styles.sortButtonsContainer}>
            <span className={styles.sortLabelText}>{option.radioButtonLabel}</span>
            <input
              value={option.radioButtonValue}
              name="sort-history-radio"
              type="radio"
              checked={props.radioButtonSelected === option.radioButtonValue}
              onChange={(event) => radioButtonChangeHandler(event.target.value)}
            />
            <span className={styles.radioOption}></span>
          </label>
        );
      })}
    </div>
  );
};

TransactionHistorySort.propTypes = {
  radioButtonSelected: PropTypes.any,
  setRadioButtonSelected: PropTypes.any,
  sortDivisionRef: PropTypes.any,
};
