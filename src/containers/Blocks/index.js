import React, { Component, Fragment } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  Button, Card, Divider, InputGroup, MenuItem,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import Table from 'components/common/Table';

import Node from './node';
import TEST_NODES from '../Nodes/test_nodes.json';
import './index.scss';

function search(value) {
  console.debug(value);
}

class Blocks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: TEST_NODES,
    };

    // Use debounce to only call search when user stop inputting
    this.search = _.debounce(search, 500);
  }

  onSearchInputChange = (e) => {
    const { value } = e.target;

    this.search(value);
  };

  renderNodeSelector() {
    const { nodes } = this.state;

    return (
      <Select
        items={nodes}
        itemRenderer={Node}
        noResults={<MenuItem disabled text="No results." />}
      >
        <Button
          minimal
          text={nodes[0].name}
          rightIcon="double-caret-vertical"
          className="no-padding field-value"
        />
      </Select>
    );
  }

  render() {
    const blocks = [
      {
        id: 'e476b5b0299c60fa45b0c80d13038dd4dbf0a1f0b70f590213c229a34bbf80ea',
        time: 1562313248,
      },
    ];

    const columns = [
      {
        key: 'id',
        displayName: 'Id',
      }, {
        key: 'time',
        displayName: 'Time',
        formatter: value => moment.unix(value).format(),
      },
    ];

    const information = [
      {
        title: 'Node',
        value: this.renderNodeSelector(),
      }, {
        title: 'Host',
        value: '172.120.1.1',
      }, {
        title: 'Port',
        value: 9334,
      }, {
        title: 'Current block',
        value: 0,
      }, {
        title: 'Total blocks',
        value: 1000,
      }, {
        title: 'Status',
        value: 'Online',
      },
    ];

    return (
      <div className="blocks">
        <Card className="node-information">
          {information.map(item => (
            <Fragment key={item.title}>
              <div className="information-field">
                <div className="field-title">{item.title}</div>
                <div className="field-value">{item.value}</div>
              </div>
              <Divider />
            </Fragment>
          ))}
          <div className="node-actions">
            <InputGroup
              className="search-wrapper"
              onChange={this.onSearchInputChange}
              placeholder="Search for block numbers"
              round
            />
          </div>
        </Card>
        <Card className="no-padding">
          <Table data={blocks} columns={columns} />
        </Card>
      </div>
    );
  }
}

export default Blocks;
