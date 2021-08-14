import { useEffect, useState } from "react";

const useInfoTableHooks = (props) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    const formatData = () => {
      // TODO add formating here
      return props.data
    }

    if (props.type === 'withdrawal') {
      setValues({ ...infoTableData.withdrawal, formattedData: formatData()})
    } else {
      setValues({ ...infoTableData.withdrawal, formattedData: formatData()})
    }
  }, [props.type, props.data])

  return { ...values }
}

const infoTableData = {
  withdrawal: {
    headerRow: ["Stake duration", "Block count", "Withdrawal fee"],
    disclaimer: "The withdrawal fee is calculated from the block number in which you made your deposit. Each deposit can be withdrawn separately."
  },
  roi: {
    headerRow: ["Time Frame", "ROI", "PLENTY per $1000"],
    disclaimer: "Calculated based on current rates. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.",
  }
};

export default useInfoTableHooks;