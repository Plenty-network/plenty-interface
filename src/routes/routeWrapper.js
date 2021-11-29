import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import Routes from './routes';
import FirstTimeDisclaimer from '../Pages/FirstTimeDisclaimer/FirstTimeDisclaimer';
import { FIRST_TIME_DISCLAIMER } from '../constants/localStorage';

const WrappedRoute = (props) => {
  const [isDisclaimerAccepted, setDisclaimerAccepted] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(FIRST_TIME_DISCLAIMER) !== 'true') {
      setDisclaimerAccepted(false);
    }
  }, []);

  return (
    <Provider store={props.store}>
      {isDisclaimerAccepted ? <Routes /> : <FirstTimeDisclaimer />}
    </Provider>
  );
};

WrappedRoute.propTypes = {
  store: PropTypes.object,
};

export default WrappedRoute;
