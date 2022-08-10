import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '../Ui/Buttons/Button';
import './styles/GasInformationPopup.scss';

const GasInformationPopup = (props) => {
  return (
    <Modal show={props.show} onHide={props.onHide} className="info-modal modal-themed" backdrop={'static'}>
      <Modal.Header className="border-bottom-themed flex-column">
        <div className="flex flex-row w-100">
          <Modal.Title className="flex align-items-center">
            <span className="span-themed">Important</span>
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
      <Modal.Body style={{paddingBottom: '0px'}}>
        <>
          <div className="information-text">
            <h6>
              {
                'Don\'t reduce your default gas fees on the wallet. If there\'s not enough gas, your funds might be locked permanently and can\'t be recovered.'
              }
            </h6>
          </div>
          <Button
            color={'primary'}
            className={'xplenty-btn flex align-items-center justify-content-center popup-btn mt-3'}
            onClick={props.onHide}
            style={{ cursor: 'pointer' }}
          >
            {'Got it'}
          </Button>
        </>
      </Modal.Body>
    </Modal>
  );
};

GasInformationPopup.propTypes = {
  onHide: PropTypes.any,
  show: PropTypes.any,
};

export default GasInformationPopup;
