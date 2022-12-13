import React from 'react';
import styles from './voteText.module.scss';
import Row from 'react-bootstrap/Row';
import Table from '../../assets/images/pip2-image.jpeg';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import useMediaQuery from '../../hooks/mediaQuery';
import VoteModalResultscopy3 from '../VoteModal/VoteModalResults-3.0';
const VoteText30 = () => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  return (
    <div className=" row justify-content-center">
      <div className=" col-24 col-sm-20 col-md-10 col-lg-10 col-xl-10">
        <Row className={styles.firstRow}>
          <h6 className={styles.proposalHeading}>Proposal #3 • PIP-003</h6>
          <h2 className={`mt-3 ${styles.govHeading}`}>More flat CFMM farms, including USDT</h2>

          <p className={`mt-1  ${styles.proposalInfo}`}>
            Introduce farms that include “.e” tokens from Ethereum and “.p” tokens from Polygon and
            introduce farms that include Tezos native USDT. Reduce rewards of existing farms and
            close farms attached to liquidity pools with low activity.
          </p>
          {isMobile && <VoteModalResultscopy3 />}
          {isMobile && <div className={`mt-2 mx-3 ${styles.lineBottom} `}></div>}
        </Row>

        <Row className={`${styles.secondRow}`}>
          <h4 className={` ${styles.plentyHeading}`}>Background</h4>
          <p className={`mt-1 ${styles.discription}`}>
            All new CPMM and flat CFMM liquidity pools are compatible with the new vote escrow
            (“ve”) system of the Plenty Network. The goal is to attract liquidity in trading pairs
            compatible with the new Plenty Network before launch of the “ve” system.
          </p>
          <p className={styles.discription}>
            Being compatible with the new Plenty Network means that before the launch of the new
            vote escrow (“ve”) system trading fees accumulate in the liquidity pool. After the
            launch of the new “ve” system trading fees will be added to the attached gauges and are
            allocated to vePLY NFT voters.
          </p>
          <h4 className={` ${styles.plentyHeading}`}>Motivation</h4>
          <p className={styles.discription}>
            Stablecoin liquidity is important for the Tezos ecosystem. Stableswap pairs + farms with
            Tezos native USDT paired with either of the two leading algorihmic stablecoins on Tezos{' '}
            <em>-kUSD by Kolibri or uUSD by Youves-</em> are pairs that will attract liquidity.
          </p>
          <p className={styles.discription}>
            The stablecoin BUSD.e is the second most liquid stablecoin of the Plenty bridge. The
            previous proposal, PIP-002, didnt include a BUSD.e farm.
          </p>
          <p className={styles.discription}>
            With the launch of the Polygon bridge we can introduce both flat CFMM &amp; CPMM
            liquidity pools +farms with “.p” tokens.
          </p>
          <p className={styles.discription}>
            We would like to continue with the push of ctez liquidity by pairing ctez with most new
            tokens.
          </p>
          <p className={styles.discription}>
            After conversations with Euro stablecoin teams Lugh (EURL) and Angle Protocol (agEUR) we
            propose three different liquidity pools + farms, including one stable CFMM + farm
            between the two euro stablecoins.
          </p>

          <div>
            <div>
              <h4 className={` ${styles.plentyHeading}`}>new farms</h4>
              <div>
                <p className={styles.discription}>
                  <strong>Flat CFMMs</strong>
                </p>
                <ul>
                  <li>BUSD.e - USDC.e</li>
                  <li>kUSD - USDT</li>
                  <li>uUSD - USDT</li>
                  <li>uXAU - PAXG.e</li>
                  <li>WMATIC.p - MATIC.e</li>
                  <li>WETH.p - WETH.e</li>
                </ul>
              </div>
              <div>
                <p className={styles.discription}>
                  <strong>CPMMs</strong>
                </p>
                <ul>
                  <li>USDT - CTEZ</li>
                  <li>EURL - CTEZ</li>
                  <li>PAXG.e - CTEZ</li>
                  <li>WETH.p - CTEZ</li>
                  <li>WMATIC.p - CTEZ</li>
                  <li>agEUR.e - USDC.e</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className={` ${styles.plentyHeading}`}>Farms reducing</h4>
              <div>
                <p className={styles.discription}>
                  <strong>Flat CFMMs</strong>
                </p>
                <ul>
                  <li>USDT.e - USDC.e</li>
                </ul>
              </div>
              <div>
                <p className={styles.discription}>
                  <strong>CPMMs</strong>
                </p>
                <ul>
                  <li>uUSD - PLENTY</li>
                  <li>kUSD - PLENTY</li>
                  <li>USDtz - PLENTY</li>
                  <li>tzBTC - PLENTY</li>
                  <li>DOGA - CTEZ</li>
                  <li>LINK.e - CTEZ</li>
                  <li>MATIC.e - CTEZ</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className={` ${styles.plentyHeading}`}>Farms closing</h4>
              <div>
                <ul>
                  <li>KALAM - PLENTY</li>
                  <li>hDAO - PLENTY</li>
                  <li>WRAP - PLENTY</li>
                  <li>ETHtz - PLENTY</li>
                  <li>EURL - USDC.e (EURL preferes pairing with CTEZ)</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className={` ${styles.plentyHeading}`}>Specification</h4>
            <p className={`mt-1 ${styles.discription}`}>
              Deploy Plenty Network compatible CPMM and flat CFMM liquidity pools and temporary
              farms. Adjust the reward rates of the different farms as proposed below.
            </p>
            <div>
              <img src={Table} className={styles.table} />
            </div>

            <h4 className={`mt-3  ${styles.plentyHeading}`}>Vote</h4>

            <p className={` mt-1 ${styles.discription}`}>
              To be eligible to vote, a user must hold xPLENTY at the time of the deployment of the
              Plenty Improvement Proposal (PIP).
            </p>

            <h4 className={`mt-3  ${styles.plentyHeading}`}>Execution</h4>

            <p className={` mt-1 ${styles.discription}`}>
              The proposal will be implemented on a rolling basis.
            </p>
          </div>
          <div>
            <h4 className={`mt-2 ${styles.plentyHeading}`}>More information</h4>
          </div>

          <p className={`mb-1 mt-1 ${styles.discriptionInfo}`}>
            <a
              href="https://forum.plentydefi.com/t/pip-003-more-flat-cfmm-farms-including-usdt/143"
              target="_blank"
              rel="noreferrer"
            >
              View Forum
            </a>
            <Link className="ml-2 mb-1" />
          </p>

          <p className={`${styles.discriptionInfo}`}>
            <a
              href="https://ipfs.io/ipfs/bafkreif367u3jofj7m7ks32oz643bhcxmwtr43gcbsv4wloda4fm6nhyr4"
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
export default VoteText30;
