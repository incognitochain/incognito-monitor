import React, { Component } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';

import HealthPanel from './HealthPanel';
import ConnectionPanel from './ConnectionPanel';

import './index.scss';
import TEST_NODES from './test_nodes.json';


// Import ipcRenderer of electron
// if app is running on electron
let ipc;
if (window.require) {
  const { ipcRenderer } = window.require('electron');
  ipc = ipcRenderer;
}

class Nodes extends Component {
  constructor(props) {
    super(props);

    let nodes = TEST_NODES;

    if (ipc) {
      const nodesInString = ipc.sendSync('get-nodes');
      nodes = JSON.parse(nodesInString);
    }

    this.state = {
      nodes,
      showNewNodeDialog: false,
    };
  }

  /**
   * Add a node to node list
   * @param {Object} newNode
   */
  onAddNode = (newNode) => {
    const { nodes } = this.state;
    const newNodes = [...nodes, newNode];
    let success = true;

    if (ipc) {
      const nodesInString = JSON.stringify(newNodes, null, 4);
      success = ipc.sendSync('new-node', nodesInString);
    }

    if (success) {
      this.setState({ nodes: newNodes, showNewNodeDialog: false });
    }
  };

  /**
   * Toggle new node dialog
   */
  onToggleDialog = () => {
    const { showNewNodeDialog } = this.state;
    this.setState({ showNewNodeDialog: !showNewNodeDialog });
  };

  render() {
    const { showNewNodeDialog, nodes } = this.state;

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
              />
            )}
          />
          <Tab id="connection" title="Connection" panel={<ConnectionPanel nodes={nodes} />} />
        </Tabs>
      </div>
    );
  }
}

export default Nodes;
