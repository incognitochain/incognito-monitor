import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Icon, Card,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Information from 'components/Information';
import { getBlock } from './actions';
import './index.scss';
import MOCK_UP_BLOCK from './test_block.json';

class Block extends Component {
  componentDidMount() {
    const {
      match, actions,
    } = this.props;
    this.blockIndex = match.params.blockIndex;
    this.nodeName = match.params.nodeName;
    actions.getBlock(this.nodeName, this.blockIndex);
  }

  onBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { gettingBlock } = this.props;
    let { block } = this.props;
    if (gettingBlock) {
      block = MOCK_UP_BLOCK;
    }

    const {
      name, producer, totalBlocks,
    } = block;

    const fields = [
      {
        title: 'BACK',
        value:
  <Button minimal onClick={this.onBack}>
    <Icon icon="arrow-left" />
  </Button>,
      }, {
        title: 'Block',
        value: name,
      }, {
        title: 'Current Block Producer',
        value: producer,
      }, {
        title: 'Total Blocks',
        value: totalBlocks,
      },
    ];

    const {
      height, version, confirmations, time,
    } = block;

    const blockFields = [
      {
        title: 'Block height',
        value: height,
      }, {
        title: 'Version',
        value: version,
      }, {
        title: 'Confirmations',
        value: confirmations,
      }, {
        title: 'Time',
        value: time,
      },
    ];

    return (
      <div className="block">
        <Information fields={fields} className={gettingBlock ? 'bp3-skeleton' : ''} />
        <Card className="no-padding">
          {blockFields.map(field => (
            <div className="flex">
              <Card>{field.title}</Card>
              <Card>{field.value}</Card>
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
  block: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
