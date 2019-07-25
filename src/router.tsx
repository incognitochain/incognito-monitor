import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from 'containers/App';
import configStore from 'utils/configStore';
import reducers from './reducers';

const store = configStore(reducers);

function AppRouter() {
  return (
    <HashRouter>
      <Provider store={store}>
        <Route path="/" component={App} />
      </Provider>
    </HashRouter>
  );
}

export default AppRouter;
