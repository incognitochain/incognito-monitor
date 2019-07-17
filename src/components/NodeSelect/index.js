import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button, MenuItem,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import Node from './node';

class NodeSelect extends Component {
  onNodeChange = (newNode) => {
    const { baseUrl, history } = this.props;

    history.push(`/${baseUrl}/${newNode.name}`);
  };

  render() {
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
}

NodeSelect.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  baseUrl: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default NodeSelect;
