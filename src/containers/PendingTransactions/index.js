import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';

import Information from 'components/Information';
import NodeSelect from 'components/NodeSelect';
import Table from 'components/common/Table';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';
import refreshOnInterval from 'components/HOC/refreshOnInterval';

import { getPendingTransactions } from './actions';
import './index.scss';
import MOCK_UP_NODE from './test_node.json';


class PendingTransactions extends Component {
  componentDidMount() {
    this.getNode();
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getPendingTransactions(this.nodeName, true));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: prevMatch, node: prevNode } = prevProps;
    const {
      match, node,
    } = this.props;
    const prevNodeName = prevMatch.params.name || _.get(prevNode, 'name');
    const currentNodeName = match.params.name || _.get(node, 'name');

    if (prevNodeName !== currentNodeName) {
      this.getNode();
    }
  }

  getNode() {
    const {
      match, nodes, actions, node,
    } = this.props;
    let nodeName = match.params.name || _.get(node, 'name');

    if (!nodeName && _.isEmpty(node) && !_.isEmpty(nodes)) {
      nodeName = nodes[0].name;
    }

    if (nodeName !== _.get(node, 'name')) {
      actions.getPendingTransactions(nodeName);
    }

    this.nodeName = nodeName;
  }

  renderNodeSelector() {
    const { nodes, node, history } = this.props;

    return (
      <NodeSelect node={node} nodes={nodes} baseUrl="pending-transactions" history={history} />
    );
  }

  render() {
    const { gettingPendingTransactions } = this.props;

    let { node } = this.props;
    if (gettingPendingTransactions) {
      node = MOCK_UP_NODE;
    }

    const columns = [
      {
        key: 'hash',
        displayName: 'Tx Hash',
        formatter: value => (
          <Link to={`/nodes/${node.name}/transactions/${value}`}>
            {value}
          </Link>
        ),
      }, {
        key: 'lockTime',
        displayName: 'Lock Time',
      },
    ];

    const fields = [
      {
        title: 'Node',
        value: this.renderNodeSelector(),
      }, {
        title: 'Host',
        value: node.host,
      }, {
        title: 'Port',
        value: node.port,
      }, {
        title: 'Status',
        value: node.status,
      },
    ];

    const transactions = _.get(node, 'transactions') || [];

    return (
      <div className="blocks">
        <Information
          className={gettingPendingTransactions ? 'bp3-skeleton' : ''}
          fields={fields}
        />
        <Card className="no-padding">
          <Table
            data={transactions}
            columns={columns}
            skeletonHeight={0}
            loading={gettingPendingTransactions}
          />
        </Card>
      </div>
    );
  }
}

PendingTransactions.propTypes = {
  actions: PropTypes.shape({
    getPendingTransactions: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    status: PropTypes.string,
    transactions: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  gettingPendingTransactions: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
  setRefreshAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.PendingTransactionsReducer.get('node'),
  gettingPendingTransactions: state.PendingTransactionsReducer.get('gettingPendingTransactions'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getPendingTransactions,
  }, dispatch),
});

const wrappedPendingTransactions = consumeRefreshContext(refreshOnInterval(PendingTransactions));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPendingTransactions);
