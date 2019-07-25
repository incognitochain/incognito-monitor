import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import {
  Alignment, Button, ButtonGroup,
} from '@blueprintjs/core';

import Table from 'components/common/Table';
import NewNodeDialog from 'components/NewNodeDialog';
import formatter from 'utils/formatter';

import './index.scss';

type Props = {
  data: any,
  showNewNodeDialog: any,
  onToggleDialog: any,
  onAddNode: any,
  onImport: any,
  onExport: any,
  onDelete: any,
  loading: any,
  newNodeError: any,
}

const HealthPanel: React.FC<Props> = ({
  data,
  showNewNodeDialog,
  onToggleDialog,
  onAddNode,
  onImport,
  onExport,
  loading,
  newNodeError,
  onDelete,
}) => {
  const columns = [{
    key: 'name',
    displayName: 'Name',
    extraData: 'id',
    formatter: (value: any, extraValue: any) => (
      <Link to={`/nodes/${extraValue}`}>
        {value}
      </Link>
    ),
  }, {
    key: 'host',
    displayName: 'Host',
    editable: true,
    width: 180,
  }, {
    key: 'port',
    displayName: 'Port',
    editable: true,
    width: 80,
  }, {
    key: 'role',
    displayName: 'Role',
    width: 150,
  }, {
    key: 'status',
    displayName: 'Status',
    cellWrapperClass: 'no-padding',
    formatter: (value: any) => <div className={`status-${_.lowerCase(value)}`}>{value}</div>,
  }, {
    key: 'totalBlocks',
    displayName: 'Total Blocks',
    formatter: formatter.formatNumber,
    width: 100,
  }, {
    key: 'beaconHeight',
    displayName: 'Beacon Height',
    formatter: formatter.formatNumber,
  }, {
    key: 'epoch',
    displayName: 'Epoch',
    width: 80,
    formatter: formatter.formatNumber,
  }, {
    key: 'reward',
    displayName: 'Reward',
    formatter: (reward: any) => _.map(reward, (value, key) => `${formatter.formatNumber(value)}${key}`).join(', '),
  }, {
    key: 'id',
    displayName: '',
    formatter: (id: string) => (
      <Button
        onClick={() => onDelete(id)}
        minimal
        icon="delete"
        name={id}
        className="btn-delete"
      />
    ),
    width: 50,
  }];

  return (
    <div className="health-panel">
      <div className="actions">
        <ButtonGroup alignText={Alignment.RIGHT} minimal>
          <Button icon="add" onClick={onToggleDialog}>Add</Button>
          <Button icon="import" onClick={onImport}>Import</Button>
          <Button icon="export" onClick={onExport}>Export</Button>
        </ButtonGroup>
      </div>
      <NewNodeDialog
        disabled={loading}
        isOpen={showNewNodeDialog}
        onClose={onToggleDialog}
        onAdd={onAddNode}
        error={newNodeError}
      />
      { !_.isEmpty(data) && (
        <Table
          data={data}
          columns={columns}
          loading={loading}
        />
      ) }
    </div>
  );
};

export default React.memo(HealthPanel);
