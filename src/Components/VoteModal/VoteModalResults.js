import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styles from './vote.module.scss';
import { GOV_PAGE_MODAL } from '../../constants/govPage';
import { ReactComponent as CheckViolet } from '../../assets/images/CheckCircle.svg';

const VoteModalResults = (props) => {
  const [proposalResult, setProposalResult] = useState('');

  useEffect(() => {
    if (props.gov?.yayCount >= props.gov?.nayCount && props.gov?.yayCount >= props.gov?.absCount) {
      setProposalResult(GOV_PAGE_MODAL.ACCEPTED);
    } else if (props.gov?.nayCount > props.gov?.absCount) {
      setProposalResult(GOV_PAGE_MODAL.REJECTED);
    } else if (props.gov?.absCount > props.gov?.nayCount) {
      setProposalResult(GOV_PAGE_MODAL.ABSTAINED);
    }
  }, [props.gov]);

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
            <span className={styles.startEndDate}>December 15, 2021</span>
          </div>
          <div className={`mt-3 ${styles.resultsDates}`}>
            <div className={styles.startEndLabel}>End date</div>
            <div className={styles.startEndDate}>
              <span>December 22, 2021</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VoteModalResults.propTypes = {
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

export default VoteModalResults;
