import React from 'react';
import truncateMiddle from 'truncate-middle';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import clsx from "clsx";
import Dropdown from 'react-bootstrap/Dropdown';
import {ExternalMenu, NavigationMenu} from './Menu';
import logo from '../../assets/images/logo.png';
import {ReactComponent as Logo} from '../../assets/images/logo.svg';
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

const Header = (props) => {
    let connectWalletButton = () => {
        if (props.walletAddress) {
            return (
                <button
                    className="disconnect-wallet-btn"
                    onClick={props.disconnectWallet}
                >
                    {truncateMiddle(props.walletAddress, 4, 4, '...')}
                </button>
            );
        } else {
            return (
                <button className="connect-wallet-btn" onClick={props.connecthWallet}>
                    <span className="material-icons-round">add</span>
                    Connect Wallet
                </button>
            );
        }
    };

    const CustomToggle = React.forwardRef(({onClick}, ref) => (
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

    return (
        <Container fluid>
            <Row>
                <Col sm={12} md={12}>
                    <Navbar collapseOnSelect expand="lg" className="menu-wrapper">
                        <Navbar.Brand as={Link} to="/" className="col-4">
                            <Logo className={clsx(
                                props.isFrontPage ? "logo-frontPage" : "logo")}/>
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="ml-auto">
                            <span className={clsx(
                                "material-icons-round",
                                props.isFrontPage ? "text-white"
                                    : "span-themed"
                            )}>more_vert</span>
                        </Navbar.Toggle>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="align-items-lg-center w-100">
                                <div className="col-lg-6 d-flex flex-lg-row flex-column justify-content-lg-center align-items-center">
                                    <Nav.Link className="align-self-end align-self-lg-center" as={Link}
                                              to="swap">
                                        <span className={clsx(
                                            props.isFrontPage ? "text-white"
                                                : "span-themed"
                                        )}>Swap</span>
                                    </Nav.Link>
                                    <Nav.Link className="align-self-end align-self-lg-center" as={Link}
                                              to="farms">
                                        <span className={clsx(
                                            props.isFrontPage ? "text-white"
                                                : "span-themed"
                                        )}>Farms</span>
                                    </Nav.Link>
                                    <Nav.Link className="align-self-end align-self-lg-center" as={Link}
                                              to="pools">
                                        <span className={clsx(
                                            props.isFrontPage ? "text-white"
                                                : "span-themed"
                                        )}>Pools</span>
                                    </Nav.Link>
                                    <Nav.Link className="align-self-end align-self-lg-center" as={Link}
                                              to="ponds">
                                        <span className={clsx(
                                            props.isFrontPage ? "text-white"
                                                : "span-themed"
                                        )}>Ponds</span>
                                    </Nav.Link>
                                </div>
                                <div className="col-lg-6 d-flex flex-column flex-lg-row align-items-end align-items-lg-center">
                                    <Nav.Item className="ml-auto">
                                        <a
                                            className="nav-menu-item-link px-lg-3 align-self-end align-self-lg-center"
                                            onClick={props.toggleTheme}
                                        >
                                            {
                                                props.theme === 'light' ?
                                                    <span className={clsx(
                                                        "theme-icon", "material-icons-round",
                                                        props.isFrontPage ? "icon-white" : "span-themed"
                                                    )}>dark_mode</span>
                                                    : <span
                                                        className="theme-icon span-themed material-icons-round">light_mode</span>

                                            }
                                        </a>
                                    </Nav.Item>

                                    <Nav.Item className="ml-auto ml-lg-0 my-3 my-lg-0">
                                        {connectWalletButton()}
                                    </Nav.Item>

                                    <Nav.Item>

                                        <NavDropdown className="top" title={
                                            <span className={clsx(
                                                "material-icons-round",
                                                props.isFrontPage ? "text-white"
                                                    : "span-themed"
                                            )}>more_vert</span>
                                        } id="basic-nav-dropdown">
                                            <ExternalMenu/>
                                        </NavDropdown>
                                    </Nav.Item>
                                </div>
                            </Nav>
                        </Navbar.Collapse>

                    </Navbar>
                </Col>
            </Row>
        </Container>
    );
    // return (
    //     <Container fluid>
    //         <Row>
    //             <Col sm={12} md={12} className={clsx(
    //                 "header-col-center",
    //                 !props.isFrontPage && "border-bottom-themed")}>
    //                 <Navbar className="menu-wrapper">
    //                     <div>
    //                         <div className="logo-section">
    //                             <Link to={"/"}>
    //                                 <Navbar.Brand>
    //                                     <Logo className={clsx(
    //                                         props.isFrontPage ? "logo-frontPage" : "logo")}/>
    //                                 </Navbar.Brand>
    //                             </Link>
    //                         </div>
    //                     </div>
    //
    //                     <ul className="nav-menu-wrapper">
    //                         <NavigationMenu isFrontPage={props.isFrontPage}/>
    //                     </ul>
    //                     <ul className="nav-menu-wrapper">
    //                         <li className="nav-menu-item">
    //                             <a
    //                                 className="nav-menu-item-link"
    //                                 onClick={props.toggleTheme}
    //                             >
    //                                 {
    //                                     props.theme === 'light' ?
    //                                         <span className={clsx(
    //                                             "theme-icon", "material-icons-round",
    //                                             props.isFrontPage ? "icon-white" : "span-themed"
    //                                             )}>dark_mode</span>
    //                                         : <span className="theme-icon span-themed material-icons-round">light_mode</span>
    //
    //                                 }
    //                             </a>
    //                         </li>
    //
    //                         <li className="nav-menu-item">{connectWalletButton()}</li>
    //                         <li className="nav-menu-item">
    //                             <Dropdown>
    //                                 <Dropdown.Toggle
    //                                     as={CustomToggle}
    //                                     id="dropdown-basic"
    //                                 ></Dropdown.Toggle>
    //                                 <Dropdown.Menu className="menu-dropdown">
    //                                     <ExternalMenu/>
    //                                 </Dropdown.Menu>
    //                             </Dropdown>
    //                         </li>
    //                     </ul>
    //                 </Navbar>
    //             </Col>
    //         </Row>
    //     </Container>
    // );
};

export default Header;
