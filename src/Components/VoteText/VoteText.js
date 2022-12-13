import PropTypes from 'prop-types';
import React from 'react';
import styles from './voteText.module.scss';
import Row from 'react-bootstrap/Row';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import useMediaQuery from '../../hooks/mediaQuery';
import VoteModal from '../VoteModal/VoteModal';
import VoteModalResults from '../VoteModal/VoteModalResults';
const VoteText4 = (props) => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  return (
    <div className=" row justify-content-center">
      <div className=" col-24 col-sm-20 col-md-10 col-lg-10 col-xl-10">
        <Row className={styles.firstRow}>
          <h6 className={styles.proposalHeading}>Proposal #4 • PIP-004</h6>
          <h2 className={`mt-3 ${styles.govHeading}`}>
            Allocating not-minted supply of PLENTY to a Plenty Network Treasury at Launch
          </h2>

          <p className={`mt-1  ${styles.proposalInfo}`}>
            The Tezsure team, the team behind Plenty, proposes a DAO treasury for plenty.network.
            With the introduction of the new veTokenomics and PLY, we propose to utilize unminted
            PLENTY tokens for a Plenty Ecosystem Growth Treasury, managed by a DAO. Also included in
            this proposal: an end date for the minting of PLENTY.
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

        <Row className={`${styles.secondRow}`}>
          <h4 className={` ${styles.plentyHeading}`}>Background</h4>
          <p className={`mt-1 ${styles.discription}`}>
            PlentyDeFi.com was originally co-founded by Tezsure & Draper Goren Holm (DGH), back in
            May 2021, and together the two entities defined very primitive tokenomics. Part of the
            co-founder agreement the two entities agreed on splitting the work and the PLENTY
            accumulating in the dev wallet (~10% of total supply) 50/50 between Tezsure and DGH.
          </p>
          <p className={styles.discription}>
            PlentyDeFi.com was started as a yield farm and staking experiment on Tezos, back in May
            2021, to test if we could bring more liquidity to Tezos, especially from Ethereum, by
            utilizing bridged assets. Following the experiment we launched the first token-to-token
            decentralized exchange on Tezos.
          </p>
          <p className={styles.discription}>
            In its own time, the experiment was a great success. Plenty’s TVL crossed 50 million,
            and 100s of millions USD volume was generated through the Plenty smart contracts.
            However, the PLENTY token was never properly designed in a way that it automates
            inflation-based incentives to sustain the growth of the Plenty protocol.
          </p>
          <p className={styles.discription}>
            When we acquired the Wrap Protocol from Bender Labs we saw an opportunity to redo our
            tokenomics, bring an EVM-Tezos bridge into our product suite, and combine both Plenty
            and Wrap communities into a new vision of the Plenty Network.
          </p>
          <p className={styles.discription}>
            While designing the PLY tokenomics, we concluded that we won’t be able to allocate more
            than 5% of the PLY tokens for Growth. Ideally this percentage is around 10%.
          </p>
          <p className={styles.discription}>
            We went ahead with a 5% supply for growth (airdrop and partner program) with the goal of
            bringing more users from other blockchain ecosystems.
          </p>
          <h4 className={` ${styles.plentyHeading}`}>Motivation</h4>
          <p className={` ${styles.plentyHeading1} w-[100%]`}>PLENTY</p>
          <p className={styles.discription}>
            The Tezsure team is obligated to send DGH’s share (~5%) of PLENTY tokens to a DGH
            managed address, to honor the original agreement from May 2021. Tezsure will burn its
            PLENTY share (~ 5%) of the original PLENTY since there is already a percentage of PLY
            allocated for the team.
          </p>
          <h3 className={`mt-3  ${styles.plentyHeading}`}>PLY</h3>
          <p className={styles.discription}>
            With PLY being a new token, and Plenty Network being an entirely new platform, we have
            to put a lot of effort into educating users from Tezos and other blockchains. This
            includes onboarding more developers so that they build products like Convex on top of
            Plenty, and also supporting the growth of the ecosystem by helping other initiatives
            such as the listing of the tokens on a CEX, market making etc.
          </p>
          <p className={styles.discription}>
            There will be a lot of unforeseen circumstances where having a DAO treasury could be
            overall beneficial for the community. Having seen a proposal on the Youves forum for
            market making, we can expect a similar scenario.
          </p>
          <p className={styles.discription}>
            Hence, the need for a Plenty Growth Treasury, and the easiest way to get capital in it
            is by using unminted PLENTY. We also propose to stop minting new PLENTY from December
            20th. After the 20th the remaining PLENTY will be minted and sent to a new multsig which
            will act as the new DAO treasury. This treasury will be managed by veNFT holders.
          </p>

          <div>
            <h4 className={` ${styles.plentyHeading}`}>Specification</h4>
            <ul className={`mt-1 ${styles.discription}`}>
              <li>Stop minting date: December 20th</li>
              <li>Expected launch date zone new system: between December 20th and January 10th</li>
              <li>
                Multisig admins mint all the unminted Plenty and send it to a new Multisig
                controlled –initially– by team members of Tezsure. In the future the multisig
                members can be changed.
              </li>
              <li>
                Upon plenty.network launch, the new multi-sig converts all the owned PLENTY to PLY.
              </li>
              <li>
                After converting all PLENTY to PLY, the multi-sig will evolve into a Lambda DAO
                (similar to Kolibri) governed by PLY/veNFTs.
              </li>
            </ul>
          </div>
          <div>
            <h4 className={`mt-2 ${styles.plentyHeading}`}>More information</h4>
          </div>

          <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
            <a
              href="https://forum.plentydefi.com/t/proposal-allocating-not-minted-supply-of-plenty-to-a-plenty-network-treasury-at-launch/147/2"
              target="_blank"
              rel="noreferrer"
            >
              View Forum
            </a>
            <Link className="ml-2 mb-1" />
          </p>

          <p className={`${styles.discriptionInfo}`}>
            <a
              href="https://ipfs.io/ipfs/bafybeifvtoeprwzxvr2jtfyqlkemjtigketgnxy23vguygsmjk6ofcvpn4"
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
export default VoteText4;

VoteText4.propTypes = {
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
