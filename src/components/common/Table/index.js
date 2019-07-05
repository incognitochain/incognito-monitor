import React from 'react';
import PropTypes from 'prop-types';
import { Column, Table as BluePrintTable, Cell } from '@blueprintjs/table';

function Table({ data, columns }) {
  if (!data || !columns) {
    return null;
  }

  const cellRenderer = (rowIndex, colIndex) => {
    const value = data[rowIndex][columns[colIndex].key];
    const column = columns[colIndex];
    const { formatter } = column;
    const displayValue = formatter ? formatter(value) : value;

    return <Cell className={column.cellWrapperClass}>{displayValue}</Cell>;
  };

  return (
    <BluePrintTable numRows={data.length}>
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
  columns: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

export default React.memo(Table);
