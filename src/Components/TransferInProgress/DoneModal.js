import PropTypes from 'prop-types';
import styles from './Transfer.module.scss';
import { ReactComponent as FeeBigIcon } from '../../assets/images/bridge/new_trans_fee_icon.svg';
import { ReactComponent as ProcessSuccess } from '../../assets/images/bridge/process_success.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import { useEffect } from 'react';
import CONFIG from '../../config/config';
import '../../assets/scss/animation.scss';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import Lottie from 'lottie-react';
import loader from '../../assets/images/bridge/loaders/loader_big.json';
import { titleCase } from '../TransactionHistory/helpers';
import fromExponential from 'from-exponential';

const DoneModal = (props) => {
  const {
    transactionFees,
    currentProgress,
    numberOfSteps,
    operation,
    fromBridge,
    toBridge,
    tokenOut,
    secondTokenAmount,
    finalOpHash,
    openingFromHistory,
    tokenIn,
  } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    if(currentProgress === numberOfSteps.length - 1) {
      dispatch(setLoader(true));
    } else {
      dispatch(setLoader(false));
    }
  }, [currentProgress]);

  useEffect(async () => {
    return () => dispatch(setLoader(false));
  }, []);

  return (
    <>
      <div className="bridge-done_screen">
        {currentProgress === numberOfSteps.length - 1 ? (
          <div className="border-tile shaded">
            <div className="left-div">
              <p className={styles.youWillReceive}>You will receive</p>
              <div className="containerwithicon">
                <img src={tokenOut.image} />
                <span className="value-text" title={fromExponential(Number(secondTokenAmount))}>
                  {fromExponential(Number(Number(secondTokenAmount).toFixed(10)))} {tokenOut.name}
                </span>
              </div>
            </div>
            <Lottie animationData={loader} loop={true} style={{height: '45px', width: '45px'}} />
          </div>
        ) : (
          <div
            className={`border-tile success ${
              !openingFromHistory ? 'topToBottomFadeInAnimation-4' : ''
            }`}
          >
            <div className="left-div">
              <div className="containerwithicon">
                <img src={tokenOut.image} />
                <div className="right-div">
                  <span className="value-text" title={fromExponential(Number(secondTokenAmount))}>
                    {fromExponential(Number(Number(secondTokenAmount).toFixed(10)))} {tokenOut.name}
                  </span>
                  <span className="fromreceived success-text">Received</span>
                </div>
              </div>
            </div>
            <div className="loading-div">
              <ProcessSuccess />
            </div>
          </div>
        )}
        <div className="border-tile">
          <div className="left-div">
            <div className="containerwithicon">
              <img src={fromBridge.image} />
              <div className="right-div">
                <span className="fromreceived">From</span>
                <span className="value-text">{titleCase(fromBridge.name)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-tile">
          <div className="left-div">
            <div className="containerwithicon">
              <img src={toBridge.image} />
              <div className="right-div">
                <span className="fromreceived">To</span>
                <span className="value-text">{titleCase(toBridge.name)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-tile">
          <div className="left-div">
            <div className="containerwithicon">
              <FeeBigIcon />
              <div className="right-div">
                <span className="fromreceived">Bridge fee</span>
                <span className="value-text">
                  {fromExponential(Number(Number(transactionFees).toFixed(12)))}
                  {` ${operation === 'BRIDGE' ? tokenOut.name : tokenIn.name}`}
                </span>
              </div>
            </div>
          </div>
        </div>
        {currentProgress === numberOfSteps.length && (
          <div
            className="borderless mt-3"
            onClick={() =>
              window.open(
                `${
                  operation === 'BRIDGE'
                    ? openingFromHistory
                      ? CONFIG.EXPLORER_LINKS[fromBridge.name]
                      : CONFIG.EXPLORER_LINKS.TEZOS
                    : openingFromHistory
                    ? CONFIG.EXPLORER_LINKS.TEZOS
                    : CONFIG.EXPLORER_LINKS[toBridge.name]
                }${finalOpHash}`,
                '_blank',
              )
            }
          >
            <p className={`mb-1 mt-1 ${styles.discriptionInfo}`} style={{ width: 'max-content' }}>
              <span>View on explorer</span>
              <Link className="ml-2 mb-1" />
            </p>
          </div>
        )}
      </div>
    </>
  );
};

DoneModal.propTypes = {
  transactionFees: PropTypes.any,
  currentProgress: PropTypes.any,
  numberOfSteps: PropTypes.any,
  operation: PropTypes.any,
  fromBridge: PropTypes.any,
  toBridge: PropTypes.any,
  tokenOut: PropTypes.any,
  secondTokenAmount: PropTypes.any,
  finalOpHash: PropTypes.any,
  openingFromHistory: PropTypes.any,
  tokenIn: PropTypes.any,
};

export default DoneModal;
