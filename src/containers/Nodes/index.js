import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import electron from 'utils/electron';
import validator from 'utils/validator';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';

import HealthPanel from './HealthPanel';
import ConnectionPanel from './ConnectionPanel';

import './index.scss';
import { addNode, getNodes, deleteNode } from './actions';

class Nodes extends Component {
  state = {
    showNewNodeDialog: false,
    newNodeError: null,
    newNode: {},
    intervalGetting: true,
  };

  componentDidMount() {
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getNodes(true));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
  onAddNode = (newNode) => {
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

  onDelete = (nodeName) => {
    const { actions } = this.props;
    actions.deleteNode(nodeName);
  };

  getNodes() {
    const { actions } = this.props;
    actions.getNodes();
  }

  validateNewNode(newNode) {
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
      showNewNodeDialog, newNodeError, newNode, intervalGetting,
    } = this.state;

    return (
      <div className="nodes">
        {/* <Tabs renderActiveTabPanelOnly> */}
        {/*  <Tab */}
        {/*    id="heal" */}
        {/*    title="Health" */}
        {/*    panel={( */}
        {/*      <HealthPanel */}
        {/*        data={nodes} */}
        {/*        showNewNodeDialog={showNewNodeDialog} */}
        {/*        onAddNode={this.onAddNode} */}
        {/*        onToggleDialog={this.onToggleDialog} */}
        {/*        onExport={this.onExport} */}
        {/*        onImport={this.onImport} */}
        {/*        loading={gettingNodes || addingNode} */}
        {/*        newNodeError={newNodeError} */}
        {/*      /> */}
        {/*    )} */}
        {/*  /> */}
        {/*  <Tab id="connection"
        title="Connection" panel={<ConnectionPanel nodes={nodes} />} /> */}
        {/* </Tabs> */}
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
          newNode={newNode}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  newNode: state.NodesReducer.get('newNode'),
  gettingNodes: state.NodesReducer.get('gettingNodes'),
  addingNode: state.NodesReducer.get('addingNode'),
  deletingNode: state.NodesReducer.get('deletingNode'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getNodes,
    addNode,
    deleteNode,
  }, dispatch),
});

Nodes.propTypes = {
  actions: PropTypes.shape({
    getNodes: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired,
  }).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  gettingNodes: PropTypes.bool,
  addingNode: PropTypes.bool,
  deletingNode: PropTypes.bool,

  // Refresh on interval hoc function
  setRefreshAction: PropTypes.func.isRequired,
};

Nodes.defaultProps = {
  nodes: [],
  gettingNodes: false,
  addingNode: false,
  deletingNode: false,
};

const wrappedNodes = consumeRefreshContext(refreshOnInterval(Nodes));

export default connect(mapStateToProps, mapDispatchToProps)(wrappedNodes);
