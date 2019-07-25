import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import electron from 'utils/electron';
import validator from 'utils/validator';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';

import HealthPanel from 'containers/Nodes/HealthPanel';

import './index.scss';
import { addNode, getNodes, deleteNode } from 'containers/Nodes/actions';

type Props = {
  actions: any,
  nodes: any,
  gettingNodes: any,
  addingNode: any,
  deletingNode: any,
  setRefreshAction: any,
}

class Nodes extends Component<Props> {
  state = {
    showNewNodeDialog: false,
    newNodeError: null,
  };

  componentDidMount() {
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getNodes(true));
  }

  componentDidUpdate(prevProps: Props) {
    const { addingNode } = this.props;
    const { addingNode: prevAddingNode } = prevProps;

    if (prevAddingNode && !addingNode) {
      this.onToggleDialog();
    }
  }

  /**
   * Add a node to node list
   * @param {Object} newNode
   */
  onAddNode = (newNode: any) => {
    const { actions } = this.props;

    const error = this.validateNewNode(newNode);

    if (!error) {
      actions.addNode(newNode);
    }

    this.setState({ newNodeError: error, newNode });
  };

  /**
   * Toggle new node dialog
   */
  onToggleDialog = () => {
    const { showNewNodeDialog } = this.state;
    this.setState({ showNewNodeDialog: !showNewNodeDialog, newNodeError: null, newNode: {} });
  };

  onExport = () => {
    electron.sendSync('export-nodes');
  };

  onImport = () => {
    const result = electron.sendSync('import-nodes');
    if (result === 'success') {
      this.getNodes();
    }
  };

  onDelete = (nodeId: string) => {
    const { actions } = this.props;
    actions.deleteNode(nodeId);
  };

  getNodes() {
    const { actions } = this.props;
    actions.getNodes();
  }

  validateNewNode(newNode: any) {
    if (_.some([
      newNode.name,
      newNode.host,
      newNode.port,
    ], _.isEmpty)) {
      return 'Fields must not be empty';
    }

    const { nodes } = this.props;

    if (!validator.validateHost(newNode.host)) {
      return 'Host is invalid';
    }

    if (!validator.validatePort(newNode.port)) {
      return 'Port is invalid';
    }

    if (_.some(nodes, node => node.name === newNode.name)) {
      return 'An existing node has same name with new node';
    }

    if (_.some(nodes, node => node.host === newNode.host && node.port === newNode.port)) {
      return 'An existing node has same address and port with new node';
    }

    return null;
  }

  render() {
    const {
      nodes, gettingNodes, addingNode, deletingNode,
    } = this.props;
    const {
      showNewNodeDialog, newNodeError,
    } = this.state;

    return (
      <div className="nodes">
        <HealthPanel
          data={nodes}
          showNewNodeDialog={showNewNodeDialog}
          onAddNode={this.onAddNode}
          onToggleDialog={this.onToggleDialog}
          onExport={this.onExport}
          onImport={this.onImport}
          onDelete={this.onDelete}
          loading={gettingNodes || addingNode || deletingNode}
          newNodeError={newNodeError}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  nodes: state.NodesReducer.get('nodes'),
  newNode: state.NodesReducer.get('newNode'),
  gettingNodes: state.NodesReducer.get('gettingNodes'),
  addingNode: state.NodesReducer.get('addingNode'),
  deletingNode: state.NodesReducer.get('deletingNode'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getNodes,
    addNode,
    deleteNode,
  }, dispatch),
});

const wrappedNodes = consumeRefreshContext(refreshOnInterval(Nodes));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedNodes);
