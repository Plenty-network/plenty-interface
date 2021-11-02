import { BsStar, BsStarFill } from 'react-icons/bs';
import React from 'react';
import clsx from 'clsx';

const TokensSymbol = ({ tokenSymbol, editFavoriteTokenList, favoriteTokens, className }) => {
  if (favoriteTokens.includes(tokenSymbol)) {
    return (
      <BsStarFill
        onClick={() => editFavoriteTokenList(tokenSymbol)}
        className={clsx(className, 'selected')}
      />
    );
  }

  return <BsStar onClick={() => editFavoriteTokenList(tokenSymbol)} className={clsx(className)} />;
};

const TokensSymbolHeader = ({ isOnlyFavTokens, setIsOnlyFavTokens, className }) => {
  if (isOnlyFavTokens) {
    return (
      <BsStarFill
        onClick={() => setIsOnlyFavTokens(false)}
        className={clsx(className, 'selected')}
      />
    );
  }

  return <BsStar onClick={() => setIsOnlyFavTokens(true)} className={clsx(className)} />;
};

export { TokensSymbol, TokensSymbolHeader };
