import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Navbar from 'components/Navbar';

import './index.scss';
import Nodes from 'containers/Nodes';
import Blocks from 'containers/Blocks';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="app-content">
          <Route exact path="/" component={Nodes} />
          <Route path="/blocks/" component={Blocks} />
        </div>
      </div>
    );
  }
}

export default App;
