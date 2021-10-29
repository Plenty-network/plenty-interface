import React , {useEffect} from "react";
import Container from "react-bootstrap/Container";
import TokensHeader from "../../Components/TokensPage/TokensHeader";
import {tokenFetchingThunk} from "../../redux/slices/tokens/tokens.thunk";
import styles from "./tokens.module.scss";
import { connect } from 'react-redux';
import { element } from "prop-types";
const Tokens = (props) => {
  useEffect(() => {
    console.log('useEffect');
    props.fetchTokensData();
  },[])

  let tableData = []
  tableData.push(
    <p>{" - Symbol - "} {"24H Change - "} {"24H Volume - "} {"Liquidity - "}</p>
   )
  return (
    <Container fluid className={styles.tokens}>
      <TokensHeader
        toggleTheme={props.toggleTheme}
        theme={props.theme}
        connecthWallet={props.connectWallet}
        disconnectWallet={props.disconnectWallet}
        walletAddress={props.walletAddress}
      />

      <div className="w-100">
        <input className={styles.searchBar} />
      </div>
      {props.tokens.tokensData.isPresent ?
        
        props.tokens.tokensData.data.forEach(element => {
         tableData.push(
          <p>{element.symbol_token} {element.price_change_percentage} {element.volume_token} {element.liquidity}</p>
         )
        })
       : <p>loading</p>}
       {tableData}
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
    fetchTokensData : () => dispatch(tokenFetchingThunk()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Tokens);
