import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from 'components/Navbar';
import Nodes from 'containers/Nodes';
import Blocks from 'containers/Blocks';

import './index.scss';

class App extends Component {
  render() {
    return (
      <div className="App bp3-dark">
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
