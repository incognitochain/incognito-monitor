import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Card, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Link } from 'react-router-dom';

import Table from 'components/common/Table';
import Information from 'components/Information';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';
import { getChains } from './actions';
import Node from './node';
import './index.scss';

const MOCK_UP_NODE = {
  name: '',
  host: '',
  port: '',
  status: '',
  chains: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
};

class Chains extends Component {
  componentDidMount() {
    this.getNode();
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getChains(this.nodeName, true));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: prevMatch, node: prevNode } = prevProps;
    const { match, node } = this.props;
    const prevNodeName = prevMatch.params.name || _.get(prevNode, 'name');
    const currentNodeName = match.params.name || _.get(node, 'name');

    if (prevNodeName !== currentNodeName) {
      this.getNode();
    }
  }

  onNodeChange = (newNode) => {
    const { history } = this.props;
    history.push(`/nodes/${newNode.name}`);
  };

  getNode() {
    const {
      match, nodes, actions, node,
    } = this.props;
    let nodeName = match.params.name || _.get(node, 'name');

    if (!nodeName && _.isEmpty(node) && !_.isEmpty(nodes)) {
      nodeName = nodes[0].name;
    }

    if (nodeName !== _.get(node, 'name')) {
      actions.getChains(nodeName);
    }

    this.nodeName = nodeName;
  }

  renderNodeSelector() {
    const { nodes, node } = this.props;

    return (
      <Select
        items={nodes}
        itemRenderer={Node}
        noResults={<MenuItem disabled text="No results." />}
        onItemSelect={this.onNodeChange}
        filterable={false}
      >
        <Button
          minimal
          text={_.get(node, 'name')}
          rightIcon="double-caret-vertical"
          className="no-padding field-value"
        />
      </Select>
    );
  }

  render() {
    const { gettingChains } = this.props;

    let { node } = this.props;
    if (gettingChains) {
      node = MOCK_UP_NODE;
    }

    const columns = [
      {
        key: 'index',
        displayName: 'Name',
        formatter: value => (
          <Link to={`/nodes/${node.name}/chains/${value}`}>
            {value === -1 ? 'Beacon' : `Shard ${value + 1}`}
          </Link>
        ),
      }, {
        key: 'hash',
        displayName: 'Block hash',
        formatter: value => (
          <Link to={`/nodes/${node.name}/blocks/${value}`}>
            {value}
          </Link>
        ),
      }, {
        key: 'height',
        displayName: 'Height',
      }, {
        key: 'totalTxs',
        displayName: 'Total Txs',
      }, {
        key: 'epoch',
        displayName: 'Epoch',
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
        title: 'Total blocks',
        value: node.totalBlocks,
      }, {
        title: 'Status',
        value: node.status,
      },
    ];

    return (
      <div className="blocks">
        <Information
          className={gettingChains ? 'bp3-skeleton' : ''}
          fields={fields}
        />
        { !_.isEmpty(node.chains) && (
          <Card className="no-padding">
            <Table
              data={node.chains}
              columns={columns}
              skeletonHeight={10}
              loading={gettingChains}
            />
          </Card>
        ) }
      </div>
    );
  }
}

Chains.propTypes = {
  actions: PropTypes.shape({
    getChains: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    status: PropTypes.string,
    totalBlocks: PropTypes.number,
    chains: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      hash: PropTypes.string,
      height: PropTypes.number,
    })),
  }).isRequired,
  gettingChains: PropTypes.bool.isRequired,
  history: PropTypes.shape({}).isRequired,
  setRefreshAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.ChainsReducer.get('node'),
  gettingChains: state.ChainsReducer.get('gettingChains'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getChains,
  }, dispatch),
});

const wrappedChains = consumeRefreshContext(refreshOnInterval(Chains));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedChains);
