import { BsStar, BsStarFill } from 'react-icons/bs';
import { Image } from 'react-bootstrap';
import React, { useMemo } from 'react';
import clsx from 'clsx';

const TokensSymbol = ({ row, imgPath, editFavoriteTokenList, favoriteTokens, className }) => {
  const favIcon = useMemo(() => {
    if (favoriteTokens.includes(row.value)) {
      return (
        <BsStarFill
          onClick={() => editFavoriteTokenList(row.value)}
          className={clsx(className, 'selected', 'mx-3')}
        />
      );
    }

    return (
      <BsStar
        onClick={() => editFavoriteTokenList(row.value)}
        className={clsx(className, 'mx-3')}
      />
    );
  }, [favoriteTokens, row.value, className, editFavoriteTokenList]);

  return (
    <div className="d-flex pl-2 align-items-center">
      {favIcon} <Image src={imgPath?.url} height={32} width={32} alt={''} />
      <span className="ml-2">{row.value}</span>
    </div>
  );
};

const TokensSymbolHeader = () => {
  return (
    <div className="d-flex pl-2 align-items-center">
      <BsStar className="mx-3" /> <span className="ml-2">Token</span>
    </div>
  );
};

export { TokensSymbol };
