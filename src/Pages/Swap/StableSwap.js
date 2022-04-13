import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  computeOutputBasedOnTokenOutAmount,
  computeTokenOutForRouteBaseByOutAmount,
  getTokenPrices,
  getUserBalanceByRpc,
  fetchtzBTCBalance,
} from '../../apis/swap/swap';
import { stableSwapTokens } from '../../constants/stableSwapPage';
import { getUserBalanceByRpcStable, loadSwapDataStable } from '../../apis/stableswap/stableswap';

import { loadSwapData } from '../../apis/swap/swap-v2';
import config from '../../config/config';

import TransactionSettings from '../../Components/TransactionSettings/TransactionSettings';

import StableSwap from '../../Components/SwapTabsContent/StableSwap';
import { ReactComponent as StableswapGrey } from '../../assets/images/SwapModal/Stableswap-grey.svg';
import { Tab, Tabs } from 'react-bootstrap';
import { ReactComponent as StableswapImg } from '../../assets/images/SwapModal/stableswap.svg';
import { useLocationStateStable } from './hooks';
import '../../assets/scss/animation.scss';
import SwapModal from '../../Components/SwapModal/SwapModal';
import tez from '../../assets/images/tez.png';
import ctez from '../../assets/images/ctez.png';

const StableeSwap = (props) => {
  const {
    activeTab,
    setActiveTab,
    tokenIn,

    tokenOut,

    tokenInStable,
    setTokenInStable,
    tokenOutStable,
    setTokenOutStable,
    tokenInLiquidity,
    tokenOutLiquidity,
  } = useLocationStateStable();

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);

  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  const [show, setShow] = useState(false);
  const [tokenType, setTokenType] = useState('tokenIn');

  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [firstTokenAmountStable, setFirstTokenAmountStable] = useState('');
  const [secondTokenAmountStable, setSecondTokenAmountStable] = useState('');
  const [swapData, setSwapData] = useState({});
  const [computedOutDetails, setComputedOutDetails] = useState({});
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [loaderInButton, setLoaderInButton] = useState(false);
  const isStableSwap = useState(true);

  const pairExist = useMemo(() => {
    return !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenInStable, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOutStable, 'name')
    ) {
      if (tokenInStable.name === tokenOutStable.name) {
        if (tokenInStable.name === 'ctez') {
          setTokenOutStable({
            name: 'tez',
            image: tez,
          });
        } else if (tokenInStable.name === 'tez') {
          setTokenOutStable({
            name: 'ctez',
            image: ctez,
          });
        }
      }
    }
  }, [tokenInStable]);
  useEffect(() => {
    if (
      Object.prototype.hasOwnProperty.call(tokenInStable, 'name') &&
      Object.prototype.hasOwnProperty.call(tokenOutStable, 'name')
    ) {
      if (tokenInStable.name === tokenOutStable.name) {
        if (tokenOutStable.name === 'tez') {
          setTokenInStable({
            name: 'ctez',
            image: ctez,
          });
        } else if (tokenOutStable.name === 'ctez') {
          setTokenInStable({
            name: 'tez',
            image: tez,
          });
        }
      }
    }
  }, [tokenOutStable]);
  const getSwapData = async () => {
    await loadSwapDataStable(tokenInStable.name, tokenOutStable.name);
  };
  useEffect(() => {
    getSwapData();
  }, []);

  const handleTokenType = (type) => {
    //setHideContent('content-hide');
    setShow(true);
    setTokenType(type);
    setLoading(false);
  };
  useEffect(() => {
    const updateBalance = async () => {
      if (props.walletAddress) {
        setTokenContractInstances({});
        const userBalancesCopy = { ...userBalances };
        const tzBTCName = 'tzBTC';
        const balancePromises = [];
        if (
          isStableSwap ? !userBalancesCopy[tokenInStable.name] : !userBalancesCopy[tokenIn.name]
        ) {
          (isStableSwap ? tokenInStable.name === tzBTCName : tokenIn.name === tzBTCName)
            ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
            : balancePromises.push(
                isStableSwap
                  ? getUserBalanceByRpcStable(tokenInStable.name, props.walletAddress)
                  : getUserBalanceByRpc(tokenIn.name, props.walletAddress),
              );
        }
        if (
          isStableSwap ? !userBalancesCopy[tokenOutStable.name] : !userBalancesCopy[tokenOut.name]
        ) {
          (isStableSwap ? tokenOutStable.name === tzBTCName : tokenOut.name === tzBTCName)
            ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
            : balancePromises.push(
                isStableSwap
                  ? getUserBalanceByRpcStable(tokenOutStable.name, props.walletAddress)
                  : getUserBalanceByRpc(tokenOut.name, props.walletAddress),
              );
        }
        if (
          isStableSwap
            ? config.STABLESWAP[config.NETWORK][tokenInStable.name].DEX_PAIRS[tokenOutStable.name]
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
        ) {
          const lpToken = isStableSwap
            ? config.STABLESWAP[config.NETWORK][tokenInStable.name].DEX_PAIRS[tokenOutStable.name]
                .liquidityToken
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

          balancePromises.push(
            isStableSwap
              ? getUserBalanceByRpcStable(lpToken, props.walletAddress)
              : getUserBalanceByRpc(lpToken, props.walletAddress),
          );
        }
        const balanceResponse = await Promise.all(balancePromises);

        setUserBalances((prev) => ({
          ...prev,
          ...balanceResponse.reduce(
            (acc, cur) => ({
              ...acc,
              [cur.identifier]: cur.balance,
            }),
            {},
          ),
        }));
      }
    };
    updateBalance();
  }, [tokenInStable, tokenOutStable, activeTab, props.walletAddress]);

  useEffect(() => {
    if (activeTab === 'Stableswap') {
      if (
        Object.prototype.hasOwnProperty.call(tokenInStable, 'name') &&
        Object.prototype.hasOwnProperty.call(tokenOutStable, 'name')
      ) {
        loadSwapDataStable(tokenInStable.name, tokenOutStable.name).then((response) => {
          if (response.success) {
            // setRouteData(response);
            setSwapData(response);
            setLoaderInButton(false);
          }
        });
      }
    }

    if (activeTab === 'liquidityStable') {
      if (
        Object.prototype.hasOwnProperty.call(tokenInLiquidity, 'name') &&
        Object.prototype.hasOwnProperty.call(tokenOutLiquidity, 'name')
      ) {
        const pairExists =
          !!config.STABLESWAP[config.NETWORK][tokenInLiquidity.name].DEX_PAIRS[
            tokenOutLiquidity.name
          ];

        if (pairExists) {
          loadSwapDataStable(tokenInLiquidity.name, tokenOutLiquidity.name).then((data) => {
            if (data.success) {
              setSwapData(data);
              //setLoading(false);
              setLoaderInButton(false);
            }
          });
        }
      }
    }
  }, [tokenIn, tokenOut, activeTab, tokenInStable, tokenOutStable]);

  const handleClose = () => {
    setShow(false);
    setShowConfirmSwap(false);
    setShowConfirmTransaction(false);
    setSearchQuery('');
    resetAllValues();
    setLoading(false);
  };

  const changeTokenLocation = () => {
    const tempTokenIn = isStableSwap ? tokenInStable.name : tokenIn.name;
    const tempTokenOut = isStableSwap ? tokenOutStable.name : tokenOut.name;
    if (isStableSwap ? tokenOutStable.name : tokenOut.name) {
      isStableSwap &&
        setTokenInStable({
          name: tokenOutStable.name,
          image: tokenOutStable.image,
        });
      isStableSwap &&
        setTokenOutStable({
          name: tokenInStable.name,
          image: tokenInStable.image,
        });
      setSwapData({});
      setComputedOutDetails({
        tokenOut_amount: '',
      });
      setFirstTokenAmountStable('');
      isStableSwap ? setSecondTokenAmountStable('') : setSecondTokenAmount('');
      if (!isStableSwap) {
        loadSwapData(tempTokenOut, tempTokenIn).then((data) => {
          if (data.success) {
            setSwapData(data);
          }
        });
      } else {
        loadSwapDataStable(tempTokenOut, tempTokenIn).then((data) => {
          if (data.success) {
            setSwapData(data);
          }
        });
      }
    }
  };

  const handleTokenInput = (input) => {
    setFirstTokenAmountStable(input);

    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      setFirstTokenAmountStable('');
      isStableSwap ? setSecondTokenAmountStable('') : setSecondTokenAmount('');
      setComputedOutDetails({
        tokenOut_amount: '',
        fees: 0,
      });
    }
  };

  const handleOutTokenInput = (input) => {
    isStableSwap ? setSecondTokenAmountStable(input) : setSecondTokenAmount(input);
    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      setFirstTokenAmountStable('');
      isStableSwap ? setSecondTokenAmountStable('') : setSecondTokenAmount('');
      setComputedOutDetails({
        tokenOut_amount: '',
        fees: 0,
      });
    } else {
      let computedData;
      if (pairExist) {
        computedData = computeOutputBasedOnTokenOutAmount(
          parseFloat(input),
          swapData.tokenIn_supply,
          swapData.tokenOut_supply,
          swapData.exchangeFee,
          slippage,
        );
      } else {
        computedData = computeTokenOutForRouteBaseByOutAmount(
          parseFloat(input),
          swapData,
          slippage,
        );
      }
      setFirstTokenAmountStable(computedData.tokenIn_amount);
      setComputedOutDetails(computedData);
    }
  };

  const fetchUserWalletBalance = () => {
    setLoaderInButton(true);
  };

  const selectToken = (token) => {
    setLoaderInButton(true);
    setFirstTokenAmountStable('');
    setSecondTokenAmountStable('');
    setSwapData({});
    setComputedOutDetails({
      tokenOut_amount: '',
    });
    //setLoading(true);

    if (tokenType === 'tokenIn') {
      setTokenInStable({
        name: token.name,
        image: token.image,
      });
    } else {
      setTokenOutStable({
        name: token.name,
        image: token.image,
      });
    }
    handleClose();
  };

  useEffect(() => {
    if (!props.walletAddress) {
      return;
    }
    setLoaderInButton(true);
  }, [props.walletAddress]);

  useEffect(() => {
    //setLoading(true);
    setLoaderInButton(true);

    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      //setLoading(false);
    });
  }, []);

  const handleLoaderMessage = (type, message) => {
    setLoaderMessage({
      type: type,
      message: message,
    });
    setLoading(false);
  };

  const resetAllValues = () => {
    setSlippage(0.05);
    setRecepient('');

    setFirstTokenAmountStable('');

    setSecondTokenAmountStable('');
    setSecondTokenAmount('');
    setComputedOutDetails({
      tokenOut_amount: '',
    });
  };
  const [showRecepient, setShowRecepient] = useState(false);
  const handleRecepient = (elem) => {
    setRecepient(elem);
  };

  return (
    <>
      <div className="bg-themed my-0 swap-content-container rightToLeftFadeInAnimation-4-stableswap">
        <Tabs
          activeKey={activeTab}
          className="swap-container-tab"
          onSelect={(e) => setActiveTab(e)}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <Tab
            eventKey="Stableswap"
            title={
              <span>
                <span className="mr-2">Stableswap</span>
                {activeTab === 'Stableswap' ? <StableswapImg /> : <StableswapGrey />}
              </span>
            }
          >
            <StableSwap
              walletAddress={props.walletAddress}
              setFirstTokenAmountStable={handleTokenInput}
              firstTokenAmountStable={firstTokenAmountStable}
              secondTokenAmountStable={secondTokenAmountStable}
              secondTokenAmount={secondTokenAmount}
              connecthWallet={props.connecthWallet}
              tokenIn={tokenInStable}
              tokenOut={tokenOutStable}
              tokens={stableSwapTokens}
              handleTokenType={handleTokenType}
              swapData={swapData}
              //routeData={routeData}
              computedOutDetails={computedOutDetails}
              userBalances={userBalances}
              tokenContractInstances={tokenContractInstances}
              getTokenPrice={getTokenPrice}
              setSlippage={setSlippage}
              setRecepient={setRecepient}
              recepient={recepient}
              slippage={slippage}
              loading={loading}
              setLoading={setLoading}
              handleLoaderMessage={handleLoaderMessage}
              loaderMessage={loaderMessage}
              setShowConfirmSwap={setShowConfirmSwap}
              showConfirmSwap={showConfirmSwap}
              handleClose={handleClose}
              setLoaderMessage={setLoaderMessage}
              resetAllValues={resetAllValues}
              changeTokenLocation={changeTokenLocation}
              handleOutTokenInput={handleOutTokenInput}
              showRecepient={showRecepient}
              setSecondTokenAmountStable={setSecondTokenAmountStable}
              fetchUserWalletBalance={fetchUserWalletBalance}
              loaderInButton={loaderInButton}
              setLoaderInButton={setLoaderInButton}
              setShowConfirmTransaction={setShowConfirmTransaction}
              showConfirmTransaction={showConfirmTransaction}
              theme={props.theme}
            />
          </Tab>
        </Tabs>

        <TransactionSettings
          recepient={recepient}
          slippage={slippage}
          setSlippage={setSlippage}
          setRecepient={setRecepient}
          walletAddress={props.walletAddress}
          handleRecepient={handleRecepient}
          setShowRecepient={setShowRecepient}
        />
      </div>

      <SwapModal
        show={show}
        activeTab={activeTab}
        onHide={handleClose}
        selectToken={selectToken}
        tokens={stableSwapTokens}
        tokenIn={tokenInStable}
        tokenOut={tokenOutStable}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isStableSwap={true}
      />
    </>
  );
};

export default StableeSwap;

StableeSwap.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
  redirect: PropTypes.any,
};
