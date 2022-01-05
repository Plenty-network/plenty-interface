import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NodeSelectorModal from './NodeSelectorModal';
import { HEADER_MODAL } from '../../constants/header';

const HeaderBottom = (props) => {
  const [nodeSelector, setNodeSelector] = useState(false);

  return (
    props.isExpanded && (
      <>
        <div
          className={clsx('headerBottom', {
            'pt-0': !props.selectedHeader,
          })}
        >
          {props.selectedHeader === HEADER_MODAL.TRADE && (
            <Row>
              <Col lg={12} xs={12}>
                <div className="topics">
                  <Link to="/swap" className="text-decoration-none">
                    <p className="heading">SWAP</p>
                    <div className="flex justify-between  para">
                      <div className="parainside">
                        Swap liquid Tezos tokens, in an instant, with audited smart contracts.{' '}
                      </div>
                      <div>
                        <span className=" material-icons-round ">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col lg={12} xs={12}>
                <div className="topics">
                  <Link to="/tokens" className="text-decoration-none">
                    <p className="heading">TOKENS</p>
                    <div className="flex justify-between  para">
                      <div className="parainside">
                        View the price, volume, and liquidity, all traded tokens on the protocol.{' '}
                      </div>
                      <div>
                        <span className=" material-icons-round ">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            </Row>
          )}
          {props.selectedHeader === HEADER_MODAL.EARN && (
            <Row>
              <Col lg={6} xs={12}>
                <div className="topics">
                  <Link to="/liquidity-pools" className="text-decoration-none">
                    <p className="heading">POOL</p>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Liquidity providers earn a 0.25% fee on all trades proportional to their
                        share of the pool.
                      </div>
                      <div>
                        <span className=" material-icons-round arrowforward">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col lg={6} xs={12}>
                <div className="topics">
                  <Link to="/farms" className="text-decoration-none">
                    <p className="heading">FARM</p>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Deposit your Plenty Liquidity Provider tokens in a farm to receive rewards.
                      </div>
                      <div>
                        <span className=" material-icons-round arrowforward ">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col lg={6} xs={12}>
                <div className="topics">
                  <Link to="/stake" className="text-decoration-none">
                    <p className="heading">STAKE</p>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Stake your PLENTY for xPLENTY and maximize your yield. No Impermanent Loss.
                      </div>
                      <div>
                        <span className=" material-icons-round arrowforward">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            </Row>
          )}
          {props.selectedHeader === HEADER_MODAL.VOTE && (
            <Row>
              <Col lg={12} xs={12}>
                <div className="topics">
                  <Link to="/vote" className="text-decoration-none">
                    <p className="heading">VOTE</p>
                    <div className="flex justify-between para para">
                      <div className="parainside">
                        Use xPLENTY to vote for Plenty Improvement Proposals.
                      </div>
                      <div>
                        <span className=" material-icons-round ">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col lg={12} xs={12}>
                <div className="topics">
                  <Link to="/vote" className="text-decoration-none">
                    <p className="heading">GOVERNANCE</p>
                    <div className="flex justify-between para para">
                      <div className="parainside">
                        Use xPLENTY to vote for Plenty Improvement Proposals.
                      </div>
                      <div>
                        <span className=" material-icons-round ">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            </Row>
          )}

          {props.selectedHeader === HEADER_MODAL.MORE && (
            <Row>
              <Col lg={4} xs={12}>
                <div className="topics">
                  <a
                    href="https://plenty-defi.notion.site/Plenty-Docs-004ba25f40b641a3a276b84ebdc44971"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">ANALYTICS</p>

                      <span className="ml-3 material-icons-round launch-icon">launch</span>
                    </div>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Documentation for users of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics">
                  <a
                    href="https://plenty-defi.notion.site/Plenty-Docs-004ba25f40b641a3a276b84ebdc44971"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">DOCS</p>

                      <span className="ml-3 material-icons-round launch-icon">launch</span>
                    </div>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Documentation for users of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics">
                  <a
                    href="https://github.com/Plenty-DeFi"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">GITHUB</p>

                      <span className="ml-3 material-icons-round launch-icon">launch</span>
                    </div>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Open Source github repositories of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics">
                  <a
                    href="https://ctez.app/"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">CTEZ</p>

                      <span className="ml-3 material-icons-round launch-icon">launch</span>
                    </div>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Swap tez for ctez or mint ctez in an oven and earn baking rewards.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics">
                  <a
                    href="https://plentydefi.medium.com/"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">BLOGS</p>

                      <span className="ml-3 material-icons-round launch-icon">launch</span>
                    </div>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Documentation for users of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics">
                  <a
                    href="https://plenty-defi.notion.site/Plenty-Docs-004ba25f40b641a3a276b84ebdc44971"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">DEV</p>

                      <span className="ml-3 material-icons-round launch-icon ">launch</span>
                    </div>
                    <div className="flex justify-between  ">
                      <div className="parainside">
                        Developer documentation for building on top of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          )}
          {props.selectedHeader === HEADER_MODAL.SETTINGS && !nodeSelector && (
            <Row>
              <Col lg={6} xs={12}>
                <div className="topics" onClick={() => setNodeSelector(true)}>
                  <div className="flex ">
                    <p className="heading">NODE SELECTOR</p>
                  </div>
                  <div className="flex justify-between para ">
                    <div className="parainside">Lorem Ipsum is simply dummy</div>
                    <div>
                      <span className=" material-icons-round ">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
          {props.selectedHeader === HEADER_MODAL.SETTINGS && nodeSelector && (
            <Row>
              <Col lg={12} xs={12}>
                <div className="topics" onClick={() => setNodeSelector(false)}>
                  <div className="flex ">
                    <p className="heading">NODE SELECTOR</p>
                  </div>
                  <div className="flex justify-between para ">
                    <div>
                      <span className=" material-icons-round ">arrow_back</span>
                    </div>
                    <div className="parainside">
                      The Plenty node can be overloaded sometimes. When your data doesn’t load
                      properly, try switching to a different node, or use a custom node.
                    </div>
                  </div>
                </div>
                <div className="node">
                  <NodeSelectorModal title={'Node Selector'} />
                </div>
              </Col>
            </Row>
          )}
        </div>
      </>
    )
  );
};

HeaderBottom.propTypes = {
  connecthWallet: PropTypes.func,
  selectedHeader: PropTypes.any,
  isExpanded: PropTypes.any,
  page: PropTypes.any,
};

export default HeaderBottom;
