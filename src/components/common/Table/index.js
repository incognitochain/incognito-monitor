import React from 'react';
import PropTypes from 'prop-types';
import { Column, Table as BluePrintTable, Cell } from '@blueprintjs/table';

import './index.scss';

function Table({ data, columns, loadingOptions }) {
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

    return <Cell className={column.cellWrapperClass}>{displayValue}</Cell>;
  };

  return (
    <BluePrintTable
      numRows={loadingOptions ? 10 : data.length}
      className="incognito-table"
      loadingOptions={loadingOptions}
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
  })).isRequired,
  loadingOptions: PropTypes.arrayOf(PropTypes.string),
};

Table.defaultProps = {
  loadingOptions: undefined,
};

export default React.memo(Table);
