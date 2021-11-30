import PropTypes from 'prop-types';
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

TokensSymbol.propTypes = {
  className: PropTypes.any,
  editFavoriteTokenList: PropTypes.any,
  favoriteTokens: PropTypes.any,
  tokenSymbol: PropTypes.any,
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

TokensSymbolHeader.propTypes = {
  className: PropTypes.any,
  isOnlyFavTokens: PropTypes.any,
  setIsOnlyFavTokens: PropTypes.any,
};

export { TokensSymbol, TokensSymbolHeader };
