import PropTypes from 'prop-types';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';
import styles from './table.module.scss';
import clsx from 'clsx';
import React, { useEffect } from 'react';

const Table = ({ searchQuery, columns, data, className }) => {
  useEffect(() => {
    setFilter('token', searchQuery);
  }, [searchQuery]);

  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    pageCount,
    state: { pageIndex },
    setFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [
          {
            id: 'liquidity',
            desc: true,
          },
        ],
      },
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  return (
    <>
      <div className={styles.tableContainer}>
        <div {...getTableProps()} className={clsx(styles.table, className)}>
          <div className={styles.thead}>
            {headerGroups.map((headerGroup) => (
              <div
                key={'will be overridden'}
                {...headerGroup.getHeaderGroupProps()}
                className={styles.th}
              >
                {headerGroup.headers.map((column) => (
                  <div
                    key={'will be overridden'}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={styles.td}
                  >
                    <div className="flex flex-row align-items-center">
                      <span className="mx-1">{column.render('Header')}</span>

                      {column.id !== 'favorite' && (
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <span className="material-icons flex">keyboard_arrow_down</span>
                            ) : (
                              <span className="material-icons flex">keyboard_arrow_up</span>
                            )
                          ) : (
                            <span className="material-icons invisible">keyboard_arrow_up</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.tbody}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <div key={'will be overridden'} {...row.getRowProps()} className={styles.tr}>
                  {row.cells.map((cell) => {
                    return (
                      <div
                        key={'will be overridden'}
                        {...cell.getCellProps()}
                        className={styles.td}
                      >
                        <span className="mx-1">{cell.render('Cell')}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-2">
        {Array(pageCount)
          .fill(0)
          .map((x, i) => (
            <div
              key={i}
              className={clsx(styles.page, {
                [styles.selected]: i === pageIndex,
              })}
              onClick={() => gotoPage(i)}
            >
              {i + 1}
            </div>
          ))}
      </div>
    </>
  );
};

Table.propTypes = {
  className: PropTypes.any,
  columns: PropTypes.any,
  data: PropTypes.any,
  searchQuery: PropTypes.any,
};

export default Table;
