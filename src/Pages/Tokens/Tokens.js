import React, { useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import TokensHeader from "../../Components/TokensPage/TokensHeader";
import { tokenFetchingThunk } from "../../redux/slices/tokens/tokens.thunk";
import styles from "./tokens.module.scss";
import { connect } from "react-redux";
import Table from "../../Components/Table/Table";
import Button from "../../Components/Ui/Buttons/Button";
import { PuffLoader } from "react-spinners";

const Tokens = (props) => {
  const columns = useMemo(
    () => [
      {
        Header: "",
        id: "1",
        accessor: (x) => <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>,
      },
      {
        Header: "Token",
        accessor: "symbol_token",
      },
      {
        Header: "Price",
        accessor: "token_price",
      },
      {
        Header: "24H Change",
        accessor: "price_change_percentage",
      },
      {
        Header: "24H Volume",
        accessor: "volume_change_percentage",
      },
      {
        Header: "Liquidity",
        accessor: "liquidity",
      },
      {
        Header: "",
        id: "trade",
        accessor: (x) => (
          <div>
            <Button className={styles.tradeBtn}>Trade</Button>
          </div>
        ),
      },
    ],
    []
  );
  useEffect(() => {
    props.fetchTokensData();
  }, []);

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
        <input className={styles.searchBar} />

        {props.tokens.data.length > 0 ? (
          <Table data={props.tokens.data} columns={columns} />
        ) : (
          <PuffLoader color={"#813CE1"} size={56} />
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    tokens : state.tokens
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTokensData: () => dispatch(tokenFetchingThunk()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
