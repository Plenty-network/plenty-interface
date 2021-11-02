import {FrontPageGradientDiv, TopGradientDiv} from "../../themes";
import Header from "../Header/Header";

const TokensHeader = ({
  toggleTheme,
  theme,
  connectWallet,
  disconnectWallet,
  walletAddress,
}) => {
  return (
    <div className={`d-flex flex-column`}>
      <TopGradientDiv className={`row`}>
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          connecthWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          walletAddress={walletAddress}
          isFrontPage={true}
        />
        <div
          className={`d-flex align-items-center flex-column my-5 mx-auto text-white`}
        >
          <h3>Tokens</h3>
          <div>Tradable on Plenty</div>
        </div>
      </TopGradientDiv>
    </div>
  );
};

export default TokensHeader;
