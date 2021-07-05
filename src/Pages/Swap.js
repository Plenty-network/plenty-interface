import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import logo from '../assets/images/logo_small.png';
import kalam from '../assets/images/kalam.png';

const Swap = () => {
  return (
    <Container fluid>
      <Row>
        <Col sm={12} md={12}>
          <div className="swap-content-container">
            <Tabs defaultActiveKey="swap" className="swap-container-tab">
              <Tab eventKey="swap" title="Swap">
                <div className="swap-content-box">
                  <div className="swap-token-select-box">
                    <button className="token-selector">
                      <img src={logo} className="button-logo" />
                      Plenty
                    </button>
                  </div>
                </div>

                <div className="swap-content-box">
                  <div className="swap-token-select-box">
                    <button className="token-selector">
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
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Swap;
