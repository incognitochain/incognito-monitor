import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Information from 'components/Information';
import BackButton from 'components/BackButton';
import formatter from 'utils/formatter';

import { getBlock } from './actions';
import './index.scss';
import MOCK_UP_BLOCK from './test_block.json';

class Block extends Component {
  componentDidMount() {
    const {
      match, actions,
    } = this.props;
    this.blockHash = match.params.blockHash;
    this.nodeName = match.params.nodeName;
    actions.getBlock(this.nodeName, this.blockHash);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: prevMatch } = prevProps;
    const { match, actions } = this.props;
    const prevBlockHash = prevMatch.params.blockHash;
    const currentBlockHash = match.params.blockHash;

    if (prevBlockHash !== currentBlockHash) {
      this.blockHash = currentBlockHash;
      actions.getBlock(this.nodeName, currentBlockHash);
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
  <Link to={`/nodes/${this.nodeName}/blocks/${previousBlockHash}`}>
    {previousBlockHash}
  </Link>,
      }, {
        title: 'Next block',
        value:
  <Link to={`/nodes/${this.nodeName}/blocks/${nextBlockHash}`}>
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
        title: 'TXs',
        value: _.get(txHashes, 'length') || 0,
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

Block.propTypes = {
  actions: PropTypes.shape({
    getBlock: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  block: PropTypes.shape({}).isRequired,
  gettingBlock: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  block: state.BlockReducer.get('block'),
  gettingBlock: state.BlockReducer.get('gettingBlock'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getBlock,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Block);
