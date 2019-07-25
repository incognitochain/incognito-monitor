import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';

import Information from 'components/Information';
import NodeSelect from 'components/NodeSelect';
import formatter from 'utils/formatter';

import { getCommittees } from 'containers/Committees/actions';
import './index.scss';
import MOCK_UP_NODE from './test_node.json';

type Props = {
  actions: any,
  match: any,
  nodes: any,
  node: any,
  gettingCommittees: boolean,
  history: any,
}

class Committees extends Component<Props> {
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
      actions.getCommittees(nodeId);
    }

    this.nodeId = nodeId;
  }

  renderNodeSelector() {
    const { nodes, node, history } = this.props;

    return (
      <NodeSelect node={node} nodes={nodes} baseUrl="committees" history={history} />
    );
  }

  render() {
    const { gettingCommittees } = this.props;

    let { node } = this.props;
    if (gettingCommittees) {
      node = MOCK_UP_NODE;
    }

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
      }, {
        title: 'Epoch',
        value: formatter.formatNumber(_.get(node, 'epoch', 0)),
      },
    ];

    const committees = _.get(node, 'committees', {});

    return (
      <div className={`committees ${gettingCommittees ? 'bp3-skeleton' : ''}`}>
        <Information
          className={gettingCommittees ? 'bp3-skeleton' : ''}
          fields={fields}
        />
        <Card className="p-10">
          <h4>Beacon Committees</h4>
          {_.get(committees, 'beacon', []).map((value: any, index: number) => (
            <div key={value} className="flex cards">
              <Card className="title p-10">#{index + 1}</Card>
              <Card className="value text-overflow p-10">{value}</Card>
            </div>
          ))}
        </Card>
        {_.map(committees.shards, (shardCommittees, shardIndex) => (
          <Card className="p-10">
            <h4>Shard #{_.toInteger(shardIndex) + 1} Committees</h4>
            {_.map(shardCommittees, (value, index) => (
              <div key={value} className="flex cards">
                <Card className="title p-10">#{index + 1}</Card>
                <Card className="value text-overflow p-10">{value}</Card>
              </div>
            ))}
          </Card>
        ))}
        <Card className="p-10">
          <h4>Beacon Pending Committees</h4>
          {_.get(committees, 'beaconPendings', []).map((value: any, index: number) => (
            <div key={value} className="flex cards">
              <Card className="title p-10">#{index + 1}</Card>
              <Card className="value text-overflow p-10">{value}</Card>
            </div>
          ))}
        </Card>
        {_.map(committees.shardPendings, (committee, shardIndex) => (
          <Card className="p-10">
            <h4>Shard Pending #{_.toInteger(shardIndex) + 1} Committees</h4>
            {_.map(committee, (value, index) => (
              <div key={value} className="flex cards">
                <Card className="title p-10">#{index + 1}</Card>
                <Card className="value text-overflow p-10">{value}</Card>
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.CommitteesReducer.get('node.ts.tsx'),
  gettingCommittees: state.CommitteesReducer.get('gettingCommittees'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getCommittees,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
