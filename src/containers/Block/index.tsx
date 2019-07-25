import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';
import { Link, RouteComponentProps } from 'react-router-dom';

import Information from 'components/Information';
import BackButton from 'components/BackButton';
import DataScrollable from 'components/DataScrollable';
import formatter from 'utils/formatter';

import { getBlock } from 'containers/Block/actions';
import './index.scss';
import MOCK_UP_BLOCK from './test_block.json';

type Props = {
  actions: any,
  match: any,
  block: any,
  gettingBlock: boolean,
  history: RouteComponentProps['history'],
};

class Block extends Component<Props> {
  blockHash: string = '';
  nodeId: string = '';

  componentDidMount() {
    const {
      match, actions,
    } = this.props;
    this.blockHash = match.params.blockHash;
    this.nodeId = match.params.nodeId;
    actions.getBlock(this.nodeId, this.blockHash);
  }

  componentDidUpdate(prevProps: Props) {
    const { match: prevMatch } = prevProps;
    const { match, actions } = this.props;
    const prevBlockHash = prevMatch.params.blockHash;
    const currentBlockHash = match.params.blockHash;

    if (prevBlockHash !== currentBlockHash) {
      this.blockHash = currentBlockHash;
      actions.getBlock(this.nodeId, currentBlockHash);
    }
  }

  render() {
    const { gettingBlock, history } = this.props;
    let { block } = this.props;
    if (gettingBlock) {
      block = MOCK_UP_BLOCK;
    }

    const {
      hash,
      height,
      version,
      confirmations,
      time,
      txRoot,
      r,
      round,
      epoch,
      crossShards,
      previousBlockHash,
      nextBlockHash,
      producer,
      producerSign,
      aggregatedSig,
      beaconHeight,
      beaconBlockHash,
      txHashes,
      fee,
      reward,
      isBeaconBlock,
      instructions,
    } = block;

    const fields = [
      {
        title: 'BACK',
        value: <BackButton history={history} />,
      }, {
        title: `${isBeaconBlock ? 'Beacon ' : ''}Block`,
        value: hash,
        maxWidth: 700,
      },
    ];

    const blockFields = [
      {
        title: 'Block height',
        value: formatter.formatNumber(height),
      }, {
        title: 'Version',
        value: version,
      }, {
        title: 'Confirmations',
        value: confirmations,
      }, {
        title: 'Time',
        value: time,
      }, {
        title: 'Merkle TxS Root',
        value: txRoot,
      }, {
        title: 'R',
        value: r,
      }, {
        title: 'Round',
        value: round,
      }, {
        title: 'Epoch',
        value: formatter.formatNumber(epoch),
      }, {
        title: 'Crosses Shards',
        value: crossShards,
      }, {
        title: 'Previous block',
        value:
  <Link to={`/nodes/${this.nodeId}/blocks/${previousBlockHash}`}>
    {previousBlockHash}
  </Link>,
      }, {
        title: 'Next block',
        value:
  <Link to={`/nodes/${this.nodeId}/blocks/${nextBlockHash}`}>
    {nextBlockHash}
  </Link>,
      }, {
        title: 'Block producer',
        value: producer,
      }, {
        title: 'Block producer signature',
        value: producerSign,
      }, {
        title: 'Aggregated signature',
        value: aggregatedSig,
      }, {
        title: 'Beacon height',
        value: formatter.formatNumber(beaconHeight),
      }, {
        title: 'Beacon block hash',
        value: beaconBlockHash,
      }, {
        title: 'Fee',
        value: fee,
      }, {
        title: 'Reward',
        value: reward,
      }, {
        title: isBeaconBlock ? 'Instructions' : 'TXs',
        value: isBeaconBlock ? <DataScrollable data={instructions} /> : _.get(txHashes, 'length') || 0,
      },
    ];

    return (
      <div className="block">
        <Information fields={fields} className={gettingBlock ? 'bp3-skeleton' : ''} />
        <Card className={`no-padding ${gettingBlock ? 'bp3-skeleton' : ''}`}>
          {blockFields.map(field => (
            <div key={field.title} className="flex cards">
              <Card className="title p-10">{field.title}</Card>
              <Card className="value text-overflow p-10">{field.value}</Card>
            </div>
          ))}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  block: state.BlockReducer.get('block'),
  gettingBlock: state.BlockReducer.get('gettingBlock'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getBlock,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Block);
