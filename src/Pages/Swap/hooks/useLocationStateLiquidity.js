import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import plenty from '../../../assets/images/logo_small.png';
import ctez from '../../../assets/images/ctez.png';
import config from '../../../config/config';
import { liquidityTokens } from '../../../constants/liquidityTokens';
import eurl from '../../../assets/images/eurl.png';
import ageure from '../../../assets/images/ageure.png';

export const useLocationStateInLiquidity = () => {
  const [tokenParams, setTokenParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenIn, setTokenIn] = useState({
    name: 'ctez',
    image: ctez,
  });
  const [tokenOut, setTokenOut] = useState({});
  useEffect(() => {
    setTokenOut({ name: 'PLENTY', image: plenty });
  }, []);
  useEffect(() => {
    if (tokenIn.name === 'tez') {
      setTokenOut({
        name: 'ctez',
        image: ctez,
      });
    } else if (tokenIn.name === 'EURL') {
      setTokenOut({
        name: 'agEUR.e',
        image: ageure,
      });
    } else if (tokenIn.name === 'agEUR.e') {
      setTokenOut({
        name: 'EURL',
        image: eurl,
      });
    }
  }, [tokenIn]);

  const AMMExists = useMemo(() => {
    if (tokenIn.name === 'tez')
      return !!config.STABLESWAP[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
    else return !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
  }, [tokenIn, tokenOut]);

  const activeTab = useMemo(() => {
    if (!location.pathname.includes('/liquidityPositions')) {
      return 'liquidity';
    }

    return 'liquidityPositions';
  }, [location.pathname]);

  const paramKeys = useMemo(() => {
    // if (activeTab === 'swap') {
    //   return { a: 'from', b: 'to' };
    // }

    return { a: 'tokenA', b: 'tokenB' };
  }, [activeTab]);

  const setActiveTab = (elem) => {
    if (elem) {
      navigate(`/${elem}`);

      if (elem === 'liquidity' && !AMMExists) {
        setTokenOut({});
      }
    }
  };

  useEffect(() => {
    setTokenParams(
      {
        ...(tokenIn.name ? { [paramKeys.a]: tokenIn.name } : {}),
        ...(tokenParams.get(paramKeys.b) ? { [paramKeys.b]: tokenParams.get(paramKeys.b) } : {}),
      },
      { replace: true },
    );
  }, [tokenIn]);

  useEffect(() => {
    setTokenParams(
      {
        ...(tokenParams.get(paramKeys.a) ? { [paramKeys.a]: tokenParams.get(paramKeys.a) } : {}),
        ...(tokenOut.name ? { [paramKeys.b]: tokenOut.name } : {}),
      },
      { replace: true },
    );
  }, [tokenOut]);

  useEffect(() => {
    const paramKey =
      location.pathname === '/swap' ? { a: 'from', b: 'to' } : { a: 'tokenA', b: 'tokenB' };

    const tokenInFromParam = tokenParams.get(paramKey.a);
    const tokenOutFromParam = tokenParams.get(paramKey.b);

    if (tokenInFromParam) {
      const tokenInDatum = liquidityTokens.find((token) => token.name === tokenInFromParam);

      if (tokenInDatum) {
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
      }
    }

    if (tokenOutFromParam) {
      const tokenOutDatum = liquidityTokens.find((token) => token.name === tokenOutFromParam);

      if (tokenOutDatum) {
        setTokenOut({
          name: tokenOutDatum.name,
          image: tokenOutDatum.image,
        });
      }
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
