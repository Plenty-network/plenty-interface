import dai from '../../assets/images/SwapModal/daiLogo.svg';
import dash from '../../assets/images/SwapModal/dashLogo.svg';
import mkr from '../../assets/images/SwapModal/mkrLogo.svg';
import oxt from '../../assets/images/SwapModal/oxtLogo.svg';
//import cross from '../assets/images/SwapModal/ModalCross.svg';
import search from '../../assets/images/SwapModal/SearchIcon.svg';

//import editpen from '../assets/images/SwapModal/Edit.svg';
import { Modal } from 'react-bootstrap';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const SwapModal = (props) => {
  const tokens = [
    {
      name: 'DAI',
      image: dai,
    },
    {
      name: 'MKR',
      image: mkr,
    },
    {
      name: 'DASH',
      image: dash,
    },
    {
      name: 'OXT',
      image: oxt,
    },
    {
      name: 'DAI',
      image: dai,
    },
    {
      name: 'MKR',
      image: mkr,
    },
    {
      name: 'DASH',
      image: dash,
    },
    {
      name: 'OXT',
      image: oxt,
    },
    {
      name: 'DAI',
      image: dai,
    },
    {
      name: 'MKR',
      image: mkr,
    },
    {
      name: 'DASH',
      image: dash,
    },
    {
      name: 'OXT',
      image: oxt,
    },
  ];

  return (
    <Modal {...props} className="swap-modal" centered>
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
          {tokens.map((token, index) => {
            return (
              <button className="token-select-btn" key={index}>
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
