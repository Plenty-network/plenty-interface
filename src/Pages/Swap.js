import React from 'react';

import TransactionSettings from '../Components/TransactionSettings/TransactionSettings';
import SwapModal from '../Components/SwapModal/SwapModal';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import logo from '../assets/images/logo_small.png';
import kalam from '../assets/images/kalam.png';

import { useState } from 'react';

const Swap = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <Row>
        <Col sm={12} md={12}>
          <div className="swap-content-container">
            <Tabs defaultActiveKey="swap" className="swap-container-tab">
              <Tab eventKey="swap" title="Swap">
                <div className="swap-content-box">
                  <div className="swap-token-select-box">
                    <button className="token-selector" onClick={handleShow}>
                      <img src={logo} className="button-logo" />
                      Plenty
                    </button>
                  </div>
                </div>

                <div className="swap-content-box">
                  <div className="swap-token-select-box">
                    <button className="token-selector" onClick={handleShow}>
                      <img src={kalam} className="button-logo" />
                      Kalam
                    </button>
                  </div>
                </div>
              </Tab>
              <Tab
                eventKey="liquidity"
                title="Liquidity"
                className="swap-container-tab"
              >
                Liquidity
              </Tab>
              <Tab
                eventKey="auto"
                title="Auto LP"
                className="swap-container-tab"
              >
                Auto LP
              </Tab>
            </Tabs>

            <TransactionSettings />
          </div>
        </Col>
      </Row>
      <SwapModal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        animation={false}
      />
    </Container>
  );
};

export default Swap;
