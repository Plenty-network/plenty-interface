import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, InputGroup, Modal } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import config from '../../config/config';

const SwapModal = (props) => {
  const [tokensToShow, setTokensToShow] = useState([]);

  const doesPairExist = useCallback(
    (token) => {
      if (props.tokenType === 'tokenOut') {
        if (config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[token.name]) {
          return true;
        }
      } else {
        if (props.tokenOut.name) {
          if (config.AMM[config.NETWORK][props.tokenOut.name].DEX_PAIRS[token.name]) {
            return true;
          }
        } else {
          return true;
        }
      }

      return false;
    },
    [props.tokenIn.name, props.tokenOut.name, props.tokenType],
  );

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
      if (props.activeTab === 'swap') {
        const filterTokens = props.tokens
          .filter(searchHits)
          .filter((token) => {
            if (props.tokenType === 'tokenOut') {
              return props.tokenIn.name !== token.name;
            }

            return props.tokenOut.name !== token.name;
          })
          .map((token) => {
            if (doesPairExist(token)) {
              return { ...token, routerNeeded: false };
            }

            return { ...token, routerNeeded: true };
          });

        setTokensToShow(filterTokens);
      } else {
        const filteredTokens = props.tokens.filter(searchHits).filter(doesPairExist);
        setTokensToShow(filteredTokens);
      }
    };
    filterTokens();
  }, [
    props.tokens,
    props.searchQuery,
    props.activeTab,
    props.tokenType,
    props.tokenIn.name,
    props.tokenOut.name,
    searchHits,
    doesPairExist,
  ]);

  return (
    <Modal show={props.show} onHide={props.onHide} className="swap-modal modal-themed">
      <Modal.Header className="border-bottom-themed flex-column">
        <div className="flex flex-row w-100">
          <Modal.Title className="flex align-items-center">
            <span className="span-themed">Select a token</span>
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
        <div className="mt-1 flex flex-row w-100">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text className="search-icon border-right-0">
                <BsSearch />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search"
              className={'shadow-none border-left-0 search-box'}
              value={props.searchQuery}
              onChange={(ev) => props.setSearchQuery(ev.target.value)}
            />
          </InputGroup>
        </div>
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
                <img src={token.image} className="select-token-img" alt={token.name} />
                <span className="span-themed">{token.name}</span>
                {token.new ? <span className="new-badge-icon">New!</span> : null}
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

SwapModal.propTypes = {
  activeTab: PropTypes.any,
  onHide: PropTypes.any,
  searchQuery: PropTypes.any,
  selectToken: PropTypes.any,
  setSearchQuery: PropTypes.any,
  show: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  tokenType: PropTypes.any,
  tokens: PropTypes.any,
};

export default SwapModal;
