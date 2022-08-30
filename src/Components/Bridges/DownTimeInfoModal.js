import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Button from '../Ui/Buttons/Button';
import './styles/DownTimeInfoModal.scss';

const DownTimeInfoModal = (props) => {
  
  const navigate = useNavigate();
  const onHide = () => {
    navigate('/');
  };

  return (
    <Modal
      show={props.show}
      onHide={onHide}
      className="info-modal modal-themed"
      backdrop={'static'}
    >
      <Modal.Header className="border-bottom-themed flex-column">
        <div className="flex flex-row w-100">
          <Modal.Title className="flex align-items-center">
            <span className="span-themed">Note</span>
          </Modal.Title>
          <Modal.Title className="ml-auto flex align-items-center">
            {/* <span
              onClick={props.onHide}
              style={{ cursor: 'pointer' }}
              className="material-icons-round"
            >
              close
            </span> */}
          </Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body style={{ paddingBottom: '0px' }}>
        <>
          <div className="information-text">
            <h6>
              {
                'Bridge is under maintainance on Tuesday (UTC time zone) 30th August. Sorry for the inconvinience!'
              }
            </h6>
          </div>
          <Button
            color={'primary'}
            className={'xplenty-btn flex align-items-center justify-content-center popup-btn mt-3'}
            onClick={onHide}
            style={{ cursor: 'pointer' }}
          >
            {'Got it'}
          </Button>
        </>
      </Modal.Body>
    </Modal>
  );
};

DownTimeInfoModal.propTypes = {
  show: PropTypes.any,
};

export default DownTimeInfoModal;
