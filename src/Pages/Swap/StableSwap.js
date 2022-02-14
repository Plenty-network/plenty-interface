import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import {
  computeOutputBasedOnTokenOutAmount,
  computeTokenOutForRouteBaseByOutAmount,
  getTokenPrices,
  getUserBalanceByRpc,
  fetchtzBTCBalance,
} from '../../apis/swap/swap';

import { getUserBalanceByRpcStable, loadSwapDataStable } from '../../apis/stableswap/stableswap';

import { loadSwapData } from '../../apis/swap/swap-v2';
import config from '../../config/config';

import TransactionSettings from '../../Components/TransactionSettings/TransactionSettings';

import StableSwap from '../../Components/SwapTabsContent/StableSwap';
import { ReactComponent as StableswapGrey } from '../../assets/images/SwapModal/Stableswap-grey.svg';
import LiquidityTab from '../../Components/SwapTabsContent/LiquidityTab';
import Loader from '../../Components/loader';
import { Tab, Tabs } from 'react-bootstrap';
import InfoModal from '../../Components/Ui/Modals/InfoModal';

import { liquidityTokens } from '../../constants/liquidityTokens';
import { stableSwapTokens } from '../../constants/stableSwapPage';

import { ReactComponent as StableswapImg } from '../../assets/images/SwapModal/stableswap.svg';
import { useLocationStateStable } from './hooks';
import '../../assets/scss/animation.scss';

