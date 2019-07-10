import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider } from '@blueprintjs/core';

import './index.scss';

const DEFAULT_MAX_WIDTH = 400;

function Information({ fields, className, rightPart }) {
  return (
    <Card className={`information ${className}`}>
      {fields.map(item => (
        <Fragment key={item.title}>
          <div className="information-field" style={{ maxWidth: item.maxWidth || DEFAULT_MAX_WIDTH }}>
            <div className="field-title text-overflow">{item.title}</div>
            <div
              className="field-value text-overflow"
              style={{ maxWidth: item.maxWidth || DEFAULT_MAX_WIDTH }}
            >
              {item.value}
            </div>
          </div>
          <Divider />
        </Fragment>
      ))}
      {rightPart}
    </Card>
  );
}

Information.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})),
  className: PropTypes.string,
  rightPart: PropTypes.element,
};

Information.defaultProps = {
  fields: [],
  className: '',
  rightPart: null,
};

export default React.memo(Information);
