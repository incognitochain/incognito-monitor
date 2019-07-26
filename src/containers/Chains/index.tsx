import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card, InputGroup, Toaster, Intent, Position, Tooltip, Button,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Table from 'components/common/Table';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';
import formatter from 'utils/formatter';

import { getChains, search } from 'containers/Chains/actions';
import './index.scss';
import NodeInformation from 'components/NodeInformation';

const MOCK_UP_NODE = {
  name: '',
  host: '',
  port: '',
  status: '',
  chains: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
};

type Props = {
  actions: any,
  match: any,
  nodes: any,
  node: any,
  gettingChains: any,
  history: any,
  setRefreshAction: any,
  searching: any,
  searchResult: any,
  data: any,
  type: any,
}

class Chains extends Component<Props> {
  state = {
    searchValue: '',
  };

  nodeId: string = '';

  private toaster: any;
  private refHandlers = {
    toaster: (ref: Toaster) => (this.toaster = ref),
  };

  componentDidMount() {
    this.getNode();
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getChains(this.nodeId, true));
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    const { match: prevMatch, node: prevNode, searching: prevSearching } = prevProps;
    const {
      match, node, searchResult, searching, history,
    } = this.props;
    const prevNodeId = prevMatch.params.nodeId || _.get(prevNode, 'id');
    const currentNodeId = match.params.nodeId || _.get(node, 'id');

    if (prevNodeId !== currentNodeId) {
      this.getNode();
    }

    if (prevSearching && !searching) {
      if (searchResult) {
        if (searchResult.type === 'block') {
          history.push(`/nodes/${node.id}/blocks/${searchResult.data.hash}`);
        } else {
          history.push(`/nodes/${node.id}/transactions/${searchResult.data.hash}`);
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
    let nodeId = match.params.nodeId || _.get(node, 'id');

    if (!nodeId && _.isEmpty(node) && !_.isEmpty(nodes)) {
      nodeId = nodes[0].id;
    }

    if (nodeId !== _.get(node, 'id')) {
      actions.getChains(nodeId);
    }

    this.nodeId = nodeId;
  }

  onSearchInputChange = (e: any) => {
    this.setState({ searchValue: e.target.value });
  };

  onSearch = (e: any) => {
    e.preventDefault();

    const { actions } = this.props;
    const { searchValue } = this.state;
    actions.search(this.nodeId, searchValue);
  };

  renderSearch(): any {
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

  render() {
    const { gettingChains, nodes, history } = this.props;

    let { node } = this.props;
    if (gettingChains || !node) {
      node = MOCK_UP_NODE;
    }

    const columns = [
      {
        key: 'index',
        displayName: 'Name',
        formatter: (value: any) => (
          <Link to={`/nodes/${node.id}/chains/${value}`}>
            {value === -1 ? 'Beacon' : `Shard ${value + 1}`}
          </Link>
        ),
      }, {
        key: 'hash',
        displayName: 'Block hash',
        formatter: (value: any) => (
          <Link to={`/nodes/${node.id}/blocks/${value}`}>
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

    return (
      <div className="blocks">
        <Toaster
          ref={this.refHandlers.toaster}
          position={Position.TOP_RIGHT}
        />
        <NodeInformation
          loading={gettingChains}
          nodes={nodes}
          node={node}
          history={history}
          baseUrl="nodes"
          extraFields={['totalBlocks']}
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

const mapStateToProps = (state: any) => ({
  nodes: state.NodesReducer.get('nodes'),
  node: state.ChainsReducer.get('node'),
  gettingChains: state.ChainsReducer.get('gettingChains'),
  searching: state.ChainsReducer.get('searching'),
  searchResult: state.ChainsReducer.get('searchResult'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getChains,
    search,
  }, dispatch),
});

const wrappedChains = consumeRefreshContext(refreshOnInterval(Chains));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedChains);
