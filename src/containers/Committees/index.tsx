import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';

import NodeInformation from 'components/NodeInformation';

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

  render() {
    const { gettingCommittees, history, nodes } = this.props;

    let { node } = this.props;
    if (gettingCommittees) {
      node = MOCK_UP_NODE;
    }

    const committees = _.get(node, 'committees', {});

    return (
      <div className={`committees ${gettingCommittees ? 'bp3-skeleton' : ''}`}>
        <NodeInformation
          loading={gettingCommittees}
          node={node}
          history={history}
          nodes={nodes}
          baseUrl="committees"
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
  node: state.CommitteesReducer.get('node'),
  gettingCommittees: state.CommitteesReducer.get('gettingCommittees'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getCommittees,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
