import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import StakePlenty from '../Components/xPlentyTabs/StakePlenty';
import UnstakePlenty from '../Components/xPlentyTabs/UnstakePlenty';
import XplentyBalance from '../Components/xPlentyTabs/xPlentyBalance';

const Stake = () => {
  return (
    <Container fluid>
      <Row>
        <Col
          sm={12}
          md={10}
          className="swap-content-section xplenty-content-section"
        >
          <div className="xplenty-content-wrapper">
            <div className="xplenty-info-wrapper">
              <h2 className="xplenty-heading">
                Maximize yield by staking PLENTY for xPLENTY
              </h2>
              <p className="xplenty-info">
                For every swap on Plenty, 0.09% of the swap fees are distributed
                as PLENTY tokens to the staking pool, which are distributed
                among the holders proportionally to the amount of their staked
                tokens and stake duration.
              </p>

              <p className="xplenty-info">
                When you stake PLENTY, you automatically receive xPLENTY in
                return. The xPLENTY token is a flash loan resistant token and
                will be used for governance. Furthermore, xPLENTY is
                continuously compounding staking rewards and trading fees. By
                unstaking, your xPLENTY tokens are burned and you receive all
                originally deposited PLENTY plus all rewards collected over
                time.
              </p>
            </div>
            <div className="bg-themed swap-content-container xplenty-content-container">
              <Tabs defaultActiveKey="stake" className="swap-container-tab">
                <Tab eventKey="stake" title="Stake Plenty">
                  <StakePlenty />
                </Tab>

                <Tab eventKey="unstake" title="Unstake">
                  <UnstakePlenty />
                </Tab>
              </Tabs>
              <div
                className="swap-token-select-box bg-themed-light swap-content-box-wrapper"
                style={{
                  borderRadius: '6px',
                  alignItems: 'flex-start',
                  minHeight: 0,
                }}
              >
                <XplentyBalance />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Stake;
