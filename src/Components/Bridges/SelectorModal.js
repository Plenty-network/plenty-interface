import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import SearchTokenInput from '../SearchTokenInput';
import { titleCase } from '../TransactionHistory/helpers';
import './styles/SelectorModal.scss';

const SelectorModal = (props) => {
  const searchTokenEl = useRef(null);
  const [tokensToShow, setTokensToShow] = useState([]);

  const searchHits = useCallback(
    (token) => {
      return (
        props.searchQuery.length === 0 ||
        token.name.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
    },
    [props.searchQuery],
  );

  useEffect(() => {
    const filterTokens = () => {
      const filteredTokens = props.tokens.filter(searchHits);
      setTokensToShow(filteredTokens);
    };
    filterTokens();
  }, [props.tokens, props.searchQuery, searchHits]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      onEntered={() => searchTokenEl.current.focus()}
      className="selector-modal modal-themed"
    >
      <Modal.Header className="border-bottom-themed flex-column">
        <div className="flex flex-row w-100">
          <Modal.Title className="flex align-items-center">
            <span className="span-themed">{props.title}</span>
          </Modal.Title>
          <Modal.Title className="ml-auto flex align-items-center">
            <span
              onClick={props.onHide}
              style={{ cursor: 'pointer' }}
              className="material-icons-round"
            >
              close
            </span>
          </Modal.Title>
        </div>
        <SearchTokenInput
          inputRef={searchTokenEl}
          value={props.searchQuery}
          onChange={(ev) => props.setSearchQuery(ev.target.value)}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="coin-selection-table">
          {props.tokens.length === 0 && <h6>No items to show.</h6>}
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
                  alt={props.selector === 'BRIDGES' ? titleCase(token.name) : token.name}
                />
                <span className="span-themed">
                  {props.selector === 'BRIDGES' ? titleCase(token.name) : token.name}
                </span>
                {token.tokenData?.deprecated ? (
                  <span className="deprecated-badge-icon">Deprecated!</span>
                ) : null}
                {(token.name === 'agEUR' || token.name === 'agEUR.e') && (
                  <span className="new-badge-icon">New!</span>
                )}
                {token.extra && (
                  <a
                    className="extra-text"
                    href={token.extra.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {token.extra.text}
                  </a>
                )}
              </button>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

SelectorModal.propTypes = {
  onHide: PropTypes.any,
  searchQuery: PropTypes.any,
  selectToken: PropTypes.any,
  setSearchQuery: PropTypes.any,
  show: PropTypes.any,
  tokens: PropTypes.any,
  title: PropTypes.string,
  selector: PropTypes.any,
};

export default SelectorModal;
