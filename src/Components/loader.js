import PuffLoader from 'react-spinners/PuffLoader';

const Loader = (props) => {
  const loaderColor = '#5C0FAE';
  if (props.loading) {
    return (
      <div className="loading-data-wrapper" style={{ zIndex: '999' }}>
        <div className="loader-icon">
          <PuffLoader color={loaderColor} size={36} />
        </div>
      </div>
    );
  } else {
    if (props.loaderMessage.type) {
      let loaderMessage = props.loaderMessage.message;
      return (
        <div className={`loader-message-wrapper ${props.loaderMessage.type}`}>
          {props.loaderMessage.type == 'success' ? (
            <>
              <span class="material-icons-outlined">check_circle</span>
              {loaderMessage}
            </>
          ) : (
            <>
              <span class="material-icons-outlined">cancel</span>
              {loaderMessage}
            </>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
};

export default Loader;
