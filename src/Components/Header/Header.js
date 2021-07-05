import React from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';

import logo from '../../assets/images/logo.png';

const Header = (props) => {
  const menus = {
    navigation: ['swap', 'farms', 'pools', 'ponds'],
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
        <Col sm={12} md={11} className="header-col-center">
          <Navbar className="menu-wrapper">
            <div>
              <Navbar.Brand href="/" className="logo-section">
                <Image src={logo} fluid />
              </Navbar.Brand>
            </div>
            <ul className="nav-menu-wrapper">
              {menus.navigation.map((menu, index) => {
                return (
                  <li className="nav-menu-item" key={index}>
                    <Link to={`/${menu}`} className="nav-menu-item-link">
                      {menu}
                    </Link>
                  </li>
                );
              })}
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
              <li className="nav-menu-item">
                <button className="connect-wallet-btn">
                  <span className="material-icons-outlined">add</span> Connect
                  Wallet
                </button>
              </li>
              <li className="nav-menu-item">
                <Dropdown>
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-basic"
                  ></Dropdown.Toggle>

                  <Dropdown.Menu className="menu-dropdown">
                    <Dropdown.Item
                      href="https://www.notion.so/Plenty-Docs-082b61c1859e4c4f86d01c3daa0db9ed"
                      target="_blank"
                    >
                      Docs
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="https://medium.com/plenty-defi"
                      target="_blank"
                    >
                      Blog
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="https://github.com/Plenty-DeFi"
                      target="_blank"
                    >
                      Github
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="https://www.notion.so/Roadmap-3d24ab4912c04d48859c332059c665ca"
                      target="_blank"
                    >
                      Roadmap
                    </Dropdown.Item>
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
