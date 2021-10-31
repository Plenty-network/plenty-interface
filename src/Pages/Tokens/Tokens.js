import React, { useEffect, useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import TokensHeader from "../../Components/TokensPage/TokensHeader";
import { tokenFetchingThunk } from "../../redux/slices/tokens/tokens.thunk";
import styles from "./tokens.module.scss";
import { connect } from "react-redux";
import Table from "../../Components/Table/Table";
import Button from "../../Components/Ui/Buttons/Button";
import { PuffLoader } from "react-spinners";
import { BsSearch, BsStar, BsStarFill } from "react-icons/bs";
import { FormControl, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

/* TODO
1. Favorite Token
2. Token Search
3. Token symbol
4. Token Picture
 */
const Tokens = (props) => {

  const positiveOrNegative = (value) => {
    if (Number(value) > 0) {
      return <span className={styles.greenText}>+{value}%</span>
    } else if (Number(value) < 0) {
      return <span className={styles.redText}>{value}%</span>
    } else {
      return value;
    }
  }

  const valueFormat = (value) => {
    if (value >= 100) {
      return Math.round(value).toLocaleString('en-US');
    }
      return value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }

  const stringSort = useMemo(
    () => (rowA, rowB, columnId) => {
        const a = String(rowA.values[columnId]).toLowerCase();
        const b = String(rowB.values[columnId]).toLowerCase();
        return a.localeCompare(b);
    }, []);

  const numberSort = useMemo(
  () => (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.values[columnId]);
      const b = parseFloat(rowB.values[columnId]);
      return a > b ? 1 : -1;
    }, []);

  const columns = useMemo(
    () => [
      {
        Header: (
          <div className="d-flex pl-2 align-items-center">
            <BsStar className="mx-3"/> <span className="ml-2">Token</span>
          </div>
        ),
        id: "token",
        accessor: "symbol_token",
        sortType: stringSort,
        Cell: (row) => (
          <div className="d-flex pl-2 align-items-center">
              <BsStar className="mx-3"/> <span className="ml-2">{row.value}</span>
          </div>
        ),
      },
      {
        Header: "Price",
        accessor: "token_price",
        sortType: numberSort,
        Cell: (row) => (
            <span>${valueFormat(row.value)}</span>
        ),
      },
      {
        Header: "24H Change",
        accessor: "price_change_percentage",
        sortType: numberSort,
        Cell: (row) => (
          <span>
            {positiveOrNegative(valueFormat(row.value))}
          </span>
        ),
      },
      {
        Header: "24H Volume",
        accessor: "volume_token",
        sortType: numberSort,
        Cell: (row) => (
          <span>${valueFormat(row.value)}</span>
        ),
      },
      {
        Header: "Liquidity",
        accessor: "liquidity",
        sortType: numberSort,
        Cell: (row) => (
          <span>${valueFormat(row.value)}</span>
        ),
      },
      {
        disableSortBy: true,
        Header: "",
        id: "trade",
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
    props.fetchTokensData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

  }, [searchQuery])

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
            className="rounded-right"
            value={searchQuery}
            onChange={(ev) => setSearchQuery(ev.target.value)}
          />
          <span className={styles.iconInside}>
              <BsSearch />
          </span>
        </InputGroup>

        {props.tokens.data.length > 0 ? (
          <div className="mb-5">
            <Table searchQuery={searchQuery} data={props.tokens.data} columns={columns} />
          </div>
        ) : (
          <PuffLoader color={"#813CE1"} size={56} />
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
