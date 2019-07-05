import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from 'components/common/Table';

import './index.scss';
import {
  Alignment, Button, ButtonGroup, Card,
} from '@blueprintjs/core';
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
  }, {
    key: 'beaconHeight',
    displayName: 'Beacon Height',
  }];

  return (
    <Card className="health-panel">
      <div className="actions">
        <ButtonGroup alignText={Alignment.RIGHT} minimal>
          <Button icon="add" onClick={onToggleDialog}>Add</Button>
          <Button icon="import">Import</Button>
          <Button icon="export">Export</Button>
        </ButtonGroup>
      </div>
      <NewNodeDialog
        isOpen={showNewNodeDialog}
        canOutsideClickClose
        onClose={onToggleDialog}
        onAdd={onAddNode}
      />
      <Table data={data} columns={columns} />
    </Card>
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
