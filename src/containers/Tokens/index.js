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

import { getTokens } from './actions';
import './index.scss';
import MOCK_UP_NODE from './test_node.json';

class Tokens extends Component {
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
      actions.getTokens(nodeName);
    }

    this.nodeName = nodeName;
  }

  renderNodeSelector() {
    const { nodes, node, history } = this.props;

    return (
      <NodeSelect node={node} nodes={nodes} baseUrl="tokens" history={history} />
    );
  }

  render() {
    const { gettingTokens } = this.props;

    let { node } = this.props;
    if (gettingTokens) {
      node = MOCK_UP_NODE;
    }

    const columns = [
      {
        key: 'image',
        displayName: 'Token',
        formatter: value => (
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
        formatter: value => (value ? 'Yes' : 'No'),
      }, {
        key: 'amount',
        displayName: 'Amount',
        formatter: value => value.toLocaleString(),
      }, {
        key: 'txs',
        displayName: 'Txs',
        formatter: value => value || 0,
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

    const tokens = _.get(node, 'tokens') || [];

    return (
      <div className="tokens">
        <Information
          className={gettingTokens ? 'bp3-skeleton' : ''}
          fields={fields}
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

Tokens.propTypes = {
  actions: PropTypes.shape({
    getTokens: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    status: PropTypes.string,
    totalBlocks: PropTypes.number,
    tokens: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  gettingTokens: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.TokensReducer.get('node'),
  gettingTokens: state.TokensReducer.get('gettingTokens'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getTokens,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tokens);
