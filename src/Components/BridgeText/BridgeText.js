import styles from './BridgeText.module.scss';
import Row from 'react-bootstrap/Row';
import { ReactComponent as VideoIcon } from '../../assets/images/bridge/video_icon.svg';
import { useState } from 'react';
import VideoModal from '../VideoPopup';

const BridgeText = () => {
  const [showVideoModal,setShowVideoModal]=useState(false);
  const [videoLink, setVideoLink] = useState('');

  return (
    <div className=" row justify-content-center">
      {showVideoModal && <VideoModal closefn={setShowVideoModal} linkString={videoLink} />}

      <div className=" col-24 col-sm-20 col-md-10 col-lg-11 col-xl-11">
        <Row>
          <h2 className={styles.heading}>Plenty bridge</h2>
          <h6 className={`mt-3 ${styles.description}`}>
            Transfer your tokens from Ethereum & Polygon to Tezos easily.
          </h6>
          <div className={`mt-2  ${styles.lineBottom} `}></div>
        </Row>

        <Row>
          <h6 className={`${styles.question}`}>How do I use the bridge?</h6>
          <p className={`mt-1 ${styles.answer}`}>
            First select the chain and token. Enter the amount you want to bridge. After completing
            all steps on both chains, your tokens will reflect in your wallet on the other chain.
          </p>
          <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
            <a
              onClick={() => {
                setVideoLink('Uuvly8mASFc');
                setShowVideoModal(true);
              }}
              target="_blank"
              rel="noreferrer"
            >
              Bridge to Tezos
              <VideoIcon className={`ml-2 ${styles.videoIcon}`} />
            </a>
            <a
              onClick={() => {
                setVideoLink('y7cU9nuYzDc');
                setShowVideoModal(true);
              }}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: '12px' }}
            >
              Bridge from Tezos
              <VideoIcon className={`ml-2 ${styles.videoIcon}`} />
            </a>
          </p>
        </Row>
      </div>
    </div>
  );
};
export default BridgeText;
