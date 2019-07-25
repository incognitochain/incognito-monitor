import React from 'react';
import _ from 'lodash';
import {
  Column, Table as BluePrintTable, Cell, SelectionModes, TableLoadingOption,
} from '@blueprintjs/table';

import './index.scss';

export type ColumnProps = {
  key: string,
  displayName: string,
  formatter?: (value: any, extraValue?: any) => any,
  extraData?: any,
  className?: string,
  editable?: boolean,
  cellWrapperClass?: string,
  width?: number,
}

type Props = {
  data: Array<any>,
  columns: Array<ColumnProps>,
  loading?: boolean,
  skeletonHeight?: number,
  defaultRowHeight?: number,
}


const Table: React.FC<Props> = ({
  data, columns, loading, skeletonHeight, defaultRowHeight
}) => {
  if (!data || !columns) {
    return null;
  }

  const cellRenderer = (rowIndex: number, colIndex: number) => {
    if (loading || _.isEmpty(data)) {
      return <Cell />;
    }

    const column = columns[colIndex];
    const value = data[rowIndex][column.key];
    const { formatter } = column;
    const extraData = column.extraData;
    const extraDataValue = extraData ? data[rowIndex][extraData] : null;
    const displayValue = formatter ? formatter(value, extraDataValue) : value;

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
};

Table.defaultProps = {
  skeletonHeight: 10,
};

export default React.memo(Table);
