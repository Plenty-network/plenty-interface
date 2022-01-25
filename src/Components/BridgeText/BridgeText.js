import React from 'react';
import styles from './BridgeText.module.scss';
import Row from 'react-bootstrap/Row';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';

const BridgeText = () => {
  return (
    <div className=" row justify-content-center">
      <div className=" col-24 col-sm-20 col-md-10 col-lg-10 col-xl-10">
        <Row>
          <h2 className={styles.heading}>Plenty Bridges</h2>
          <h6 className={`mt-3 ${styles.description}`}>
            Transfer your crypto assets across different blockchains, including Plenty
          </h6>
          <div className={`mt-2  ${styles.lineBottom} `}></div>
        </Row>

        <Row>
          <h6 className={`${styles.question}`}>How do I use Plenty Bridge?</h6>
          <p className={`mt-1 ${styles.answer}`}>
            Go to Assets Withdraw to select the available currency and blockchain. After withdrawal,
            you’ll get crypto on the chosen blockchain at a 1:1 ratio.
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
