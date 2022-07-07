import PropTypes from 'prop-types';
import {
  addLiquidity,
  addLiquidity_generalStable,
  estimateOtherToken,
  lpTokenOutput,
} from '../../apis/swap/swap';
import {
  add_liquidity,
  liqCalc,
  liqCalcRev,
  getExchangeRate,
  loadSwapDataStable,
} from '../../apis/stableswap/stableswap';
import fromExponential from 'from-exponential';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import InfoModal from '../../Components/Ui/Modals/InfoModal';
import ConfirmAddLiquidity from '../../Components/SwapTabsContent/LiquidityTabs/ConfirmAddLiquidity';
import config from '../../config/config';
import Button from '../../Components/Ui/Buttons/Button';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import LiquidityInfo from '../../Components/SwapTabsContent/LiquidityTabs/LiquidityInfo';
import ConfirmTransaction from '../../Components/WrappedAssets/ConfirmTransaction';
import Loader from '../../Components/loader';
import {
  getGeneralExchangeRate,
  loadSwapDataGeneralStable,
} from '../../apis/stableswap/generalStableswap';

const AddLiquidity = (props) => {
  const [estimatedTokenAmout, setEstimatedTokenAmout] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [lpTokenAmount, setLpTokenAmount] = useState({});
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [poolShare, setPoolShare] = useState('0.0');
  const [xtztoctez, setxtztoctez] = useState('0.00');
  const [cteztoxtz, setcteztoxtz] = useState('0.00');
  const [tokenArate, settokenArate] = useState('0.00');
  const [tokenBrate, settokenBrate] = useState('0.00');
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const fetchOutputData = async () => {
    const res = getExchangeRate(
      props.swapData.tezPool,
      props.swapData.ctezPool,
      props.swapData.target,
    );
    setxtztoctez(res.ctezexchangeRate.toFixed(6));
    setcteztoxtz(res.tezexchangeRate.toFixed(6));
  };
  const fetchOutputDataGeneralStable = async () => {
    const res = getGeneralExchangeRate(
      props.swapData.tokenIn_supply,
      props.swapData.tokenOut_supply,
    );
    settokenArate(res.tokenAexchangeRate);
    settokenBrate(res.tokenBexchangeRate);
  };

  useEffect(() => {
    if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type === 'xtz'
    ) {
      fetchOutputData();
      getSwapData();
    } else if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
      'veStableAMM'
    ) {
      fetchOutputDataGeneralStable();
      getSwapDataGeneralStableswap();
    }
  }, [props.tokenOut.name, props.tokenOut.name, props]);

  const getSwapData = async () => {
    await loadSwapDataStable(props.tokenIn.name, props.tokenOut.name);
  };

  const getSwapDataGeneralStableswap = async () => {
    await loadSwapDataGeneralStable(props.tokenIn.name, props.tokenOut.name);
  };

  const resetAllValuesLiq = () => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');
  };
  const onClickAmount = () => {
    const value =
      props.userBalances[props.tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    props.tokenIn.name === 'tez'
      ? setFirstTokenAmount(value - 0.02)
      : setFirstTokenAmount(value.substring(0, value.length));
    props.tokenIn.name === 'tez'
      ? handleLiquidityInput(value - 0.02)
      : handleLiquidityInput(value.substring(0, value.length));
  };
  useEffect(() => {
    setErrorMessage(false);
  }, [props.tokenOut.name, firstTokenAmount]);

  const setErrorMessageOnUI = (value) => {
    setMessage(value);
    setErrorMessage(true);
  };
  const getXtz = async (input) => {
    const values = await liqCalc(
      input,
      props.swapData.tezPool,
      props.swapData.ctezPool,
      props.swapData.lpTokenSupply,
    );
    setPoolShare(values.poolPercent.toFixed(5));
    if (props.tokenIn.name === 'tez') {
      setLpTokenAmount((values.lpToken / 10 ** 6).toFixed(6));
    }
    return values.ctez / 10 ** 6;
  };

  const liqCa = async (input) => {
    const values = await liqCalcRev(
      input,
      props.swapData.tezPool,
      props.swapData.ctezPool,
      props.swapData.lpTokenSupply,
    );
    setPoolShare(values.poolPercent.toFixed(5));
    if (props.tokenIn.name === 'tez') {
      setLpTokenAmount((values.lpToken / 10 ** 6).toFixed(6));
    }
    return values.tez / 10 ** 6;
  };

  const handleLiquidityInput = async (input) => {
    setFirstTokenAmount(input);
    setEstimatedTokenAmout({});
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
      setFirstTokenAmount('');
      setEstimatedTokenAmout({
        otherTokenAmount: '',
      });
      return;
    }
    if (props.tokenIn.name === 'tez') {
      const res = await getXtz(input);

      setEstimatedTokenAmout({
        otherTokenAmount: res.toFixed(6),
      });
    } else {
      const estimatedTokenAmout = estimateOtherToken(
        input,
        props.swapData.tokenIn_supply,
        props.swapData.tokenOut_supply,
      );
      setEstimatedTokenAmout(estimatedTokenAmout);
    }
  };
  const handleLiquiditySecondInput = async (input) => {
    setSecondTokenAmount(input);
    setEstimatedTokenAmout({});
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
      setFirstTokenAmount('');
      setEstimatedTokenAmout({
        otherTokenAmount: '',
      });
    } else {
      if (props.tokenIn.name === 'tez') {
        const res = await liqCa(input);

        setEstimatedTokenAmout({
          otherTokenAmount: res.toFixed(6),
        });
        setFirstTokenAmount(res.toFixed(6));
      } else {
        const estimatedTokenAmout = estimateOtherToken(
          input,
          props.swapData.tokenOut_supply,
          props.swapData.tokenIn_supply,
        );
        setEstimatedTokenAmout(estimatedTokenAmout);
        setFirstTokenAmount(estimatedTokenAmout.otherTokenAmount);
      }
    }
  };
  const confirmAddLiquidity = () => {
    props.setShowConfirmAddSupply(true);

    const secondTokenAmountEntered = secondTokenAmount
      ? parseFloat(secondTokenAmount)
      : estimatedTokenAmout.otherTokenAmount;

    if (props.tokenIn.name !== 'tez') {
      const lpTokenAmount = lpTokenOutput(
        firstTokenAmount,
        secondTokenAmountEntered,
        props.swapData.tokenIn_supply,
        props.swapData.tokenOut_supply,
        props.swapData.lpTokenSupply,
      );
      setLpTokenAmount(lpTokenAmount);
    }
  };

  useEffect(() => {
    const secondTokenAmountEntered = secondTokenAmount
      ? parseFloat(secondTokenAmount)
      : estimatedTokenAmout.otherTokenAmount;
    if (props.tokenIn.name !== 'tez') {
      const lpTokenAmount = lpTokenOutput(
        firstTokenAmount,
        secondTokenAmountEntered,
        props.swapData.tokenIn_supply,
        props.swapData.tokenOut_supply,
        props.swapData.lpTokenSupply,
      );
      setLpTokenAmount(lpTokenAmount);
    }
  }, [firstTokenAmount, secondTokenAmount]);

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };
  const handleCloseModal = () => {
    setShowConfirmTransaction(false);

    props.setLoader(false);
    resetAllValuesLiq();

    props.setLoading(false);
  };

  const CallConfirmAddLiquidity = () => {
    props.setLoading(true);
    props.setLoader(true);
    props.setShowConfirmAddSupply(false);
    localStorage.setItem(
      'liqinput',
      props.tokenIn.name === 'tez' ? lpTokenAmount : lpTokenAmount.estimatedLpOutput,
    );
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

    setShowConfirmTransaction(true);
    const secondTokenAmountEntered = secondTokenAmount
      ? parseFloat(secondTokenAmount)
      : estimatedTokenAmout.otherTokenAmount;
    if (props.tokenIn.name === 'tez') {
      add_liquidity(
        props.tokenIn.name,
        props.tokenOut.name,
        secondTokenAmountEntered,
        firstTokenAmount,
        props.walletAddress,
        transactionSubmitModal,
        props.setShowConfirmAddSupply,
        resetAllValuesLiq,
        setShowConfirmTransaction,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);

          props.handleLoaderMessage('success', 'Transaction confirmed');
          props.setLoader(false);
          props.setShowConfirmAddSupply(false);
          setShowConfirmTransaction(false);
          //props.setHideContent('');
          resetAllValuesLiq();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
          props.setBalanceUpdate(true);
        } else {
          props.setLoading(false);
          setShowTransactionSubmitModal(false);

          props.handleLoaderMessage('error', 'Transaction failed');
          props.setLoader(false);
          props.setShowConfirmAddSupply(false);
          setShowConfirmTransaction(false);
          //props.setHideContent('');
          resetAllValuesLiq();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
          props.setBalanceUpdate(true);
        }
      });
    } else if (
      config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
      'veStableAMM'
    ) {
      addLiquidity_generalStable(
        props.tokenIn.name,
        props.tokenOut.name,
        firstTokenAmount,
        secondTokenAmountEntered,
        props.tokenContractInstances[props.tokenIn.name],
        props.tokenContractInstances[props.tokenOut.name],
        props.walletAddress,
        props.swapData.dexContractInstance,
        transactionSubmitModal,
        resetAllValuesLiq,
        props.setShowConfirmAddSupply,
        setShowConfirmTransaction,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          props.setLoader(false);
          setShowTransactionSubmitModal(false);

          props.handleLoaderMessage('success', 'Transaction confirmed');
          getSwapData();
          props.setShowConfirmAddSupply(false);
          setShowConfirmTransaction(false);
          //props.setHideContent('');
          resetAllValuesLiq();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
          props.setBalanceUpdate(true);
        } else {
          props.setLoading(false);
          props.setLoader(false);
          setShowTransactionSubmitModal(false);

          props.handleLoaderMessage('error', 'Transaction failed');
          props.setShowConfirmAddSupply(false);
          setShowConfirmTransaction(false);
          //props.setHideContent('');
          resetAllValuesLiq();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
          props.setBalanceUpdate(true);
        }
      });
    } else {
      addLiquidity(
        props.tokenIn.name,
        props.tokenOut.name,
        firstTokenAmount,
        secondTokenAmountEntered,
        props.tokenContractInstances[props.tokenIn.name],
        props.tokenContractInstances[props.tokenOut.name],
        props.walletAddress,
        props.swapData.dexContractInstance,
        transactionSubmitModal,
        resetAllValuesLiq,
        props.setShowConfirmAddSupply,
        setShowConfirmTransaction,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);

          props.setLoader(false);
          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('success', 'Transaction confirmed');
          getSwapData();
          props.setShowConfirmAddSupply(false);
          setShowConfirmTransaction(false);
          //props.setHideContent('');
          resetAllValuesLiq();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
          props.setBalanceUpdate(true);
        } else {
          props.setLoading(false);
          props.setLoader(false);

          setShowTransactionSubmitModal(false);
          props.handleLoaderMessage('error', 'Transaction failed');
          props.setShowConfirmAddSupply(false);
          setShowConfirmTransaction(false);
          //props.setHideContent('');
          resetAllValuesLiq();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
          props.setBalanceUpdate(true);
        }
      });
    }
  };

  useEffect(() => {
    if (firstTokenAmount === '' || firstTokenAmount === 0) {
      setSecondTokenAmount('');
      setEstimatedTokenAmout({
        otherTokenAmount: '',
      });
    }
  }, [firstTokenAmount]);

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
    if (props.tokenOut.name && firstTokenAmount > 0) {
      swapContentButton = (
        <Button
          onClick={confirmAddLiquidity}
          color={'primary'}
          startIcon={'add'}
          className={'mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Add Liquidity
        </Button>
      );
    } else if (firstTokenAmount === 0 || secondTokenAmount === 0) {
      return (
        <Button
          color={'disabled'}
          startIcon={'add'}
          className={
            ' mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
          }
        >
          Add Liquidity
        </Button>
      );
    } else if (!props.tokenOut.name) {
      swapContentButton = (
        <Button
          onClick={() => setErrorMessageOnUI('Please select a token and then enter the amount')}
          color={'disabled'}
          startIcon={'add'}
          className={
            ' mt-4 w-100 flex align-items-center justify-content-center disable-button-swap'
          }
        >
          Add Liquidity
        </Button>
      );
    } else {
      swapContentButton = (
        <Button
          onClick={() => setErrorMessageOnUI('Enter an amount to add liqiidity')}
          color={'disabled'}
          startIcon={'add'}
          className={' mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Add Liquidity
        </Button>
      );
    }
    if (props.tokenIn.name && props.tokenOut.name) {
      if (
        props.walletAddress &&
        ((firstTokenAmount && firstTokenAmount > props.userBalances[props.tokenIn.name]) ||
          (secondTokenAmount ? secondTokenAmount : estimatedTokenAmout.otherTokenAmount) >
            props.userBalances[props.tokenOut.name])
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
  }

  return (
    <>
      <div className="lq-content-box">
        <div className={clsx('lq-token-select-box', errorMessage && 'errorBorder-liq')}>
          <div className="token-selector-lq">
            <button
              className={clsx('liquidity-token-selector')}
              {...(props.isStableSwap ? {} : { onClick: () => props.handleTokenType('tokenIn') })}
            >
              <div className="d-flex">
                <div>
                  <img width="42" height="42" src={props.tokenIn.image} />
                </div>
                <div className="ml-2">
                  <span className="input-label">Input</span>
                  <div className="token-name">
                    {props.tokenIn.name === 'tez'
                      ? 'TEZ'
                      : props.tokenIn.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenIn.name}
                  </div>
                </div>{' '}
                <div className="expand-more-div">
                  <span className="material-icons-round expand-more-icon">expand_more</span>
                </div>
              </div>
            </button>
          </div>
          <div className="d-flex  align-items-center input-lq">
            <div className="input-width">
              {props.swapData.success ? (
                <input
                  type="text"
                  className="token-user-input-lq"
                  placeholder="0.0"
                  value={fromExponential(firstTokenAmount)}
                  onChange={(e) => {
                    setFirstTokenAmount(e.target.value);
                    handleLiquidityInput(e.target.value);
                  }}
                />
              ) : (
                <input
                  type="text"
                  className="token-user-input-lq"
                  placeholder="--"
                  disabled
                  value={firstTokenAmount}
                />
              )}
            </div>
            {props.walletAddress && props.tokenIn.name ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {props.userBalances[props.tokenIn.name]
                      ? fromExponential(props.userBalances[props.tokenIn.name])
                      : 0.0}
                    {props.tokenIn.name === 'tez'
                      ? 'TEZ'
                      : props.tokenIn.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenIn.name}
                  </Tooltip>
                }
              >
                <div className="balance-lq ml-auto">
                  <p className="bal" onClick={onClickAmount} style={{ cursor: 'pointer' }}>
                    Balance:{' '}
                    <span className="balance-value-liq">
                      {props.userBalances[props.tokenIn.name] >= 0 ? (
                        props.userBalances[props.tokenIn.name].toFixed(4)
                      ) : (
                        <div className="shimmer">0.00</div>
                      )}{' '}
                    </span>
                  </p>
                </div>
              </OverlayTrigger>
            ) : null}
          </div>
        </div>
      </div>

      <div className="lq-arrow-center">
        <span className="material-icons-round">add</span>
      </div>

      <div className="swap-content-box second-input">
        <div
          className={clsx(
            'lq-token-select-box',

            errorMessage && 'errorBorder-liq',
          )}
        >
          <div className="token-selector-lq">
            {props.tokenOut.name ? (
              <button
                className={clsx('liquidity-token-selector')}
                {...(props.isStableSwap
                  ? {}
                  : { onClick: () => props.handleTokenType('tokenOut') })}
              >
                <div className="d-flex">
                  <div>
                    <img width="42" height="42" src={props.tokenOut.image} />
                  </div>
                  <div className="ml-2">
                    <span className="input-label">Input</span>
                    <div className="token-name">
                      {props.tokenOut.name === 'tez'
                        ? 'TEZ'
                        : props.tokenOut.name === 'ctez'
                        ? 'CTEZ'
                        : props.tokenOut.name}
                    </div>
                  </div>{' '}
                  <div className="expand-more-div">
                    <span className="material-icons-round expand-more-icon">expand_more</span>
                  </div>
                </div>
              </button>
            ) : (
              <button
                className="token-selector not-selected"
                {...(props.isStableSwap
                  ? {}
                  : { onClick: () => props.handleTokenType('tokenOut') })}
              >
                Select a token <span className="material-icons-round">expand_more</span>
              </button>
            )}
          </div>

          <div className="d-flex  align-items-center input-lq">
            <div className="input-width">
              {props.swapData.success ? (
                <input
                  type="text"
                  className="token-user-input-lq"
                  placeholder="0.0"
                  value={
                    secondTokenAmount
                      ? fromExponential(secondTokenAmount)
                      : fromExponential(estimatedTokenAmout.otherTokenAmount)
                  }
                  onChange={(e) => handleLiquiditySecondInput(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  disabled
                  className="token-user-input-lq"
                  placeholder="--"
                  value={firstTokenAmount}
                />
              )}
            </div>
            {props.walletAddress && props.tokenOut.name ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {props.userBalances[props.tokenOut.name]
                      ? fromExponential(props.userBalances[props.tokenOut.name])
                      : 0.0}
                    {props.tokenOut.name === 'tez'
                      ? 'TEZ'
                      : props.tokenOut.name === 'ctez'
                      ? 'CTEZ'
                      : props.tokenOut.name}
                  </Tooltip>
                }
              >
                <div className="balance-lq-second ml-auto">
                  <p className="bal">
                    Balance:{' '}
                    <span>
                      {props.userBalances[props.tokenOut.name] >= 0 ? (
                        props.userBalances[props.tokenOut.name].toFixed(4)
                      ) : (
                        <div className="shimmer">0.00</div>
                      )}{' '}
                    </span>
                  </p>
                </div>
              </OverlayTrigger>
            ) : null}
          </div>
        </div>
      </div>
      {errorMessage && <span className="error-message">{message}</span>}
      <LiquidityInfo
        tokenIn={props.tokenIn}
        tokenOut={props.tokenOut}
        lpTokenAmount={lpTokenAmount}
        swapData={props.swapData}
        poolShare={poolShare}
        xtztoctez={xtztoctez}
        cteztoxtz={cteztoxtz}
        tokenArate={tokenArate}
        tokenBrate={tokenBrate}
        isStable={
          config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name]?.type ===
          'xtz'
        }
        theme={props.theme}
      />

      {swapContentButton}
      <div className="add-liq-border"></div>
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
                        {props.positionDetails.data ? (
                          props.positionDetails.data.tokenAPoolBalance.toFixed(4)
                        ) : (
                          <span className="shimmer">99999</span>
                        )}{' '}
                        {props.tokenIn.name === 'tez'
                          ? 'TEZ'
                          : props.tokenIn.name === 'ctez'
                          ? 'CTEZ'
                          : props.tokenIn.name}
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
                        {props.positionDetails.data ? (
                          props.positionDetails.data.tokenBPoolBalance.toFixed(4)
                        ) : (
                          <span className="shimmer">99999</span>
                        )}{' '}
                        {props.tokenOut.name === 'tez'
                          ? 'TEZ'
                          : props.tokenOut.name === 'ctez'
                          ? 'CTEZ'
                          : props.tokenOut.name}
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
      <ConfirmAddLiquidity
        {...props}
        firstTokenAmount={firstTokenAmount}
        CallConfirmAddLiquidity={CallConfirmAddLiquidity}
        lpTokenAmount={lpTokenAmount}
        onHide={props.handleClose}
        estimatedTokenAmout={estimatedTokenAmout}
        secondTokenAmount={secondTokenAmount}
        poolShare={poolShare}
        xtztoctez={xtztoctez}
        cteztoxtz={cteztoxtz}
        isStableSwap={props.tokenIn.name === 'tez' && props.tokenOut.name === 'ctez'}
      />

      <ConfirmTransaction
        show={showConfirmTransaction}
        content={`Mint ${Number(localStorage.getItem('liqinput')).toFixed(
          6,
        )} ${localStorage.getItem('tokeninliq')} / ${localStorage.getItem('tokenoutliq')} LP `}
        theme={props.theme}
        onHide={handleCloseModal}
      />
      <InfoModal
        open={showTransactionSubmitModal}
        InfoMessage={`Mint ${Number(localStorage.getItem('liqinput')).toFixed(
          6,
        )} ${localStorage.getItem('tokeninliq')} / ${localStorage.getItem('tokenoutliq')} LP `}
        theme={props.theme}
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
        content={`Mint ${Number(localStorage.getItem('liqinput')).toFixed(
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
export default connect(mapStateToProps, mapDispatchToProps)(AddLiquidity);

AddLiquidity.propTypes = {
  theme: PropTypes.any,
  loaderMessage: PropTypes.any,
  loading: PropTypes.any,
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  setLoader: PropTypes.func,
  getTokenPrice: PropTypes.any,
  handleClose: PropTypes.any,
  handleLoaderMessage: PropTypes.any,
  handleTokenType: PropTypes.any,
  loaderInButton: PropTypes.any,
  resetAllValuesLiq: PropTypes.any,
  setFirstTokenAmount: PropTypes.any,
  setLoaderMessage: PropTypes.any,
  setLoading: PropTypes.any,
  setShowConfirmAddSupply: PropTypes.any,
  swapData: PropTypes.any,
  tokenContractInstances: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  userBalances: PropTypes.any,
  walletAddress: PropTypes.any,
  isStableSwap: PropTypes.any,
  getSwapData: PropTypes.func,
  setSwapData: PropTypes.func,
  positionDetails: PropTypes.any,
  isPositionAvailable: PropTypes.any,
  balanceUpdate: PropTypes.any,
  setBalanceUpdate: PropTypes.any,
};
