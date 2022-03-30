import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import plenty from '../../../assets/images/logo_small.png';
import tez from '../../../assets/images/tez.png';
import ctez from '../../../assets/images/ctez.png';
//import config from '../../../config/config';
import { stableSwapTokens } from '../../../constants/stableSwapPage';

export const useLocationStateStable = () => {
  const [tokenParams, setTokenParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tokenIn, setTokenIn] = useState({
    name: 'PLENTY',
    image: plenty,
  });
  const [tokenInStable, setTokenInStable] = useState({
    name: 'CTEZ',
    image: ctez,
  });
  const [tokenOut, setTokenOut] = useState({});
  const [tokenOutStable, setTokenOutStable] = useState({
    name: 'TEZ',
    image: tez,
  });

  const tokenInLiquidity = {
    name: 'TEZ',
    image: tez,
  };
  const tokenOutLiquidity = {
    name: 'CTEZ',
    image: ctez,
  };

  // const AMMExists = useMemo(() => {
  //   return !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
  // }, [tokenIn, tokenOut]);

  const activeTab = useMemo(() => {
    if (location.pathname === '/Stableswap') {
      return 'Stableswap';
    }

    return 'liquidityStable';
  }, [location.pathname]);

  const paramKeys = useMemo(() => {
    if (activeTab === 'Stableswap') {
      return { a: 'from', b: 'to' };
    }

    return { a: 'tokenA', b: 'tokenB' };
  }, [activeTab]);

  const setActiveTab = (elem) => {
    if (elem) {
      navigate(`/${elem}`);

      if (elem === 'liquidityStable') {
        setTokenOut({});
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'Stableswap') {
      setTokenParams(
        {
          ...(tokenInStable.name ? { [paramKeys.a]: tokenInStable.name } : {}),
          ...(tokenParams.get(paramKeys.b) ? { [paramKeys.b]: tokenParams.get(paramKeys.b) } : {}),
        },
        { replace: true },
      );
    }
  }, [tokenInStable]);

  useEffect(() => {
    if (activeTab === 'Stableswap') {
      setTokenParams(
        {
          ...(tokenParams.get(paramKeys.a) ? { [paramKeys.a]: tokenParams.get(paramKeys.a) } : {}),
          ...(tokenOutStable.name ? { [paramKeys.b]: tokenOutStable.name } : {}),
        },
        { replace: true },
      );
    }
  }, [tokenOutStable]);

  useEffect(() => {
    if (activeTab === 'Stableswap') {
      const paramKey = location.pathname === '/Stableswap' && { a: 'from', b: 'to' };

      const tokenInFromParam = tokenParams.get(paramKey.a);
      const tokenOutFromParam = tokenParams.get(paramKey.b);

      if (tokenInFromParam) {
        const tokenInDatum = stableSwapTokens.find((token) => token.name === tokenInFromParam);

        if (tokenInDatum) {
          setTokenInStable({
            name: tokenInDatum.name,
            image: tokenInDatum.image,
          });
        }
      }

      if (tokenOutFromParam) {
        const tokenOutDatum = stableSwapTokens.find((token) => token.name === tokenOutFromParam);

        if (tokenOutDatum) {
          setTokenOutStable({
            name: tokenOutDatum.name,
            image: tokenOutDatum.image,
          });
        }
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
    tokenInStable,
    setTokenInStable,
    tokenOutStable,
    setTokenOutStable,
    tokenInLiquidity,
    tokenOutLiquidity,
  };
};
