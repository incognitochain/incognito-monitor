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
import SettingsDialog from 'components/SettingsDialog';
import Dialog from 'components/common/Dialog';

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
    isShowSettingsModal: false,
    error: '',
  };

  settings: any;

  componentDidMount() {
    const { setRefreshAction, actions } = this.props;
    setRefreshAction(() => actions.getNodes(true));
    this.settings = electron.sendSync('get-config');
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

  onStartNode = () => {
    const result = electron.sendSync('start-node');
    if (result.status) {
      this.props.actions.getNodes();
    } else {
      this.setState({ error: result.message });
    }
  };

  onStopNode = () => {
    const result = electron.sendSync('stop-node');
    this.props.actions.getNodes();
    return result;
  };

  onShowSettings = () => {
    this.setState({
      isShowSettingsModal: true
    });
  };

  onCloseSettings = (): any => {
    this.setState({
      isShowSettingsModal: false
    });
  };

  onSaveSettings = (settings: any): void => {
    console.debug(settings);
    electron.sendSync('change-config', settings);
    this.settings = settings;
    this.onCloseSettings();
  };

  onCloseErrorModal = (): any => {
    this.setState({ error: '' });
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
      showNewNodeDialog, newNodeError, isShowSettingsModal
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
          onShowSetting={this.onShowSettings}
          onStopNode={this.onStopNode}
          onStartNode={this.onStartNode}
        />
        <SettingsDialog
          isOpen={isShowSettingsModal}
          settings={this.settings}
          onSave={this.onSaveSettings}
          onClose={this.onCloseSettings}
        />
        {this.state.error && <Dialog
          title="Start Local Node Error"
          body={this.state.error}
          isOpen
          onClose={this.onCloseErrorModal}
        /> }
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
