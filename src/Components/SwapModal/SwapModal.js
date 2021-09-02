import React from 'react';
import { Modal } from 'react-bootstrap';
const config = require('../../config/config');

const SwapModal = (props) => {
  const tokensToShow = props.tokens.filter((token) => {
    if (props.tokenType == 'tokenOut') {
      if (
        config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[token.name]
      ) {
        return token;
      }
    } else {
      if (props.tokenOut.name) {
        if (
          config.AMM[config.NETWORK][props.tokenOut.name].DEX_PAIRS[token.name]
        ) {
          return token;
        }
      } else {
        return token;
      }
    }
  });
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      className="swap-modal modal-themed"
    >
      <Modal.Header closeButton className="border-bottom-themed">
        <Modal.Title>
          <span className="span-themed">Select a token</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="coin-selection-table">
          {tokensToShow.map((token, index) => {
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
                <span className="span-themed">{token.name}</span>
                {token.new ? (
                  <span className="new-badge-icon">New!</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SwapModal;
