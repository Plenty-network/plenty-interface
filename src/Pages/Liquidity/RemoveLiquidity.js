import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import {
  computeRemoveTokens,
  removeLiquidity,
  removeLiquidity_generalStable,
} from '../../apis/swap/swap';
import { remove_liquidity, liqCalcRemove, getExchangeRate } from '../../apis/stableswap/stableswap';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import fromExponential from 'from-exponential';
import { connect } from 'react-redux';
import InfoModal from '../../Components/Ui/Modals/InfoModal';
import config from '../../config/config';
import Button from '../../Components/Ui/Buttons/Button';
import CONFIG from '../../config/config';
import ConfirmRemoveLiquidity from '../../Components/SwapTabsContent/LiquidityTabs/ConfirmRemoveLiquidity';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Loader from '../../Components/loader';
import ConfirmTransaction from '../../Components/WrappedAssets/ConfirmTransaction';
import { loadSwapDataGeneralStable } from '../../apis/stableswap/generalStableswap';

const RemoveLiquidity = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [removableTokens, setRemovableTokens] = useState({});
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [xtztoctez, setxtztoctez] = useState('0.00');
  const [cteztoxtz, setcteztoxtz] = useState('0.00');

  const fetchOutputData = async () => {
    const res = getExchangeRate(
      props.swapData.tezPool,
      props.swapData.ctezPool,
      props.swapData.target,
    );

    setxtztoctez(res.ctezexchangeRate.toFixed(6));
    setcteztoxtz(res.tezexchangeRate.toFixed(6));
  };
  useEffect(() => {
    if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type === 'xtz'
    ) {
      fetchOutputData();
    } else if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
      'veStableAMM'
    ) {
      getSwapDataGeneralStableswap();
    }
  }, [props.tokenOut.name, props.tokenOut.name]);

  const getSwapDataGeneralStableswap = async () => {
    await loadSwapDataGeneralStable(props.tokenIn.name, props.tokenOut.name);
  };

  useEffect(() => {
    setErrorMessage(false);
  }, [props.tokenOut.name, firstTokenAmount]);

  const setErrorMessageOnUI = (value) => {
    setMessage(value);
    setErrorMessage(true);
  };
  const resetValues = () => {
    props.resetAllValues();
    setFirstTokenAmount('');
    setRemovableTokens({});
  };

  const removeLiquidityInput = (input) => {
    const removeAmount = parseFloat(input);
    let computedRemoveTokens;

    if (props.tokenIn.name === 'tez') {
      computedRemoveTokens = liqCalcRemove(
        removeAmount,
        props.swapData.tezPool,
        props.swapData.ctezPool,
        props.swapData.lpTokenSupply,
      );
    } else {
      computedRemoveTokens = computeRemoveTokens(
        removeAmount,
        props.swapData.lpTokenSupply,
        props.swapData.tokenIn_supply,
        props.swapData.tokenOut_supply,
        props.slippage,
      );
    }

    computedRemoveTokens = {
      ...computedRemoveTokens,
      removeAmount: removeAmount,
    };
    setRemovableTokens(computedRemoveTokens);
  };
  const handleCloseModal = () => {
    setShowConfirmTransaction(false);

    props.setLoader(false);
    resetValues();

    props.setLoading(false);
  };

  const handleRemoveLiquidity = () => {
    props.setShowConfirmRemoveSupply(true);
  };
  const confirmRemoveLiquidity = () => {
    props.setLoading(true);
    props.setLoader(true);
    props.setShowConfirmRemoveSupply(false);
    setShowConfirmTransaction(true);
    localStorage.setItem('liqinput', firstTokenAmount);
    localStorage.setItem(
      'tokeninliq',
      props.tokenIn.name === 'tez'
        ? 'TEZ'
        : props.tokenIn.name === 'ctez'
        ? 'CTEZ'
        : props.tokenIn.name,
    );
    localStorage.setItem(
      'tokenoutliq',
      props.tokenOut.name === 'tez'
        ? 'TEZ'
        : props.tokenOut.name === 'ctez'
        ? 'CTEZ'
        : props.tokenOut.name,
    );
    if (props.tokenIn.name === 'tez') {
      remove_liquidity(
        props.tokenIn.name,
        props.tokenOut.name,
        removableTokens.removeAmount,
        transactionSubmitModal,
        props.setShowConfirmRemoveSupply,
        resetValues,
        setShowConfirmTransaction,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          props.setShowConfirmRemoveSupply(false);
          transactionSubmitModal(data.operationId);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('success', 'Transaction confirmed');
          props.setLoader(false);
          setShowConfirmTransaction(false);
          resetValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        } else {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('error', 'Transaction failed');
          props.setLoader(false);
          props.setShowConfirmRemoveSupply(false);
          setShowConfirmTransaction(false);
          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        }
      });
    } else if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
      'veStableAMM'
    ) {
      removeLiquidity_generalStable(
        props.tokenIn.name,
        props.tokenOut.name,
        new BigNumber(removableTokens.tokenFirst_Out),
        new BigNumber(removableTokens.tokenSecond_Out),
        new BigNumber(removableTokens.removeAmount),
        props.walletAddress,
        props.swapData.dexContractInstance,
        transactionSubmitModal,
        resetValues,
        props.setShowConfirmRemoveSupply,
        setShowConfirmTransaction,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('success', 'Transaction confirmed');
          props.setLoader(false);
          props.setShowConfirmRemoveSupply(false);
          setShowConfirmTransaction(false);

          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        } else {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('error', 'Transaction failed');
          props.setLoader(false);
          props.setShowConfirmRemoveSupply(false);
          setShowConfirmTransaction(false);

          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        }
      });
    } else {
      removeLiquidity(
        props.tokenIn.name,
        props.tokenOut.name,
        new BigNumber(removableTokens.tokenFirst_Out),
        new BigNumber(removableTokens.tokenSecond_Out),
        new BigNumber(removableTokens.removeAmount),
        props.walletAddress,
        props.swapData.dexContractInstance,
        transactionSubmitModal,
        resetValues,
        props.setShowConfirmRemoveSupply,
        setShowConfirmTransaction,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('success', 'Transaction confirmed');
          props.setLoader(false);
          props.setShowConfirmRemoveSupply(false);
          setShowConfirmTransaction(false);

          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        } else {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('error', 'Transaction failed');
          props.setLoader(false);
          props.setShowConfirmRemoveSupply(false);
          setShowConfirmTransaction(false);

          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        }
      });
    }
  };

  let swapContentButton = (
    <Button
      onClick={props.connecthWallet}
      color={'primary'}
      startIcon={'add'}
      className={'mt-4 w-100 flex align-items-center justify-content-center'}
    >
      Connect Wallet
    </Button>
  );

  if (props.walletAddress) {
    swapContentButton = (
      <Button
        onClick={() => setErrorMessageOnUI('Enter an amount to withdraw')}
        color={'disabled'}
        className={' mt-4 w-100 flex align-items-center justify-content-center '}
      >
        Remove Liquidity
      </Button>
    );
  }
  if (props.walletAddress && firstTokenAmount > 0) {
    swapContentButton = (
      <Button
        onClick={handleRemoveLiquidity}
        color={'primary'}
        className={'mt-4 w-100 flex align-items-center justify-content-center'}
      >
        Remove Liquidity
      </Button>
    );
  } else if (firstTokenAmount === 0) {
    return (
      <Button
        color={'disabled'}
        className={' mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'}
      >
        Remove Liquidity
      </Button>
    );
  }
  if (props.tokenIn.name && props.tokenOut.name) {
    if (
      props.walletAddress &&
      firstTokenAmount &&
      firstTokenAmount >
        props.userBalances[
          config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
          'xtz'
            ? CONFIG.STABLESWAP[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                .liquidityToken
            : CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                .liquidityToken
        ]
    ) {
      swapContentButton = (
        <Button
          onClick={() => null}
          color={'disabled'}
          className={
            ' mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
          }
        >
          Insufficient Balance
        </Button>
      );
    }
  }

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const onClickAmount = () => {
    const value =
      props.userBalances[
        config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
        'xtz'
          ? CONFIG.STABLESWAP[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
              .liquidityToken
          : CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
              .liquidityToken
      ];
    setFirstTokenAmount(value);
    removeLiquidityInput(value);
  };

  return (
    <>
      <div className="lq-content-box">
        <div className={clsx('lq-token-select-box', errorMessage && 'errorBorder-liq')}>
          <div className="token-selector-lq-remove align-items-center flex ">Amount to remove</div>
          <div className="input-lq-remove  ">
            <div className="d-flex  align-items-center ">
              <div className="input-width-liq">
                {props.userBalances[props.tokenIn.name] >= 0 ? (
                  <input
                    type="text"
                    className="token-user-input-lq"
                    placeholder="0.0"
                    value={fromExponential(firstTokenAmount)}
                    onChange={(e) => {
                      setFirstTokenAmount(e.target.value);
                      removeLiquidityInput(e.target.value);
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    className="token-user-input-lq"
                    placeholder="0.0"
                    disabled
                    value={firstTokenAmount}
                  />
                )}
              </div>
              {props.walletAddress && props.tokenOut.name ? (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      {config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]
                        ?.type === 'xtz'
                        ? props.userBalances[
                            CONFIG.STABLESWAP[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                              props.tokenOut.name
                            ].liquidityToken
                          ]
                          ? fromExponential(
                              props.userBalances[
                                CONFIG.STABLESWAP[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                                  props.tokenOut.name
                                ].liquidityToken
                              ],
                            )
                          : 0.0
                        : props.userBalances[
                            CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                              props.tokenOut.name
                            ].liquidityToken
                          ]
                        ? fromExponential(
                            props.userBalances[
                              CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                                props.tokenOut.name
                              ].liquidityToken
                            ],
                          )
                        : 0.0}{' '}
                    </Tooltip>
                  }
                >
                  <div className="balance-lq ml-auto">
                    <p className="bal" onClick={onClickAmount} style={{ cursor: 'pointer' }}>
                      Balance:{' '}
                      <span className="balance-value-liq">
                        {config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[
                          props.tokenOut.name
                        ]?.type === 'xtz' ? (
                          props.userBalances[
                            CONFIG.STABLESWAP[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                              props.tokenOut.name
                            ].liquidityToken
                          ] >= 0 ? (
                            props.userBalances[
                              CONFIG.STABLESWAP[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                                props.tokenOut.name
                              ].liquidityToken
                            ].toFixed(4)
                          ) : (
                            <div className="shimmer">0.0000</div>
                          )
                        ) : props.userBalances[
                            CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                              props.tokenOut.name
                            ].liquidityToken
                          ] >= 0 ? (
                          props.userBalances[
                            CONFIG.AMM[CONFIG.NETWORK][props.tokenIn.name].DEX_PAIRS[
                              props.tokenOut.name
                            ].liquidityToken
                          ].toFixed(4)
                        ) : (
                          <div className="shimmer">0.0000</div>
                        )}{' '}
                      </span>
                    </p>
                  </div>
                </OverlayTrigger>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="lq-arrow-center remove-lq-arrow-center">
        <span className="material-icons-round">arrow_downward</span>
      </div>

      <div className="swap-content-box second-input">
        <div
          className={clsx(
            'lq-token-select-box',
            'remove-lq-input-height',

            errorMessage && 'errorBorder-liq',
          )}
        >
          <div className="token-selector-lq-remove align-items-center flex remove-lq-border">
            You will receive
          </div>

          <div className="input-lq-remove d-flex">
            <div className="d-flex remove-tokens">
              <div>
                <img height="42" width="42" src={props.tokenIn.image} />
              </div>
              <div className="ml-2">
                {removableTokens.tokenFirst_Out ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="button-tooltip" {...props}>
                        {fromExponential(removableTokens.tokenFirst_Out)}
                      </Tooltip>
                    }
                  >
                    <span className="remove-value-lq">
                      {removableTokens.tokenFirst_Out.toFixed(4)}
                    </span>
                  </OverlayTrigger>
                ) : (
                  <span className="remove-value-lq">0.00</span>
                )}
                <div className="remove-token-lq">
                  {props.tokenIn.name === 'tez'
                    ? 'TEZ'
                    : props.tokenIn.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenIn.name}
                </div>
              </div>
            </div>
            <div className="ml-3 d-flex remove-tokens">
              <div>
                <img height="42" width="42" src={props.tokenOut.image} />
              </div>
              <div className="ml-2">
                {removableTokens.tokenSecond_Out ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="button-tooltip" {...props}>
                        {fromExponential(removableTokens.tokenSecond_Out)}
                      </Tooltip>
                    }
                  >
                    <span className="remove-value-lq">
                      {removableTokens.tokenSecond_Out.toFixed(4)}
                    </span>
                  </OverlayTrigger>
                ) : (
                  <span className="remove-value-lq">0.00</span>
                )}

                <div className="remove-token-lq">
                  {' '}
                  {props.tokenOut.name === 'tez'
                    ? 'TEZ'
                    : props.tokenOut.name === 'ctez'
                    ? 'CTEZ'
                    : props.tokenOut.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorMessage && <span className="error-message">{message}</span>}

      {swapContentButton}
      {props.isPositionAvailable ? (
        <div className="your-positions">
          <div className=" content-your-position justify-content-between">
            <div className="left">
              <div className="your-positions-label ">Your Positions</div>
              <img width="50" height="50" src={props.tokenIn.image} />
              <img width="50" height="50" src={props.tokenOut.image} className="ml-2" />
              <span className="lp-pair">
                {props.tokenIn.name === 'tez'
                  ? 'TEZ'
                  : props.tokenIn.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenIn.name}{' '}
                /{' '}
                {props.tokenOut.name === 'tez'
                  ? 'TEZ'
                  : props.tokenOut.name === 'ctez'
                  ? 'CTEZ'
                  : props.tokenOut.name}
              </span>
              <div className="d-flex mt-2">
                <div>
                  <div className="token-name-lp"></div>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="button-tooltip" {...props}>
                        {props.positionDetails.data
                          ? fromExponential(props.positionDetails.data.tokenAPoolBalance)
                          : '0.00'}
                      </Tooltip>
                    }
                  >
                    <div className="tokenin-value">
                      <span className="value">
                        {props.tokenIn.name === 'tez'
                          ? 'TEZ'
                          : props.tokenIn.name === 'ctez'
                          ? 'CTEZ'
                          : props.tokenIn.name}{' '}
                        {props.positionDetails.data ? (
                          props.positionDetails.data.tokenAPoolBalance.toFixed(4)
                        ) : (
                          <span className="shimmer">99999</span>
                        )}
                      </span>{' '}
                    </div>
                  </OverlayTrigger>
                </div>
                <div className="ml-2">
                  <div className="token-name-lp"></div>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="button-tooltip" {...props}>
                        {props.positionDetails.data
                          ? fromExponential(props.positionDetails.data.tokenBPoolBalance)
                          : '0.00'}
                      </Tooltip>
                    }
                  >
                    <div className="tokenin-value">
                      <span className="value">
                        {props.tokenOut.name === 'tez'
                          ? 'TEZ'
                          : props.tokenOut.name === 'ctez'
                          ? 'CTEZ'
                          : props.tokenOut.name}{' '}
                        {props.positionDetails.data ? (
                          props.positionDetails.data.tokenBPoolBalance.toFixed(4)
                        ) : (
                          <span className="shimmer">99999</span>
                        )}
                      </span>{' '}
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
            <div className="ml-auto right">
              <div className="pool-tokens ">
                <div className="label">Pool tokens</div>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      {props.positionDetails.data
                        ? fromExponential(props.positionDetails.data.lpBalance)
                        : '0.00'}
                    </Tooltip>
                  }
                >
                  <div className="pool-value">
                    {props.positionDetails.data ? (
                      props.positionDetails.data.lpBalance.toFixed(4)
                    ) : (
                      <span className="shimmer">99999</span>
                    )}
                  </div>
                </OverlayTrigger>
              </div>
              <div className="pool-share">
                <div className="label">Pool share</div>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="button-tooltip" {...props}>
                      {props.positionDetails.data
                        ? fromExponential(props.positionDetails.data.lpTokenShare)
                        : '0.00'}
                    </Tooltip>
                  }
                >
                  <div className="pool-value">
                    {props.positionDetails.data ? (
                      props.positionDetails.data.lpTokenShare.toFixed(4)
                    ) : (
                      <span className="shimmer">99999</span>
                    )}{' '}
                    %
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmRemoveLiquidity
        {...props}
        firstTokenAmount={firstTokenAmount}
        removableTokens={removableTokens}
        confirmRemoveLiquidity={confirmRemoveLiquidity}
        onHide={props.handleClose}
        xtztoctez={xtztoctez}
        cteztoxtz={cteztoxtz}
        isStableSwap={props.tokenIn.name === 'tez' && props.tokenOut.name === 'ctez'}
      />
      <ConfirmTransaction
        show={showConfirmTransaction}
        theme={props.theme}
        content={`Burn ${Number(localStorage.getItem('liqinput')).toFixed(
          6,
        )} ${localStorage.getItem('tokeninliq')} / ${localStorage.getItem('tokenoutliq')} LP `}
        onHide={handleCloseModal}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        theme={props.theme}
        InfoMessage={`Burn ${Number(localStorage.getItem('liqinput')).toFixed(
          6,
        )} ${localStorage.getItem('tokeninliq')} / ${localStorage.getItem('tokenoutliq')} LP `}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Block Explorer'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />
      <Loader
        loading={props.loading}
        loaderMessage={props.loaderMessage}
        setLoaderMessage={props.setLoaderMessage}
        content={`Burn ${Number(localStorage.getItem('liqinput')).toFixed(
          6,
        )} ${localStorage.getItem('tokeninliq')} / ${localStorage.getItem('tokenoutliq')} LP `}
        tokenIn={props.tokenIn.name}
        tokenOut={props.tokenOut.name}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  loader: state.settings.loader,
});

const mapDispatchToProps = (dispatch) => ({
  setLoader: (value) => dispatch(setLoader(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RemoveLiquidity);

RemoveLiquidity.propTypes = {
  theme: PropTypes.any,
  loaderMessage: PropTypes.any,
  loading: PropTypes.any,
  connecthWallet: PropTypes.any,
  setLoader: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  resetAllValues: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  //setHideContent: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  setShowConfirmRemoveSupply: PropTypes.any,
  swapData: PropTypes.any,
  tokenContractInstances: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  userBalances: PropTypes.any,
  walletAddress: PropTypes.any,
  isStableSwap: PropTypes.any,
  getSwapData: PropTypes.func,
  setSwapData: PropTypes.func,
  slippage: PropTypes.any,
  positionDetails: PropTypes.any,
  isPositionAvailable: PropTypes.any,
};
