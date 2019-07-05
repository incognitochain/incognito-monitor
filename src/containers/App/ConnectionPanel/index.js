import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'p2p-graph';

import './index.scss';

class ConnectionPanel extends Component {
  /**
   * Init graph after component had mounted
   */
  componentDidMount() {
    this.graph = new Graph('.graph');
    const { nodes } = this.props;

    if (nodes) {
      const { graph } = this;

      nodes.forEach((nodeA) => {
        graph.add({
          id: nodeA.name,
          name: nodeA.name,
        });
      });

      nodes.forEach((nodeA) => {
        nodes
          .filter(node => node !== nodeA)
          .forEach((nodeB) => {
            graph.connect(nodeA.name, nodeB.name);
          });
      });

      graph.add({
        id: 'shard',
        name: 'Shard',
        me: true,
      });

      graph.add({
        id: 'shard 1',
        name: 'Shard 1',
      });

      graph.add({
        id: 'shard 2',
        name: 'Shard 2',
      });

      graph.connect('shard', 'shard 1');
      graph.connect('shard', 'shard 2');
    }
  }

  render() {
    const { nodes } = this.props;

    if (!nodes) {
      return null;
    }

    return (
      <div className="connection-panel">
        <div className="graph" />
      </div>
    );
  }
}

ConnectionPanel.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
  })),
};

ConnectionPanel.defaultProps = {
  nodes: null,
};

export default ConnectionPanel;
