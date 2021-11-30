import PropTypes from 'prop-types';
import React from 'react';
import Header from '../Components/Header/Header';
import { useSelector } from 'react-redux';

const OtherPages = (props) => {
  const userAddress = useSelector((state) => state.wallet.address);
  return (
    <React.Suspense fallback={<div />}>
      <div>
        <Header
          toggleTheme={props.toggleTheme}
          theme={props.theme}
          connecthWallet={props.connectWallet}
          disconnectWallet={props.disconnectUserWallet}
          walletAddress={userAddress}
        />
        {props.children}
      </div>
    </React.Suspense>
  );
};

OtherPages.propTypes = {
  children: PropTypes.element,
  connectWallet: PropTypes.func.isRequired,
  disconnectUserWallet: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  userAddress: PropTypes.string,
};

export default OtherPages;
