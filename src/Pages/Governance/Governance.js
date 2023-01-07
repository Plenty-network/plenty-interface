import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './governance.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '../../Components/loader';
import VoteText30 from '../../Components/VoteText/VoteText-3.0';
import VoteText10 from '../../Components/VoteText/VoteText-1.0';
import VoteModalResults10 from '../../Components/VoteModal/VoteModalResults-1.0';
import VoteText20 from '../../Components/VoteText/VoteText-2.0';
import VoteModalResults20 from '../../Components/VoteModal/VoteModalResults-2.0';
import VoteModal from '../../Components/VoteModal/VoteModal';
import VoteModalResults from '../../Components/VoteModal/VoteModalResults';
import { connect } from 'react-redux';
import useMediaQuery from '../../hooks/mediaQuery';
import * as walletActions from '../../redux/actions/wallet/wallet.action';
import { GOV_PAGE_MODAL } from '../../constants/govPage';
import {
  getVoteData,
  getVoteResults,
  checkIfAlreadyVoted,
} from '../../redux/actions/governance/gov.actions';
import InfoModal from '../../Components/Ui/Modals/InfoModal';
import VoteModalResultscopy3 from '../../Components/VoteModal/VoteModalResults-3.0';
import VoteText4 from '../../Components/VoteText/VoteText';

const Governance = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [voteEnded, setVoteEnded] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);

  useEffect(() => {
    // ? voting results modal will be displayed, until next proposal comes up,
    props.getResults();
    setVoteEnded(true);
  }, []);
  useEffect(() => {
    if (props.walletAddress && voteEnded === false) {
      props.getAlreadyVoted(props.walletAddress);
      props.getResults();
      props.alreadyVoted && setIsSubmitted(true);
    }
  }, [props.walletAddress]);

  useEffect(() => {
    if (
      (props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS ||
        props.modalData === GOV_PAGE_MODAL.TRANSACTION_FAILED) &&
      voteEnded === false
    ) {
      const successfulTransaction =
        props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS && !props.loading;

      setLoaderMessage({
        type: successfulTransaction ? 'success' : 'error',
        message: successfulTransaction ? 'Transaction confirmed' : 'Transaction failed',
      });
      props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS && setIsSubmitted(true);
      if (props.loading) {
        props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS &&
          setShowTransactionSubmitModal(true);
        props.modalData === GOV_PAGE_MODAL.TRANSACTION_FAILED &&
          setShowTransactionSubmitModal(false);
      }

      props.modalData === GOV_PAGE_MODAL.TRANSACTION_FAILED && setIsSubmitted(false);

      setTimeout(() => {
        setLoaderMessage({});
      }, 5000);
    }
  }, [props.modalData, isSubmitted, props.loading]);

  return (
    <>
      <Container className={` ${styles.govContainer4}`} fluid>
        <Row className={clsx('row justify-content-center', !isMobile && styles.govContainerInner)}>
          <Col xs={20} sm={8} md={10} lg={6} xl={6}>
            <VoteText4
              gov={props.gov}
              loading={props.loading}
              modalData={props.modalData}
              alreadyVoted={props.alreadyVoted}
              walletAddress={props.walletAddress}
              connectWallet={props.connectWallet}
              getVote={props.getVote}
              voteEnded={voteEnded}
            />
          </Col>
          <Col xs={20} sm={5} md={10} lg={6} xl={5}>
            {!isMobile &&
              (voteEnded ? (
                <VoteModalResults
                  gov={props.gov}
                  loading={props.loading}
                  modalData={props.modalData}
                  alreadyVoted={props.alreadyVoted}
                  walletAddress={props.walletAddress}
                  connectWallet={props.connectWallet}
                  getVote={props.getVote}
                  voteEnded={voteEnded}
                />
              ) : (
                <VoteModal
                  gov={props.gov}
                  loading={props.loading}
                  modalData={props.modalData}
                  alreadyVoted={props.alreadyVoted}
                  walletAddress={props.walletAddress}
                  connectWallet={props.connectWallet}
                  getVote={props.getVote}
                  voteEnded={voteEnded}
                />
              ))}
          </Col>
        </Row>
      </Container>
      <InfoModal
        open={showTransactionSubmitModal}
        InfoMessage={'Vote submitted'}
        theme={props.theme}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Block Explorer'}
        onBtnClick={
          props.transactionId
            ? () => window.open(`https://tzkt.io/${props.transactionId}`, '_blank')
            : null
        }
      />
      <Loader
        loading={props.loading}
        theme={props.theme}
        loaderMessage={loaderMessage}
        content={'Voted Successfully'}
        onBtnClick={
          props.transactionId
            ? () => window.open(`https://tzkt.io/${props.transactionId}`, '_blank')
            : null
        }
      />
      <Loader loading={props.loading} loaderMessage={loaderMessage} />
      {/* static Governance */}
      <Container className={` ${styles.govContainer3}`} fluid>
        <Row className={clsx('row justify-content-center', !isMobile && styles.govContainerInner)}>
          <Col xs={20} sm={8} md={10} lg={6} xl={6}>
            <VoteText30 />
          </Col>
          <Col xs={20} sm={5} md={10} lg={6} xl={5}>
            {!isMobile && <VoteModalResultscopy3 />}
          </Col>
        </Row>
      </Container>
      {/* end of static governance */}
      {/* static Governance */}
      <Container className={` ${styles.govContainerr}`} fluid>
        <Row className={clsx('row justify-content-center', !isMobile && styles.govContainerInner)}>
          <Col xs={20} sm={8} md={10} lg={6} xl={6}>
            <VoteText20 />
          </Col>
          <Col xs={20} sm={5} md={10} lg={6} xl={5}>
            {!isMobile && <VoteModalResults20 />}
          </Col>
        </Row>
      </Container>
      {/* end of static governance */}
      {/* static Governance */}
      <Container className={` ${styles.govContainer}`} fluid>
        <Row className={clsx('row justify-content-center', !isMobile && styles.govContainerInner)}>
          <Col xs={20} sm={8} md={10} lg={6} xl={6}>
            <VoteText10 />
          </Col>
          <Col xs={20} sm={5} md={10} lg={6} xl={5}>
            {!isMobile && <VoteModalResults10 />}
          </Col>
        </Row>
      </Container>
      {/* end of static governance */}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    gov: state.governance.gov.data,
    loading: state.governance.gov.loading,
    modalData: state.governance.modals.open,
    userAddress: state.wallet.address,
    alreadyVoted: state.governance.gov.alreadyVoted,
    transactionId: state.governance.modals.transactionId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getVote: (voteSelected) => dispatch(getVoteData(voteSelected)),
    getAlreadyVoted: (address) => dispatch(checkIfAlreadyVoted(address)),
    getResults: () => dispatch(getVoteResults()),
    connectWallet: () => dispatch(walletActions.connectWallet()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Governance);

Governance.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  gov: PropTypes.any,
  transactionId: PropTypes.any,
  modalData: PropTypes.any,
  postResults: PropTypes.any,
  getVote: PropTypes.any,
  getResults: PropTypes.any,
  loading: PropTypes.any,
  getAlreadyVoted: PropTypes.any,
  walletAddress: PropTypes.any,
  alreadyVoted: PropTypes.any,
  theme: PropTypes.any,
  toggleTheme: PropTypes.any,
};
