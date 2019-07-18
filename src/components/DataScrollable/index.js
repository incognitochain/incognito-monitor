import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

function DataScrollable({ data }) {
  console.log(JSON.stringify(data, null, 4));
  return (
    <textarea readOnly className="data-scrollable" value={JSON.stringify(data, null, 4)} />
  );
}

DataScrollable.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]).isRequired,
};


export default React.memo(DataScrollable);
