import React from 'react';
import SimpleModal from '../Ui/Modals/SimpleModal';
import PropTypes from 'prop-types';

import styles from './info-table-modal.module.scss';
import clsx from 'clsx';
import useInfoTableHooks from './infoTableHooks';

const InfoTableModal = (props) => {
  const { headerRow, formattedData, disclaimer } = useInfoTableHooks({
    type: props.type,
    data: props.tableData,
    secondToken: props.secondToken,
    contractAddress: props.contractAddress,
  });

  return (
    <SimpleModal
      open={props.open}
      onClose={props.onClose}
      title={props.type === 'roi' ? 'ROI' : 'Withdrawal fee breakdown'}
      backdrop={true}
    >
      <div className={clsx(styles.infoTable, 'w-100 mb-2')}>
        <div className="font-weight-bold">
          {headerRow?.map((x) => (
            <div key={x}>{x}</div>
          ))}
        </div>

        {formattedData?.map(
          (
            x, // TODO add props.tableData
          ) => (
            <div key={x.col1}>
              <div>{x.col1}</div>
              <div>{x.col2}</div>
              <div>{x.col3}</div>
              {x.col4 ?? <div>{x.col4}</div>}
            </div>
          ),
        )}
      </div>

      <div className={styles.caption}>{disclaimer}</div>
    </SimpleModal>
  );
};

InfoTableModal.propTypes = {
  contractAddress: PropTypes.any,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  secondToken: PropTypes.any,
  tableData: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['roi', 'withdrawal']),
};

export default InfoTableModal;
