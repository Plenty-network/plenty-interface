import PropTypes from 'prop-types';
import React from 'react';
import { PuffLoader } from 'react-spinners';

const Loader = (props) => {
  if (props.loading) {
    return (
      <div className="loading-data-wrapper">
        <PuffLoader color="var(--theme-primary-1)" size={36} />
      </div>
    );
  }

  if (props.loaderMessage.type) {
    const loaderMessage = props.loaderMessage.message;
    return (
      <div className={`loader-message-wrapper ${props.loaderMessage.type}`}>
        {props.loaderMessage.type === 'success' ? (
          <>
            <span className="material-icons-round">check_circle</span>
            {loaderMessage}
          </>
        ) : (
          <>
            <span className="material-icons-round">cancel</span>
            {loaderMessage}
          </>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default Loader;

Loader.propTypes = {
  loaderMessage: PropTypes.object,
  loading: PropTypes.bool,
};
