import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import plenty from '../../../assets/images/logo_small.png';
import config from '../../../config/config';
import { SWAP_PAGE_ACTIVE_TAB } from '../../../constants/localStorage';
import { tokens } from '../../../constants/swapPage';

export const useLocationStateInSwap = () => {
  const [tokenParams, setTokenParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tokenIn, setTokenIn] = useState({
    name: 'PLENTY',
    image: plenty,
  });
  const [tokenOut, setTokenOut] = useState({});

  const AMMExists = useMemo(() => {
    return !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
  }, [tokenIn, tokenOut]);

  const activeTab = useMemo(() => {
    if (location.pathname === '/swap') {
      return 'swap';
    }

    return 'liquidity';
  }, [location.pathname]);

  const paramKeys = useMemo(() => {
    if (activeTab === 'swap') {
      return { a: 'from', b: 'to' };
    }

    return { a: 'tokenA', b: 'tokenB' };
  }, [activeTab]);

  const setActiveTab = (elem) => {
    if (elem) {
      navigate(`/${elem}`);

      if (elem === 'liquidity' && !AMMExists) {
        setTokenOut({});
      }

      localStorage.setItem(SWAP_PAGE_ACTIVE_TAB, elem);
    }
  };

  useEffect(() => {
    setTokenParams({
      ...(tokenIn.name ? { [paramKeys.a]: tokenIn.name } : {}),
      ...(tokenParams.get(paramKeys.b) ? { [paramKeys.b]: tokenParams.get(paramKeys.b) } : {}),
    });
  }, [tokenIn]);

  useEffect(() => {
    setTokenParams({
      ...(tokenParams.get(paramKeys.a) ? { [paramKeys.a]: tokenParams.get(paramKeys.a) } : {}),
      ...(tokenOut.name ? { [paramKeys.b]: tokenOut.name } : {}),
    });
  }, [tokenOut]);

  useEffect(() => {
    const paramKey =
      location.pathname === '/swap' ? { a: 'from', b: 'to' } : { a: 'tokenA', b: 'tokenB' };

    const tokenInFromParam = tokenParams.get(paramKey.a);
    const tokenOutFromParam = tokenParams.get(paramKey.b);

    if (tokenInFromParam) {
      const tokenInDatum = tokens.find((token) => token.name === tokenInFromParam);

      if (tokenInDatum) {
        setTokenIn({
          name: tokenInDatum.name,
          image: tokenInDatum.image,
        });
      }
    }

    if (tokenOutFromParam) {
      const tokenOutDatum = tokens.find((token) => token.name === tokenOutFromParam);

      if (tokenOutDatum) {
        setTokenOut({
          name: tokenOutDatum.name,
          image: tokenOutDatum.image,
        });
      }
    }

    const activeTabFromLS = localStorage.getItem(SWAP_PAGE_ACTIVE_TAB);

    if (activeTabFromLS && !location.pathname.match('add|remove')) {
      navigate(`/${activeTabFromLS}`);
    }
  }, []);

  return { activeTab, setActiveTab, tokenIn, setTokenIn, tokenOut, setTokenOut };
};
