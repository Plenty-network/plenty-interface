import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import styles from "./table.module.scss";
import clsx from "clsx";
import { useEffect } from "react";

/* TODO
 1. Sorted by indicator has to be added
 2. Table cell transparent to be removed (mobile view overlap occurs)
 3. CSS Tweaks
 */
const Table = ({ searchQuery, columns, data, className }) => {
  useEffect(() => {
    setFilter("token", searchQuery);
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
            id: "liquidity",
            desc: true,
          },
        ],
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className={styles.tableContainer}>
        <div {...getTableProps()} className={clsx(styles.table, className)}>
          <div className={styles.thead}>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className={styles.th}>
                {headerGroup.headers.map((column) => (
                  <div
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={styles.td}
                  >
                    <div className="flex flex-row align-items-center">
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span className="material-icons flex">
                              keyboard_arrow_down
                            </span>
                          ) : (
                            <span className="material-icons flex">
                              keyboard_arrow_up
                            </span>
                          )
                        ) : (
                          <span className="material-icons invisible">
                            keyboard_arrow_up
                          </span>
                        )}
                      </span>
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
                <div {...row.getRowProps()} className={styles.tr}>
                  {row.cells.map((cell) => {
                    return (
                      <div {...cell.getCellProps()} className={styles.td}>
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mt-5">
        {Array(pageCount)
          .fill(0)
          .map((x, i) => (
            <div
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

export default Table;
