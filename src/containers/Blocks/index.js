import React, { Component, Fragment } from 'react';
import moment from 'moment';
import _ from 'lodash';
import {
  Button, Card, Divider, InputGroup,
} from '@blueprintjs/core';

import Table from 'components/common/Table';
import './index.scss';

function search(value) {
  console.debug(value);
}

class Blocks extends Component {
  constructor(props) {
    super(props);

    // Use debounce to only call search when user stop inputting
    this.search = _.debounce(search, 500);
  }

  onSearchInputChange = (e) => {
    const { value } = e.target;

    this.search(value);
  };

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
        title: 'Name',
        value: 'Beacon 0',
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
            <Button>Switch</Button>
          </div>
        </Card>
        <Card>
          <Table data={blocks} columns={columns} />
        </Card>
      </div>
    );
  }
}

export default Blocks;
