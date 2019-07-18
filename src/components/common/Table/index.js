import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Column, Table as BluePrintTable, Cell, SelectionModes, TableLoadingOption,
} from '@blueprintjs/table';

import './index.scss';

function Table({
  data, columns, loading, skeletonHeight, defaultRowHeight,
}) {
  if (!data || !columns) {
    return null;
  }

  const cellRenderer = (rowIndex, colIndex) => {
    if (loading || _.isEmpty(data)) {
      return <Cell />;
    }

    const column = columns[colIndex];
    const value = data[rowIndex][column.key];
    const { formatter } = column;
    const displayValue = formatter ? formatter(value) : value;

    return <Cell className={column.cellWrapperClass}>{displayValue}</Cell>;
  };

  const columnWidths = columns.map(column => column.width || 150);

  let loadingOptions;

  if (loading) {
    loadingOptions = [TableLoadingOption.CELLS, TableLoadingOption.ROW_HEADERS];
  }

  return (
    <BluePrintTable
      numRows={_.get(data, 'length') || skeletonHeight}
      className="incognito-table"
      loadingOptions={loadingOptions}
      selectionModes={SelectionModes.NONE}
      columnWidths={columnWidths}
      defaultRowHeight={defaultRowHeight}
    >
      {columns.map(({ key, displayName }) => (
        <Column
          key={key}
          name={displayName}
          cellRenderer={cellRenderer}
        />
      ))}
    </BluePrintTable>
  );
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({}),
    PropTypes.string,
    PropTypes.bool,
  ])).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    formatter: PropTypes.func,
    className: PropTypes.string,
    editable: PropTypes.bool,
  })).isRequired,
  loading: PropTypes.bool,
  skeletonHeight: PropTypes.number,
  defaultRowHeight: PropTypes.number,
};

Table.defaultProps = {
  loading: false,
  skeletonHeight: 10,
  defaultRowHeight: undefined,
};

export default React.memo(Table);
