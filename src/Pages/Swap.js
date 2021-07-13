import React, { useEffect } from 'react';

import TransactionSettings from '../Components/TransactionSettings/TransactionSettings';
import SwapModal from '../Components/SwapModal/SwapModal';
import SwapTab from '../Components/SwapTabsContent/SwapTab';
import LiquidityTab from '../Components/SwapTabsContent/LiquidityTab';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { useState } from 'react';

const Swap = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [firstToken, setFirstToken] = useState(0);

  return (
    <Container fluid>
      <Row>
        <Col sm={8} md={4} className="swap-content-section">
          <div className="swap-content-container">
            <Tabs defaultActiveKey="swap" className="swap-container-tab">
              <Tab eventKey="swap" title="Swap">
                <SwapTab
                  handleShow={handleShow}
                  walletAddress={props.walletAddress}
                  setFirstToken={setFirstToken}
                  firstToken={firstToken}
                  connecthWallet={props.connecthWallet}
                />
              </Tab>
              <Tab eventKey="liquidity" title="Liquidity">
                <LiquidityTab
                  walletAddress={props.walletAddress}
                  setFirstToken={setFirstToken}
                  firstToken={firstToken}
                  connecthWallet={props.connecthWallet}
                />
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
