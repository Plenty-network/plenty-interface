import React, { useEffect, useState } from 'react';
import truncateMiddle from 'truncate-middle';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import clsx from 'clsx';
import Dropdown from 'react-bootstrap/Dropdown';
import { ExternalMenu, NavigationMenu } from './Menu';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as LogoWhite } from '../../assets/images/logo-white.svg';
import { Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SimpleModal from '../../Components/Ui/Modals/SimpleModal';
import NodeSelectorModal from './NodeSelectorModal';
import Loader from '../../Components/loader';
import { RPC_NODE } from '../../constants/localStorage';
import { setNode } from '../../redux/slices/settings/settings.slice';
import { connect } from 'react-redux';
import Button from "../Ui/Buttons/Button";

const Header = (props) => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');
  const [nodeSelector, toggleNodeSelector] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});

  useEffect(() => {
    const RPCNodeInLS = localStorage.getItem(RPC_NODE);
    if (RPCNodeInLS) {
      props.setNode(RPCNodeInLS);
    }
  }, []);

  let connectWalletButton = () => {
    if (props.walletAddress) {
      return (
        <Button
          onClick={props.disconnectWallet}
          color={'primary'}
          className={'bg-themed'}
        >
           <span
               className={clsx(
                   props.theme === 'light' ? 'light-theme-text' : 'span-themed'
               )}
           >
            {truncateMiddle(props.walletAddress, 4, 4, '...')}
          </span>
        </Button>
      );
    } else {
      return (
        <Button
          color={'primary'}
          onClick={props.connecthWallet}
          className={clsx(
              'px-md-3',
              'connect-wallet-btn',
              props.theme === 'light'
                  ? 'frontpage-light-wallet-btn'
                  : 'bg-themed')
          }>
          <div
              className={clsx(
                  'connect-wallet-btn',
                  props.isFrontPage ? 'text-white' : 'span-themed'
              )}
          >
            <div className="flex flex-row align-items-center">
              <span
                  className={clsx(
                      'mr-1',
                      'material-icons-round',
                      props.isFrontPage ? 'text-white' : 'span-themed'
                  )}
              >
              add
            </span>
              <span
                  className={clsx(
                      props.isFrontPage ? 'text-white' : 'span-themed'
                  )}
              >
              Connect to Wallet
            </span>
            </div>
          </div>
        </Button>
      );
    }
  };

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <a
      href=""
      className="nav-menu-item-link"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <span className="span-themed material-icons-round">more_vert</span>
    </a>
  ));

  const resetActiveTab = () => {
    localStorage.setItem('activeTab', 'swap');
  };

  const toggleNodeSelectorHandler = () => {
    toggleNodeSelector(!nodeSelector);
  };
  const closeNodeSelectorModal = () => {
    toggleNodeSelector(false);
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={12} md={12}>
            <Navbar collapseOnSelect expand="lg" className="px-0 menu-wrapper">
              <Navbar.Brand as={Link} to="/" className="col-4 m-0">
                {props.isFrontPage ? (
                  <LogoWhite />
                ) : props.theme === 'light' ? (
                  <Logo />
                ) : (
                  <LogoWhite />
                )}
              </Navbar.Brand>
              <Nav.Item className="ml-auto d-lg-none align-self-lg-end">
                {connectWalletButton()}
              </Nav.Item>
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="ml-lg-auto flex header-click"
              >
                <span
                  className={clsx(
                    'material-icons-round',
                    props.isFrontPage ? 'text-white' : 'span-themed'
                  )}
                >
                  more_vert
                </span>
              </Navbar.Toggle>

              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav
                  activeKey={location.pathname}
                  className="align-items-lg-center w-100"
                >
                  <div className="col-lg-6 d-flex flex-lg-row flex-column justify-content-lg-center align-items-center">
                    <Nav.Link
                      className={clsx(
                        splitLocation[1] === 'swap' ||
                          splitLocation[1] === 'liquidity'
                          ? 'menu-item-active'
                          : 'menu-item',
                        'align-self-end align-self-lg-center d-flex align-items-center'
                      )}
                      as={Link}
                      to="/swap"
                      onClick={resetActiveTab}
                    >
                      <span
                        className={clsx(
                          props.isFrontPage ? 'text-white' : undefined
                        )}
                      >
                        Swap
                      </span>
                    </Nav.Link>
                    <Nav.Link
                        className={clsx(
                            splitLocation[1] === 'tokens'
                                ? 'menu-item-active'
                                : 'menu-item',
                            'align-self-end align-self-lg-center d-flex align-items-center'
                        )}
                        as={Link}
                        to="/tokens"
                        onClick={resetActiveTab}
                    >
                      <span
                          className={clsx(
                              props.isFrontPage ? 'text-white' : undefined
                          )}
                      >
                        Tokens
                      </span>
                    </Nav.Link>
                    <Nav.Link
                      className={clsx(
                        splitLocation[1] === 'farms'
                          ? 'menu-item-active'
                          : 'menu-item',
                        'align-self-end align-self-lg-center d-flex align-items-center'
                      )}
                      as={Link}
                      to="/farms"
                      onClick={resetActiveTab}
                    >
                      <span
                        className={clsx(
                          props.isFrontPage ? 'text-white' : undefined
                        )}
                      >
                        Farms
                      </span>
                    </Nav.Link>
                    <Nav.Link
                      className={clsx(
                        splitLocation[1] === 'stake'
                          ? 'menu-item-active'
                          : 'menu-item',
                        'align-self-end align-self-lg-center d-flex align-items-center'
                      )}
                      as={Link}
                      to="/stake"
                      onClick={resetActiveTab}
                    >
                      <span
                        className={clsx(
                          props.isFrontPage ? 'text-white' : undefined
                        )}
                      >
                        Stake
                      </span>
                    </Nav.Link>
                    <Nav.Link
                      className={clsx(
                        splitLocation[1] === 'pools'
                          ? 'menu-item-active'
                          : 'menu-item',
                        'align-self-end align-self-lg-center d-flex align-items-center'
                      )}
                      as={Link}
                      to="/pools"
                      onClick={resetActiveTab}
                    >
                      <span
                        className={clsx(
                          props.isFrontPage ? 'text-white' : undefined
                        )}
                      >
                        Pools
                      </span>
                    </Nav.Link>
                  </div>
                  <div className="col-lg-6 d-flex flex-column flex-lg-row align-items-end align-items-lg-center">
                    <Nav.Item className="ml-auto">
                      <a
                        className="flex header-click nav-menu-item-link px-lg-3 align-self-end align-self-lg-center"
                        onClick={props.toggleTheme}
                      >
                        {props.theme === 'light' ? (
                          <span
                            className={clsx(
                              'theme-icon',
                              'material-icons-round',
                              props.isFrontPage ? 'icon-white' : 'span-themed'
                            )}
                          >
                            dark_mode
                          </span>
                        ) : (
                          <span className="theme-icon span-themed material-icons-round">
                            light_mode
                          </span>
                        )}
                      </a>
                    </Nav.Item>

                    <Nav.Item className="d-none d-lg-block align-self-lg-end">
                      {connectWalletButton()}
                    </Nav.Item>
                    <Nav.Item>
                      <div className="d-flex flex-column d-lg-none col p-0">
                        <hr className="w-100" />
                        <a
                          href={
                            'https://plenty-defi.notion.site/Plenty-Docs-004ba25f40b641a3a276b84ebdc44971'
                          }
                          className="align-self-end align-self-lg-center nav-link"
                        >
                          <span
                            className={clsx(
                              props.isFrontPage ? 'text-white' : 'span-themed'
                            )}
                          >
                            Docs
                          </span>
                        </a>
                        <a
                          href={'https://plentydefi.medium.com/'}
                          className="align-self-end align-self-lg-center nav-link"
                        >
                          <span
                            className={clsx(
                              props.isFrontPage ? 'text-white' : 'span-themed'
                            )}
                          >
                            Blog
                          </span>
                        </a>
                        <a
                          href={'https://github.com/Plenty-DeFi'}
                          className="align-self-end align-self-lg-center nav-link"
                        >
                          <span
                            className={clsx(
                              props.isFrontPage ? 'text-white' : 'span-themed'
                            )}
                          >
                            GitHub
                          </span>
                        </a>
                        <a
                          onClick={toggleNodeSelectorHandler}
                          className="align-self-end align-self-lg-center nav-link"
                        >
                          <span
                            className={clsx(
                              props.isFrontPage ? 'text-white' : 'span-themed'
                            )}
                          >
                            Node Selector
                          </span>
                        </a>
                      </div>
                      <NavDropdown
                        className="d-none d-lg-block top"
                        title={
                          <span
                            className={clsx(
                              'flex header-click align-items-center material-icons-round',
                              props.isFrontPage ? 'text-white' : 'span-themed'
                            )}
                          >
                            more_vert
                          </span>
                        }
                        id="basic-nav-dropdown"
                      >
                        <ExternalMenu
                          toggleNodeSelectorHandler={toggleNodeSelectorHandler}
                        />
                      </NavDropdown>
                    </Nav.Item>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
      <NodeSelectorModal
        title={'Node Selector'}
        nodeSelector={nodeSelector}
        closeNodeSelectorModal={closeNodeSelectorModal}
        setLoaderMessage={setLoaderMessage}
      />
      <Loader loaderMessage={loaderMessage} />
    </>
  );
};

const mapStateToProps = (state) => ({
  rpcNode: state.settings.rpcNode,
});

const mapDispatchToProps = (dispatch) => ({
  setNode: (rpcNode) => dispatch(setNode(rpcNode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
