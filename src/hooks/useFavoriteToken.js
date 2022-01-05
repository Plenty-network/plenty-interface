import { useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_FAVORITE_TOKENS, LIQUIDITY_FAVORITE_TOKENS } from '../constants/localStorage';

const useFavoriteToken = (page) => {
  const [isOnlyFavTokens, setIsOnlyFavTokens] = useState(false);
  const [favoriteTokens, setFavoriteTokens] = useState([]);

  const localStorageKey = useMemo(
    () => (page === 'token' ? TOKEN_FAVORITE_TOKENS : LIQUIDITY_FAVORITE_TOKENS),
    [page],
  );

  useEffect(() => {
    const localFavTokens = localStorage.getItem(localStorageKey)?.split(',') ?? [];
    setFavoriteTokens(localFavTokens);
  }, []);

  const editFavoriteTokenList = useCallback(
    (tokenSymbol) => {
      if (tokenSymbol == null) {
        return;
      }

      let updatedToken = [...favoriteTokens];

      if (updatedToken.includes(tokenSymbol)) {
        updatedToken = updatedToken.filter((x) => x !== tokenSymbol);
      } else {
        updatedToken = [...updatedToken, tokenSymbol];
      }

      localStorage.setItem(localStorageKey, updatedToken.join(','));
      setFavoriteTokens(updatedToken);
    },
    [favoriteTokens, setFavoriteTokens],
  );

  return { isOnlyFavTokens, setIsOnlyFavTokens, favoriteTokens, editFavoriteTokenList };
};

export { useFavoriteToken };
