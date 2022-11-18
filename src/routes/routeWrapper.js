import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import Routes from './routes';
import FirstTimeDisclaimer from '../Pages/FirstTimeDisclaimer/FirstTimeDisclaimer';
import { FIRST_TIME_DISCLAIMER, BRIDGES_CONFIG, BRIDGES_CONFIG_EXPIRY_TIME, BRIDGES_CONFIG_POLYGON_LOAD } from '../constants/localStorage';
import { loadConfiguration } from '../apis/Config/Config';

const WrappedRoute = (props) => {
  const [isDisclaimerAccepted, setDisclaimerAccepted] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(FIRST_TIME_DISCLAIMER) !== 'true') {
      setDisclaimerAccepted(false);
    }
  }, []);

  // Function to load the bridges config data from indexer on app load and store it for usage across app.
  useEffect(async () => {
    // Load only if not found in localStorage or if the TTL has expired.
    if (
      !localStorage.getItem(BRIDGES_CONFIG) ||
      new Date().getTime() > JSON.parse(localStorage.getItem(BRIDGES_CONFIG_EXPIRY_TIME)) ||
      !localStorage.getItem(BRIDGES_CONFIG_POLYGON_LOAD) ||
      localStorage.getItem(BRIDGES_CONFIG_POLYGON_LOAD) !== 'true'
    ) {
      const bridgeConfig = await loadConfiguration();
      if (bridgeConfig.success) {
        console.log('Successfully loaded bridge config.');
        localStorage.setItem(BRIDGES_CONFIG, JSON.stringify(bridgeConfig.data));
        localStorage.setItem(
          BRIDGES_CONFIG_EXPIRY_TIME,
          JSON.stringify(new Date().getTime() + 1000 * 60 * 60 * 1),
        );
        localStorage.setItem(BRIDGES_CONFIG_POLYGON_LOAD, JSON.stringify(true));
      } else {
        console.log(`Failed to load bridge config - ${bridgeConfig.error}.`);
      }
    } else {
      console.log('Bridge config already loaded.');
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