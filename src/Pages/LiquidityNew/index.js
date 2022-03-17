import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useMemo, useEffect, useState } from 'react';
import { Col, Container } from 'react-bootstrap';
import { Tab, Tabs } from 'react-bootstrap';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../../assets/scss/animation.scss';
import AddLiquidityNew from './AddLiquidityNew';
import '../../assets/scss/partials/_wrappedAssets.scss';
import config from '../../config/config';
import { useLocationStateInLiquidity } from '../Swap/hooks/useLocationStateLiquidity';
import { getUserBalanceByRpc, fetchtzBTCBalance, getTokenPrices } from '../../apis/swap/swap';
import { loadSwapData } from '../../apis/swap/swap-v2';
import TransactionSettings from '../../Components/TransactionSettings/TransactionSettings';
import RemoveLiquidityNew from './RemoveLiquidityNew';
import { liquidityTokens } from '../../constants/liquidityTokens';
import { LiquidityPositions } from './LiquidityPositions';
import {
  getLiquidityPositionDetails,
  getLiquidityPositionDetailsStable,
  getLpTokenBalanceForPair,
  isTokenPairStable,
} from '../../apis/Liquidity/Liquidity';
import LiquidityModal from '../../Components/LiquidityModal/LiquidityModal';
import ctez from '../../assets/images/ctez.png';

