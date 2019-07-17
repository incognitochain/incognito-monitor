import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Table from 'components/common/Table';
import Information from 'components/Information';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';
import BackButton from 'components/BackButton';

import { getChain } from './actions';
import './index.scss';
import MOCK_UP_CHAIN from './test_chain.json';

class Chain extends Component {
  componentDidMount() {
    const {
      match, actions, setRefreshAction,
    } = this.props;
    this.chainIndex = match.params.chainIndex;
    this.nodeName = match.params.nodeName;
    actions.getChain(this.nodeName, this.chainIndex);

    setRefreshAction(() => actions.getChain(this.nodeName, this.chainIndex, true));
  }

  render() {
    const { gettingChain, history } = this.props;
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
        value: <BackButton history={history} />,
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
        <Information
          fields={fields}
          className={gettingChain ? 'bp3-skeleton' : ''}
        />
        { !_.isEmpty(blocks) && (
          <Card className="no-padding">
            <Table
              data={blocks}
              columns={columns}
              skeletonHeight={10}
              loading={gettingChain}
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
  setRefreshAction: PropTypes.func.isRequired,
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

const wrappedChain = consumeRefreshContext(refreshOnInterval(Chain));

export default connect(mapStateToProps, mapDispatchToProps)(refreshOnInterval(wrappedChain));
