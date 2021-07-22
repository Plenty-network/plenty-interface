const FarmCardBottom = (props) => {
  let content = '';
  if (props.hidden) {
    content = (
      <>
        <div className="expand-more-btn-wrapper">
          <button className="expand-more-btn" onClick={props.displayAccordion}>
            <span className="material-icons-outlined">expand_more</span>
          </button>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="card-bottom-content-wrapper"></div>
        <div className="expand-more-btn-wrapper">
          <button className="expand-more-btn" onClick={props.hideAccordion}>
            <span className="material-icons-outlined">expand_less</span>
          </button>
        </div>
      </>
    );
  }
  return content;
};

export default FarmCardBottom;
