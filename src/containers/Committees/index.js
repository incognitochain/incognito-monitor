import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';

import Information from 'components/Information';
import NodeSelect from 'components/NodeSelect';
import formatter from 'utils/formatter';

import { getCommittees } from './actions';
import './index.scss';
import MOCK_UP_NODE from './test_node.json';

class Committees extends Component {
  componentDidMount() {
    this.getNode();
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
      actions.getCommittees(nodeName);
    }

    this.nodeName = nodeName;
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
        value: node.host,
      }, {
        title: 'Port',
        value: node.port,
      }, {
        title: 'Status',
        value: node.status,
      }, {
        title: 'Epoch',
        value: formatter.formatNumber(node.epoch),
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
          {_.get(committees, 'beacon', []).map((value, index) => (
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
          {_.get(committees, 'beaconPendings', []).map((value, index) => (
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

Committees.propTypes = {
  actions: PropTypes.shape({
    getCommittees: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    status: PropTypes.string,
    committees: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  gettingCommittees: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.CommitteesReducer.get('node'),
  gettingCommittees: state.CommitteesReducer.get('gettingCommittees'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getCommittees,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Committees);
