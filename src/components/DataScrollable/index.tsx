import React from 'react';
import './index.scss';

type Props = {
  data: any,
  space?: number,
}

const DataScrollable: React.FC<Props> = ({ data, space = 4 }) => {
  return (
    <textarea readOnly className="data-scrollable" value={JSON.stringify(data, null, space)} />
  );
};

export default React.memo(DataScrollable);
