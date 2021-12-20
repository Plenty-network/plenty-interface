import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './governance.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '../../Components/loader';
import VoteText from '../../Components/VoteText/VoteText';
import VoteModal from '../../Components/VoteModal/VoteModal';
import VoteModalResults from '../../Components/VoteModal/VoteModalResults';
import { connect } from 'react-redux';
import useMediaQuery from '../../hooks/mediaQuery';
import * as walletActions from '../../redux/actions/wallet/wallet.action';
import { GOV_PAGE_MODAL } from '../../constants/govPage';
import Header from '../../Components/Header/Header';
import {
  getVoteData,
  getVoteResults,
  checkIfAlreadyVoted,
} from '../../redux/actions/governance/gov.actions';

const Governance = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [voteEnded, setVoteEnded] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const date = new Date();

  useEffect(() => {
    if (
      date.getDate() >= GOV_PAGE_MODAL.END_DATE &&
      date.getHours() >= GOV_PAGE_MODAL.END_HOUR &&
      date.getMinutes() >= GOV_PAGE_MODAL.END_MIN
    ) {
      props.getResults();
      setVoteEnded(true);
    }
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
      setLoaderMessage({
        type: props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS ? 'success' : 'error',
        message:
          props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS
            ? 'Transaction confirmed'
            : 'Transaction failed',
      });
      props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS && setIsSubmitted(true);
      props.modalData === GOV_PAGE_MODAL.TRANSACTION_FAILED && setIsSubmitted(false);
      setTimeout(() => {
        setLoaderMessage({});
      }, 5000);
    }
  }, [props.modalData, isSubmitted]);

  return (
    <>
      <Container className={` ${styles.govContainer}`} fluid>
        <Header
          toggleTheme={props.toggleTheme}
          theme={props.theme}
          connecthWallet={props.connectWallet}
          disconnectWallet={props.disconnectWallet}
          walletAddress={props.walletAddress}
          isGradientBgPage={true}
        />
        <Row className={clsx('row justify-content-center', !isMobile && styles.govContainerInner)}>
          <Col xs={20} sm={8} md={10} lg={6} xl={5}>
            <VoteText
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

      <Loader loading={props.loading} loaderMessage={loaderMessage} />
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
