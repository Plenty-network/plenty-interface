import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import styles from './governance.module.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Clock } from '../../assets/images/clock.svg';
import useMediaQuery from '../../hooks/mediaQuery';

const Governance = () => {
  const isMobile = useMediaQuery('(max-width: 991px)');
  const [voteSelected, setVoteSelected] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const voteModal = useMemo(() => {
    return (
      <div
        className={`row justify-content-center col-20 col-md-20 col-lg-10 col-xl-10 ${styles.gov}`}
      >
        <div className={styles.border}>
          <div className={` ${styles.voteModal}`}>
            <p className={styles.voteHeading}>Governance</p>
            <p className="mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industrys standard dummy text ever since the 1500s
            </p>
            <div className={`my-4 ${styles.line} `}></div>
            <p className={`my-4 ${styles.voteHeading}`}>Make a Difference</p>
            <span className={styles.postedInfo}>Posted on November 03, 2021 , 13:05</span>

            <div
              className={clsx(
                styles.votingBox,
                voteSelected === 'accept' ? styles.borderChange : styles.initialColor,
              )}
            >
              <input
                className={` ${styles.option}`}
                id="select-accept"
                type="radio"
                name="where"
                value="accept"
                onClick={(e) => {
                  setVoteSelected(e.target.value);
                }}
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  voteSelected === 'accept' ? styles.colorChange : styles.initialColor,
                )}
                htmlFor="select-accept"
              >
                Accept
              </label>
              {isSubmitted && <span>97.5%</span>}
            </div>

            <div
              className={clsx(
                styles.votingBox,
                voteSelected === 'reject' ? styles.borderChange : styles.initialColor,
              )}
            >
              <input
                className={` ${styles.option}`}
                id="select-reject"
                type="radio"
                name="where"
                value="reject"
                onClick={(e) => {
                  setVoteSelected(e.target.value);
                }}
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  voteSelected === 'reject' ? styles.colorChange : styles.initialColor,
                )}
                htmlFor="select-reject"
              >
                Reject
              </label>
              {isSubmitted && <span>97.5%</span>}
            </div>
            <div
              className={clsx(
                styles.votingBox,
                voteSelected === 'abstained' ? styles.borderChange : styles.initialColor,
              )}
            >
              <input
                className={` ${styles.option}`}
                id="select-abstained"
                type="radio"
                name="where"
                value="abstained"
                onClick={(e) => {
                  setVoteSelected(e.target.value);
                }}
              />
              <label
                className={clsx(
                  'ml-4',
                  styles.selectItem,
                  voteSelected === 'abstained' ? styles.colorChange : styles.initialColor,
                )}
                htmlFor="select-abstained"
              >
                Abstained
              </label>
              {isSubmitted && <span>97.5%</span>}
            </div>
            <span
              className={clsx(
                styles.submitButton,
                voteSelected ? styles.buttonColorChange : styles.initialColor,
              )}
              onClick={() => {
                setIsSubmitted(true);
              }}
            >
              {isSubmitted ? 'Submitted' : 'Submit'}
            </span>
            <div className="mt-3">
              <Clock />
              <span className={`ml-2 ${styles.poll}`}>
                This poll closes on <b>Dec 12, 2021</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [voteSelected, isSubmitted]);

  return (
    <>
      <Container className={` ${styles.govContainer}`} fluid>
        <Row className="row justify-content-center">
          <Col xs={20} sm={8} md={10} lg={6} xl={5}>
            <div className=" row justify-content-center">
              <div className=" col-24 col-sm-20 col-md-20 col-lg-8 col-xl-10">
                <Row className={styles.firstRow}>
                  <h6 className={styles.proposalHeading}>Proposal #1 • PIP-001</h6>
                  <h2 className={`mt-3 ${styles.govHeading}`}>
                    Become a tenant in the Bloktopia VR metaverse
                  </h2>
                  {isMobile && voteModal}
                  <p className={`mt-3 ${styles.proposalInfo}`}>
                    It would be awesome to see plenty become a tenant in the new vr/ar bloktopia
                    metaverse. The metaverse launches in Q1 of 2022. They already have tons of big
                    name crypto projects as tenants. So it only makes since that plenty would become
                    one to.
                  </p>
                </Row>

                <Row className={` ${styles.secondRow}`}>
                  <h4 className={` ${styles.plentyHeading}`}>Dear Plenty community,</h4>
                  <p className={`mt-3 ${styles.discription}`}>
                    Since its launch on July 22, 2021, plenty continuously grew, and it is fantastic
                    to see that over 500 vaults were created, more than 5m tez are locked in those
                    vaults, and over 8m uUSD were minted. The quality of the community discussions
                    prove that the platform documentation, its open-source notion and its
                    participatory approach empower us all in building a new and exciting ecosystem
                    for asset creation and management.
                  </p>
                  <p className={styles.discription}>
                    We are excited to propose our first amendment to plenty. This amendment proposes
                    the ability for users to create a new synthetic asset uDEFI that is
                    collateralised with uUSD, allocating YOU for liquidity incentives, an
                    introduction of a 6-week lock-up period for uUSD in saving accounts, optional
                    minter conversions and changes to the interest rate feature for uDEFI.
                  </p>
                </Row>
              </div>
            </div>
          </Col>
          <Col xs={10} sm={5} md={10} lg={6} xl={5}>
            {!isMobile && voteModal}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Governance;
