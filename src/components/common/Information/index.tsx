import React, { Fragment } from 'react';
import { Card, Divider } from '@blueprintjs/core';

import 'components/common/Information/index.scss';

const DEFAULT_MAX_WIDTH = 400;

type Field = {
  title: string,
  value: any,
  maxWidth?: number,
  loading?: boolean,
}

type Props = {
  fields: Array<Field>,
  className?: string,
  rightPart?: React.ElementType,
}

const Information: React.FC<Props> = ({ fields, className, rightPart }) => {
  return (
    <Card className={`information ${className}`}>
      {fields.map(item => (
        <Fragment key={item.title}>
          <div className="information-field" style={{ maxWidth: item.maxWidth || DEFAULT_MAX_WIDTH }}>
            <div className="field-title text-overflow">{item.title}</div>
            <div
              className={`field-value text-overflow ${item.loading ? 'bp3-skeleton' : ''}`}
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
};

Information.defaultProps = {
  fields: [],
};

export default React.memo(Information);
