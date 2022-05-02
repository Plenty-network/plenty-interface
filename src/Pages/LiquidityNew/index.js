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
import { getUserBalanceByRpcStable, loadSwapDataStable } from '../../apis/stableswap/stableswap';

const LiquidityNew = (props) => {
  const { activeTab, tokenIn, setTokenIn, tokenOut, setTokenOut, setActiveTab } =
    useLocationStateInLiquidity();

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

  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const splitLocation = pathname.split('/');
  const [searchParams] = useSearchParams();
  const [isLiquidityPosition, setLiquidityPosition] = useState(false);
  const [positionDetails, setPositionDetails] = useState({});
  const [isPositionAvailable, setPositionAvailable] = useState(false);

  useEffect(() => {
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
  }, [tokenIn, tokenOut, props]);

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
    if (!location.pathname.includes('liquidityPositions')) {
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
      if (props.walletAddress) {
        setTokenContractInstances({});
        const userBalancesCopy = { ...userBalances };
        const tzBTCName = 'tzBTC';
        const balancePromises = [];
        if (!userBalancesCopy[tokenIn.name]) {
          tokenIn.name === tzBTCName
            ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
            : balancePromises.push(
                isTokenPairStable(tokenIn.name, tokenOut.name)
                  ? getUserBalanceByRpcStable(tokenIn.name, props.walletAddress)
                  : getUserBalanceByRpc(tokenIn.name, props.walletAddress),
              );
        }
        if (!userBalancesCopy[tokenOut.name]) {
          tokenOut.name === tzBTCName
            ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
            : balancePromises.push(
                isTokenPairStable(tokenIn.name, tokenOut.name)
                  ? getUserBalanceByRpcStable(tokenOut.name, props.walletAddress)
                  : getUserBalanceByRpc(tokenOut.name, props.walletAddress),
              );
        }
        if (
          isTokenPairStable(tokenIn.name, tokenOut.name)
            ? config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
        ) {
          const lpToken = isTokenPairStable(tokenIn.name, tokenOut.name)
            ? config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
                .liquidityToken
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

          balancePromises.push(
            isTokenPairStable(tokenIn.name, tokenOut.name)
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
        const pairExists = isTokenPairStable(tokenIn.name, tokenOut.name)
          ? !!config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
          : !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];

        if (pairExists) {
          isTokenPairStable(tokenIn.name, tokenOut.name)
            ? loadSwapDataStable(tokenIn.name, tokenOut.name).then((data) => {
                if (data.success) {
                  setSwapData(data);
                  //setLoading(false);
                  setLoaderInButton(false);
                }
              })
            : loadSwapData(tokenIn.name, tokenOut.name).then((data) => {
                if (data.success) {
                  setSwapData(data);
                  //setLoading(false);
                  setLoaderInButton(false);
                }
              });
        }
      }
    }
  }, [tokenIn, tokenOut, activeTab, splitLocation[1]]);

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
    // setSlippage(0.5);
    setRecepient('');
    setTokenType('tokenIn');
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

    value ? setActiveTab('liquidityPositions') : setActiveTab('liquidity');
  };

  // useEffect(() => {
  //   splitLocation[1] === 'liquidityPositions'
  //     ? setLiquidityPosition(true)
  //     : setLiquidityPosition(false);
  //   splitLocation[1] === 'liquidity' && setActiveTab('liquidity');
  // }, [splitLocation[1]]);

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
      {props.walletAddress && (
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
      )}
      {isLiquidityPosition && <div className="liq-label">Your Liquidity Positions</div>}
      {/* <div className="liq-label">{isLiquidityPosition ? 'Liquidity Positions' : 'Liquidity'}</div> */}
      {!isLiquidityPosition ? (
        <Col
          sm={8}
          md={6}
          className={clsx('liquidity-content-container', !props.walletAddress && 'liq-margin')}
        >
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
                    isStableSwap={isTokenPairStable(tokenIn.name, tokenOut.name)}
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
          </div>
        </Col>
      ) : (
        <LiquidityPositions walletAddress={props.walletAddress} theme={props.theme} />
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
