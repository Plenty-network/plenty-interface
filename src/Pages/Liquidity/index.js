import PropTypes from 'prop-types';
import clsx from 'clsx';
import React, { useMemo, useEffect, useState } from 'react';
import { Col, Container } from 'react-bootstrap';
import { Tab, Tabs } from 'react-bootstrap';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../../assets/scss/animation.scss';
import AddLiquidity from './AddLiquidity';
import '../../assets/scss/partials/_wrappedAssets.scss';
import config from '../../config/config';
import { useLocationStateInLiquidity } from '../Swap/hooks/useLocationStateLiquidity';
import { getUserBalanceByRpc, fetchtzBTCBalance, getTokenPrices } from '../../apis/swap/swap';
import { loadSwapData } from '../../apis/swap/swap-v2';
import RemoveLiquidity from './RemoveLiquidity';
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
import SettingsLiq from '../../Components/TransactionSettings/SettingsLiq';
import { loadSwapDataGeneralStable } from '../../apis/stableswap/generalStableswap';
import CONFIG from '../../config/config';
import eurl from '../../assets/images/eurl.png';
import ageure from '../../assets/images/ageure.png';

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

  const [balanceUpdate, setBalanceUpdate] = useState(false);

  useEffect(async () => {
    const isStable = isTokenPairStable(tokenIn.name, tokenOut.name);

    const ress = await getLpTokenBalanceForPair(tokenIn.name, tokenOut.name, props.walletAddress);

    setPositionAvailable(ress.isLiquidityAvailable);
    if (ress.isLiquidityAvailable) {
      let res;
      if (isStable) {
        if (CONFIG.AMM[CONFIG.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]?.type === 'xtz') {
          res = await getLiquidityPositionDetailsStable(
            tokenIn.name,
            tokenOut.name,
            props.walletAddress,
          );
        } else if (
          CONFIG.AMM[CONFIG.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]?.type === 'veStableAMM'
        ) {
          res = await getLiquidityPositionDetails(tokenIn.name, tokenOut.name, props.walletAddress);
        }
      } else {
        res = await getLiquidityPositionDetails(tokenIn.name, tokenOut.name, props.walletAddress);
      }

      setPositionDetails(res);
    }
  }, [tokenIn, tokenOut, props]);

  useEffect(() => {
    setLoaderInButton(true);

    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
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
    setSearchQuery('');
  };

  useEffect(() => {
    const updateBalance = async () => {
      if (props.walletAddress) {
        setTokenContractInstances({});

        const tzBTCName = 'tzBTC';
        const balancePromises = [];

        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(
              config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'xtz'
                ? getUserBalanceByRpcStable(tokenIn.name, props.walletAddress)
                : getUserBalanceByRpc(tokenIn.name, props.walletAddress),
            );

        tokenOut.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(
              config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'xtz'
                ? getUserBalanceByRpcStable(tokenOut.name, props.walletAddress)
                : getUserBalanceByRpc(tokenOut.name, props.walletAddress),
            );

        if (
          config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'xtz'
            ? config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
        ) {
          const lpToken = isTokenPairStable(tokenIn.name, tokenOut.name)
            ? config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name]
                .liquidityToken
            : config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name].liquidityToken;

          balancePromises.push(
            config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'xtz'
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
  }, [tokenIn, tokenOut, props, balanceUpdate]);

  const selectToken = (token) => {
    setLoaderInButton(true);

    setSwapData({});

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
      } else if (token.name === 'EURL') {
        setTokenOut({
          name: 'agEUR.e',
          image: ageure,
        });
      } else if (token.name === 'agEUR.e') {
        setTokenOut({
          name: 'EURL',
          image: eurl,
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
          if (config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type === 'xtz') {
            loadSwapDataStable(tokenIn.name, tokenOut.name).then((data) => {
              if (data.success) {
                setSwapData(data);

                setLoaderInButton(false);
              }
            });
          } else if (
            config.AMM[config.NETWORK][tokenIn.name]?.DEX_PAIRS[tokenOut.name]?.type ===
            'veStableAMM'
          ) {
            loadSwapDataGeneralStable(tokenIn.name, tokenOut.name).then((data) => {
              if (data.success) {
                setSwapData(data);

                setLoaderInButton(false);
              }
            });
          } else {
            loadSwapData(tokenIn.name, tokenOut.name).then((data) => {
              if (data.success) {
                setSwapData(data);

                setLoaderInButton(false);
              }
            });
          }
        }
      }
    }
  }, [tokenIn, tokenOut, activeTab, splitLocation[1]]);

  const handleTokenType = (type) => {
    setBalanceUpdate(false);
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
      {isLiquidityPosition && <div className="liq-label">Position overview</div>}

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
                <AddLiquidity
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
                  setBalanceUpdate={setBalanceUpdate}
                  balanceUpdate={balanceUpdate}
                  {...props}
                />
              </Tab>
              {/* {isPositionAvailable ? ( */}
              <Tab eventKey="remove" title="Remove">
                <RemoveLiquidity
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
              {/* ) : null} */}
            </Tabs>
            <div className="settings-liq">
              <SettingsLiq
                slippage={slippage}
                setSlippage={setSlippage}
                walletAddress={props.walletAddress}
                theme={props.theme}
              />
            </div>
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
