import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../Ui/Buttons/Button';
import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HEADER_MODAL } from '../../constants/header';
import Switch from '../Ui/Switch/Switch';
import useMediaQuery from '../../hooks/mediaQuery';
import { RPC_NODE } from '../../constants/localStorage';
import { connect } from 'react-redux';
import axios from 'axios';
import { setNode } from '../../redux/slices/settings/settings.slice';

const HeaderBottom = (props) => {
  useEffect(() => {
    isOpen(true);
  }, [props]);
  const setDefault = () => {
    isOpen(false);
    setNodeSelector(false);
  };

  const [nodeSelector, setNodeSelector] = useState(false);
  const isMobile = useMediaQuery('(max-width: 991px)');
  const [open, isOpen] = useState(true);

  async function isValidURL(userInput) {
    try {
      const response = await axios({
        method: 'get',
        baseURL: userInput,
        url: '/chains/main/blocks',
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  const [currentRPC, setCurrentRPC] = useState('');
  const [customRPC, setCustomRPC] = useState('');

  const LOCAL_RPC_NODES = {
    PLENTY: 'https://mifx20dfsr.windmill.tools/',
    GIGANODE: 'https://mainnet-tezos.giganode.io/',
    CRYPTONOMIC: 'https://tezos-prod.cryptonomic-infra.tech/',
  };
  const nodeNames = {
    PLENTY: 'Plenty node',
    GIGANODE: 'Giganode',
    CRYPTONOMIC: 'Cryptonomic',
  };

  const rpcNodeDetect = async () => {
    let RPCNodeInLS = localStorage.getItem(RPC_NODE);

    if (!RPCNodeInLS) {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES['CRYPTONOMIC']);
      props.setNode(LOCAL_RPC_NODES['CRYPTONOMIC']);
      setCurrentRPC(LOCAL_RPC_NODES['CRYPTONOMIC']);
      RPCNodeInLS = LOCAL_RPC_NODES['CRYPTONOMIC'];
    }

    const valid = await isValidURL(RPCNodeInLS);
    if (!valid) {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES['PLENTY']);
      props.setNode(LOCAL_RPC_NODES['PLENTY']);
      setCurrentRPC('PLENTY');
      return;
    }

    const matchedNode = Object.keys(LOCAL_RPC_NODES).find(
      (key) => LOCAL_RPC_NODES[key] === RPCNodeInLS,
    );

    if (!matchedNode) {
      setCurrentRPC('CUSTOM');
      setCustomRPC(RPCNodeInLS);
      return;
    }

    setCurrentRPC(matchedNode);
  };

  useEffect(() => {
    rpcNodeDetect();
    // eslint-disable-next-line
  }, [nodeSelector]);

  const setRPCInLS = async () => {
    if (currentRPC !== 'CUSTOM') {
      localStorage.setItem(RPC_NODE, LOCAL_RPC_NODES[currentRPC]);
      props.setNode(LOCAL_RPC_NODES[currentRPC]);
      //isOpen(false);
      setDefault();
    } else {
      let _customRPC = customRPC;
      if (!_customRPC.match(/\/$/)) {
        _customRPC += '/';
      }
      const response = await isValidURL(_customRPC);

      if (!response) {
        props.setLoaderMessage({ type: 'error', message: 'Invalid RPC URL' });
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      } else {
        setDefault();
        // isOpen(false);
        localStorage.setItem(RPC_NODE, _customRPC);
        props.setNode(_customRPC);
      }
    }
  };

  return (
    (isMobile ? props.isExpanded : props.selectedHeader) &&
    open && (
      <>
        <div
          className={clsx('headerBottom', {
            'pt-0': !props.selectedHeader,
            height: props.selectedHeader === HEADER_MODAL.SETTINGS && nodeSelector,
            'more-height': props.selectedHeader === HEADER_MODAL.MORE,
          })}
          {...(props.selectedHeader === HEADER_MODAL.SETTINGS
            ? {}
            : { onMouseLeave: () => isOpen(false) })}
        >
          {props.selectedHeader === HEADER_MODAL.TRADE && (
            <Row>
              <Col lg={12} xs={12}>
                <div className="topics">
                  <Link to="/swap" className="text-decoration-none">
                    <p className="heading">SWAP</p>
                    <div className="flex   para">
                      <div className="parainside">
                        Swap Tezos tokens instantly with audited smart contracts.
                      </div>
                      <div>
                        <span className=" material-icons-round arrowforward">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col lg={12} xs={12}>
                <div className="topics">
                  <Link to="/tokens" className="text-decoration-none">
                    <p className="heading">TOKENS</p>
                    <div className="flex   para">
                      <div className="parainside">
                        View the price, volume, and liquidity of all tokens on Plenty.
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
          {props.selectedHeader === HEADER_MODAL.EARN && (
            <Row>
              <Col lg={6} xs={12}>
                <div className="topics">
                  <Link to="/farms" className="text-decoration-none">
                    <p className="heading">FARM</p>
                    <div className="flex  para ">
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
                    <div className="flex para  ">
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
              <Col lg={6} xs={12}>
                <div className="topics">
                  <Link to="/liquidity-pools" className="text-decoration-none">
                    <p className="heading">POOL</p>
                    <div className="flex para ">
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
            </Row>
          )}
          {props.selectedHeader === HEADER_MODAL.VOTE && (
            <Row>
              <Col lg={12} xs={12}>
                <div className="topics gov">
                  <Link to="/vote" className="text-decoration-none">
                    <p className="heading">VOTE</p>
                    <div className="flex  para para">
                      <div className="parainside">
                        Use xPLENTY to vote for Plenty Improvement Proposals.
                      </div>
                      <div>
                        <span className=" material-icons-round arrowforward">arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col lg={12} xs={12}>
                <div className="topics gov">
                  <a
                    href="https://forum.plentydefi.com/"
                    className="text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-row ">
                      <p className="heading">FORUM</p>
                      <span className="ml-3 material-icons-round launch-icon">launch</span>
                    </div>
                    <div className="flex  para para">
                      <div className="parainside">
                        Discuss Plenty Improvement Proposals or start a discussion.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          )}

          {props.selectedHeader === HEADER_MODAL.MORE && (
            <Row>
              <Col lg={4} xs={12}>
                <div className="topics more">
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
                    <div className="flex   ">
                      <div className="parainside">
                        Documentation for users of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics more">
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
                    <div className="flex   ">
                      <div className="parainside">
                        Open source github repositories of the Plenty Protocol.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics more">
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
                    <div className="flex   ">
                      <div className="parainside">Swap tez for ctez or mint ctez.</div>
                    </div>
                  </a>
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="topics more">
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
                    <div className="flex   ">
                      <div className="parainside">
                        Read our blogs for announcements and regular updates.
                      </div>
                    </div>
                  </a>
                </div>
              </Col>
            </Row>
          )}
          {props.selectedHeader === HEADER_MODAL.SETTINGS &&
            open &&
            (!nodeSelector ? (
              <Row>
                <Col lg={6} xs={12}>
                  <div className="topics " onClick={() => setNodeSelector(true)}>
                    <p className="heading">NODE SELECTOR</p>
                    <div className="flex   para">
                      <div className="parainside">
                        When your data doesn’t load properly, try switching to a different node, or
                        use a custom node.
                      </div>
                      <div>
                        <span className=" material-icons-round arrowforward">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={6} xs={12}>
                  <div className="topics toogleMode">
                    <div className="flex justify-between">
                      <span className="">
                        <span>THEME</span>
                        <div>{props.theme === 'light' ? 'Light' : 'Dark'}</div>
                      </span>
                      <span className="mr-4">
                        <Switch
                          value={props.theme === 'light'}
                          onChange={props.toggleTheme}
                          inverted={true}
                        />
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col lg={12} xs={12}>
                  <span
                    onClick={() => setDefault()}
                    style={{ cursor: 'pointer' }}
                    className="material-icons-round closeOption"
                  >
                    close
                  </span>

                  <div className="topics nodeSelector">
                    <div className="flex  para ">
                      <div style={{ cursor: 'pointer' }} onClick={() => setNodeSelector(false)}>
                        <span className=" material-icons-round arrowback">arrow_back</span>
                      </div>
                      <div>
                        <p className="heading  ">NODE SELECTOR</p>
                      </div>
                    </div>
                    <div className="flex  para ">
                      <div className="parainside nodeSector-Heading">
                        When your data doesn’t load properly, try switching to a different node, or
                        use a custom node.
                      </div>
                    </div>
                  </div>
                  <div className="horizontal-line"></div>
                  <div className="node">
                    {/* <NodeSelectorModal title={'Node Selector'} open={open} isOpen={isOpen} /> */}
                    <>
                      <div className="node-selector-modal">
                        <div className="node-selector-radio-container node-selector-list">
                          <ul>
                            {Object.entries(nodeNames).map(([identifier, name]) => (
                              <li key={identifier}>
                                <label
                                  className={clsx(currentRPC === identifier && 'selected-border')}
                                  htmlFor={identifier}
                                  onClick={() => setCurrentRPC(identifier)}
                                >
                                  <div className="check" />
                                  <input
                                    defaultChecked={currentRPC === identifier}
                                    type="radio"
                                    checked={currentRPC === identifier}
                                    id={identifier}
                                    name="selector"
                                    className="input-nodeselector"
                                  />
                                  <span
                                    className={clsx(
                                      currentRPC === identifier
                                        ? 'selected-label'
                                        : 'default-label',
                                    )}
                                  >
                                    {name}
                                  </span>
                                </label>
                              </li>
                            ))}
                            <li>
                              <label
                                className={clsx(
                                  'custom',
                                  currentRPC === 'CUSTOM' && 'selected-border',
                                )}
                                htmlFor="w-option"
                                onClick={() => setCurrentRPC('CUSTOM')}
                              >
                                <input
                                  defaultChecked={currentRPC === 'CUSTOM'}
                                  type="radio"
                                  id="w-option"
                                  checked={currentRPC === 'CUSTOM'}
                                  name="selector"
                                  className="custominput"
                                />
                              </label>
                              <input
                                disabled={currentRPC !== 'CUSTOM'}
                                type="url"
                                htmlFor="w-option"
                                className={clsx(
                                  'node-selector-modal-input',
                                  currentRPC === 'CUSTOM' && 'selected-border',
                                )}
                                placeholder="https://custom.tezos.node"
                                value={customRPC}
                                onChange={(e) => {
                                  setCustomRPC(e.target.value);
                                }}
                              />
                            </li>
                          </ul>
                        </div>
                        <Button onClick={setRPCInLS} className="button-bg w-100 mt-1 mb-2 py-1">
                          Set Node
                        </Button>
                      </div>
                    </>
                  </div>
                </Col>
              </Row>
            ))}
          {/* {props.selectedHeader === HEADER_MODAL.SETTINGS && open && nodeSelector && (
            <Row>
              <Col lg={12} xs={12}>
                <span
                  onClick={() => isOpen(false)}
                  style={{ cursor: 'pointer' }}
                  className="material-icons-round closeOption"
                >
                  close
                </span>

                <div className="topics nodeSelector" onClick={() => setNodeSelector(false)}>
                  <div className="flex  para ">
                    <div>
                      <span className=" material-icons-round arrowback">arrow_back</span>
                    </div>
                    <div>
                      <p className="heading  ">NODE SELECTOR</p>
                    </div>
                  </div>
                  <div className="flex  para ">
                    <div className="parainside nodeSector-Heading">
                      The Plenty node can be overloaded sometimes. When your data doesn’t load
                      properly, try switching to a different node, or use a custom node.
                    </div>
                  </div>
                </div>
                <div className="horizontal-line"></div>
                <div className="node">
                  <NodeSelectorModal title={'Node Selector'} />
                </div>
              </Col>
            </Row>
          )} */}
        </div>
      </>
    )
  );
};
const mapStateToProps = (state) => ({
  rpcNode: state.settings.rpcNode,
});

const mapDispatchToProps = (dispatch) => ({
  setNode: (rpcNode) => dispatch(setNode(rpcNode)),
});
HeaderBottom.propTypes = {
  connectWallet: PropTypes.func,
  selectedHeader: PropTypes.any,
  isExpanded: PropTypes.any,
  rpcNode: PropTypes.any,
  theme: PropTypes.any,
  toggleTheme: PropTypes.any,
  setSelectedHeader: PropTypes.any,
  nodeSelector: PropTypes.func.isRequired,
  setLoaderMessage: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(HeaderBottom);
