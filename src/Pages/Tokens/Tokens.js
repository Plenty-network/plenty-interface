import React, { useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container';
import TokensHeader from '../../Components/TokensPage/TokensHeader';
import { tokenFetchingThunk } from '../../redux/slices/tokens/tokens.thunk';
import styles from './tokens.module.scss';
import { connect } from 'react-redux';
import Table from '../../Components/Table/Table';
import Button from '../../Components/Ui/Buttons/Button';
import { PuffLoader } from 'react-spinners';
import { BsSearch, BsStar } from 'react-icons/bs';
import { FormControl, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/* TODO
1. Favorite Token
2. Token Search
3. Token symbol
4. Token Picture
 */
const Tokens = (props) => {
  const columns = useMemo(
    () => [
      {
        Header: (
          <div className="d-flex pl-2 align-items-center">
            <BsStar /> <span className="ml-2">Token</span>
          </div>
        ),
        id: 'token',
        accessor: (row) => (
          <div className="d-flex pl-2">
            <BsStar /> <span className="ml-2">{row.symbol_token}</span>
          </div>
        ),
      },
      {
        Header: 'Price',
        accessor: 'token_price',
      },
      {
        Header: '24H Change',
        accessor: 'price_change_percentage',
      },
      {
        Header: '24H Volume',
        accessor: 'volume_change_percentage',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
      },
      {
        Header: '',
        id: 'trade',
        accessor: (x) => (
          <Link to={`/swap?from=${x.symbol_token}`}>
            <Button className={styles.tradeBtn}>Trade</Button>
          </Link>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const fetchDataContinuously = () => {
      props.fetchTokensData();
    };

    fetchDataContinuously();
    const backgroundRefresh = setInterval(() => {
      fetchDataContinuously();
    }, 30 * 1000);

    return () => clearInterval(backgroundRefresh);
    //props.fetchTokensData();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container fluid className={styles.tokens}>
      <TokensHeader
        toggleTheme={props.toggleTheme}
        theme={props.theme}
        connecthWallet={props.connectWallet}
        disconnectWallet={props.disconnectWallet}
        walletAddress={props.walletAddress}
      />

      <div className="w-100 d-flex align-center flex-column">
        <InputGroup className={styles.searchBar}>
          <FormControl
            value={searchQuery}
            onChange={(ev) => setSearchQuery(ev.target.value)}
          />
          <InputGroup.Append>
            <InputGroup.Text>
              <BsSearch />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>

        {props.tokens.data.length > 0 ? (
          <div className="mb-5">
            <Table data={props.tokens.data} columns={columns} />
          </div>
        ) : (
          <PuffLoader color={'#813CE1'} size={56} />
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    tokens: state.tokens.tokensData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTokensData: () => dispatch(tokenFetchingThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
