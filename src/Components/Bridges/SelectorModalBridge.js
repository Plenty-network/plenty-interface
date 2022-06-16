import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import './styles/SelectorModal.scss';
import eth from '../../assets/images/bridge/eth.svg';
import tezos from '../../assets/images/bridge/ic_tezos.svg';
import { bridgesList } from '../../constants/bridges';
import matic_normal from '../../assets/images/bridge/tokens/matic_icon.svg';

const SelectorModalBridge = (props) => {
  const chainSelection = [
    {
      name: 'Ethereum to Tezos',
      image1: eth,
      name1: 'RINKEBY',
      token2: tezos,
      name2: 'TEZOS',
      buttonImage1: bridgesList[0].buttonImage,
      buttonImage2: bridgesList[1].buttonImage,
    },
    {
      name: 'Tezos to Ethereum',
      image1: tezos,
      name1: 'TEZOS',
      token2: eth,
      name2: 'RINKEBY',
      buttonImage1: bridgesList[1].buttonImage,
      buttonImage2: bridgesList[0].buttonImage,
    },
    {
      name: 'Polygon to Tezos',
      image1: matic_normal,
      name1: 'POLYGON',
      token2: tezos,
      name2: 'TEZOS',
      buttonImage1: bridgesList[0].buttonImage,
      buttonImage2: bridgesList[1].buttonImage,
    },
    {
      name: 'Tezos to Polygon',
      image1: tezos,
      name1: 'TEZOS',
      token2: matic_normal,
      name2: 'POLYGON',
      buttonImage1: bridgesList[0].buttonImage,
      buttonImage2: bridgesList[1].buttonImage,
    },
  ];
  return (
    <Modal show={props.show} onHide={props.onHide} className="selector-modal modal-themed">
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
      </Modal.Header>
      <Modal.Body>
        <div className="coin-selection-table">
          <button className="token-select-btn">
            <img src={eth} className="select-token-img-bridge" alt={'etherium'} />
            <span className="chain-topic">Ethereum</span>
          </button>

          <button
            className="token-select-btn"
            onClick={() => props.selectBridge(chainSelection[0])}
          >
            <span className="selectionAlignment">Ethereum to Tezos</span>
          </button>
          <button
            className="token-select-btn"
            onClick={() => props.selectBridge(chainSelection[1])}
          >
            <span className=" selectionAlignment">Tezos to Ethereum</span>
          </button>
          <button className="token-select-btn">
            <img src={tezos} className="select-token-img-bridge" alt={'tezos'} />
            <span className="chain-topic">Polygon</span>
          </button>

          <button
            className="token-select-btn"
            onClick={() => props.selectBridge(chainSelection[2])}
          >
            <span className=" selectionAlignment">Polygon to Tezos</span>
          </button>
          <button
            className="token-select-btn"
            onClick={() => props.selectBridge(chainSelection[3])}
          >
            <span className="selectionAlignment">Tezos to Polygon</span>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

SelectorModalBridge.propTypes = {
  onHide: PropTypes.any,
  searchQuery: PropTypes.any,
  selectBridge: PropTypes.any,
  show: PropTypes.any,
  tokens: PropTypes.any,
  title: PropTypes.string,
  selector: PropTypes.any,
};

export default SelectorModalBridge;
