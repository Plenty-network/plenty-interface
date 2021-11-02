import { useCallback, useEffect, useState } from 'react';
import { FAVORITE_TOKENS } from '../../constants/localStorage';

const useFavoriteToken = () => {
  const [isOnlyFavTokens, setIsOnlyFavTokens] = useState(false);
  const [favoriteTokens, setFavoriteTokens] = useState([]);

  useEffect(() => {
    const localFavTokens = localStorage.getItem(FAVORITE_TOKENS)?.split(',') ?? [];
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

      localStorage.setItem(FAVORITE_TOKENS, updatedToken.join(','));
      setFavoriteTokens(updatedToken);
    },
    [favoriteTokens, setFavoriteTokens],
  );

  return { isOnlyFavTokens, setIsOnlyFavTokens, favoriteTokens, editFavoriteTokenList };
};

export { useFavoriteToken };
