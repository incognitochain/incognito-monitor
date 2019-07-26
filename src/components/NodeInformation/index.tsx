import React from 'react';
import _ from 'lodash';

import Information from 'components/common/Information';
import NodeSelect from 'components/NodeSelect';
import formatter from 'utils/formatter';

import './index.scss';

type Props = {
  nodes: any,
  node: any,
  history: any,
  loading?: boolean,
  extraFields?: Array<string>,
  baseUrl: string,
  rightPart?: any,
}

const NodeInformation: React.FC<Props> = (props) => {
  const { nodes, node, history, loading, extraFields, baseUrl, rightPart } = props;

  const fields = [
    {
      title: 'Node',
      value: <NodeSelect node={node} nodes={nodes} baseUrl={baseUrl} history={history} />,
    }, {
      title: 'Host',
      value: _.get(node, 'host'),
    }, {
      title: 'Port',
      value:  _.get(node, 'port'),
    }, {
      title: 'Status',
      value:  _.get(node, 'status'),
    },
  ];

  _.forEach(extraFields,(field: string) => {
    if (field === 'epoch') {
      fields.push({
        title: 'Epoch',
        value: formatter.formatNumber(_.get(node, 'epoch', 0)),
      })
    } else if (field === 'totalBlocks') {
      fields.push({
        title: 'Total Blocks',
        value: formatter.formatNumber(_.get(node, 'totalBlocks', 0)),
      })
    }
  });

  return (
    <div className="tokens">
      <Information
        className={loading ? 'bp3-skeleton' : ''}
        fields={fields}
        rightPart={rightPart}
      />
    </div>
  );
};

export default NodeInformation;
