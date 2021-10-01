import React, { useEffect, useState } from 'react';
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
  closetransactionInjectionModalThunk,
  closeToastThunk,
} from '../redux/slices/xPlenty/xPlenty.thunk';
import * as userActions from '../redux/actions/user/user.action';

import InfoModal from '../Components/Ui/Modals/InfoModal';

const Stake = (props) => {
  useEffect(() => {
    props.getxPlentyData();
    props.fetchUserBalances(props.walletAddress);
  }, []);

  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});

  useEffect(() => {
    if (props.isToastOpen) {
      setLoaderMessage({
        type:
          props.toastMessage === 'Transaction Successfull'
            ? 'success'
            : 'error',
        message: props.toastMessage,
      });
      setTimeout(() => {
        props.closeToast();
        setLoaderMessage({});
      }, 5000);
    }
  }, [props.isToastOpen]);
  return (
    <>
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
                  For every swap on Plenty, 0.09% of the swap fees are
                  distributed as PLENTY tokens to the staking pool, which are
                  distributed among the holders proportionally to the amount of
                  their staked tokens and stake duration.
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

                <ul className="xplenty-number-info">
                  <li>
                    <p>Value Locked</p>
                    <p className="xplenty-numbers">
                      {props.xPlentyData.data.ValueLockedToShow
                        ? props.xPlentyData.data.ValueLockedToShow.toFixed(2)
                        : null}
                    </p>
                  </li>
                  <li>
                    <p>xPlenty Supply</p>
                    <p className="xplenty-numbers">
                      {props.xPlentyData.data.xPlentySupplyToShow
                        ? props.xPlentyData.data.xPlentySupplyToShow.toFixed(2)
                        : null}
                    </p>
                  </li>
                  <li>
                    <p>Plenty Staked</p>
                    <p className="xplenty-numbers">
                      {props.xPlentyData.data.plentyStakedToShow
                        ? props.xPlentyData.data.plentyStakedToShow.toFixed(2)
                        : null}
                    </p>
                  </li>
                </ul>
              </div>
              <div>
                <div className="swap-token-select-box-wrapper">
                  <div
                    className="swap-token-select-box bg-themed-light swap-content-box-wrapper"
                    style={{
                      minHeight: 0,
                      borderRadius: '6px',
                      padding: '22px',
                      marginTop: 0,
                    }}
                  >
                    <div className="token-selector-balance-wrapper">
                      <p className="xplenty-staking-apr">
                        Rewards distribution start:
                      </p>
                    </div>
                    <div className="token-user-input-wrapper">
                      <p className="xplenty-staking-apr">
                        {/* {props.xPlentyData.data.APR
                      ? props.xPlentyData.data.APR.toFixed(3)
                      : 0}
                    {'%'} */}
                        October 4
                      </p>
                    </div>
                  </div>
                </div>

                <div className="xplenty-content-container-wrapper">
                  <div className="bg-themed swap-content-container xplenty-content-container">
                    <Tabs
                      defaultActiveKey="stake"
                      className="swap-container-tab"
                    >
                      <Tab eventKey="stake" title="Stake Plenty">
                        <StakePlenty
                          xPlentyData={props.xPlentyData}
                          setExpectedxPlenty={props.setExpectedxPlenty}
                          buyxPlenty={props.buyxPlenty}
                          expectedxPlenty={props.expectedxPlenty}
                          walletAddress={props.walletAddress}
                          plentyBalance={props.walletBalances.PLENTY}
                          setLoaderMessage={setLoaderMessage}
                        />
                      </Tab>

                      <Tab eventKey="unstake" title="Unstake">
                        <UnstakePlenty
                          xPlentyData={props.xPlentyData}
                          setExpectedPlenty={props.setExpectedPlenty}
                          sellXPlenty={props.sellXPlenty}
                          expectedPlenty={props.expectedPlenty}
                          walletAddress={props.walletAddress}
                          xplentyBalance={props.walletBalances.xPLENTY}
                        />
                      </Tab>
                    </Tabs>
                  </div>
                  <div className="xplenty-content-container-shadow"></div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Loader loading={props.isProcessing} loaderMessage={loaderMessage} />
      <InfoModal
        open={props.isTransactionInjectionModalOpen}
        onClose={props.closetransactionInjectionModal}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
      />
      <Loader loading={false} loaderMessage={loaderMessage} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    xPlentyData: state.xPlenty.xPlentyData,
    expectedxPlenty: state.xPlenty.expectedxPlenty,
    expectedPlenty: state.xPlenty.expectedPlenty,
    userAddress: state.wallet.address,
    walletBalances: state.user.balances,
    isProcessing:
      state.xPlenty.xPlentyBuyingOperation.processing ||
      state.xPlenty.xPlentySellingOperation.processing,
    isTransactionInjectionModalOpen:
      state.xPlenty.isTransactionInjectionModalOpen,
    isToastOpen: state.xPlenty.isToastOpen,
    toastMessage: state.xPlenty.toastMessage,
    isInfoType: state.xPlenty.isInfoType,
    //toastMessage
    //isInfoType
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
    closetransactionInjectionModal: () =>
      dispatch(closetransactionInjectionModalThunk()),
    closeToast: () => dispatch(closeToastThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
