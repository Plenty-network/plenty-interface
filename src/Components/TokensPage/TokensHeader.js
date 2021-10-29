import { FrontPageGradientDiv } from "../../themes";
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
      <FrontPageGradientDiv className={`row`}>
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
          <h1>Tokens</h1>
          <div>Available on Plenty</div>
        </div>
      </FrontPageGradientDiv>
    </div>
  );
};

export default TokensHeader;
