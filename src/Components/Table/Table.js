import { useTable } from "react-table";
import styles from "./table.module.scss";
const Table = ({ columns, data }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div {...getTableProps()} className={styles.table}>
      <div className={styles.thead}>
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()} className={styles.th}>
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} className={styles.td}>
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.tbody}>
        {rows.map((row, i) => {
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
  );
};

export default Table;
