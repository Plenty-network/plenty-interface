import React from 'react';
import WrappedRoute from './routes/routeWrapper';
import store from './redux/store/store';

import './App.scss';

function App() {
  return (
    <>
      <WrappedRoute store={store} />
    </>
  );
}

export default App;
