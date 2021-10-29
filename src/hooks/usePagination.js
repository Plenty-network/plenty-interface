import { useCallback, useMemo, useState } from "react";

const usePagination = (data = [], itemPerPage = 10) => {
  const [page, setPage] = useState(1);

  const totalPage = useMemo(
    () => Math.ceil(data.length / itemPerPage),
    [data, itemPerPage]
  );

  const dataInPage = useMemo(
    () => data.slice((page - 1) * itemPerPage, page * itemPerPage),
    [data, itemPerPage, page]
  );

  const handleSetPage = useCallback(
    (newPage) => {
      if (newPage <= totalPage) {
        setPage(newPage);
      }
    },
    [totalPage]
  );

  return { page, totalPage, handleSetPage, dataInPage };
};

export default usePagination;
