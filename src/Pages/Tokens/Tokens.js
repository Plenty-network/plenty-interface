import React from "react";
import Container from "react-bootstrap/Container";
import TokensHeader from "../../Components/TokensPage/TokensHeader";

import styles from "./tokens.module.scss";

const Tokens = ({
  toggleTheme,
  theme,
  connectWallet,
  disconnectWallet,
  walletAddress,
}) => {
  return (
    <Container fluid className={styles.tokens}>
      <TokensHeader
        toggleTheme={toggleTheme}
        theme={theme}
        connecthWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        walletAddress={walletAddress}
      />

      <div className="w-100">
        <input className={styles.searchBar} />
      </div>
    </Container>
  );
};

export default Tokens;
