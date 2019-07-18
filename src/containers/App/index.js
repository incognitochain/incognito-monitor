import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';

import Navbar from 'components/Navbar';
import Nodes from 'containers/Nodes';
import Chains from 'containers/Chains';
import Blocks from 'containers/Chain';
import Block from 'containers/Block';
import Transaction from 'containers/Transaction';
import Committees from 'containers/Committees';
import Tokens from 'containers/Tokens';
import PendingTransactions from 'containers/PendingTransactions';
import RefreshContext from 'components/Contexts/RefreshContext';
import { getNodes } from 'containers/Nodes/actions';

import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      autoRefresh: false,
      refreshTime: 5000,
    };

    const { actions } = props;

    actions.getNodes();

    this.changeRefreshTime = _.debounce(this.changeRefreshTime, 500);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location: prevLocation } = prevProps;
    const { location: currentLocation, actions } = this.props;

    if (prevLocation.pathname !== '/' && currentLocation.pathname === '/') {
      actions.getNodes();
    }
  }

  onToggleAutoRefresh = () => {
    const { autoRefresh } = this.state;
    this.setState({ autoRefresh: !autoRefresh });
  };

  onChangeRefreshTime = (e) => {
    this.changeRefreshTime(e.target.value);
  };

  changeRefreshTime(newTime) {
    this.setState({
      refreshTime: newTime,
    });
  }

  render() {
    const { gettingNodes, location } = this.props;
    const { autoRefresh, refreshTime } = this.state;

    if (gettingNodes && location.pathname !== '/') {
      return <Spinner className="center-spinner" />;
    }

    return (
      <div className="App">
        <RefreshContext.Provider value={{
          autoRefresh,
          refreshTime,
        }}
        >
          <Navbar
            onToggleAutoRefresh={this.onToggleAutoRefresh}
            autoRefresh={autoRefresh}
            refreshTime={refreshTime}
            onChangeRefreshTime={this.onChangeRefreshTime}
          />
          <div className="app-content">
            <Route exact path="/(.*index.html)?" component={Nodes} />
            <Route exact path="/nodes/:name([a-zA-Z0-9 _-]*)/" component={Chains} />
            <Route exact path="/committees/:name([a-zA-Z0-9 _-]*)/" component={Committees} />
            <Route exact path="/nodes/:nodeName([a-zA-Z0-9 _-]+)/chains/:chainIndex" component={Blocks} />
            <Route exact path="/nodes/:nodeName([a-zA-Z0-9 _-]+)/blocks/:blockHash" component={Block} />
            <Route exact path="/nodes/:nodeName([a-zA-Z0-9 _-]+)/transactions/:transactionHash" component={Transaction} />
            <Route exact path="/pending-transactions/:name([a-zA-Z0-9 _-]*)" component={PendingTransactions} />
            <Route exact path="/tokens/:name([a-zA-Z0-9 _-]*)" component={Tokens} />
          </div>
        </RefreshContext.Provider>
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
