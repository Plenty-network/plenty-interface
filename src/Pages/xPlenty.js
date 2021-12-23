import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Loader from '../Components/loader';
import NumericLabel from 'react-pretty-numbers';
import { currencyOptions, currencyOptionsWithSymbol } from '../constants/global';
import xplenty from '../assets/images/x-plenty-medium.svg';
import StakePlenty from '../Components/xPlentyTabs/StakePlenty';
import UnstakePlenty from '../Components/xPlentyTabs/UnstakePlenty';

import { connect } from 'react-redux';
import {
  buyXPlentyThunk,
  closeToastThunk,
  closetransactionInjectionModalThunk,
  getExpectedPlentyThunk,
  getExpectedxPlentyThunk,
  sellXPlentyThunk,
  xPlentyComputationsThunk,
} from '../redux/slices/xPlenty/xPlenty.thunk';
import * as userActions from '../redux/actions/user/user.action';

import * as walletActions from '../redux/actions/wallet/wallet.action';

import InfoModal from '../Components/Ui/Modals/InfoModal';
import Label from '../Components/Ui/Label/Label';
import Image from 'react-bootstrap/Image';

const Stake = (props) => {
  useEffect(() => {
    props.getxPlentyData();
    props.fetchUserBalances(props.walletAddress);
  }, [props.walletAddress]);

  const [loaderMessage, setLoaderMessage] = useState({});

  useEffect(() => {
    if (props.isToastOpen) {
      setLoaderMessage({
        type: props.toastMessage === 'Transaction Successfull' ? 'success' : 'error',
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
          <Col sm={12} xl={12} className="swap-content-section xplenty-content-section">
            <div className="xplenty-content-wrapper xplenty-container row justify-content-center">
              <div className="xplenty-info-wrapper col-12 col-lg-5 col-xl-4">
                <h2 className="xplenty-heading">Maximize yield by staking PLENTY for xPLENTY</h2>
                <p className="xplenty-info">
                  When you stake PLENTY, you automatically receive xPLENTY in return. The xPLENTY
                  token is a flash loan resistant token and will be used for governance of the
                  Plenty protocol. Furthermore, xPLENTY continuously compounds staking rewards and
                  trading fees. By unstaking, your xPLENTY tokens are burned and you receive all of
                  your originally deposited PLENTY tokens plus the rewards collected from staking
                  and trading fees.
                </p>

                <p className="xplenty-info">
                  For every swap on Plenty, 0.09% of the total value of the swap is distributed as
                  PLENTY tokens to the xPLENTY staking pool. Such PLENTY tokens are proportionally
                  distributed to the xPLENTY holders according to the amount of their staked tokens
                  and stake duration.
                </p>

                {/*<ul className="xplenty-number-info">*/}
                {/*  <li>*/}
                {/*    <p>Value Locked</p>*/}
                {/*    <p className="xplenty-numbers">*/}
                {/*      {props.xPlentyData.data.ValueLockedToShow*/}
                {/*        ?*/}
                {/*          <NumericLabel params={currencyOptionsWithSymbol}>*/}
                {/*            {parseInt(props.xPlentyData.data.ValueLockedToShow)}*/}
                {/*          </NumericLabel>*/}
                {/*        : null}*/}
                {/*    </p>*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    <p>xPlenty Supply</p>*/}
                {/*    <p className="xplenty-numbers">*/}
                {/*      {props.xPlentyData.data.xPlentySupplyToShow*/}
                {/*        ?*/}
                {/*          <NumericLabel params={currencyOptions}>*/}
                {/*            {parseInt(props.xPlentyData.data.xPlentySupplyToShow)}*/}
                {/*          </NumericLabel>*/}
                {/*        : null}*/}
                {/*    </p>*/}
                {/*  </li>*/}
                {/*  <li>*/}
                {/*    <p>Plenty Staked</p>*/}
                {/*    <p className="xplenty-numbers">*/}
                {/*      {props.xPlentyData.data.plentyStakedToShow*/}
                {/*        ?*/}
                {/*          <NumericLabel params={currencyOptions}>*/}
                {/*            {parseInt(props.xPlentyData.data.plentyStakedToShow)}*/}
                {/*          </NumericLabel>*/}
                {/*        : null}*/}
                {/*    </p>*/}
                {/*  </li>*/}
                {/*</ul>*/}
              </div>
              <div className="col-12 col-lg-5 col-xl-4">
                <div className="swap-token-select-box-wrapper">
                  <div
                    className="swap-token-select-box bg-themed swap-content-box-wrapper"
                    style={{
                      minHeight: 0,
                      padding: '22px',
                      marginTop: 0,
                    }}
                  >
                    <div>
                      <p className="xplenty-staking-apr">Staking APR:</p>
                    </div>
                    <div>
                      <p className="xplenty-staking-apr">
                        {props.xPlentyData.data.APR ? props.xPlentyData.data.APR.toFixed(2) : 0}
                        {'%'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="xplenty-content-container-wrapper">
                  <div className="bg-themed position-relative xplenty-content xplenty-content-container">
                    <Tabs defaultActiveKey="stake" className="swap-container-tab">
                      <Tab eventKey="stake" title="Stake PLENTY">
                        <StakePlenty
                          xPlentyData={props.xPlentyData}
                          setExpectedxPlenty={props.setExpectedxPlenty}
                          buyxPlenty={props.buyxPlenty}
                          expectedxPlenty={props.expectedxPlenty}
                          walletAddress={props.walletAddress}
                          plentyBalance={props.walletBalances.PLENTY}
                          setLoaderMessage={setLoaderMessage}
                          connectWallet={props.connectWallet}
                          isProcessing={props.isProcessing}
                          isToastOpen={props.isToastOpen}
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
                          connectWallet={props.connectWallet}
                          isProcessing={props.isProcessing}
                          isToastOpen={props.isToastOpen}
                        />
                      </Tab>
                    </Tabs>
                  </div>
                </div>
                <div className="xplenty-content-container-shadow"></div>
              </div>
              <div className="col-12 col-lg-2 col-xl-2">
                <div className="xplenty-content-container-wrapper">
                  <div className="bg-themed xplenty-content">
                    <div className="flex flex-column">
                      <div className="stats-item stats-item-border">
                        <div className="flex flex-column">
                          <div className="mx-auto mb-2">
                            <Image src={xplenty} />
                          </div>
                          <p className="mx-auto mb-3">Stats</p>
                        </div>
                      </div>
                      <div className="stats-item stats-item-border">
                        <Label
                          className="justify-content-center"
                          divClassName="text-center"
                          text={
                            props.xPlentyData.data.ValueLockedToShow ? (
                              <NumericLabel params={currencyOptionsWithSymbol}>
                                {parseInt(props.xPlentyData.data.ValueLockedToShow)}
                              </NumericLabel>
                            ) : null
                          }
                          subText={'Value Locked'}
                        />
                      </div>
                      <div className="stats-item stats-item-border">
                        <Label
                          className="justify-content-center"
                          divClassName="text-center"
                          text={
                            props.xPlentyData.data.xPlentySupplyToShow ? (
                              <NumericLabel params={currencyOptions}>
                                {parseInt(props.xPlentyData.data.xPlentySupplyToShow)}
                              </NumericLabel>
                            ) : null
                          }
                          subText={'xPLENTY Supply'}
                        />
                      </div>
                      <div className="stats-item negative-margin-bottom">
                        <Label
                          className="justify-content-center"
                          divClassName="text-center"
                          text={
                            props.xPlentyData.data.plentyStakedToShow ? (
                              <NumericLabel params={currencyOptions}>
                                {parseInt(props.xPlentyData.data.plentyStakedToShow)}
                              </NumericLabel>
                            ) : null
                          }
                          subText={'Plenty Staked'}
                        />
                      </div>
                    </div>
                  </div>
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
        onBtnClick={
          props.currentOpHash
            ? () => window.open(`https://tzkt.io/${props.currentOpHash}`, '_blank')
            : null
        }
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
    isTransactionInjectionModalOpen: state.xPlenty.isTransactionInjectionModalOpen,
    isToastOpen: state.xPlenty.isToastOpen,
    toastMessage: state.xPlenty.toastMessage,
    isInfoType: state.xPlenty.isInfoType,
    currentOpHash: state.xPlenty.currentOpHash,
    //toastMessage
    //isInfoType
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    connectWallet: () => dispatch(walletActions.connectWallet()),
    getxPlentyData: () => dispatch(xPlentyComputationsThunk()),
    setExpectedxPlenty: (plentyBalance, totalSupply, plentyAmount) =>
      dispatch(getExpectedxPlentyThunk(plentyBalance, totalSupply, plentyAmount)),
    buyxPlenty: (plentyBalance, totalSupply, plentyAmount) =>
      dispatch(buyXPlentyThunk(plentyBalance, totalSupply, plentyAmount)),
    setExpectedPlenty: (plentyBalance, totalSupply, xplentyAmount) =>
      dispatch(getExpectedPlentyThunk(plentyBalance, totalSupply, xplentyAmount)),
    sellXPlenty: (xPlentyAmount, minimumExpected, recipient) =>
      dispatch(sellXPlentyThunk(xPlentyAmount, minimumExpected, recipient)),
    fetchUserBalances: (address) => dispatch(userActions.fetchUserBalances(address)),
    closetransactionInjectionModal: () => dispatch(closetransactionInjectionModalThunk()),
    closeToast: () => dispatch(closeToastThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);

Stake.propTypes = {
  buyxPlenty: PropTypes.any,
  closeToast: PropTypes.any,
  closetransactionInjectionModal: PropTypes.any,
  connectWallet: PropTypes.any,
  currentOpHash: PropTypes.any,
  expectedPlenty: PropTypes.any,
  expectedxPlenty: PropTypes.any,
  fetchUserBalances: PropTypes.any,
  getxPlentyData: PropTypes.any,
  isProcessing: PropTypes.any,
  isToastOpen: PropTypes.any,
  isTransactionInjectionModalOpen: PropTypes.any,
  sellXPlenty: PropTypes.any,
  setExpectedPlenty: PropTypes.any,
  setExpectedxPlenty: PropTypes.any,
  toastMessage: PropTypes.any,
  walletAddress: PropTypes.any,
  walletBalances: PropTypes.any,
  xPlentyData: PropTypes.any,
};
