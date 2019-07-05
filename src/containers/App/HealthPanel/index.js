import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from 'components/common/Table';

import './index.scss';
import { Button, ButtonGroup } from '@blueprintjs/core';
import NewNodeDialog from 'components/NewNodeDialog';

function HealthPanel({
  data, showNewNodeDialog, onToggleDialog, onAddNode,
}) {
  const columns = [{
    key: 'name',
    displayName: 'Name',
  }, {
    key: 'host',
    displayName: 'Host',
  }, {
    key: 'port',
    displayName: 'Port',
  }, {
    key: 'type',
    displayName: 'Type',
  }, {
    key: 'status',
    displayName: 'Status',
    cellWrapperClass: 'no-padding',
    formatter: value => <div className={`status-${_.lowerCase(value)}`}>{value}</div>,
  }, {
    key: 'totalBlocks',
    displayName: 'Total Blocks',
  }];

  return (
    <div className="heal-panel">
      <ButtonGroup minimal>
        <Button icon="add" onClick={onToggleDialog} />
      </ButtonGroup>
      <NewNodeDialog
        isOpen={showNewNodeDialog}
        canOutsideClickClose
        onClose={onToggleDialog}
        onAdd={onAddNode}
      />
      <Table data={data} columns={columns} />
    </div>
  );
}

HealthPanel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  showNewNodeDialog: PropTypes.bool,
  onToggleDialog: PropTypes.func,
  onAddNode: PropTypes.func,
};

HealthPanel.defaultProps = {
  showNewNodeDialog: false,
  onToggleDialog: undefined,
  onAddNode: PropTypes.func,
};

export default React.memo(HealthPanel);