const StableeSwap = (props) => {
  const {
    activeTab,
    setActiveTab,
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
    tokenInStable,
    setTokenInStable,
    tokenOutStable,
    setTokenOutStable,
    tokenInLiquidity,
    tokenOutLiquidity,
  } = useLocationStateStable();

  const [showConfirmSwap, setShowConfirmSwap] = useState(false);
  const [showConfirmAddSupply, setShowConfirmAddSupply] = useState(false);
  const [showConfirmRemoveSupply, setShowConfirmRemoveSupply] = useState(false);

  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  // const [tokenType, setTokenType] = useState('tokenIn');

  const [firstTokenAmount, setFirstTokenAmount] = useState('');
  const [secondTokenAmount, setSecondTokenAmount] = useState('');
  const [firstTokenAmountStable, setFirstTokenAmountStable] = useState('');
  const [secondTokenAmountStable, setSecondTokenAmountStable] = useState('');
  const [swapData, setSwapData] = useState({});
  // const [routeData, setRouteData] = useState({});
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
        setTokenOutStable({});
      }
    }
  }, [tokenInStable, tokenOutStable]);

  useEffect(() => {
    console.log(isStableSwap);
    const updateBalance = async () => {
      setTokenContractInstances({});
      const userBalancesCopy = { ...userBalances };
      const tzBTCName = 'tzBTC';
      const balancePromises = [];
      if (isStableSwap ? !userBalancesCopy[tokenInStable.name] : !userBalancesCopy[tokenIn.name]) {
        (isStableSwap ? tokenInStable.name === tzBTCName : tokenIn.name === tzBTCName)
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(
              isStableSwap
                ? getUserBalanceByRpcStable(tokenInStable.name, props.walletAddress)
                : getUserBalanceByRpc(tokenIn.name, props.walletAddress),
            );
      }
      if (isStableSwap ? !userBalancesCopy[tokenInStable.name] : !userBalancesCopy[tokenIn.name]) {
        (isStableSwap ? tokenInStable.name === tzBTCName : tokenIn.name === tzBTCName)
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
        console.log(lpToken);
        balancePromises.push(
          isStableSwap
            ? getUserBalanceByRpcStable(lpToken, props.walletAddress)
            : getUserBalanceByRpc(lpToken, props.walletAddress),
        );
      }
      const balanceResponse = await Promise.all(balancePromises);

      console.log('updateBalance', balanceResponse);

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
    };
    updateBalance();
  }, [tokenInStable, tokenOutStable, activeTab]);

  useEffect(() => {
    if (activeTab === 'stableswap') {
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
    //setShow(false);
    setShowConfirmSwap(false);
    setShowConfirmAddSupply(false);
    setShowConfirmRemoveSupply(false);
    //setHideContent('');
    //setSearchQuery('');
    //setLoading(false);
  };

  const changeTokenLocation = () => {
    const tempTokenIn = isStableSwap ? tokenInStable.name : tokenIn.name;
    const tempTokenOut = isStableSwap ? tokenOutStable.name : tokenOut.name;
    if (isStableSwap ? tokenOutStable.name : tokenOut.name) {
      !isStableSwap &&
        setTokenIn({
          name: tokenOut.name,
          image: tokenOut.image,
        });
      !isStableSwap &&
        setTokenOut({
          name: tokenIn.name,
          image: tokenIn.image,
        });
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
      isStableSwap ? setFirstTokenAmountStable('') : setFirstTokenAmount('');
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

  // const handleTokenType = (type) => {
  //   //setHideContent('content-hide');
  //   //setShow(true);
  //   // setTokenType(type);
  //   setLoading(false);
  // };

  const handleTokenInput = (input) => {
    setFirstTokenAmountStable(input);
    setFirstTokenAmount(input);
    console.log(firstTokenAmountStable);
    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      isStableSwap ? setFirstTokenAmountStable('') : setFirstTokenAmount('');
      isStableSwap ? setSecondTokenAmountStable('') : setSecondTokenAmount('');
      setComputedOutDetails({
        tokenOut_amount: '',
        fees: 0,
      });
    } else {
      //let computedData;

      if (pairExist) {
        // computedData = computeTokenOutput(
        //   parseFloat(input),
        //   swapData.tokenIn_supply,
        //   swapData.tokenOut_supply,
        //   swapData.exchangeFee,
        //   slippage,
        // );
      } else {
        // computedData = computeTokenOutForRouteBase(parseFloat(input), swapData, slippage);
      }

      // setComputedOutDetails(computedData);
      // setLoading(false);
    }
  };

  const handleOutTokenInput = (input) => {
    isStableSwap ? setSecondTokenAmountStable(input) : setSecondTokenAmount(input);
    setComputedOutDetails({});
    if (input === '' || isNaN(input)) {
      isStableSwap ? setFirstTokenAmountStable('') : setFirstTokenAmount('');
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
      setFirstTokenAmount(computedData.tokenIn_amount);
      setComputedOutDetails(computedData);
    }
  };

  const fetchUserWalletBalance = () => {
    setLoaderInButton(true);
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
    //setTokenType('tokenIn');
    isStableSwap ? setFirstTokenAmountStable('') : setFirstTokenAmount('');
    isStableSwap ? setSecondTokenAmountStable('') : setSecondTokenAmount('');
    setComputedOutDetails({
      tokenOut_amount: '',
    });
  };
  const [showRecepient, setShowRecepient] = useState(false);
  const handleRecepient = (elem) => {
    setRecepient(elem);
  };

  const [showTransactionSubmitModal, setShowTransactionSubmitModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const transactionSubmitModal = (id) => {
    setTransactionId(id);
    setShowTransactionSubmitModal(true);
  };

  // const selectToken = (token) => {
  //   setLoaderInButton(true);
  //   setFirstTokenAmount('');
  //   setSecondTokenAmount('');
  //   setSwapData({});
  //   setComputedOutDetails({
  //     tokenOut_amount: '',
  //   });
  //   //setLoading(true);

  //   if (tokenType === 'tokenIn') {
  //     setTokenIn({
  //       name: token.name,
  //       image: token.image,
  //     });
  //   } else {
  //     setTokenOut({
  //       name: token.name,
  //       image: token.image,
  //     });
  //   }
  //   handleClose();
  // };

  return (
    <div className="border-swap rightToLeftFadeInAnimation-4-stableswap">
      <div className="bg-themed my-0 swap-content-container">
        <Tabs
          activeKey={activeTab}
          className="swap-container-tab"
          onSelect={(e) => setActiveTab(e)}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <Tab
            eventKey="stableswap"
            title={
              <span>
                <span className="mr-2">Stableswap</span>
                {activeTab === 'stableswap' ? <StableswapImg /> : <StableswapGrey />}
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
              // handleTokenType={handleTokenType}
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
              transactionSubmitModal={transactionSubmitModal}
              setSecondTokenAmountStable={setSecondTokenAmountStable}
              fetchUserWalletBalance={fetchUserWalletBalance}
              loaderInButton={loaderInButton}
              setLoaderInButton={setLoaderInButton}
            />
          </Tab>

          <Tab eventKey="liquidityStable" title="Liquidity">
            <LiquidityTab
              walletAddress={props.walletAddress}
              setFirstTokenAmount={handleTokenInput}
              firstTokenAmount={firstTokenAmount}
              connecthWallet={props.connecthWallet}
              tokenIn={tokenInLiquidity}
              tokenOut={tokenOutLiquidity}
              // handleTokenType={handleTokenType}
              swapData={swapData}
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
              handleClose={handleClose}
              showConfirmAddSupply={showConfirmAddSupply}
              setShowConfirmAddSupply={setShowConfirmAddSupply}
              showConfirmRemoveSupply={showConfirmRemoveSupply}
              setShowConfirmRemoveSupply={setShowConfirmRemoveSupply}
              setLoaderMessage={setLoaderMessage}
              resetAllValues={resetAllValues}
              fetchUserWalletBalance={fetchUserWalletBalance}
              setTokenIn={setTokenIn}
              setTokenOut={setTokenOut}
              tokens={liquidityTokens}
              loaderInButton={false}
              setLoaderInButton={setLoaderInButton}
              isStableSwap={true}
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
      <InfoModal
        open={showTransactionSubmitModal}
        onClose={() => setShowTransactionSubmitModal(false)}
        message={'Transaction submitted'}
        buttonText={'View on Tezos'}
        onBtnClick={
          transactionId ? () => window.open(`https://tzkt.io/${transactionId}`, '_blank') : null
        }
      />

      <Loader loading={loading} loaderMessage={loaderMessage} />
    </div>
  );
};

export default StableeSwap;

StableeSwap.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
  redirect: PropTypes.any,
};
