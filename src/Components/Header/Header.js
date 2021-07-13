import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import truncateMiddle from 'truncate-middle';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';

import { ExternalMenu, NavigationMenu } from './Menu';

import logo from '../../assets/images/logo.png';

//Redux Actions
import {
  connectWallet,
  disconnectWallet,
  getWalletAddress,
} from '../../redux/actions/wallet/wallet.action';

const Header = (props) => {
  const dispatch = useDispatch();
  const WalletFromStore = useSelector((state) => state.wallet);

  const fetchWallet = async () => {
    if (WalletFromStore === null) {
      await dispatch(connectWallet());
    }
  };

  let connectWalletButton = () => {
    if (WalletFromStore === null) {
      return (
        <button
          className="connect-wallet-btn"
          onClick={() => {
            fetchWallet();
          }}
        >
          <span className="material-icons-outlined">add</span>
          Connect Wallet
        </button>
      );
    }

    return (
      <button
        className="disconnect-wallet-btn"
        onClick={() => dispatch(disconnectWallet())}
      >
        {truncateMiddle(WalletFromStore, 4, 4, '...')}
      </button>
    );
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
      <span className="material-icons-outlined">more_vert</span>
    </a>
  ));
  return (
    <Container fluid>
      <Row>
        <Col sm={12} md={12} className="header-col-center">
          <Navbar className="menu-wrapper">
            <div>
              <div className="logo-section">
                <Navbar.Brand href="/">
                  <Image src={logo} fluid />
                </Navbar.Brand>
              </div>
            </div>

            <ul className="nav-menu-wrapper">
              <NavigationMenu />
            </ul>
            <ul className="nav-menu-wrapper">
              <li className="nav-menu-item">
                <a
                  href="#"
                  className="nav-menu-item-link"
                  onClick={(e) => {
                    e.preventDefault();
                    props.toggleTheme();
                  }}
                >
                  <span className="material-icons-outlined">light_mode</span>
                </a>
              </li>

              <li className="nav-menu-item">{connectWalletButton()}</li>
              <li className="nav-menu-item">
                <Dropdown>
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-basic"
                  ></Dropdown.Toggle>

                  <Dropdown.Menu className="menu-dropdown">
                    <ExternalMenu />
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </Navbar>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
