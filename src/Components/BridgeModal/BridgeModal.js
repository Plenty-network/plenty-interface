import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styles from './BridgeModal.module.scss';
import Button from '../Ui/Buttons/Button';
import { ReactComponent as Avalanche } from '../../assets/images/bridge/avalanche.svg';
import AvalancheRed from '../../assets/images/bridge/avalanche_red.svg';
import tezos from '../../assets/images/bridge/tezos.svg';
import arrowDown from '../../assets/images/bridge/arrow_down.svg';
import arrowUp from '../../assets/images/bridge/arrow_up.svg';
import { tokens } from '../../constants/swapPage';
import SwapModal from '../SwapModal/SwapModal';
import plenty from '../../assets/images/logo_small.png';
import { getTokenPrices, getUserBalanceByRpc, fetchtzBTCBalance } from '../../apis/swap/swap';
import config from '../../config/config';

const BridgeModal = (props) => {
  const [firstTokenAmount, setFirstTokenAmount] = useState();
  const [secondTokenAmount, setSecondTokenAmount] = useState();

  const [tokenIn, setTokenIn] = useState({
    name: 'PLENTY',
    image: plenty,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);

  const [userBalances, setUserBalances] = useState({});
  const [tokenType, setTokenType] = useState('tokenIn');
  const [getTokenPrice, setGetTokenPrice] = useState({});
  const tokenOut = {};
  useEffect(() => {
    const updateBalance = async () => {
      const userBalancesCopy = { ...userBalances };
      const tzBTCName = 'tzBTC';
      const balancePromises = [];
      if (!userBalancesCopy[tokenIn.name]) {
        tokenIn.name === tzBTCName
          ? balancePromises.push(fetchtzBTCBalance(props.walletAddress))
          : balancePromises.push(getUserBalanceByRpc(tokenIn.name, props.walletAddress));
      }
      if (!userBalancesCopy[tokenOut.name]) {
        tokenOut.name === tzBTCName
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
  }, [tokenIn]);
  useEffect(() => {
    //setLoading(true);
    //setLoaderInButton(true);
    getTokenPrices().then((tokenPrice) => {
      setGetTokenPrice(tokenPrice);
      //setLoading(false);
    });
  }, []);
  const getDollarValue = (amount, price) => {
    const calculatedValue = amount * price;
    if (calculatedValue < 100) {
      return calculatedValue.toFixed(2);
    }
    return Math.floor(calculatedValue);
  };
  const onClickAmount = () => {
    const value =
      userBalances[tokenIn.name].toLocaleString('en-US', {
        maximumFractionDigits: 20,
        useGrouping: false,
      }) ?? 0;
    handleFromTokenInput(value, 'tokenIn');
  };

  const handleFromTokenInput = (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setFirstTokenAmount('');
    } else {
      if (tokenType === 'tokenIn') {
        setFirstTokenAmount(input);
      }
    }
  };

  const handleToTokenInput = (input, tokenType) => {
    if (input === '' || isNaN(input)) {
      setSecondTokenAmount('');
    } else {
      if (tokenType === 'tokenIn') {
        setSecondTokenAmount(input);
      }
    }
  };

  const handleClose = () => {
    setShow(false);

    setSearchQuery('');
  };
  const handleTokenType = (type) => {
    setShow(true);
    setTokenType(type);
  };
  const setTransaction = (value) => {
    if (value) {
      props.setTransaction(value);
    }
  };
  const selectToken = (token) => {
    setFirstTokenAmount('');
    setSecondTokenAmount('');

    if (tokenType === 'tokenIn') {
      setTokenIn({
        name: token.name,
        image: token.image,
      });
    }
    handleClose();
  };
  return (
    <div
      className={`justify-content-center mx-auto col-20 col-md-10 col-lg-10 col-xl-10 ${styles.gov}`}
    >
      <div className={styles.border}>
        <div className={` ${styles.bridgeModal}`}>
          <div className={styles.resultsHeader}>
            <p className={styles.heading}>Bridge Tokens</p>
            <p
              className={styles.res}
              onClick={() => {
                setTransaction(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              View History
            </p>
          </div>
          <div className={`mb-3 ${styles.lineBottom} `}></div>
          <div className={`mt-2 ${styles.selectBox}`} onClick={() => handleTokenType('tokenIn')}>
            <div className="token-user-input-wrapper" style={{ textAlign: 'left' }}>
              <img src={tokenIn.image} className="button-logo" />
              {tokenIn.name}
            </div>
            <span className="span-themed material-icons-round">expand_more</span>
          </div>
          <div className={`mt-4 ${styles.from}`}>From</div>
          <div className={`mt-3 ${styles.selectBox} ${styles.inputSelectBox}`}>
            <div className="token-user-input-wrapper" style={{ textAlign: 'left' }}>
              <input
                type="text"
                className={styles.tokenUserInput}
                placeholder="0.0"
                value={firstTokenAmount}
                onChange={(e) => handleFromTokenInput(e.target.value, 'tokenIn')}
              />
            </div>

            <div className={styles.tokenSelector}>
              <img src={AvalancheRed} className="button-logo" />
              AVALANCHE{' '}
            </div>
          </div>

          {props.walletAddress ? (
            <div className="flex justify-between mb-5" style={{ flex: '0 0 100%' }}>
              <p
                className="wallet-token-balance"
                onClick={onClickAmount}
                style={{ cursor: 'pointer' }}
              >
                Balance:{' '}
                {userBalances[tokenIn.name] >= 0 ? (
                  userBalances[tokenIn.name]
                ) : (
                  <div className="shimmer">0.0000</div>
                )}{' '}
                <span className="max-btn">(Max)</span>
              </p>

              <p className="wallet-token-balance">
                ~$
                {getTokenPrice.success && firstTokenAmount
                  ? getDollarValue(firstTokenAmount, getTokenPrice.tokenPrice[tokenIn.name])
                  : '0.00'}
              </p>
            </div>
          ) : null}

          <div className={styles.arrowSwap}>
            <img src={arrowDown} alt={'arrowdown'} className={styles.arrow} />
            <img src={arrowUp} alt={'arrowup'} className={styles.arrow} />
          </div>

          <div className={`mt-5 ${styles.to}`}>To</div>
          <div className={`mt-3 ${styles.selectBox} ${styles.inputSelectBox}`}>
            <div className="token-user-input-wrapper" style={{ textAlign: 'left' }}>
              <p className={styles.toLabel}>you will receive</p>

              <input
                type="text"
                className={styles.tokenUserInput}
                placeholder="0.0"
                value={secondTokenAmount}
                onChange={(e) => handleToTokenInput(e.target.value, 'tokenIn')}
              />
            </div>

            <div className={styles.tokenSelector}>
              <img src={tezos} className="button-logo" />
              TEZOS{' '}
            </div>
          </div>

          <p className="mt-2 wallet-token-balance">Estimated fee: 100</p>
          <Button className={clsx('px-md-3', 'mt-3', 'w-100', 'connect-wallet-btn', 'button-bg')}>
            <div className={clsx('connect-wallet-btn')}>
              <div className="flex flex-row align-items-center">
                <Avalanche />
                <span className="ml-2">Connect to Avalanche wallet</span>
              </div>
            </div>
          </Button>
        </div>
      </div>

      <SwapModal
        show={show}
        activeTab="swap"
        onHide={handleClose}
        selectToken={selectToken}
        tokens={tokens}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        tokenType="tokenIn"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

BridgeModal.propTypes = {
  transaction: PropTypes.any,
  setTransaction: PropTypes.any,
  walletAddress: PropTypes.any,
};

export default BridgeModal;
