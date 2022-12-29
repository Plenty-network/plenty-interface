import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import ctez from '../../../assets/images/ctez.png';
import config from '../../../config/config';
import { tokens } from '../../../constants/swapPage';

export const useLocationStateInSwap = () => {
  const [tokenParams, setTokenParams] = useSearchParams();
  const navigate = useNavigate();

  const location = useLocation();

  const [tokenIn, setTokenIn] = useState(
    location.search.indexOf('=') >= 0
      ? location.search
          .slice(
            location.search.indexOf('=') + 1,
            location.search.indexOf('&') === -1
              ? location.search.length
              : location.search.indexOf('&'),
          )
          .toString() === ''
        ? {}
        : {
            name: location.search
              .slice(
                location.search.indexOf('=') + 1,
                location.search.indexOf('&') === -1
                  ? location.search.length
                  : location.search.indexOf('&'),
              )
              .toString(),
            image: `/assets/Tokens/${location.search
              .slice(
                location.search.indexOf('=') + 1,
                location.search.indexOf('&') === -1
                  ? location.search.length
                  : location.search.indexOf('&'),
              )
              .toString()}.png`,
          }
      : { name: 'ctez', image: ctez },
  );

  const [tokenOut, setTokenOut] = useState(
    location.search.indexOf('=') !== location.search.lastIndexOf('=')
      ? {
          name: location.search
            .slice(location.search.lastIndexOf('=') + 1, location.search.length)
            .toString(),
          image: `/assets/Tokens/${location.search
            .slice(location.search.lastIndexOf('=') + 1, location.search.length)
            .toString()}.png`,
        }
      : {},
  );

  const AMMExists = useMemo(() => {
    return !!config.AMM[config.NETWORK][tokenIn.name].DEX_PAIRS[tokenOut.name];
  }, [tokenIn, tokenOut]);

  const activeTab = useMemo(() => {
    if (location.pathname === '/swap') {
      return 'swap';
    }
  }, [location.pathname]);

  const paramKeys = useMemo(() => {
    if (activeTab === 'swap') {
      return { a: 'from', b: 'to' };
    }
  }, [activeTab]);

  const setActiveTab = (elem) => {
    if (elem) {
      navigate(`/${elem}`);

      if (elem === 'liquidity' && !AMMExists) {
        setTokenOut({});
      }
    }
  };

  // useEffect(() => {
  //   setTokenParams(
  //     {
  //       ...(tokenIn.name ? { [paramKeys.a]: tokenIn.name } : {}),
  //       ...(tokenParams.get(paramKeys.b) ? { [paramKeys.b]: tokenParams.get(paramKeys.b) } : {}),
  //     },
  //     { replace: true },
  //   );
  // }, [tokenIn]);

  useEffect(() => {
    setTokenParams(
      {
        ...(tokenIn.name
          ? { [paramKeys.a]: tokenIn.name }
          : { [paramKeys.a]: tokenParams.get(paramKeys.a) }),
        ...(tokenOut.name ? { [paramKeys.b]: tokenOut.name } : {}),
      },
      { replace: true },
    );
  }, [tokenIn, tokenOut]);

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
  }, [location.search]);

  return {
    activeTab,
    setActiveTab,
    tokenIn,
    setTokenIn,
    tokenOut,
    setTokenOut,
  };
};
