import { useEffect, useState } from 'react';

const useInfoTableHooks = (props) => {
  const [values, setValues] = useState({});

  const getTableHead = (secondToken) => {
    return {
      headerRow: ['Time Frame', 'ROI', 'PLENTY per $1000', `${secondToken} per $1000`],
      disclaimer:
        'Calculated based on current rates. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
    };
  };
  useEffect(() => {
    const formatData = () => {
      if (props.type === 'withdrawal') {
        return props.data.map((datum) => ({
          col1: datum.duration,
          col2: datum.block,
          col3: datum.rate + '%',
        }));
      }
      const roiDays = [1, 7, 30, 365];

      if (props.data[0].tokenSecondPer1000dollar) {
        return props.data.map((datum, i) => ({
          col1: `${roiDays[i]} day${i ? 's' : ''}`,
          col2: datum.roi?.toFixed(2) + '%',
          col3: datum.PlentyPer1000dollar?.toFixed(2),
          col4: datum.tokenSecondPer1000dollar?.toFixed(2),
        }));
      }
      return props.data.map((datum, i) => ({
        col1: `${roiDays[i]} day${i ? 's' : ''}`,
        col2: datum.roi?.toFixed(2) + '%',
        col3: datum.PlentyPer1000dollar?.toFixed(2),
      }));
    };

    if (props.type === 'withdrawal') {
      setValues({ ...infoTableData.withdrawal, formattedData: formatData() });
    } else {
      if (props.data.length) {
        if (props.data[0].tokenSecondPer1000dollar) {
          setValues({
            ...getTableHead(props.secondToken),
            formattedData: formatData(),
          });
        } else if (
          props.contractAddress === 'KT1KGKzNGX1NDP3hGcipzyqVMCkwWbH76NJU' ||
          props.contractAddress === 'KT1DfYVe4CaE9S6Sm3SEfhFYVZ9XzJbkQDqs' ||
          props.contractAddress === 'KT1RENb4rWNFPP5QJSYT4rRGGsk1tPgLLwu2'
        ) {
          setValues({ ...infoTableData.youRoi, formattedData: formatData() });
        } else {
          setValues({ ...infoTableData.roi, formattedData: formatData() });
        }
      }
    }
  }, [props.type, props.data]);

  return { ...values };
};

const infoTableData = {
  withdrawal: {
    headerRow: ['Stake duration', 'Block count', 'Withdrawal fee'],
    disclaimer:
      'The withdrawal fee is calculated from the block number in which you made your deposit. Each deposit can be withdrawn separately.',
  },
  roi: {
    headerRow: ['Time Frame', 'ROI', 'PLENTY per $1000'],
    disclaimer:
      'Calculated based on current rates. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
  },
  youRoi: {
    headerRow: ['Time Frame', 'ROI', 'YOU per $1000'],
    disclaimer:
      'Calculated based on current rates. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
  },
  roiDual: {
    headerRow: ['Time Frame', 'ROI', 'PLENTY per $1000', 'GIF per $1000'],
    disclaimer:
      'Calculated based on current rates. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.',
  },
};

export default useInfoTableHooks;
