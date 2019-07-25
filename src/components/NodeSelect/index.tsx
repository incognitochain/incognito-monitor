import React, { Component } from 'react';
import _ from 'lodash';
import {
  Button, MenuItem,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { RouteComponentProps } from 'react-router';

import { Node as NodeInterface } from 'interfaces';

import { renderNode } from './node';

type Props = {
  nodes: Array<NodeInterface>,
  node: NodeInterface,
  baseUrl: string,
  history: RouteComponentProps['history'],
}

class NodeSelect extends Component<Props> {
  onNodeChange = (newNode: NodeInterface) => {
    const { baseUrl, history } = this.props;

    history.push(`/${baseUrl}/${newNode.id}`);
  };

  render() {
    const { nodes, node } = this.props;

    return (
      <Select
        items={nodes}
        itemRenderer={renderNode}
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

export default NodeSelect;
