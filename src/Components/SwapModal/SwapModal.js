import { Modal } from 'react-bootstrap';

const SwapModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      animation={false}
      className="swap-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Select a token</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="search-coin-wrapper">
          <span className="material-icons-outlined search-coin-icon">
            search
          </span>
          <input
            type="text"
            className="search-coin-input"
            placeholder="Search"
          />
        </div>

        <div className="coin-selection-table">
          {props.tokens.map((token, index) => {
            return (
              <button
                className="token-select-btn"
                key={index}
                onClick={() => props.selectToken(token)}
              >
                <img
                  src={token.image}
                  className="select-token-img"
                  alt={token.name}
                />
                {token.name}
              </button>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="swap-modal-manage-btn">Manage</button>
      </Modal.Footer>
    </Modal>
  );
};

export default SwapModal;
