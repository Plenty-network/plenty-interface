import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Loader from '../Components/loader';

import StakePlenty from '../Components/xPlentyTabs/StakePlenty';
import UnstakePlenty from '../Components/xPlentyTabs/UnstakePlenty';
import XplentyBalance from '../Components/xPlentyTabs/xPlentyBalance';

import { connect } from 'react-redux';
import {
  xPlentyComputationsThunk,
  getExpectedxPlentyThunk,
  buyXPlentyThunk,
  getExpectedPlentyThunk,
  sellXPlentyThunk,
} from '../redux/slices/xPlenty/xPlenty.thunk';
import * as userActions from '../redux/actions/user/user.action';

const Stake = (props) => {
  useEffect(() => {
    props.getxPlentyData();
    props.fetchUserBalances(props.walletAddress);
  }, []);
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

              <p className="xplenty-info">
                Value Locked : {props.xPlentyData.data.ValueLockedToShow} |
                xPlenty Supply : {props.xPlentyData.data.xPlentySupplyToShow} |
                Plenty Staked : {props.xPlentyData.data.plentyStakedToShow}
              </p>
            </div>
            <div className="bg-themed swap-content-container xplenty-content-container">
              <Tabs defaultActiveKey="stake" className="swap-container-tab">
                <Tab eventKey="stake" title="Stake Plenty">
                  <StakePlenty
                    xPlentyData={props.xPlentyData}
                    setExpectedxPlenty={props.setExpectedxPlenty}
                    buyxPlenty={props.buyxPlenty}
                    expectedxPlenty={props.expectedxPlenty}
                    walletAddress={props.walletAddress}
                  />
                </Tab>

                <Tab eventKey="unstake" title="Unstake">
                  <UnstakePlenty
                    xPlentyData={props.xPlentyData}
                    setExpectedPlenty={props.setExpectedPlenty}
                    sellXPlenty={props.sellXPlenty}
                    expectedPlenty={props.expectedPlenty}
                    walletAddress={props.walletAddress}
                  />
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

const mapStateToProps = (state) => {
  return {
    xPlentyData: state.xPlenty.xPlentyData,
    expectedxPlenty: state.xPlenty.expectedxPlenty,
    expectedPlenty: state.xPlenty.expectedPlenty,
    userAddress: state.wallet.address,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getxPlentyData: () => dispatch(xPlentyComputationsThunk()),
    setExpectedxPlenty: (plentyBalance, totalSupply, plentyAmount) =>
      dispatch(
        getExpectedxPlentyThunk(plentyBalance, totalSupply, plentyAmount)
      ),
    buyxPlenty: (plentyBalance, totalSupply, plentyAmount) =>
      dispatch(buyXPlentyThunk(plentyBalance, totalSupply, plentyAmount)),
    setExpectedPlenty: (plentyBalance, totalSupply, xplentyAmount) =>
      dispatch(
        getExpectedPlentyThunk(plentyBalance, totalSupply, xplentyAmount)
      ),
    sellXPlenty: (xPlentyAmount, minimumExpected, recipient) =>
      dispatch(sellXPlentyThunk(xPlentyAmount, minimumExpected, recipient)),
    fetchUserBalances: (address) =>
      dispatch(userActions.fetchUserBalances(address)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
