import PropTypes from 'prop-types';
import { addLiquidity, estimateOtherToken, lpTokenOutput } from '../../apis/swap/swap';
import {
  add_liquidity,
  getXtzDollarPrice,
  liqCalc,
  liqCalcRev,
  getExchangeRate,
  loadSwapDataStable,
} from '../../apis/stableswap/stableswap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import InfoModal from '../../Components/Ui/Modals/InfoModal';
import ConfirmAddLiquidity from '../../Components/SwapTabsContent/LiquidityTabs/ConfirmAddLiquidity';
import Button from '../../Components/Ui/Buttons/Button';
import { setLoader } from '../../redux/slices/settings/settings.slice';
import LiquidityInfo from '../../Components/SwapTabsContent/LiquidityTabs/LiquidityInfo';
import { isTokenPairStable } from '../../apis/Liquidity/Liquidity';

const AddLiquidityNew = (props) => {
  const [estimatedTokenAmout, setEstimatedTokenAmout] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [lpTokenAmount, setLpTokenAmount] = useState({});
  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [dolar, setDolar] = useState('');
  const [poolShare, setPoolShare] = useState('0.0');
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
    if (isTokenPairStable(props.tokenIn.name, props.tokenOut.name)) {
      fetchOutputData();
      getSwapData();
    }
  }, [props]);
  const getSwapData = async () => {
    await loadSwapDataStable(props.tokenIn.name, props.tokenOut.name);
  };

  const onClickAmount = () => {
    const value =
      props.userBalances[props.tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    setFirstTokenAmount(value.substring(0, value.length - 1));
    handleLiquidityInput(value.substring(0, value.length - 1));
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

  useEffect(() => {
    getXtzDollarPrice().then((res) => {
      setDolar(res);
    });
  }, []);

  const InfoMessage = useMemo(() => {
    return (
      <span>
        {lpTokenAmount.estimatedLpOutput} {props.tokenIn.name}/{props.tokenOut.name} LP Tokens
      </span>
    );
  }, [lpTokenAmount.estimatedLpOutput]);

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
    //props.setHideContent('content-hide');

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
  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  const CallConfirmAddLiquidity = () => {
    props.setLoading(true);
    props.setLoader(true);
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
        props.resetAllValues,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          props.handleLoaderMessage('success', 'Transaction confirmed');
          props.setLoader(false);
          props.setShowConfirmAddSupply(false);
          //props.setHideContent('');
          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        } else {
          props.setLoading(false);
          props.handleLoaderMessage('error', 'Transaction failed');
          props.setLoader(false);
          props.setShowConfirmAddSupply(false);
          //props.setHideContent('');
          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
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
        props.resetAllValues,
        props.setShowConfirmAddSupply,
      ).then((data) => {
        if (data.success) {
          props.setLoading(false);
          props.handleLoaderMessage('success', 'Transaction confirmed');
          getSwapData();
          props.setShowConfirmAddSupply(false);
          //props.setHideContent('');
          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
        } else {
          props.setLoading(false);
          props.handleLoaderMessage('error', 'Transaction failed');
          props.setShowConfirmAddSupply(false);
          //props.setHideContent('');
          props.resetAllValues();
          setTimeout(() => {
            props.setLoaderMessage({});
          }, 5000);
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
    if (props.tokenOut.name && firstTokenAmount) {
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
    } else if (!props.tokenOut.name) {
      swapContentButton = (
        <Button
          onClick={() => setErrorMessageOnUI('Please select a token and then enter the amount')}
          color={'disabled'}
          startIcon={'add'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Add Liquidity
        </Button>
      );
    } else {
      // swapContentButton = props.loaderInButton ? (
      //   <Button
      //     onClick={() => null}
      //     color={'primary'}
      //     loading={true}
      //     className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
      //   ></Button>
      // ) : (
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
  }

  return (
    <>
      <div className="lq-content-box">
        <div className={clsx('lq-token-select-box', errorMessage && 'errorBorder')}>
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
                  <div className="token-name">{props.tokenIn.name}</div>
                </div>{' '}
                <div className="ml-auto">
                  <span className="material-icons-round expand-more-icon">expand_more</span>
                </div>
              </div>
            </button>
          </div>
          <div className="d-flex  align-items-center input-lq">
            {props.walletAddress ? (
              <div className="max-button" onClick={onClickAmount}>
                MAX
              </div>
            ) : null}

            <div className="input-width">
              {props.swapData.success && props.userBalances[props.tokenIn.name] ? (
                <input
                  type="text"
                  className="token-user-input-lq"
                  placeholder="0.0"
                  value={firstTokenAmount}
                  onChange={(e) => {
                    setFirstTokenAmount(e.target.value);
                    handleLiquidityInput(e.target.value);
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
              <p className="wallet-token-balance-lq">
                $
                {props.tokenIn.name === 'tez'
                  ? (dolar * firstTokenAmount).toFixed(2)
                  : props.getTokenPrice.success && props.firstTokenAmount
                  ? (firstTokenAmount * props.getTokenPrice.tokenPrice[props.tokenIn.name]).toFixed(
                      5,
                    )
                  : '0.00'}
              </p>
            </div>
            {props.walletAddress && props.tokenIn.name ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {props.userBalances[props.tokenIn.name]
                      ? props.userBalances[props.tokenIn.name]
                      : 0.0}
                  </Tooltip>
                }
              >
                <div className="balance-lq ml-auto">
                  <p className="bal">
                    Balance:{' '}
                    {props.userBalances[props.tokenIn.name] >= 0 ? (
                      props.userBalances[props.tokenIn.name].toFixed(2)
                    ) : (
                      <div className="shimmer">0.00</div>
                    )}{' '}
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

            errorMessage && 'errorBorder',
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
                    <div className="token-name">{props.tokenOut.name}</div>
                  </div>{' '}
                  <div className="ml-auto">
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
            {props.walletAddress ? (
              <div className="max-button" onClick={onClickAmount}>
                MAX
              </div>
            ) : null}
            <div className="input-width">
              {props.swapData.success ? (
                <input
                  type="text"
                  className="token-user-input-lq"
                  placeholder="0.0"
                  value={
                    secondTokenAmount ? secondTokenAmount : estimatedTokenAmout.otherTokenAmount
                  }
                  onChange={(e) => handleLiquiditySecondInput(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  disabled
                  className="token-user-input-lq"
                  placeholder="0.0"
                  value={firstTokenAmount}
                />
              )}
              <p className="wallet-token-balance-lq">
                $0.0
                {/* {props.tokenIn.name === 'tez'
                  ? (dolar * props.firstTokenAmount).toFixed(2)
                  : props.getTokenPrice.success && props.firstTokenAmount
                  ? (
                      props.firstTokenAmount * props.getTokenPrice.tokenPrice[props.tokenIn.name]
                    ).toFixed(5)
                  : '0.00'} */}
              </p>
            </div>
            {props.walletAddress && props.tokenOut.name ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="button-tooltip" {...props}>
                    {props.userBalances[props.tokenOut.name]
                      ? props.userBalances[props.tokenOut.name]
                      : 0.0}
                  </Tooltip>
                }
              >
                <div className="balance-lq ml-auto">
                  <p className="bal">
                    Balance:{' '}
                    {props.userBalances[props.tokenOut.name] >= 0 ? (
                      props.userBalances[props.tokenOut.name].toFixed(2)
                    ) : (
                      <div className="shimmer">0.00</div>
                    )}{' '}
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
        isStable={isTokenPairStable(props.tokenIn.name, props.tokenOut.name)}
        theme={props.theme}
      />

      {/* <div className="swap-detail-wrapper bg-themed-light"> }
        <div className="add-liquidity-tip">
          When you add liquidity, you will receive pool tokens representing your position. These
          tokens automatically earn fees proportional to your share of the pool, and can be redeemed
          at any time.
        </div>
      </div> */}

      {swapContentButton}
      {props.isPositionAvailable ? (
        <div className="your-positions">
          <div className="d-flex justify-content-between">
            <div className="left">
              <div className="your-positions-label ">Your Positions</div>
              <img width="50" height="50" src={props.tokenIn.image} />
              <img width="50" height="50" src={props.tokenOut.image} className="ml-2" />
              <span className="lp-pair">
                {props.tokenIn.name} / {props.tokenOut.name}
              </span>
              <div className="d-flex mt-2">
                <div>
                  <div className="token-name-lp">{props.tokenIn.name}</div>
                  <div className="tokenin-value">
                    <span className="value">
                      {props.positionDetails.data
                        ? props.positionDetails.data.tokenAPoolBalance.toFixed(10)
                        : '0.00'}
                    </span>{' '}
                    <span className="tokenName"> {props.tokenIn.name}</span>
                  </div>
                </div>
                <div className="ml-2">
                  <div className="token-name-lp">{props.tokenOut.name}</div>
                  <div className="tokenin-value">
                    <span className="value">
                      {props.positionDetails.data
                        ? props.positionDetails.data.tokenBPoolBalance.toFixed(10)
                        : '0.00'}
                    </span>{' '}
                    <span className="tokenName">{props.tokenOut.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-auto right">
              <div className="pool-tokens ml-auto">
                <div className="label">Pool Tokens</div>
                <div className="pool-value">
                  {props.positionDetails.data
                    ? props.positionDetails.data.lpBalance.toFixed(6)
                    : '0.00'}
                </div>
              </div>
              <div className="pool-share">
                <div className="label">Your pool share</div>
                <div className="pool-value">
                  {props.positionDetails.data
                    ? props.positionDetails.data.lpTokenShare.toFixed(6)
                    : '0.00'}{' '}
                  %
                </div>
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
      />
      <InfoModal
        open={showTransactionSubmitModal}
        InfoMessage={InfoMessage}
        theme={props.theme}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
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
export default connect(mapStateToProps, mapDispatchToProps)(AddLiquidityNew);

AddLiquidityNew.propTypes = {
  theme: PropTypes.any,
  connecthWallet: PropTypes.any,
  fetchUserWalletBalance: PropTypes.any,
  firstTokenAmount: PropTypes.any,
  setLoader: PropTypes.func,
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
};
