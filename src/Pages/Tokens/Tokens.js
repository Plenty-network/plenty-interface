import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import styles from './tokens.module.scss';
import Table from '../../Components/Table/Table';
import Button from '../../Components/Ui/Buttons/Button';
import { PuffLoader } from 'react-spinners';
import { BsSearch } from 'react-icons/bs';
import { FormControl, Image, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SimpleLineChart from '../../Components/Charts/SimpleLineChart';
import { useFavoriteToken } from './useTokensPage';
import { TokensSymbol, TokensSymbolHeader } from '../../Components/TokensPage/TokensSymbol';
import { ReactComponent as FavoriteIconGradient } from '../../assets/images/tokens/favorite-icon-fill.svg';
import { useGet7DaysChangeQuery, useGetTokensQuery } from '../../redux/slices/tokens/tokens.query';

const Tokens = () => {
  const [imgPaths, setImgPath] = useState({});

  const {
    data = [],
    isLoading,
    error,
  } = useGetTokensQuery(undefined, {
    pollingInterval: 30_000,
  });

  const { data: priceChangeData = {}, isLoading: priceChangeLoading } = useGet7DaysChangeQuery(
    undefined,
    {
      pollingInterval: 30_000,
    },
  );

  const loadImageFor = useCallback(
    (token) => {
      // ? if token exists, abort
      if (imgPaths[token]) {
        return;
      }

      setImgPath((prev) => ({
        ...prev,
        [token]: {
          ...prev[token],
          loading: true,
        },
      }));

      import(`../../assets/images/tokens/${token}.png`).then((image) => {
        setImgPath((prev) => ({
          ...prev,
          [token]: {
            url: image['default'] ?? image,
            loading: false,
          },
        }));
      });
    },
    [imgPaths],
  );

  useEffect(() => {
    data.forEach((datum) => {
      loadImageFor(datum.symbol_token);
    });
  }, [loadImageFor, data]);

  const positiveOrNegative = (value) => {
    if (Number(value) > 0) {
      return <span className={styles.greenText}>+{value}%</span>;
    } else if (Number(value) < 0) {
      return <span className={styles.redText}>{value}%</span>;
    } else {
      return value;
    }
  };

  const valueFormat = (value, opt = {}) => {
    if (value >= 100) {
      return `${opt.percentChange ? '' : '$'}${Math.round(value).toLocaleString('en-US')}`;
    }

    if (!opt.percentChange && value < 0.01) {
      return '< $0.01';
    }
    return `${opt.percentChange ? '' : '$'}${value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  };

  const stringSort = useMemo(
    () => (rowA, rowB, columnId) => {
      const a = String(rowA.values[columnId]).toLowerCase();
      const b = String(rowB.values[columnId]).toLowerCase();
      return a.localeCompare(b);
    },
    [],
  );

  const numberSort = useMemo(
    () => (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.values[columnId]);
      const b = parseFloat(rowB.values[columnId]);
      return a > b ? 1 : -1;
    },
    [],
  );

  const { isOnlyFavTokens, setIsOnlyFavTokens, favoriteTokens, editFavoriteTokenList } =
    useFavoriteToken();

  // ? Move to React Table filter later
  const finalData = useMemo(() => {
    if (isOnlyFavTokens) {
      return data?.filter((datum) => favoriteTokens.includes(datum.symbol_token)) ?? [];
    }

    return data;
  }, [favoriteTokens, isOnlyFavTokens, data]);

  const columns = useMemo(
    () => [
      {
        Header: (
          <TokensSymbolHeader
            className={styles.favoriteIcon}
            isOnlyFavTokens={isOnlyFavTokens}
            setIsOnlyFavTokens={setIsOnlyFavTokens}
          />
        ),
        id: 'favorite',
        accessor: 'symbol_token',
        disableSortBy: true,
        Cell: (row) => (
          <TokensSymbol
            tokenSymbol={row.value}
            className={styles.favoriteIcon}
            favoriteTokens={favoriteTokens}
            editFavoriteTokenList={editFavoriteTokenList}
          />
        ),
      },
      {
        Header: <span className="ml-2">Name</span>,
        id: 'token',
        accessor: 'symbol_token',
        sortType: stringSort,
        Cell: (row) => (
          <div className="d-flex pl-2 align-items-center">
            <Image src={imgPaths[row.value]?.url} height={32} width={32} alt={''} />
            <span className="ml-2 mr-4">{row.value}</span>
          </div>
        ),
        width: 120,
      },
      {
        Header: 'Price',
        accessor: 'token_price',
        sortType: numberSort,
        Cell: (row) => <span title={row.value}>{valueFormat(row.value)}</span>,
      },
      {
        Header: '24h Change',
        accessor: 'price_change_percentage',
        sortType: numberSort,
        Cell: (row) => (
          <span>{positiveOrNegative(valueFormat(row.value, { percentChange: true }))}</span>
        ),
      },
      {
        Header: '24h Volume',
        accessor: 'volume_token',
        sortType: numberSort,
        Cell: (row) => <span>{valueFormat(row.value)}</span>,
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
        sortType: numberSort,
        Cell: (row) => <span>{valueFormat(row.value)}</span>,
      },
      {
        id: 'price7d',
        Header: 'Last 7 Days',
        accessor: 'symbol_token',
        Cell: (row) => {
          let value = [...(priceChangeData[row.value] ?? [])].reverse();

          if (priceChangeLoading) return <div />;

          if (value.length === 0) return <div>N/A</div>;

          const changePositive = value[value.length - 1].value >= value[0].value;

          if (value.length <= 38) {
            const timeData = priceChangeData.PLENTY.map((x) => ({
              ...x,
              value: undefined,
            })).reverse();
            value = [...timeData.filter((x) => x.time < value[0].time), ...value];
          }

          return (
            <SimpleLineChart
              data={value}
              color={changePositive ? '#4FBF67' : '#FF7A68'}
              className="mx-2"
            />
          );
        },
        minWidth: 170,
        disableSortBy: true,
      },
      {
        disableSortBy: true,
        Header: '',
        id: 'trade',
        accessor: (x) => (
          <Link style={{ textDecoration: 'none' }} to={`/swap?from=${x.symbol_token}`}>
            <Button color="primary" className={styles.tradeBtn}>
              Trade
            </Button>
          </Link>
        ),
        width: 120,
      },
    ],
    [
      isOnlyFavTokens,
      setIsOnlyFavTokens,
      stringSort,
      numberSort,
      favoriteTokens,
      editFavoriteTokenList,
      imgPaths,
      priceChangeData,
      priceChangeLoading,
    ],
  );

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Container fluid className={styles.tokens}>
        <div className="w-100 d-flex justify-content-between px-5 align-items-center">
          <h5 className="font-weight-bolder">Tokens</h5>
          <InputGroup className={styles.searchBar}>
            <InputGroup.Prepend>
              <InputGroup.Text className={`${styles.searchIcon} border-right-0`}>
                <BsSearch />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search"
              className={`shadow-none border-left-0 ${styles.searchBox}`}
              value={searchQuery}
              onChange={(ev) => setSearchQuery(ev.target.value)}
            />
          </InputGroup>
        </div>

        {data.length > 0 && (
          <div>
            <Table searchQuery={searchQuery} data={finalData} columns={columns} />
          </div>
        )}

        {data.length === 0 && (isLoading || error) && (
          <div className="d-flex justify-content-between w-100" style={{ height: 800 }}>
            <div className="m-auto">
              {error ? <div>Something went wrong</div> : <PuffLoader color={'#813CE1'} size={56} />}
            </div>
          </div>
        )}
      </Container>

      <FavoriteIconGradient />
    </>
  );
};

export default Tokens;
