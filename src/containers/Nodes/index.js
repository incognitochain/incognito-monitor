import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import electron from 'utils/electron';

import HealthPanel from './HealthPanel';
import ConnectionPanel from './ConnectionPanel';

import './index.scss';
import { addNode, getNodes } from './actions';


class Nodes extends Component {
  state = {
    showNewNodeDialog: false,
    newNodeError: null,
  };

  componentDidMount() {
    this.getNodes();
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

    this.setState({ newNodeError: error });
  };

  /**
   * Toggle new node dialog
   */
  onToggleDialog = () => {
    const { showNewNodeDialog } = this.state;
    this.setState({ showNewNodeDialog: !showNewNodeDialog, newNodeError: null });
  };

  onExport = () => {
    electron.sendSync('export-nodes');
  };

  onImport = () => {
    electron.sendSync('import-nodes');
    this.getNodes();
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

    if (_.some(nodes, node => node.host === newNode.host && node.port === newNode.port)) {
      return 'An existing node has same address and port with this node';
    }

    return null;
  }

  render() {
    const { nodes, gettingNodes, addingNode } = this.props;
    const { showNewNodeDialog, newNodeError } = this.state;

    return (
      <div className="nodes">
        <Tabs renderActiveTabPanelOnly>
          <Tab
            id="heal"
            title="Health"
            panel={(
              <HealthPanel
                data={nodes}
                showNewNodeDialog={showNewNodeDialog}
                onAddNode={this.onAddNode}
                onToggleDialog={this.onToggleDialog}
                onExport={this.onExport}
                onImport={this.onImport}
                loading={gettingNodes || addingNode}
                newNodeError={newNodeError}
              />
            )}
          />
          <Tab id="connection" title="Connection" panel={<ConnectionPanel nodes={nodes} />} />
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  nodes: state.NodesReducer.get('nodes'),
  newNode: state.NodesReducer.get('newNode'),
  gettingNodes: state.NodesReducer.get('gettingNodes'),
  addingNode: state.NodesReducer.get('addingNode'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getNodes,
    addNode,
  }, dispatch),
});

Nodes.propTypes = {
  actions: PropTypes.shape({
    getNodes: PropTypes.func.isRequired,
    addNode: PropTypes.func.isRequired,
  }).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({})),
  gettingNodes: PropTypes.bool,
  addingNode: PropTypes.bool,
};

Nodes.defaultProps = {
  nodes: [],
  gettingNodes: false,
  addingNode: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);
