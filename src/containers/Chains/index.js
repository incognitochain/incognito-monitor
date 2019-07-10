import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Card, InputGroup, MenuItem,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { TableLoadingOption } from '@blueprintjs/table';
import { Link } from 'react-router-dom';

import Table from 'components/common/Table';
import Information from 'components/Information';
import { getChains } from './actions';
import Node from './node';
import './index.scss';

function search(value) {
  console.debug(value);
}

const MOCK_UP_NODE = {
  name: 'Test',
  host: '127.0.0.1',
  port: 9000,
  status: 'Online',
  chains: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
};

class Chains extends Component {
  constructor(props) {
    super(props);

    // Use debounce to only call search when user stop inputting
    this.search = _.debounce(search, 500);
  }

  componentDidMount() {
    this.getNode();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: prevMatch, node: prevNode } = prevProps;
    const { match, node } = this.props;
    const prevNodeName = prevMatch.params.name || _.get(prevNode, 'name');
    const currentNodeName = match.params.name || _.get(node, 'name');

    console.debug(prevNodeName, currentNodeName);
    if (prevNodeName !== currentNodeName) {
      this.getNode();
    }
  }

  onSearchInputChange = (e) => {
    const { value } = e.target;

    this.search(value);
  };

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
  }

  // eslint-disable-next-line class-methods-use-this
  renderSearch() {
    return null;

    // return (
    //   <div className="node-actions">
    //     <InputGroup
    //       className="search-wrapper"
    //       onChange={this.onSearchInputChange}
    //       placeholder="Search for block numbers"
    //       round
    //     />
    //   </div>
    // );
  }

  renderNodeSelector() {
    const { nodes, node } = this.props;

    if (_.isEmpty(node)) {
      return <div className="field-value">{MOCK_UP_NODE.name}</div>;
    }

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
          text={node.name}
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

    const {
      chains, host, port, totalBlocks, status,
    } = node;

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
        value: host,
      }, {
        title: 'Port',
        value: port,
      }, {
        title: 'Total blocks',
        value: totalBlocks,
      }, {
        title: 'Status',
        value: status,
      },
    ];

    return (
      <div className="blocks">
        <Information
          className={gettingChains ? 'bp3-skeleton' : ''}
          fields={fields}
          rightPart={this.renderSearch()}
        />
        { !_.isEmpty(chains) && (
          <Card className="no-padding">
            <Table
              data={chains}
              columns={columns}
              skeletonHeight={10}
              loadingOptions={gettingChains ? [
                TableLoadingOption.CELLS,
                TableLoadingOption.ROW_HEADERS,
              ] : undefined}
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

export default connect(mapStateToProps, mapDispatchToProps)(Chains);
