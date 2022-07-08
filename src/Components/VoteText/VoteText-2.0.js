import React from 'react';
import Row from 'react-bootstrap/Row';
import Table from '../../assets/images/imagepip-2.png';
import { ReactComponent as Link } from '../../assets/images/linkIcon.svg';
import useMediaQuery from '../../hooks/mediaQuery';
import VoteModalResults from '../VoteModal/VoteModalResults-2.0';
import styles from './voteText.module.scss';

const VoteText = () => {
  const isMobile = useMediaQuery('(max-width: 991px)');

  return (
    <div className=" row justify-content-center">
      <div className=" col-24 col-sm-20 col-md-10 col-lg-10 col-xl-10">
        <Row className={styles.firstRow}>
          <h6 className={styles.proposalHeading}>Proposal #2 • PIP-002</h6>
          <h2 className={`mt-3 ${styles.govHeading}`}>Reallocating rewards from wAsset farms</h2>

          <p className={`mt-1  ${styles.proposalInfo}`}>
            The dev team proposes to end the farms that include wrapped assets of the Wrap Protocol
            because of the rebrand from wASSET to ASSET.e. At the same time we propose to use the
            unused emissions for incentivization of liquidity pools that will be compatible with the
            new Plenty Network.
          </p>
          {isMobile &&
             <VoteModalResults/>
            }
          {isMobile && <div className={`mt-2 mx-3 ${styles.lineBottom} `}></div>}
        </Row>

        <Row className={`${styles.secondRow}`}>
          <h4 className={` ${styles.plentyHeading}`}>Background</h4>
          <p className={`mt-1 ${styles.discription}`}>
            The assets bridged from Ethereum will be rebranded from wASSET to ASSET.e. This process
            requires users to actively swap their wrapped assets. This migration will take place
            early May 2022.
          </p>
          <p className={styles.discription}>
            The goal is to grow liquidity in liquidity pools compatible with the new Plenty Network
            before launch. Being compatible with the new Plenty Network means that before the launch
            of the PLY & vePLY NFT system the trading fees accumulate in the liquidity pool. After
            relaunch the trading fees will be added to the attached gauges and are allocated to
            vePLY NFT voters.
          </p>
          <h4 className={` ${styles.plentyHeading}`}>Motivation</h4>
          <p className={styles.discription}>
            The wrapped asset rebrand gives us the opportunity to redirect PLENTY emissions from the
            following farms that are required to close due to the rebrand of the wrapped assets:
          </p>
          <ul>
            <li>PLENTY - wUSDC LP</li>
            <li>PLENTY - wBUSD LP</li>
            <li>PLENTY - wUSDT LP</li>
            <li>PLENTY - wDAI LP</li>
            <li>PLENTY - wWBTC LP</li>
            <li>PLENTY - wWETH LP</li>
            <li>PLENTY - wLINK LP</li>
            <li>PLENTY - wMATIC LP</li>
          </ul>
          <p className={styles.discription}>
            The goal is to attract liquidity in trading pairs compatible with the new Plenty Network
            before launch. Trading pairs that are expected to attract liquidity, volume and
            emissions after relaunch:
          </p>
          <div>
            <div>
              <p className={styles.discription}>
                <strong>Flat curve AMM farms:</strong>
              </p>
              <ul>
                <li>USDT.e - USDC.e LP</li>
                <li>DAI.e - USDC.e LP</li>
                <li>kUSD - USDC.e LP</li>
                <li>uUSD - USDC.e LP</li>
                <li>USDtz - USDC.e LP</li>
                <li>ETHtz - WETH.e LP</li>
                <li>tzBTC - WBTC.e LP</li>
                <li>EURL - agEUR.e</li>
                <li>TEZ - CTEZ LP</li>
              </ul>
            </div>
            <div>
              <p className={styles.discription}>
                <strong>Regular curve AMM farms:</strong>
              </p>
              <ul>
                <li>USDC.e - CTEZ LP</li>
                <li>WBTC.e - CTEZ LP</li>
                <li>WETH.e - CTEZ LP</li>
                <li>LINK.e - CTEZ LP</li>
                <li>MATIC.e - CTEZ LP</li>
                <li>DOGA - CTEZ LP</li>
                <li>EURL - USDC.e LP</li>
              </ul>
            </div>
          </div>
          <p className={styles.discription}>
            These liquidity pools will be compatible with the new Plenty Network. This means that
            before the relaunch of Plenty the trading fees accumulate in the liquidity pool. After
            relaunch trading fees will be added to the attached gauges and are allocated to vePLY
            NFT voters.
          </p>

          <div>
            <div>
              <p className={styles.discription}>
                <strong>
                  Besides adding new farms we also propose to reduce the reward rates for the
                  following farms:
                </strong>
              </p>
              <ul>
                <li>tzBTC - PLENTY LP</li>
                <li>USDtz - PLENTY LP</li>
                <li>kUSD - PLENTY LP</li>
                <li>uUSD - PLENTY LP</li>
                <li>hDAO - PLENTY LP</li>
              </ul>
            </div>
            <div>
              <p className={styles.discription}>
                <strong>And increase the reward rate for:</strong>
              </p>
              <ul>
                <li>PLENTY - CTEZ LP</li>
                <li>xPLENTY</li>
              </ul>
            </div>
          </div>
          <h4 className={` ${styles.plentyHeading}`}>Specification</h4>
          <p className={`mt-1 ${styles.discription}`}>
            Deploy Plenty Network compatible liquidity pools and temporary farms. View the proposed
            reward rates below.
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
              href="https://forum.plentydefi.com/t/pip-002-reallocating-rewards-from-wasset-farms/136"
              target="_blank"
              rel="noreferrer"
            >
              View Forum
            </a>
            <Link className="ml-2 mb-1" />
          </p>

          <p className={`${styles.discriptionInfo}`}>
            <a
              href="https://ipfs.io/ipfs/bafkreie3m2fgehpmqlpegdsrpmfyykudls553xhpzj7xgx3oqf7vdvqgwu"
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
