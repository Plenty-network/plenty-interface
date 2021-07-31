const Loader = (props) => {
  if (props.loaderMessage.type) {
    let loaderMessage = props.loaderMessage.message;
    return (
      <div className={`loader-message-wrapper ${props.loaderMessage.type}`}>
        {props.loaderMessage.type == 'success' ? (
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
