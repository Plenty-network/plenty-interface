import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styles from './vote.module.scss';
import { GOV_PAGE_MODAL } from '../../constants/govPage';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Info } from '../../assets/images/Icon.svg';
import { ReactComponent as Check } from '../../assets/images/check-circle.svg';
import { ReactComponent as CheckViolet } from '../../assets/images/CheckCircle.svg';
import { ReactComponent as Clock } from '../../assets/images/clock.svg';

const VoteModal = (props) => {
  const [voteSelected, setVoteSelected] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  useEffect(() => {
    if (
      props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS ||
      props.modalData === GOV_PAGE_MODAL.TRANSACTION_FAILED
    ) {
      props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS && setIsSubmitted(true);

      props.modalData === GOV_PAGE_MODAL.TRANSACTION_FAILED && setIsSubmitted(false);
    }
  }, [props.modalData, isSubmitted]);

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
                  voteSelected === GOV_PAGE_MODAL.ACCEPT ? styles.colorChange : styles.initialColor,
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
                  voteSelected === GOV_PAGE_MODAL.REJECT ? styles.colorChange : styles.initialColor,
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
                voteSelected === GOV_PAGE_MODAL.ABSTAIN ? styles.colorChange : styles.initialColor,
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
                {(props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted) && (
                  <Check className="mr-2 mb-1" />
                )}
                {props.modalData === GOV_PAGE_MODAL.TRANSACTION_SUCCESS || props.alreadyVoted
                  ? 'Submitted'
                  : 'Submit'}
              </Button>
            ) : (
              <Button onClick={props.connectWallet} className={styles.submitButton} startIcon="add">
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
            The weight of your vote is calculated based on your xPLENTY balance at the block the PIP
            was inserted on-chain. Users can cast their vote for the duration of one week.
          </p>
          <div className={`px-3 py-3 ${styles.info}`}>
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
};

VoteModal.propTypes = {
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
};

export default VoteModal;
