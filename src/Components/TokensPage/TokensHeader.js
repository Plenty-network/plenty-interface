import PropTypes from 'prop-types';
import React from 'react';
import { TopGradientDiv } from '../../themes';
import Header from '../Header/Header';

const TokensHeader = ({ toggleTheme, theme, connectWallet, disconnectWallet, walletAddress }) => {
  return (
    <div className={'d-flex flex-column'}>
      <TopGradientDiv className={'row'}>
        <Header
          toggleTheme={toggleTheme}
          theme={theme}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          walletAddress={walletAddress}
          isGradientBgPage={true}
        />
        <div className={'d-flex align-items-center flex-column my-5 mx-auto text-white'}>
          <h3>Tokens</h3>
          <div>Tradable on Plenty</div>
        </div>
      </TopGradientDiv>
    </div>
  );
};

TokensHeader.propTypes = {
  connectWallet: PropTypes.any,
  disconnectWallet: PropTypes.any,
  theme: PropTypes.any,
  toggleTheme: PropTypes.any,
  walletAddress: PropTypes.any,
};

export default TokensHeader;
