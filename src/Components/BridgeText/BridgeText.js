import styles from './BridgeText.module.scss';
import Row from 'react-bootstrap/Row';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';

const BridgeText = () => {
  return (
    <div className=" row justify-content-center">
      <div className=" col-24 col-sm-20 col-md-10 col-lg-11 col-xl-11">
        <Row>
          <h2 className={styles.heading}>Plenty bridge</h2>
          <h6 className={`mt-3 ${styles.description}`}>
            Transfer your tokens from Ethereum to Tezos within five minutes.
          </h6>
          <div className={`mt-2  ${styles.lineBottom} `}></div>
        </Row>

        <Row>
          <h6 className={`${styles.question}`}>How do I use the bridge?</h6>
          <p className={`mt-1 ${styles.answer}`}>
            First select the chain and token. Enter the amount you want to bridge. After completing
            all steps on both chains your tokens will reflect in your wallet on the other chain.
          </p>
          <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
            <a
              href="https://forum.plentydefi.com/t/pip-001-minting-rate-reduction/51"
              target="_blank"
              rel="noreferrer"
            >
              Learn more
            </a>
            <Link className="ml-2 mb-1" />
          </p>
        </Row>
      </div>
    </div>
  );
};
export default BridgeText;
