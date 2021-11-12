import React, { useMemo } from 'react';
import SwapDetails from '../SwapDetails';
import ConfirmSwap from './ConfirmSwap';
import { swapTokens, swapTokenUsingRoute } from '../../apis/swap/swap';
import PuffLoader from 'react-spinners/PuffLoader';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from '../Ui/Buttons/Button';
import config from '../../config/config';

const SwapTab = (props) => {
  const callSwapToken = () => {
    props.setShowConfirmSwap(true);
    props.setHideContent('content-hide');
  };

  const pairExist = useMemo(() => {
    return !!config.AMM[config.NETWORK][props.tokenIn.name].DEX_PAIRS[props.tokenOut.name];
  }, [props.tokenIn, props.tokenOut]);

  const handleSwapResponse = (status) => {
    if (status) {
      props.setLoading(false);
      props.handleLoaderMessage('success', 'Transaction confirmed');
      props.setShowConfirmSwap(false);
      props.setHideContent('');
      props.setSecondTokenAmount('');
      props.resetAllValues();
      props.fetchUserWalletBalance();
      props.setLoaderInButton(false);
    } else {
      props.setLoading(false);
      props.handleLoaderMessage('error', 'Transaction failed');
      props.setShowConfirmSwap(false);
      props.setHideContent('');
      props.resetAllValues();
      props.setSecondTokenAmount('');
      props.fetchUserWalletBalance();
      props.setLoaderInButton(false);
    }
  };

  const confirmSwapToken = () => {
    props.setLoading(true);
    props.setLoaderInButton(true);
    let recepientAddress = props.recepient ? props.recepient : props.walletAddress;

    if (pairExist) {
      swapTokens(
        props.tokenIn.name,
        props.tokenOut.name,
        props.computedOutDetails.minimum_Out,
        recepientAddress,
        props.firstTokenAmount,
        props.walletAddress,
        props.tokenContractInstances[props.tokenIn.name],
        props.swapData.dexContractInstance,
        props.transactionSubmitModal,
      ).then((swapResp) => {
        // if (swapResp.success) {
        //   props.setLoading(false);
        //   props.handleLoaderMessage('success', 'Transaction confirmed');
        //   props.setShowConfirmSwap(false);
        //   props.setHideContent('');
        //   props.setSecondTokenAmount('');
        //   props.resetAllValues();
        //   props.fetchUserWalletBalance();
        //   props.setLoaderInButton(false);
        //   setTimeout(() => {
        //     props.setLoaderMessage({});
        //   }, 5000);
        // } else {
        //   props.setLoading(false);
        //   props.handleLoaderMessage('error', 'Transaction failed');
        //   props.setShowConfirmSwap(false);
        //   props.setHideContent('');
        //   props.resetAllValues();
        //   props.setSecondTokenAmount('');
        //   props.fetchUserWalletBalance();
        //   props.setLoaderInButton(false);
        handleSwapResponse(swapResp.success);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    } else {
      swapTokenUsingRoute(
        props.tokenIn.name,
        props.tokenOut.name,
        props.walletAddress,
        props.firstTokenAmount,
        props.computedOutDetails.minimum_Out,
        props.computedOutDetails.minimum_Out_Plenty,
      ).then((swapResp) => {
        // if (swapResp.success) {
        //   props.setLoading(false);
        //   props.handleLoaderMessage('success', 'Transaction confirmed');
        //   props.setShowConfirmSwap(false);
        //   props.setHideContent('');
        //   props.setSecondTokenAmount('');
        //   props.resetAllValues();
        //   props.fetchUserWalletBalance();
        //   props.setLoaderInButton(false);
        //   setTimeout(() => {
        //     props.setLoaderMessage({});
        //   }, 5000);
        // } else {
        //   props.setLoading(false);
        //   props.handleLoaderMessage('error', 'Transaction failed');
        //   props.setShowConfirmSwap(false);
        //   props.setHideContent('');
        //   props.resetAllValues();
        //   props.setSecondTokenAmount('');
        //   props.fetchUserWalletBalance();
        //   props.setLoaderInButton(false);
        handleSwapResponse(swapResp.success);
        setTimeout(() => {
          props.setLoaderMessage({});
        }, 5000);
      });
    }
  };

  const onClickAmount = () => {
    const value =
      props.userBalances[props.tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    props.setFirstTokenAmount(value.substring(0, value.length - 1));
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
    if (props.tokenOut.name && props.firstTokenAmount) {
      swapContentButton = (
        <Button
          onClick={callSwapToken}
          color={'primary'}
          className={'mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Swap
        </Button>
      );
    } else if (!props.tokenOut.name) {
      swapContentButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Select a token
        </Button>
      );
    } else if (props.loaderInButton) {
      swapContentButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          loading={true}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        ></Button>
      );
    } else {
      swapContentButton = (
        <Button
          onClick={() => null}
          color={'primary'}
          className={'enter-amount mt-4 w-100 flex align-items-center justify-content-center'}
        >
          Enter an amount
        </Button>
      );
    }
  }
  return (
    <>
      <div className="swap-content-box-wrapper">
        <div className="swap-content-box">
          <div className="swap-token-select-box bg-themed-light">
            <div className="token-selector-balance-wrapper">
              <button
                className="token-selector dropdown-themed"
                onClick={() => props.handleTokenType('tokenIn')}
              >
                <img src={props.tokenIn.image} className="button-logo" />
                <span className="span-themed">{props.tokenIn.name} </span>
                <span className="span-themed material-icons-round">expand_more</span>
              </button>
            </div>

            <div className="token-user-input-wrapper">
              {props.swapData.success ? (
                <input
                  type="text"
                  className="token-user-input"
                  placeholder="0.0"
                  value={props.firstTokenAmount}
                  onChange={(e) => props.setFirstTokenAmount(e.target.value)}
                />
              ) : (
                <input type="text" className="token-user-input" placeholder="0.0" disabled />
              )}
            </div>
            {props.walletAddress ? (
              <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
                {props.tokenOut.name ? (
                  <p
                    className="wallet-token-balance"
                    onClick={onClickAmount}
                    style={{ cursor: 'pointer' }}
                  >
                    Balance: {props.userBalances[props.tokenIn.name]}{' '}
                    <span className="max-btn">(Max)</span>
                  </p>
                ) : (
                  <p className="wallet-token-balance">
                    Balance: {props.userBalances[props.tokenIn.name]}
                  </p>
                )}

                <p className="wallet-token-balance">
                  ~$
                  {props.getTokenPrice.success && props.firstTokenAmount
                    ? (
                        props.firstTokenAmount * props.getTokenPrice.tokenPrice[props.tokenIn.name]
                      ).toFixed(5)
                    : '0.00'}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className="swap-arrow-center bg-themed icon-animated"
          onClick={props.changeTokenLocation}
        >
          <span className="span-themed material-icons-round">arrow_downward</span>
        </div>

        <div className="swap-content-box">
          <div className="swap-token-select-box bg-themed-light">
            <div className="token-selector-balance-wrapper">
              {props.tokenOut.name ? (
                <button
                  className="token-selector dropdown-themed"
                  onClick={() => props.handleTokenType('tokenOut')}
                >
                  <img src={props.tokenOut.image} className="button-logo" />
                  <span className="span-themed">{props.tokenOut.name} </span>
                  <span className="span-themed material-icons-round">expand_more</span>
                </button>
              ) : (
                <button
                  className="token-selector not-selected"
                  onClick={() => props.handleTokenType('tokenOut')}
                >
                  Select a token <span className="material-icons-round">expand_more</span>
                </button>
              )}
            </div>

            <div className="token-user-input-wrapper">
              {props.swapData.success && props.tokenOut.name ? (
                <input
                  type="text"
                  className="token-user-input"
                  value={
                    props.secondTokenAmount
                      ? props.secondTokenAmount
                      : props.computedOutDetails.tokenOut_amount
                  }
                  placeholder="0.0"
                  onChange={(e) => props.handleOutTokenInput(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="token-user-input"
                  disabled
                  placeholder="0.0"
                  value={props.firstTokenAmount}
                />
              )}
            </div>
            {props.walletAddress && props.tokenOut.name ? (
              <div className="flex justify-between" style={{ flex: '0 0 100%' }}>
                <p className="wallet-token-balance">
                  Balance: {props.userBalances[props.tokenOut.name]}
                </p>
                <p className="wallet-token-balance">
                  ~$
                  {props.getTokenPrice.success && props.computedOutDetails.tokenOut_amount
                    ? (
                        props.computedOutDetails.tokenOut_amount *
                        props.getTokenPrice.tokenPrice[props.tokenOut.name]
                      ).toFixed(5)
                    : '0.00'}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {props.walletAddress && props.swapData.success ? (
          <div className="flex">
            <p className="wallet-token-balance whitespace-prewrap ml-auto flex flex-row">
              1 {props.tokenIn.name} ={' '}
              <OverlayTrigger
                placement="auto"
                overlay={
                  <Tooltip id="swap-token-out-tooltip" {...props}>
                    {props.swapData.tokenOutPerTokenIn}
                  </Tooltip>
                }
              >
                <div>
                  {props.swapData.tokenOutPerTokenIn
                    ? props.swapData.tokenOutPerTokenIn.toFixed(3)
                    : 0}{' '}
                  {props.tokenOut.name}
                </div>
              </OverlayTrigger>
            </p>
          </div>
        ) : null}
        {props.showRecepient ? (
          <input
            type="text"
            className="slipping-tolerance-input full-width"
            placeholder="Send to:"
            onChange={(e) => props.setRecepient(e.target.value)}
            value={props.recepient}
          />
        ) : (
          ''
        )}
        {swapContentButton}
        {props.walletAddress && props.tokenIn.name && props.tokenOut.name && (
          <SwapDetails
            computedOutDetails={props.computedOutDetails}
            tokenIn={props.tokenIn}
            tokenOut={props.tokenOut}
            tokenMiddle={props.tokens.find((token) => token.name === 'PLENTY')}
            firstTokenAmount={props.firstTokenAmount}
          />
        )}
      </div>

      <ConfirmSwap
        show={props.showConfirmSwap}
        computedOutDetails={props.computedOutDetails}
        tokenIn={props.tokenIn}
        firstTokenAmount={props.firstTokenAmount}
        tokenOut={props.tokenOut}
        slippage={props.slippage}
        confirmSwapToken={confirmSwapToken}
        onHide={props.handleClose}
        {...props}
      />
    </>
  );
};

export default SwapTab;
