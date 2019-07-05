import React from 'react';
import PropTypes from 'prop-types';
import { Column, Table as BluePrintTable, Cell } from '@blueprintjs/table';

import './index.scss';

function Table({ data, columns }) {
  if (!data || !columns) {
    return null;
  }

  const cellRenderer = (rowIndex, colIndex) => {
    const column = columns[colIndex];
    const value = data[rowIndex][column.key];
    const { formatter } = column;
    const displayValue = formatter ? formatter(value) : value;

    return <Cell className={column.cellWrapperClass}>{displayValue}</Cell>;
  };

  return (
    <BluePrintTable numRows={data.length} className="incognito-table">
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
  })).isRequired,
};

export default React.memo(Table);
