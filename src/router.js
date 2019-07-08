import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from 'containers/App';
import configStore from 'utils/configStore';
import reducers from './reducers';

const store = configStore(reducers);

function AppRouter() {
  return (
    <Router>
      <Provider store={store}>
        <Route path="/" component={App} />
      </Provider>
    </Router>
  );
}

export default AppRouter;
