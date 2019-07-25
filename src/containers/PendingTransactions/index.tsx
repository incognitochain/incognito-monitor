import React, { Component } from 'react';
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

import { getPendingTransactions } from 'containers/PendingTransactions/actions';
import './index.scss';
import MOCK_UP_NODE from './test_node.json';

type Props = {
  actions: any,
  match: any,
  nodes: any,
  node: any,
  gettingPendingTransactions: boolean,
  history: any,
  setRefreshAction: any,
}


class PendingTransactions extends Component<Props> {
  nodeId: string = '';

  componentDidMount() {
    this.getNode();
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getPendingTransactions(this.nodeId, true));
  }

  componentDidUpdate(prevProps: Props) {
    const { match: prevMatch, node: prevNode } = prevProps;
    const {
      match, node,
    } = this.props;
    const prevNodeId = prevMatch.params.nodeId || _.get(prevNode, 'id');
    const currentNodeId = match.params.nodeId || _.get(node, 'id');

    if (prevNodeId !== currentNodeId) {
      this.getNode();
    }
  }

  getNode() {
    const {
      match, nodes, actions, node,
    } = this.props;
    let nodeId = match.params.nodeId || _.get(node, 'id');

    if (!nodeId && _.isEmpty(node) && !_.isEmpty(nodes)) {
      nodeId = nodes[0].id;
    }

    if (nodeId !== _.get(node, 'id')) {
      actions.getPendingTransactions(nodeId);
    }

    this.nodeId = nodeId;
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
        formatter: (value: any) => (
          <Link to={`/nodes/${node.id}/transactions/${value}`}>
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
        value: _.get(node, 'host'),
      }, {
        title: 'Port',
        value:  _.get(node, 'port'),
      }, {
        title: 'Status',
        value:  _.get(node, 'status'),
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

const mapStateToProps = (state: any) => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.PendingTransactionsReducer.get('node.ts.tsx'),
  gettingPendingTransactions: state.PendingTransactionsReducer.get('gettingPendingTransactions'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getPendingTransactions,
  }, dispatch),
});

const wrappedPendingTransactions = consumeRefreshContext(refreshOnInterval(PendingTransactions));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedPendingTransactions);
