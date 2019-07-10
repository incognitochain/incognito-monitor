import React from 'react';
import PropTypes from 'prop-types';
import {
  Column, Table as BluePrintTable, Cell, EditableCell, SelectionModes,
} from '@blueprintjs/table';

import './index.scss';

function Table({
  data, columns, loadingOptions, skeletonHeight,
}) {
  if (!data || !columns) {
    return null;
  }

  const cellRenderer = (rowIndex, colIndex) => {
    if (loadingOptions) {
      return <Cell />;
    }
    const column = columns[colIndex];
    const value = data[rowIndex][column.key];
    const { formatter } = column;
    const displayValue = formatter ? formatter(value) : value;

    if (column.editable) {
      return (
        <EditableCell
          className={column.cellWrapperClass}
          value={displayValue}
        >
          {displayValue}
        </EditableCell>
      );
    }

    return <Cell className={column.cellWrapperClass}>{displayValue}</Cell>;
  };

  const columnWidths = columns.map(column => column.width || 150);

  return (
    <BluePrintTable
      numRows={loadingOptions ? skeletonHeight : data.length}
      className="incognito-table"
      loadingOptions={loadingOptions}
      selectionModes={SelectionModes.NONE}
      columnWidths={columnWidths}
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
  loadingOptions: PropTypes.arrayOf(PropTypes.string),
  skeletonHeight: PropTypes.number,
};

Table.defaultProps = {
  loadingOptions: undefined,
  skeletonHeight: 10,
};

export default React.memo(Table);
