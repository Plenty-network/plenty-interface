import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import truncateMiddle from 'truncate-middle';
import { Col, Container, Nav, Navbar, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import clsx from 'clsx';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as BannerArrow } from '../../assets/images/banner-arrow.svg';
import { ReactComponent as LogoWhite } from '../../assets/images/logo-white.svg';
import { Link, useLocation } from 'react-router-dom';
import { RPC_NODE } from '../../constants/localStorage';
import { setNode } from '../../redux/slices/settings/settings.slice';
import { connect } from 'react-redux';
import Button from '../Ui/Buttons/Button';
import HeaderBottom from './HeaderBottom';
import useMediaQuery from '../../hooks/mediaQuery';
import { HEADER_MODAL } from '../../constants/header';
import '../../assets/scss/animation.scss';

const Header = (props) => {
  const loader = useSelector((state) => state.settings.loader);

  const isMobile = useMediaQuery('(max-width: 991px)');
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split('/');
  const [selectedHeader, setSelectedHeader] = useState('');
  const [isExpanded, toggleExpand] = useState(false);
  const [open, setOpen] = useState(false);
  const [isBannerOpen, setBannerOpen] = useState(true);

  useEffect(() => {
    const RPCNodeInLS = localStorage.getItem(RPC_NODE);
    if (RPCNodeInLS) {
      props.setNode(RPCNodeInLS);
    }
  }, []);

  useEffect(() => {
    toggleExpand(false);
    document.getElementById('responsive-navbar-nav').classList.remove('show');
    if (open) {
      document.getElementById('toggler').click();
    }
    setHeader('');
  }, [splitLocation[1]]);

  const closeBanner = () => {
    setBannerOpen(false);
  };

  const connectWalletButton = () => {
    if (props.walletAddress) {
      return (
        <Button onClick={props.disconnectWallet} className="button-bg w-100">
          <div className="flex flex-row mx-2">
            <span>{truncateMiddle(props.walletAddress, 4, 4, '...')}</span>
            {loader && <span className="loader-button ml-2"></span>}
          </div>
        </Button>
      );
    } else {
      return (
        <Button
          onClick={props.connectWallet}
          className={clsx('px-md-3', 'w-100', 'connect-wallet-btn', 'button-bg')}
        >
          <div className={clsx('connect-wallet-btn')}>
            <div className="flex flex-row align-items-center">
              <span className={clsx('mr-1', 'material-icons-round')}>add</span>
              <span>Connect wallet</span>
            </div>
          </div>
        </Button>
      );
    }
  };

  const setHeader = (value) => {
    if (!isMobile) {
      if (value === HEADER_MODAL.SETTINGS && selectedHeader === HEADER_MODAL.SETTINGS) {
        setSelectedHeader('');
      } else {
        setSelectedHeader(value);
      }
    }
  };
  const setHeaderMobile = (value) => {
    if (value !== selectedHeader) {
      toggleExpand(true);
    } else {
      toggleExpand(!isExpanded);
    }
    setSelectedHeader(value);
  };

  return (
    <>
      <Container
        className={clsx(
          'header',
          (splitLocation[1] === 'wrappedAssets' || splitLocation[1] === 'WrappedAssets') &&
            'header-wrappedAssets',
        )}
        fluid
      >
        {isBannerOpen && (
          <div className="banner" onMouseEnter={() => setHeader('')}>
            <div className="banner-middle">
              <span className="banner-text">
                {isMobile ? 'Check out the new plenty.network' : 'Check out the new plenty.network'}
              </span>
              <a
                className="bottom-last text-decoration-none"
                href={'https://plenty.network/'}
                target="_blank"
                rel="noreferrer"
              >
                <span className="bottom-last" style={{ cursor: 'pointer' }}>
                  Explore
                </span>
                <BannerArrow className="ml-2" />
              </a>
            </div>
            <div className="banner-right">
              <span
                className="closebanner"
                onClick={() => closeBanner()}
                style={{ cursor: 'pointer' }}
              >
                <span className={clsx('material-icons-round', 'banner-close')}>close</span>
              </span>
            </div>
          </div>
        )}

        <Row className="removing-margin">
          <Col className={clsx('innerHeader')} sm={12} md={12}>
            <Navbar
              id="nav-bar"
              expand="lg"
              className="px-0 menu-wrapper"
              {...(selectedHeader === HEADER_MODAL.SETTINGS
                ? {}
                : { onMouseEnter: () => setHeader('') })}
            >
              {/* {!isMobile && <span className='bridge-new-tag' style={{position: 'absolute', marginLeft: '0px', left: '30%', bottom: '60%'}}>New</span>} */}
              <Navbar.Brand as={Link} to="/" className="mx-3 mx-sm-0">
                {props.isGradientBgPage ? (
                  <LogoWhite />
                ) : props.theme === 'light' ? (
                  <Logo />
                ) : (
                  <LogoWhite />
                )}
              </Navbar.Brand>
              <div className="seperator"></div>

              <Navbar.Toggle
                className="ml-lg-auto flex header-click"
                onClick={() => setOpen(!open)}
                id="toggler"
                aria-controls="responsive-navbar-nav"
              >
                {open ? (
                  <span
                    className={clsx(
                      'material-icons-round',
                      props.isGradientBgPage ? 'text-white' : 'span-themed',
                    )}
                  >
                    close
                  </span>
                ) : (
                  <span
                    className={clsx(
                      'material-icons-round',
                      props.isGradientBgPage ? 'text-white' : 'span-themed',
                    )}
                  >
                    menu
                  </span>
                )}
              </Navbar.Toggle>

              <Navbar.Collapse
                id="responsive-navbar-nav"
                {...(selectedHeader === HEADER_MODAL.SETTINGS
                  ? {}
                  : { onMouseEnter: () => setHeader('') })}
              >
                <Nav
                  className={clsx('align-items-lg-center w-100 mobileview ')}
                  {...(selectedHeader === HEADER_MODAL.SETTINGS
                    ? {}
                    : { onMouseEnter: () => setHeader('') })}
                >
                  <div
                    className={clsx(
                      'col-lg-6 d-lg-flex flex-lg-row flex-column align-items-center links ',
                    )}
                  >
                    <Nav.Link
                      className={clsx(
                        selectedHeader === HEADER_MODAL.TRADE ? 'menu-item-active' : 'menu-item',
                        (splitLocation[1] === 'swap' ||
                          splitLocation[1] === 'Stableswap' ||
                          splitLocation[1] === 'tokens') &&
                          'selected-menu-item-active',
                        'align-self-start align-self-lg-center d-lg-flex align-items-center',
                      )}
                      {...(isMobile ? { as: Link, to: '/swap' } : { as: Link, to: '/swap' })}
                      onMouseEnter={() => setHeader(HEADER_MODAL.TRADE)}
                      onClick={() => setHeaderMobile(HEADER_MODAL.TRADE)}
                    >
                      <span className={clsx(props.isGradientBgPage ? 'text-white' : undefined)}>
                        Trade
                      </span>
                      {/* <span
                        className={clsx('material-icons', 'arrow-header', {
                          rotate:
                            selectedHeader === HEADER_MODAL.TRADE && (isMobile ? isExpanded : true),
                        })}
                      >
                        expand_more
                      </span> */}
                    </Nav.Link>
                    {/* {selectedHeader === HEADER_MODAL.TRADE && isMobile && (
                      <HeaderBottom
                        selectedHeader={selectedHeader}
                        isExpanded={isExpanded}
                        {...props}
                      />
                    )} */}
                    <Nav.Link
                      className={clsx(
                        selectedHeader === HEADER_MODAL.EARN ? 'menu-item-active' : 'menu-item',
                        (splitLocation[1] === 'farms' ||
                          splitLocation[1] === 'stake' ||
                          splitLocation[1] === 'liquidity' ||
                          splitLocation[1] === 'liquidityPositions') &&
                          'selected-menu-item-active',
                        'align-self-end align-self-lg-center d-lg-flex align-items-center',
                      )}
                      {...(isMobile ? {} : { as: Link, to: '/liquidity' })}
                      onMouseEnter={() => setHeader(HEADER_MODAL.EARN)}
                      onClick={() => setHeaderMobile(HEADER_MODAL.EARN)}
                    >
                      <span className={clsx(props.isGradientBgPage ? 'text-white' : undefined)}>
                        Earn
                      </span>
                      <span
                        className={clsx('material-icons', 'arrow-header', {
                          rotate:
                            selectedHeader === HEADER_MODAL.EARN && (isMobile ? isExpanded : true),
                        })}
                      >
                        expand_more
                      </span>
                    </Nav.Link>
                    {selectedHeader === HEADER_MODAL.EARN && isMobile && (
                      <HeaderBottom
                        selectedHeader={selectedHeader}
                        isExpanded={isExpanded}
                        {...props}
                      />
                    )}
                    <Nav.Link
                      className={clsx(
                        selectedHeader === HEADER_MODAL.BRIDGE ? 'menu-item-active' : 'menu-item',
                        splitLocation[1] === 'bridge' && 'selected-menu-item-active',
                        'align-self-end align-self-lg-center d-lg-flex align-items-center',
                      )}
                      onMouseEnter={() => setHeader(HEADER_MODAL.BRIDGE)}
                      onClick={() => setHeaderMobile(HEADER_MODAL.BRIDGE)}
                      style={{ position: 'relative' }}
                    >
                      <span className={clsx(props.isGradientBgPage ? 'text-white' : undefined)}>
                        Bridge
                      </span>
                      {isMobile && <span className="bridge-new-tag">New</span>}
                      <span
                        className={clsx('material-icons', 'arrow-header', {
                          rotate:
                            selectedHeader === HEADER_MODAL.BRIDGE &&
                            (isMobile ? isExpanded : true),
                        })}
                      >
                        expand_more
                      </span>
                      {!isMobile && (
                        <span
                          className="bridge-new-tag"
                          style={{ position: 'absolute', right: '-4%', bottom: '75%' }}
                        >
                          New
                        </span>
                      )}
                    </Nav.Link>

                    {selectedHeader === HEADER_MODAL.BRIDGE && isMobile && (
                      <HeaderBottom
                        selectedHeader={selectedHeader}
                        isExpanded={isExpanded}
                        {...props}
                      />
                    )}

                    <Nav.Link
                      className={clsx(
                        selectedHeader === HEADER_MODAL.VOTE ? 'menu-item-active' : 'menu-item',
                        splitLocation[1] === 'vote' && 'selected-menu-item-active',
                        'align-self-end align-self-lg-center d-lg-flex align-items-center',
                      )}
                      {...(isMobile ? {} : { as: Link, to: '/vote' })}
                      onMouseEnter={() => setHeader(HEADER_MODAL.VOTE)}
                      onClick={() => setHeaderMobile(HEADER_MODAL.VOTE)}
                    >
                      <span className={clsx(props.isGradientBgPage ? 'text-white' : undefined)}>
                        Vote
                      </span>
                      <span
                        className={clsx('material-icons', 'arrow-header', {
                          rotate:
                            selectedHeader === HEADER_MODAL.VOTE && (isMobile ? isExpanded : true),
                        })}
                      >
                        expand_more
                      </span>
                    </Nav.Link>
                    {selectedHeader === HEADER_MODAL.VOTE && isMobile && (
                      <HeaderBottom
                        selectedHeader={selectedHeader}
                        isExpanded={isExpanded}
                        {...props}
                      />
                    )}
                    <Nav.Link
                      className={clsx(
                        selectedHeader === HEADER_MODAL.MORE ? 'menu-item-active' : 'menu-item',

                        'align-self-end align-self-lg-center d-lg-flex align-items-center',
                      )}
                      onMouseOver={() => setHeader(HEADER_MODAL.MORE)}
                      onClick={() => setHeaderMobile(HEADER_MODAL.MORE)}
                    >
                      <span className={clsx(props.isGradientBgPage ? 'text-white' : undefined)}>
                        More
                      </span>
                      <span
                        className={clsx('material-icons', 'arrow-header', {
                          rotate:
                            selectedHeader === HEADER_MODAL.MORE && (isMobile ? isExpanded : true),
                        })}
                      >
                        expand_more
                      </span>
                    </Nav.Link>
                    {selectedHeader === HEADER_MODAL.MORE && isMobile && (
                      <HeaderBottom
                        selectedHeader={selectedHeader}
                        isExpanded={isExpanded}
                        {...props}
                      />
                    )}
                    {isMobile && (
                      <Nav.Link
                        className={clsx(
                          selectedHeader === HEADER_MODAL.SETTINGS
                            ? 'menu-item-active'
                            : 'menu-item',

                          'align-self-end align-self-lg-center d-lg-flex align-items-center',
                          'd-lg-none',
                        )}
                        onClick={() => setHeaderMobile(HEADER_MODAL.SETTINGS)}
                      >
                        <span className={clsx(props.isGradientBgPage ? 'text-white' : undefined)}>
                          Settings
                        </span>
                        <span className={clsx('material-icons', 'arrow-header', 'align-self-end')}>
                          settings
                        </span>
                      </Nav.Link>
                    )}
                    {selectedHeader === HEADER_MODAL.SETTINGS && isMobile && (
                      <HeaderBottom
                        selectedHeader={selectedHeader}
                        isExpanded={isExpanded}
                        {...props}
                      />
                    )}
                  </div>

                  <Nav.Item
                    className={clsx(
                      'mx-3',
                      'connectwallet d-block d-lg-none align-self-center align-self-lg-end',
                    )}
                  >
                    {connectWalletButton()}
                  </Nav.Item>
                  <div className="col-lg-6 d-lg-flex flex-column flex-lg-row align-items-end align-items-lg-center last">
                    <Nav.Item className="ml-auto d-none d-md-block align-self-lg-end">
                      {
                        <OverlayTrigger
                          overlay={(props) => (
                            <Tooltip className="connect-wallet-tooltip" {...props}>
                              Connect wallet
                            </Tooltip>
                          )}
                          placement="left"
                          show={props.connectWalletTooltip}
                        >
                          {connectWalletButton()}
                        </OverlayTrigger>
                      }
                    </Nav.Item>
                    <div className="seperator seperatorSettings"></div>
                    <Nav.Item>
                      <span
                        className={clsx(
                          'ml-3',
                          'flex header-click align-items-center material-icons',
                          props.isGradientBgPage ? 'text-white' : 'span-themed',
                          'settings-icon',
                        )}
                        onClick={() => setHeader(HEADER_MODAL.SETTINGS)}
                      >
                        settings
                      </span>
                    </Nav.Item>
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
      {!isMobile && selectedHeader !== HEADER_MODAL.TRADE && (
        <div onMouseLeave={() => setHeader('')}>
          <HeaderBottom
            selectedHeader={selectedHeader}
            isExpanded={isExpanded}
            page={splitLocation[1]}
            isBannerOpen={isBannerOpen}
            {...props}
          />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  rpcNode: state.settings.rpcNode,
  loader: state.settings.loader,
  firstTokenAmount: state.settings.firstTokenAmount,
  secondTokenAmount: state.settings.secondTokenAmount,
  tokenIn: state.settings.tokenIn,
  tokenOut: state.settings.tokenOut,
  opertaionId: state.settings.opertaionId,
  connectWalletTooltip: state.settings.connectWalletTooltip,
});

const mapDispatchToProps = (dispatch) => ({
  setNode: (rpcNode) => dispatch(setNode(rpcNode)),
});

Header.propTypes = {
  connectWallet: PropTypes.func,
  disconnectWallet: PropTypes.func,
  isGradientBgPage: PropTypes.bool,
  setNode: PropTypes.func,
  theme: PropTypes.string,
  toggleTheme: PropTypes.func,
  walletAddress: PropTypes.oneOf(),
  connectWalletTooltip: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
