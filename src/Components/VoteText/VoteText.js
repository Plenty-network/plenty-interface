import PropTypes from 'prop-types';
import React from 'react';
import styles from './voteText.module.scss';
import Row from 'react-bootstrap/Row';
import Table from '../../assets/images/Farm_Rewards.png';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import useMediaQuery from '../../hooks/mediaQuery';
import VoteModal from '../VoteModal/VoteModal';
import VoteModalResults from '../VoteModal/VoteModalResults';

const VoteText = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  return (
    <div className=" row justify-content-center">
      <div className=" col-24 col-sm-20 col-md-10 col-lg-10 col-xl-10">
        <Row className={styles.firstRow}>
          <h6 className={styles.proposalHeading}>Proposal #1 • PIP-001</h6>
          <h2 className={`mt-3 ${styles.govHeading}`}>Minting rate reduction</h2>

          <p className={`mt-1 ${styles.proposalInfo}`}>
            Implement a minting rate reduction from 50 PLENTY/block to 30 PLENTY/block. A reduction
            of the minting rate results in a new reward distribution scheme, as seen in the
            specification, for the PLENTY farms.
          </p>
          {isMobile &&
            (props.voteEnded ? (
              <VoteModalResults
                gov={props.gov}
                loading={props.loading}
                modalData={props.modalData}
                alreadyVoted={props.alreadyVoted}
                walletAddress={props.walletAddress}
                connectWallet={props.connectWallet}
                getVote={props.getVote}
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
              />
            ))}
          {isMobile && <div className={`mt-2 mx-3 ${styles.lineBottom} `}></div>}
        </Row>

        <Row className={` ${styles.secondRow}`}>
          <h4 className={` ${styles.plentyHeading}`}>Motivation</h4>
          <p className={`mt-1 ${styles.discription}`}>
            Almost half of the maximum supply of 62,000,000 PLENTY is minted already, and at the
            current rate all tokens will be minted around August 2022.
          </p>
          <p className={styles.discription}>
            The goal of this proposal is to reduce the amount of PLENTY that leaves the circulation,
            by reducing the newly incoming supply. In the short term, this will lower the APR of the
            farms. However, by reducing the minting rate, the sell pressure of the PLENTY token is
            reduced as well.
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
            To be eligible to vote, a user must hold xPLENTY at the time of the deployment of the
            Plenty Improvement Proposal (PIP).
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
  );
};
export default VoteText;

VoteText.propTypes = {
  voteEnded: PropTypes.any,
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
