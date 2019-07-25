import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Table, { ColumnProps } from 'components/common/Table';
import Information from 'components/Information';
import refreshOnInterval from 'components/HOC/refreshOnInterval';
import consumeRefreshContext from 'components/HOC/consumeRefreshContext';
import BackButton from 'components/BackButton';
import formatter from 'utils/formatter';

import { getChain } from 'containers/Chain/actions';
import './index.scss';
import MOCK_UP_CHAIN from './test_chain.json';

type Props = {
  actions: any,
  match: any,
  chain: any,
  gettingChain: boolean,
  history: any,
  setRefreshAction: any,
}

class Chain extends Component<any> {
  chainIndex: number = -1;
  nodeId: string = '';

  componentDidMount() {
    const {
      match, actions, setRefreshAction,
    } = this.props;
    this.chainIndex = match.params.chainIndex;
    this.nodeId = match.params.nodeId;
    actions.getChain(this.nodeId, this.chainIndex);

    setRefreshAction(() => actions.getChain(this.nodeId, this.chainIndex, true));
  }

  render() {
    const { gettingChain, history } = this.props;
    let { chain } = this.props;
    if (gettingChain) {
      chain = MOCK_UP_CHAIN;
    }

    const columns: ColumnProps[] = [
      {
        key: 'height',
        displayName: 'Block',
        formatter: formatter.formatNumber,
      }, {
        key: 'hash',
        displayName: 'Hash',
        formatter: (value: any) => (
          <Link to={`/nodes/${this.nodeId}/blocks/${value}`}>
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
        value: formatter.formatNumber(totalBlocks),
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

const mapStateToProps = (state: any) => ({
  chain: state.ChainReducer.get('chain'),
  gettingChain: state.ChainReducer.get('gettingChain'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getChain,
  }, dispatch),
});

const wrappedChain = consumeRefreshContext(refreshOnInterval(Chain));

export default connect(mapStateToProps, mapDispatchToProps)(refreshOnInterval(wrappedChain));
