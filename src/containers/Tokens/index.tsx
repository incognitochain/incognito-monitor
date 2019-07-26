import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';

import Table from 'components/common/Table';
import formatter from 'utils/formatter';

import { getTokens } from 'containers/Tokens/actions';
import './index.scss';
import MOCK_UP_NODE from './test_node.json';
import NodeInformation from 'components/NodeInformation';

type Props = {
  actions: any,
  match: any,
  nodes: any,
  node: any,
  gettingTokens: boolean,
  history: any,
}

class Tokens extends Component<Props> {
  nodeId: string = '';

  componentDidMount() {
    this.getNode();
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
      actions.getTokens(nodeId);
    }

    this.nodeId = nodeId;
  }

  render() {
    const { gettingTokens, history, nodes } = this.props;

    let { node } = this.props;
    if (gettingTokens) {
      node = MOCK_UP_NODE;
    }

    const columns = [
      {
        key: 'image',
        displayName: 'Token',
        formatter: (value: any) => (
          <div className="token-img-wrapper">
            <img className="token-img" src={value} alt="token-img" />
          </div>
        ),
        width: 60,
      }, {
        key: 'name',
        displayName: 'Name',
      }, {
        key: 'symbol',
        displayName: 'Symbol',
      }, {
        key: 'isPrivacy',
        displayName: 'isPrivacy',
        formatter: (value: any) => (value ? 'Yes' : 'No'),
      }, {
        key: 'amount',
        displayName: 'Amount',
        formatter: formatter.formatNumber,
      }, {
        key: 'txs',
        displayName: 'Txs',
        formatter: (value: any) => value || 0,
      },
    ];

    const tokens = _.get(node, 'tokens') || [];

    return (
      <div className="tokens">
        <NodeInformation
          loading={gettingTokens}
          node={node}
          history={history}
          nodes={nodes}
          baseUrl="tokens"
        />
        <Card className="no-padding">
          <Table
            data={tokens}
            columns={columns}
            skeletonHeight={0}
            loading={gettingTokens}
            defaultRowHeight={60}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.TokensReducer.get('node'),
  gettingTokens: state.TokensReducer.get('gettingTokens'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getTokens,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