const LiquidityNew = (props) => {
  const { tokenIn, setTokenIn, tokenOut, setTokenOut } = useLocationStateInLiquidity();
  const [searchQuery, setSearchQuery] = useState('');
  const [swapData, setSwapData] = useState({});
  const [tokenType, setTokenType] = useState('tokenIn');
  const [show, setShow] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [recepient, setRecepient] = useState('');
  const [tokenContractInstances, setTokenContractInstances] = useState({});
  const [showConfirmAddSupply, setShowConfirmAddSupply] = useState(false);
  const [showConfirmRemoveSupply, setShowConfirmRemoveSupply] = useState(false);
  const [showConfirmTransaction, setShowConfirmTransaction] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState({});
  const [loaderInButton, setLoaderInButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const [userBalances, setUserBalances] = useState({});
  const activeTab = 'liquidity';
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLiquidityPosition, setLiquidityPosition] = useState(false);
  const [positionDetails, setPositionDetails] = useState({});
  const [isPositionAvailable, setPositionAvailable] = useState(false);

  useEffect(() => {
    console.log(tokenIn);
    if (tokenIn.name === 'tez') {
      setTokenOut({
        name: 'ctez',
        image: ctez,
      });
    }
  }, [tokenIn]);

  useEffect(async () => {
    const isStable = isTokenPairStable(tokenIn.name, tokenOut.name);

    const ress = await getLpTokenBalanceForPair(tokenIn.name, tokenOut.name, props.walletAddress);

    setPositionAvailable(ress.isLiquidityAvailable);
    if (ress.isLiquidityAvailable) {
      let res;
      if (isStable) {
        res = await getLiquidityPositionDetailsStable(
          tokenIn.name,
          tokenOut.name,
          props.walletAddress,
        );
      } else {
        res = await getLiquidityPositionDetails(tokenIn.name, tokenOut.name, props.walletAddress);
      }
      setPositionDetails(res);
    }
  }, [tokenIn, tokenOut]);

  useEffect(() => {
    //setLoading(true);
    setLoaderInButton(true);

    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      //setLoading(false);
    });
  }, []);

  const activeKey = useMemo(() => {
    if (location.pathname === '/liquidity/remove') {
      return 'remove';
    }

    return 'add';
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname.includes('liquidity')) {
      setLiquidityPosition(false);
    }
  }, [searchParams]);

  const handleClose = () => {
    setShow(false);

    setShowConfirmAddSupply(false);
    setShowConfirmRemoveSupply(false);
    setShowConfirmTransaction(false);
    //setHideContent('');
    setSearchQuery('');
    //setLoading(false);
  };

  useEffect(() => {
    const updateBalance = async () => {
      setTokenContractInstances({});
      const userBalancesCopy = { ...userBalances };
      const tzBTCName = 'tzBTC';
      const balancePromises = [];
      if (!userBalancesCopy[tokenIn.name]) {
        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenIn.name, props.walletAddress));
      }
      if (!userBalancesCopy[tokenOut.name]) {
        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenOut.name, props.walletAddress));
      }
      if (config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]) {
        const lpToken =
          config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

        balancePromises.push(getUserBalanceByRpc(lpToken, props.walletAddress));
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
    };
    updateBalance();
  }, [tokenIn, tokenOut, props]);

  const selectToken = (token) => {
    setLoaderInButton(true);

    setSwapData({});

    //setLoading(true);

    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });
      if (token.name === 'tez') {
        setTokenOut({
          name: 'ctez',
          image: ctez,
        });
      }
    } else {
      setTokenOut({
        name: token.name,
        image: token.image,
      });
    }
    handleClose();
  };

  useEffect(() => {
    if (activeTab === 'liquidity') {
      if (
        Object.prototype.hasOwnProperty.call(tokenIn, 'name') &&
        Object.prototype.hasOwnProperty.call(tokenOut, 'name')
      ) {
        const pairExists = !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
        if (pairExists) {
          loadSwapData(tokenIn.name, tokenOut.name).then((data) => {
            if (data.success) {
              setSwapData(data);
              //setLoading(false);
              setLoaderInButton(false);
            }
          });
        }
      }
    }
  }, [tokenIn, tokenOut, activeTab]);

  const handleTokenType = (type) => {
    //setHideContent('content-hide');
    setShow(true);
    setTokenType(type);
    setLoading(false);
  };

  const fetchUserWalletBalance = () => {
    setLoaderInButton(true);
  };

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
    setTokenType('tokenIn');
    // setFirstTokenAmount('');
    // setSecondTokenAmount('');
  };

  const changeLiquidityType = (tab) => {
    const tokenAFromParam = searchParams.get('tokenA');
    const tokenBFromParam = searchParams.get('tokenB');
    navigate({
      pathname: `/liquidity/${tab}`,
      search: `?${createSearchParams({
        ...(tokenAFromParam ? { tokenA: tokenAFromParam } : {}),
        ...(tokenBFromParam ? { tokenB: tokenBFromParam } : {}),
      })}`,
    });
  };
  const redirectLiquidityPositions = (value) => {
    setLiquidityPosition(value);
  };

  useEffect(() => {
    const tokenAFromParam = searchParams.get('tokenA');
    const tokenBFromParam = searchParams.get('tokenB');

    if (tokenAFromParam !== tokenBFromParam) {
      if (tokenAFromParam) {
        liquidityTokens.map((token) => {
          if (token.name === tokenAFromParam) {
            setTokenIn({
              name: tokenAFromParam,
              image: token.image,
            });
          }
        });
      }

      if (tokenBFromParam) {
        liquidityTokens.map((token) => {
          if (token.name === tokenBFromParam) {
            setTokenOut({
              name: tokenBFromParam,
              image: token.image,
            });
          }
        });
      }
    }
  }, [searchParams]);

  return (
    <Container fluid className="removing-padding">
      <p
        className="redirect-label-lp"
        style={{ cursor: 'pointer' }}
        onClick={() => redirectLiquidityPositions(!isLiquidityPosition)}
      >
        {isLiquidityPosition && (
          <span className={clsx('material-icons', 'arrow-forward', 'mt-1', 'ml-0')}>
            arrow_back_ios_icon
          </span>
        )}
        {isLiquidityPosition ? 'Back' : 'View Liquidity Positions'}
        {!isLiquidityPosition && (
          <span className={clsx('material-icons', 'arrow-forward', 'mt-1')}>
            arrow_forward_ios_icon
          </span>
        )}
      </p>
      {/* <div className="liq-label">{isLiquidityPosition ? 'Liquidity Positions' : 'Liquidity'}</div> */}
      {!isLiquidityPosition ? (
        <Col sm={8} md={6} className="liquidity-content-container">
          <div className="">
            <Tabs
              activeKey={activeKey}
              className="liq-container-tab"
              onSelect={(e) => changeLiquidityType(e)}
              mountOnEnter={true}
              unmountOnExit={true}
            >
              <Tab eventKey="add" title="Add">
                <AddLiquidityNew
                  walletAddress={props.walletAddress}
                  connecthWallet={props.connecthWallet}
                  tokenIn={tokenIn}
                  tokenOut={tokenOut}
                  handleTokenType={handleTokenType}
                  swapData={swapData}
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
                  loaderInButton={loaderInButton}
                  setLoaderInButton={setLoaderInButton}
                  setShowConfirmTransaction={setShowConfirmTransaction}
                  showConfirmTransaction={showConfirmTransaction}
                  positionDetails={positionDetails}
                  setPositionAvailable={setPositionAvailable}
                  isPositionAvailable={isPositionAvailable}
                  setPositionDetails={setPositionDetails}
                  theme={props.theme}
                  {...props}
                />
              </Tab>
              {isPositionAvailable ? (
                <Tab eventKey="remove" title="Remove">
                  <RemoveLiquidityNew
                    theme={props.theme}
                    walletAddress={props.walletAddress}
                    connecthWallet={props.connecthWallet}
                    tokenIn={tokenIn}
                    tokenOut={tokenOut}
                    handleTokenType={handleTokenType}
                    swapData={swapData}
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
                    loaderInButton={loaderInButton}
                    setLoaderInButton={setLoaderInButton}
                    isStableSwap={false}
                    setShowConfirmTransaction={setShowConfirmTransaction}
                    showConfirmTransaction={showConfirmTransaction}
                    positionDetails={positionDetails}
                    setPositionAvailable={setPositionAvailable}
                    isPositionAvailable={isPositionAvailable}
                    setPositionDetails={setPositionDetails}
                  />
                </Tab>
              ) : null}
            </Tabs>
            <div className="transaction-setting-lq">
              <TransactionSettings
                recepient={recepient}
                slippage={slippage}
                setSlippage={setSlippage}
                setRecepient={setRecepient}
                walletAddress={props.walletAddress}
              />
            </div>
          </div>
        </Col>
      ) : (
        <LiquidityPositions walletAddress={props.walletAddress} />
      )}
      <LiquidityModal
        show={show}
        activeTab={activeTab}
        onHide={handleClose}
        selectToken={selectToken}
        tokens={liquidityTokens}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType={tokenType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </Container>
  );
};

export default LiquidityNew;

LiquidityNew.propTypes = {
  connecthWallet: PropTypes.any,
  walletAddress: PropTypes.any,
  theme: PropTypes.any,
  setTokenIn: PropTypes.any,
  setTokenOut: PropTypes.any,
  tokenIn: PropTypes.any,
  tokenOut: PropTypes.any,
  tokens: PropTypes.any,
  isStableSwap: PropTypes.any,
};
