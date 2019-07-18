import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card, InputGroup, Toaster, Intent, Position, Tooltip, Button,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Table from 'components/common/Table';
import Information from 'components/Information';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';
import NodeSelect from 'components/NodeSelect';
import formatter from 'utils/formatter';

import { getChains, search } from './actions';
import './index.scss';

const MOCK_UP_NODE = {
  name: '',
  host: '',
  port: '',
  status: '',
  chains: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
};

class Chains extends Component {
  state = {
    searchValue: '',
  };

  refHandlers = {
    toaster: (ref) => {
      this.toaster = ref;
    },
  };

  componentDidMount() {
    this.getNode();
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getChains(this.nodeName, true));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: prevMatch, node: prevNode, searching: prevSearching } = prevProps;
    const {
      match, node, searchResult, searching, history,
    } = this.props;
    const prevNodeName = prevMatch.params.name || _.get(prevNode, 'name');
    const currentNodeName = match.params.name || _.get(node, 'name');

    if (prevNodeName !== currentNodeName) {
      this.getNode();
    }

    if (prevSearching && !searching) {
      if (searchResult) {
        if (searchResult.type === 'block') {
          history.push(`/nodes/${node.name}/blocks/${searchResult.data.hash}`);
        } else {
          history.push(`/nodes/${node.name}/transactions/${searchResult.data.hash}`);
        }
      } else {
        this.toaster.show({
          intent: Intent.DANGER,
          message: 'Not found.',
        });
      }
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
      actions.getChains(nodeName);
    }

    this.nodeName = nodeName;
  }

  onSearchInputChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  onSearch = (e) => {
    e.preventDefault();

    const { actions } = this.props;
    const { searchValue } = this.state;
    actions.search(this.nodeName, searchValue);
  };

  renderSearch() {
    return (
      <form className="node-actions" onSubmit={this.onSearch}>
        <InputGroup
          className="search-wrapper"
          onChange={this.onSearchInputChange}
          placeholder="Block hash, tx hash or block number"
          round
        />
        <Tooltip
          content="Use format <shard_index>:<block_number> to search block by block number"
          position={Position.LEFT}
        >
          <Button icon="help" minimal />
        </Tooltip>
      </form>
    );
  }


  renderNodeSelector() {
    const { nodes, node, history } = this.props;

    return (
      <NodeSelect node={node} nodes={nodes} baseUrl="nodes" history={history} />
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
        formatter: formatter.formatNumber,
      }, {
        key: 'totalTxs',
        displayName: 'Total Txs',
        formatter: formatter.formatNumber,
      }, {
        key: 'epoch',
        displayName: 'Epoch',
        formatter: formatter.formatNumber,
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
        value: formatter.formatNumber(node.totalBlocks),
      }, {
        title: 'Status',
        value: node.status,
      },
    ];

    return (
      <div className="blocks">
        <Toaster ref={this.refHandlers.toaster} position={Position.TOP_RIGHT} timeout={2000} />
        <Information
          className={gettingChains ? 'bp3-skeleton' : ''}
          fields={fields}
          rightPart={this.renderSearch()}
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
    search: PropTypes.func.isRequired,
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
  searching: PropTypes.bool.isRequired,
  searchResult: PropTypes.shape({
    data: PropTypes.shape({
      hash: PropTypes.string,
    }),
    type: PropTypes.oneOf([
      'block',
      'transaction',
    ]),
  }),
};

Chains.defaultProps = {
  searchResult: null,
};

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.ChainsReducer.get('node'),
  gettingChains: state.ChainsReducer.get('gettingChains'),
  searching: state.ChainsReducer.get('searching'),
  searchResult: state.ChainsReducer.get('searchResult'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getChains,
    search,
  }, dispatch),
});

const wrappedChains = consumeRefreshContext(refreshOnInterval(Chains));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedChains);
