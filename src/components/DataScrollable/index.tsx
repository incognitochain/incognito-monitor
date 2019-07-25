import React from 'react';
import './index.scss';

type Props = {
  data: any,
}

const DataScrollable: React.FC<Props> = ({ data }) => {
  return (
    <textarea readOnly className="data-scrollable" value={JSON.stringify(data, null, 4)} />
  );
};

export default React.memo(DataScrollable);
