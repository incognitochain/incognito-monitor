import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import { RouteComponentProps } from 'react-router';
import { Dispatch } from 'redux';

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

type Actions = {
  getNodes: () => void,
}

type Props = {
  actions: Actions,
  gettingNodes: boolean,
  location: RouteComponentProps['location'],
}

type State = {
  autoRefresh: boolean,
  refreshTime: string,
  firstTimeLoaded: boolean,
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      autoRefresh: true,
      refreshTime: '5000',
      firstTimeLoaded: false,
    };

    const { actions } = props;

    actions.getNodes();


    this.changeRefreshTime = _.debounce(this.changeRefreshTime, 500);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { location: prevLocation, gettingNodes: prevLoading } = prevProps;
    const { location: currentLocation, actions, gettingNodes: loading } = this.props;

    if (prevLocation.pathname !== '/' && currentLocation.pathname === '/') {
      actions.getNodes();
    }

    if (prevLoading && !loading) {
      this.setState({ firstTimeLoaded: true });
    }
  }

  onToggleAutoRefresh = () => {
    const { autoRefresh } = this.state;
    this.setState({ autoRefresh: !autoRefresh });
  };

  onChangeRefreshTime = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    this.changeRefreshTime(target.value);
  };

  changeRefreshTime(newTime: string) {
    this.setState({
      refreshTime: newTime,
    });
  }

  render() {
    const { autoRefresh, refreshTime } = this.state;

    if (!this.state.firstTimeLoaded) {
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
            <Route exact path="/nodes/:nodeId([a-zA-Z0-9 _-]*)/" component={Chains} />
            <Route exact path="/committees/:nodeId([a-zA-Z0-9 _-]*)/" component={Committees} />
            <Route exact path="/nodes/:nodeId([a-zA-Z0-9 _-]+)/chains/:chainIndex" component={Blocks} />
            <Route exact path="/nodes/:nodeId([a-zA-Z0-9 _-]+)/blocks/:blockHash" component={Block} />
            <Route exact path="/nodes/:nodeId([a-zA-Z0-9 _-]+)/transactions/:transactionHash" component={Transaction} />
            <Route exact path="/pending-transactions/:nodeId([a-zA-Z0-9 _-]*)" component={PendingTransactions} />
            <Route exact path="/tokens/:nodeId([a-zA-Z0-9 _-]*)" component={Tokens} />
          </div>
        </RefreshContext.Provider>
      </div>
    );
  }
}

const mapStateToProps = (state: any): any => ({
  gettingNodes: state.NodesReducer.get('gettingNodes'),
});

const mapDispatchToProps = (dispatch: Dispatch<any>): object => ({
  actions: bindActionCreators({
    getNodes,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
