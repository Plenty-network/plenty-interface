

export const filterData = (originalData, checkBoxesState) => {
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

  export const sortData = (filteredData, radioSelected) => {
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