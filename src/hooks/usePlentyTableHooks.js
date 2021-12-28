import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from '../assets/scss/tokens.module.scss';

export const useLazyImages = ({ data, page = 'token' }) => {
  const [imgPaths, setImgPath] = useState({});

  const loadImageFor = useCallback(
    (token) => {
      // ? if token exists, abort
      if (imgPaths[token]) {
        return;
      }

      setImgPath((prev) => ({
        ...prev,
        [token]: {
          ...prev[token],
          loading: true,
        },
      }));

      import(`../assets/images/tokens/${token}.png`)
        .then((image) => {
          setImgPath((prev) => ({
            ...prev,
            [token]: {
              url: image['default'] ?? image,
              loading: false,
            },
          }));
        })
        .catch((err) => console.error(err));
    },
    [imgPaths],
  );

  useEffect(() => {
    data?.forEach((datum) => {
      if (page === 'token') {
        loadImageFor(datum.symbol_token);
      } else if (page === 'liquidity') {
        loadImageFor(datum.token1);
        loadImageFor(datum.token2);
      }
    });
  }, [loadImageFor, data]);

  return { imgPaths };
};

export const useTableNumberUtils = () => {
  const positiveOrNegative = (value) => {
    if (Number(value) > 0) {
      return <span className={styles.greenText}>+{value}%</span>;
    } else if (Number(value) < 0) {
      return <span className={styles.redText}>{value}%</span>;
    } else {
      return value;
    }
  };

  const valueFormat = (value, opt = {}) => {
    if (value >= 100) {
      return `${opt.percentChange ? '' : '$'}${Math.round(value).toLocaleString('en-US')}`;
    }

    if (!opt.percentChange && value < 0.01) {
      return '< $0.01';
    }
    return `${opt.percentChange ? '' : '$'}${value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  };

  const stringSort = useMemo(
    () => (rowA, rowB, columnId) => {
      const a = String(rowA.values[columnId]).toLowerCase();
      const b = String(rowB.values[columnId]).toLowerCase();
      return a.localeCompare(b);
    },
    [],
  );

  const numberSort = useMemo(
    () => (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.values[columnId]);
      const b = parseFloat(rowB.values[columnId]);
      return a > b ? 1 : -1;
    },
    [],
  );

  return { positiveOrNegative, valueFormat, stringSort, numberSort };
};
