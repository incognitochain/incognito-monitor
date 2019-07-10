import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Card, Icon,
} from '@blueprintjs/core';
import { TableLoadingOption } from '@blueprintjs/table';
import { Link } from 'react-router-dom';

import Table from 'components/common/Table';
import Information from 'components/Information';
import { getChain } from './actions';
import './index.scss';
import MOCK_UP_CHAIN from './test_chain.json';

class Chain extends Component {
  componentDidMount() {
    const {
      match, actions,
    } = this.props;
    this.chainIndex = match.params.chainIndex;
    this.nodeName = match.params.nodeName;
    actions.getChain(this.nodeName, this.chainIndex);
  }

  onBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { gettingChain } = this.props;
    let { chain } = this.props;
    if (gettingChain) {
      chain = MOCK_UP_CHAIN;
    }

    const columns = [
      {
        key: 'height',
        displayName: 'Block',
      }, {
        key: 'hash',
        displayName: 'Hash',
        formatter: value => (
          <Link to={`/nodes/${this.nodeName}/blocks/${value}`}>
            {value}
          </Link>
        ),
      }, {
        key: 'producer',
        displayName: 'Producer',
      }, {
        key: 'tXS',
        displayName: 'Txn',
      }, {
        key: 'fee',
        displayName: 'TxS Fee',
      }, {
        key: 'reward',
        displayName: 'Reward',
      },
    ];

    const {
      name, producer, totalBlocks, blocks,
    } = chain;

    const fields = [
      {
        title: 'BACK',
        value:
  <Button minimal onClick={this.onBack}>
    <Icon icon="arrow-left" />
  </Button>,
      }, {
        title: 'Chain',
        value: name,
      }, {
        title: 'Current Block Producer',
        value: producer,
      }, {
        title: 'Total Blocks',
        value: totalBlocks,
      },
    ];

    return (
      <div className="chain">
        <Information fields={fields} className={gettingChain ? 'bp3-skeleton' : ''} />
        { !_.isEmpty(blocks) && (
          <Card className="no-padding">
            <Table
              data={blocks}
              columns={columns}
              skeletonHeight={10}
              loadingOptions={gettingChain ? [
                TableLoadingOption.CELLS,
                TableLoadingOption.ROW_HEADERS,
              ] : undefined}
            />
          </Card>
        ) }
      </div>
    );
  }
}

Chain.propTypes = {
  actions: PropTypes.shape({
    getChain: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  chain: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  gettingChain: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  chain: state.ChainReducer.get('chain'),
  gettingChain: state.ChainReducer.get('gettingChain'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getChain,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chain);
