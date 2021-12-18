import PropTypes from 'prop-types';
import React, { useMemo, useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './governance.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '../../Components/loader';
import { ReactComponent as Clock } from '../../assets/images/clock.svg';
import { ReactComponent as Info } from '../../assets/images/Icon.svg';
import { ReactComponent as Check } from '../../assets/images/check-circle.svg';
import { ReactComponent as CheckViolet } from '../../assets/images/CheckCircle.svg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import Table from '../../assets/images/Farm_Rewards.png';
import Button from '../../Components/Ui/Buttons/Button';
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
  const [voteSelected, setVoteSelected] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [voteEnded, setVoteEnded] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [proposalResult, setProposalResult] = useState('');
  const date = new Date();

  const handleVoteClick = (value) => {
    if (value && !props.alreadyVoted) {
      setVoteSelected(value);
    }
    if (props.alreadyVoted) {
      document.getElementById('select-accept').checked = false;
      document.getElementById('select-reject').checked = false;
      document.getElementById('select-abstained').checked = false;
    }
  };
  console.log(voteSelected);
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
    if (props.gov?.yayCount >= props.gov?.nayCount && props.gov?.yayCount >= props.gov?.absCount) {
      setProposalResult(GOV_PAGE_MODAL.ACCEPTED);
    } else if (props.gov?.nayCount > props.gov?.absCount) {
      setProposalResult(GOV_PAGE_MODAL.REJECTED);
    } else if (props.gov?.absCount > props.gov?.nayCount) {
      setProposalResult(GOV_PAGE_MODAL.ABSTAINED);
    }
  }, [props.gov]);

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

  useEffect(() => {
    if (isSubmitted === true) {
      if (voteSelected === GOV_PAGE_MODAL.ACCEPT) {
        props.getVote(GOV_PAGE_MODAL.ACCEPT_VOTE);
      }
      if (voteSelected === GOV_PAGE_MODAL.REJECT) {
        props.getVote(GOV_PAGE_MODAL.REJECT_VOTE);
      }
      if (voteSelected === GOV_PAGE_MODAL.ABSTAIN) {
        props.getVote(GOV_PAGE_MODAL.ABSTAINED_VOTE);
      }
    }
  }, [isSubmitted]);

  const voteModal = useMemo(() => {
    return (
      <div
        className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
      >
        <div className={styles.border}>
          <div className={` ${styles.voteModal}`}>
            <div className={styles.resultsHeader}>
              <p className={styles.voteHeading}>Vote</p>
              <p className={styles.res}>Open</p>
            </div>
            <span className={styles.postedInfo}>Posted on December 15, 2021</span>

            <div
              className={clsx(
                styles.votingBox,
                voteSelected === GOV_PAGE_MODAL.ACCEPT ? styles.borderChange : styles.initialColor,
              )}
            >
              {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                <div
                  className={clsx(
                    styles.votingBoxBg,
                    voteSelected === GOV_PAGE_MODAL.ACCEPT
                      ? styles.selectedVotingBoxBg
                      : styles.defaultVotingBoxBg,
                  )}
                  style={{
                    width: `${props.gov?.yayPercentage}%`,
                  }}
                />
              )}
              <input
                className={` ${styles.option}`}
                id="select-accept"
                type="radio"
                name="where"
                value={GOV_PAGE_MODAL.ACCEPT}
                onClick={(e) => {
                  handleVoteClick(e.target.value);
                }}
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  voteSelected === GOV_PAGE_MODAL.ACCEPT ? styles.colorChange : styles.initialColor,
                )}
                htmlFor="select-accept"
              >
                {GOV_PAGE_MODAL.ACCEPT}
              </label>
              {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                <span
                  className={clsx(
                    styles.percentage,
                    voteSelected === GOV_PAGE_MODAL.ACCEPT
                      ? styles.colorChange
                      : styles.initialColor,
                  )}
                >
                  {props.gov?.yayPercentage === undefined ? (
                    <span className="shimmer">999</span>
                  ) : (
                    `${props.gov.yayPercentage}%`
                  )}
                </span>
              )}
            </div>

            <div
              className={clsx(
                styles.votingBox,
                voteSelected === GOV_PAGE_MODAL.REJECT ? styles.borderChange : styles.initialColor,
              )}
            >
              {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                <div
                  className={clsx(
                    styles.votingBoxBg,
                    voteSelected === GOV_PAGE_MODAL.REJECT
                      ? styles.selectedVotingBoxBg
                      : styles.defaultVotingBoxBg,
                  )}
                  style={{
                    width: `${props.gov?.nayPercentage}%`,
                  }}
                />
              )}
              <input
                className={` ${styles.option}`}
                id="select-reject"
                type="radio"
                name="where"
                value={GOV_PAGE_MODAL.REJECT}
                onClick={(e) => {
                  handleVoteClick(e.target.value);
                }}
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  voteSelected === GOV_PAGE_MODAL.REJECT ? styles.colorChange : styles.initialColor,
                )}
                htmlFor="select-reject"
              >
                {GOV_PAGE_MODAL.REJECT}
              </label>
              {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                <span
                  className={clsx(
                    styles.percentage,
                    voteSelected === GOV_PAGE_MODAL.REJECT
                      ? styles.colorChange
                      : styles.initialColor,
                  )}
                >
                  {props.gov?.nayPercentage === undefined ? (
                    <span className="shimmer">999</span>
                  ) : (
                    `${props.gov.nayPercentage}%`
                  )}
                </span>
              )}
            </div>
            <div
              className={clsx(
                styles.votingBox,
                voteSelected === GOV_PAGE_MODAL.ABSTAIN ? styles.borderChange : styles.initialColor,
              )}
            >
              {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                <div
                  className={clsx(
                    styles.votingBoxBg,
                    voteSelected === GOV_PAGE_MODAL.ABSTAIN
                      ? styles.selectedVotingBoxBg
                      : styles.defaultVotingBoxBg,
                  )}
                  style={{
                    width: `${props.gov?.absPercentage}%`,
                  }}
                />
              )}
              <input
                className={` ${styles.option}`}
                id="select-abstained"
                type="radio"
                name="where"
                value={GOV_PAGE_MODAL.ABSTAIN}
                onClick={(e) => {
                  handleVoteClick(e.target.value);
                }}
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  voteSelected === GOV_PAGE_MODAL.ABSTAIN
                    ? styles.colorChange
                    : styles.initialColor,
                )}
                htmlFor="select-abstained"
              >
                {GOV_PAGE_MODAL.ABSTAIN}
              </label>
              {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                <span
                  className={clsx(
                    styles.percentage,
                    voteSelected === GOV_PAGE_MODAL.ABSTAIN
                      ? styles.colorChange
                      : styles.initialColor,
                  )}
                >
                  {props.gov?.absPercentage === undefined ? (
                    <span className="shimmer">999</span>
                  ) : (
                    `${props.gov.absPercentage}%`
                  )}
                </span>
              )}
            </div>
            <div className={` ${styles.submit}`}>
              {props.walletAddress ? (
                <Button
                  disabled={props.alreadyVoted || props.loading}
                  className={clsx(
                    styles.submitButton,
                    voteSelected || props.alreadyVoted
                      ? styles.buttonColorChange
                      : styles.initialColor,
                    props.loading && styles.buttonColorChange,
                  )}
                  onClick={() => {
                    setIsSubmitted(true);
                  }}
                  loading={props.loading}
                >
                  {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS ||
                    props.alreadyVoted) && <Check className="mr-2 mb-1" />}
                  {props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted
                    ? 'Submitted'
                    : 'Submit'}
                </Button>
              ) : (
                <Button
                  onClick={props.connecthWallet}
                  className={styles.submitButton}
                  startIcon="add"
                >
                  Connect Wallet
                </Button>
              )}

              <span className={`my-3 ml-4 ${styles.totalVotes}`}>
                {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                  <CheckViolet className="mr-2 mb-1" />
                )}
                {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) &&
                  (props.gov?.totalVotes === undefined ? (
                    <span className="shimmer">999</span>
                  ) : (
                    `${props.gov.totalVotes} voted so far.`
                  ))}
              </span>
            </div>
            <div className="mt-3">
              <Clock />
              <span className={`ml-2 ${styles.poll}`}>
                Voting closes on <b>Dec 22, 2021</b>
              </span>
            </div>
            <div className={`my-4 ${styles.line} `}></div>
            <p className={styles.voteHeading}>Weightage</p>
            <p className="mt-2">
              The weight of your vote is calculated based on your xPLENTY balance at the block the
              PIP was inserted on-chain. Users can cast their vote for the duration of one week.
            </p>
            <div className={`px-4 py-4 ${styles.info}`}>
              <div className={styles.InfoIconBg}>
                <div className={styles.infoIcon}>
                  <Info />
                </div>
              </div>
              <div className={` ${styles.infoText}`}>
                This is a light version of the upcoming Plenty governance process that will be
                released in the future.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [voteSelected, isSubmitted, props.loading, props.modalData, props.alreadyVoted, props.gov]);

  const voteModalResults = useMemo(() => {
    return (
      <div
        className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
      >
        <div className={clsx(styles.border, styles.textColor)}>
          <div className={` ${styles.voteModal}`}>
            <div className={styles.resultsHeader}>
              <p className={styles.voteHeading}>Results</p>
              <p
                className={clsx(
                  styles.res,
                  proposalResult === GOV_PAGE_MODAL.ACCEPTED && styles.accepted,
                  proposalResult === GOV_PAGE_MODAL.REJECTED && styles.rejected,
                  proposalResult === GOV_PAGE_MODAL.ABSTAINED && styles.abstained,
                )}
              >
                {proposalResult === '' ? <span className="shimmer">999</span> : proposalResult}
              </p>
            </div>
            <div className={`my-4 ${styles.line} `}></div>
            <div
              className={clsx(
                styles.votingBox,
                styles.textColor,
                styles.borderChange,
                styles.removeMargin,
              )}
            >
              <div
                className={clsx(
                  styles.votingBoxBg,
                  proposalResult === GOV_PAGE_MODAL.ACCEPTED
                    ? styles.selectedVotingBoxBg
                    : styles.defaultVotingBoxBg,
                )}
                style={{
                  width: `${props.gov?.yayPercentage}%`,
                }}
              />
              <input
                className={` ${styles.option}`}
                id="select-accept"
                type="radio"
                value={GOV_PAGE_MODAL.ACCEPT}
                checked
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  proposalResult === GOV_PAGE_MODAL.ACCEPTED
                    ? styles.selectedVotingLabel
                    : styles.defaultVotingText,
                )}
                htmlFor="select-accept"
              >
                {GOV_PAGE_MODAL.ACCEPTED}
              </label>

              <span
                className={clsx(
                  styles.textColor,
                  styles.percentageResults,
                  proposalResult === GOV_PAGE_MODAL.ACCEPTED
                    ? styles.selectedVotingText
                    : styles.defaultVotingText,
                )}
              >
                {props.gov?.yayPercentage === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.yayPercentage}%`
                )}
              </span>
            </div>
            <div className={styles.totalStats}>
              <span>
                {props.gov?.yayCount === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.yayCount} votes`
                )}
              </span>
              <span className={`mx-2  ${styles.dot}`}></span>
              <span>
                {props.gov?.yayTokens === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.yayTokens} xplenty`
                )}
              </span>
            </div>

            <div
              className={clsx(
                styles.votingBox,
                styles.textColor,
                styles.borderChange,
                styles.removeMargin,
              )}
            >
              <div
                className={clsx(
                  styles.votingBoxBg,
                  proposalResult === GOV_PAGE_MODAL.REJECTED
                    ? styles.selectedVotingBoxBg
                    : styles.defaultVotingBoxBg,
                )}
                style={{
                  width: `${props.gov?.nayPercentage}%`,
                }}
              />
              <input
                className={` ${styles.option}`}
                id="select-reject"
                type="radio"
                value={GOV_PAGE_MODAL.REJECT}
                checked
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  proposalResult === GOV_PAGE_MODAL.REJECTED
                    ? styles.selectedVotingLabel
                    : styles.defaultVotingText,
                )}
                htmlFor="select-reject"
              >
                {GOV_PAGE_MODAL.REJECTED}
              </label>

              <span
                className={clsx(
                  styles.textColor,
                  styles.percentageResults,
                  proposalResult === GOV_PAGE_MODAL.REJECTED
                    ? styles.selectedVotingText
                    : styles.defaultVotingText,
                )}
              >
                {props.gov?.nayPercentage === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.nayPercentage}%`
                )}
              </span>
            </div>
            <div className={styles.totalStats}>
              <span>
                {props.gov?.nayCount === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.nayCount} votes`
                )}{' '}
              </span>
              <span className={`mx-2  ${styles.dot}`}></span>
              <span>
                {props.gov?.nayTokens === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.nayTokens} xplenty`
                )}
              </span>
            </div>
            <div
              className={clsx(
                styles.votingBox,
                styles.textColor,
                styles.borderChange,
                styles.removeMargin,
              )}
            >
              <div
                className={clsx(
                  styles.votingBoxBg,
                  proposalResult === GOV_PAGE_MODAL.ABSTAINED
                    ? styles.selectedVotingBoxBg
                    : styles.defaultVotingBoxBg,
                )}
                style={{
                  width: `${props.gov?.absPercentage}%`,
                }}
              />
              <input
                className={` ${styles.option}`}
                id="select-abstained"
                type="radio"
                value={GOV_PAGE_MODAL.ABSTAIN}
                checked
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  proposalResult === GOV_PAGE_MODAL.ABSTAINED
                    ? styles.selectedVotingLabel
                    : styles.defaultVotingText,
                )}
                htmlFor="select-abstained"
              >
                {GOV_PAGE_MODAL.ABSTAINED}
              </label>

              <span
                className={clsx(
                  styles.textColor,
                  styles.percentageResults,
                  proposalResult === GOV_PAGE_MODAL.ABSTAINED
                    ? styles.selectedVotingText
                    : styles.defaultVotingText,
                )}
              >
                {props.gov?.absPercentage === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.absPercentage}%`
                )}
              </span>
            </div>
            <div className={styles.totalStats}>
              <span>
                {props.gov?.absCount === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.absCount} votes`
                )}{' '}
              </span>
              <span className={`mx-2  ${styles.dot}`}></span>
              <span>
                {props.gov?.absTokens === undefined ? (
                  <span className="shimmer">999</span>
                ) : (
                  `${props.gov.absTokens} xplenty`
                )}
              </span>
            </div>
            <span className={`mt-5  ${styles.totalStats}`}>
              <CheckViolet className="mr-2 mb-1" />
              {props.gov?.totalVotes === undefined ? (
                <span className="shimmer">999</span>
              ) : (
                `${props.gov.totalVotes} total number of votes.`
              )}
            </span>
            <div className={`mt-3 ${styles.resultsDates}`}>
              <span className={styles.startEndLabel}>Start Date</span>
              <span className={styles.startEndDate}>November 15, 2021 , 13:05</span>
            </div>
            <div className={`mt-3 ${styles.resultsDates}`}>
              <div className={styles.startEndLabel}>End date</div>
              <div className={styles.startEndDate}>
                <span>December 22, 2021 , 13:05</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [voteEnded, props.gov, proposalResult]);

  return (
    <>
      <Container className={` ${styles.govContainer}`} fluid>
        <Header
          toggleTheme={props.toggleTheme}
          theme={props.theme}
          connecthWallet={props.connecthWallet}
          disconnectWallet={props.disconnectWallet}
          walletAddress={props.walletAddress}
          isGradientBgPage={true}
        />
        <Row className={clsx('row justify-content-center', !isMobile && styles.govContainerInner)}>
          <Col xs={20} sm={8} md={10} lg={6} xl={5}>
            <div className=" row justify-content-center">
              <div className=" col-24 col-sm-20 col-md-10 col-lg-10 col-xl-10">
                <Row className={styles.firstRow}>
                  <h6 className={styles.proposalHeading}>Proposal #1 • PIP-001</h6>
                  <h2 className={`mt-3 ${styles.govHeading}`}>Minting rate reduction</h2>

                  <p className={`mt-1 ${styles.proposalInfo}`}>
                    Implement a minting rate reduction from 50 PLENTY/block to 30 PLENTY/block. A
                    reduction of the minting rate results in a new reward distribution scheme, as
                    seen in the specification, for the PLENTY farms.
                  </p>
                  {isMobile && (voteEnded ? voteModalResults : voteModal)}
                  {isMobile && <div className={`mt-2 mx-3 ${styles.lineBottom} `}></div>}
                </Row>

                <Row className={` ${styles.secondRow}`}>
                  <h4 className={` ${styles.plentyHeading}`}>Motivation</h4>
                  <p className={`mt-1 ${styles.discription}`}>
                    Almost half of the maximum supply of 62,000,000 PLENTY is minted already, and at
                    the current rate all tokens will be minted around August 2022.
                  </p>
                  <p className={styles.discription}>
                    The goal of this proposal is to reduce the amount of PLENTY that leaves the
                    circulation, by reducing the newly incoming supply. In the short term, this will
                    lower the APR of the farms. However, by reducing the minting rate, the sell
                    pressure of the PLENTY token is reduced as well.
                  </p>
                  <h4 className={` ${styles.plentyHeading}`}>Specifications</h4>
                  <p className={`mt-1 ${styles.discription} ${styles.specification}`}>
                    1. Update the storage of tokensPerBlock from 50000000000000000000 to
                    30000000000000000000
                  </p>
                  <p className={`mb-3 ${styles.discription} ${styles.specification}`}>
                    2. Update farm rates{' '}
                  </p>

                  <div>
                    <img src={Table} className={styles.table} />
                  </div>
                  <h4 className={`mt-3  ${styles.plentyHeading}`}>Vote</h4>

                  <p className={` mt-1 ${styles.discription}`}>
                    To be eligible to vote, a user must hold xPLENTY at the time of the deployment
                    of the Plenty Improvement Proposal (PIP).
                  </p>
                  <div>
                    <h4 className={`mt-2 ${styles.plentyHeading}`}>More information</h4>
                  </div>

                  <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
                    <a
                      href="https://forum.plentydefi.com/t/pip-001-minting-rate-reduction/51"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Forum
                    </a>
                    <Link className="ml-2 mb-1" />
                  </p>

                  <p className={`${styles.discriptionInfo}`}>
                    <a
                      href="https://ipfs.io/ipfs/bafkreidki5u7chsbrofrypmiaoqsrkeburkwctxidcuv33foq75lnmhogy"
                      target="_blank"
                      rel="noreferrer"
                    >
                      IPFS link to proposal
                    </a>

                    <Link className="ml-2 mb-1" />
                  </p>
                </Row>
              </div>
            </div>
          </Col>
          <Col xs={20} sm={5} md={10} lg={6} xl={5}>
            {!isMobile && (voteEnded ? voteModalResults : voteModal)}
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
  connecthWallet: PropTypes.any,
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
