import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import {
  Alignment, Button, ButtonGroup,
} from '@blueprintjs/core';

import Table from 'components/common/Table';
import NewNodeDialog from 'components/NewNodeDialog';
import formatter from 'utils/formatter';

import './index.scss';

function HealthPanel({
  data,
  showNewNodeDialog,
  onToggleDialog,
  onAddNode,
  onImport,
  onExport,
  loading,
  newNodeError,
  onDelete,
}) {
  const columns = [{
    key: 'name',
    displayName: 'Name',
    formatter: value => (
      <Link to={`/nodes/${value}`}>
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
    formatter: value => <div className={`status-${_.lowerCase(value)}`}>{value}</div>,
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
    formatter: reward => _.map(reward, (value, key) => `${formatter.formatNumber(value)}${key}`).join(', '),
  }, {
    key: 'name',
    displayName: '',
    formatter: name => (
      <Button
        onClick={() => onDelete(name)}
        minimal
        icon="delete"
        name={name}
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
        canOutsideClickClose
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
}

HealthPanel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  showNewNodeDialog: PropTypes.bool,
  onToggleDialog: PropTypes.func.isRequired,
  onAddNode: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  newNodeError: PropTypes.string,
};

HealthPanel.defaultProps = {
  showNewNodeDialog: false,
  loading: false,
  newNodeError: null,
};

export default React.memo(HealthPanel);
