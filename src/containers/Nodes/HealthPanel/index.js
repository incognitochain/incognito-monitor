import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Table from 'components/common/Table';

import './index.scss';
import {
  Alignment, Button, ButtonGroup,
} from '@blueprintjs/core';
import NewNodeDialog from 'components/NewNodeDialog';
import { TableLoadingOption } from '@blueprintjs/table';

function HealthPanel({
  data, showNewNodeDialog, onToggleDialog, onAddNode, onImport, onExport, loading, newNodeError,
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
    <div className="health-panel">
      <div className="actions">
        <ButtonGroup alignText={Alignment.RIGHT} minimal>
          <Button icon="add" onClick={onToggleDialog}>Add</Button>
          <Button icon="import" onClick={onImport}>Import</Button>
          <Button icon="export" onClick={onExport}>Export</Button>
        </ButtonGroup>
      </div>
      <NewNodeDialog
        isOpen={showNewNodeDialog}
        canOutsideClickClose
        onClose={onToggleDialog}
        onAdd={onAddNode}
        error={newNodeError}
      />
      <Table
        data={data}
        columns={columns}
        loadingOptions={loading ? [
          TableLoadingOption.CELLS,
          TableLoadingOption.ROW_HEADERS,
        ] : undefined}
      />
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
  loading: PropTypes.bool,
  newNodeError: PropTypes.string,
};

HealthPanel.defaultProps = {
  showNewNodeDialog: false,
  loading: false,
  newNodeError: null,
};

export default React.memo(HealthPanel);
