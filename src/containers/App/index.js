import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';

import Navbar from 'components/Navbar';
import Nodes from 'containers/Nodes';
import Chains from 'containers/Chains';
import Blocks from 'containers/Chain';
import Block from 'containers/Block';
import { getNodes } from 'containers/Nodes/actions';

import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);

    const { actions } = props;

    actions.getNodes();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location: prevLocation } = prevProps;
    const { location: currentLocation, actions } = this.props;

    if (prevLocation.pathname !== '/' && currentLocation.pathname === '/') {
      actions.getNodes();
    }
  }

  render() {
    const { gettingNodes, location } = this.props;

    if (gettingNodes && location.pathname !== '/') {
      return <Spinner className="center-spinner" />;
    }

    return (
      <div className="App">
        <Navbar />
        <div className="app-content">
          <Route exact path="/(.*index.html)?" component={Nodes} />
          <Route exact path="/nodes/:name([a-zA-Z0-9 _-]*)/" component={Chains} />
          <Route exact path="/nodes/:nodeName([a-zA-Z0-9 _-]+)/chains/:chainIndex" component={Blocks} />
          <Route exact path="/nodes/:nodeName([a-zA-Z0-9 _-]+)/blocks/:blockHash" component={Block} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  actions: PropTypes.shape({
    getNodes: PropTypes.func,
  }).isRequired,
  gettingNodes: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  gettingNodes: state.NodesReducer.get('gettingNodes'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getNodes,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
