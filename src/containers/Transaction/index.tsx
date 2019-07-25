import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Icon, Card,
} from '@blueprintjs/core';
import Information from 'components/Information';
import DataScrollable from 'components/DataScrollable';
import { getTransaction } from 'containers/Transaction/actions';
import './index.scss';
import MOCK_UP_TRANSACTION from './test_transaction.json';

type Props = {
  actions: any,
  match: any,
  transaction: any,
  gettingTransaction: any,
  history: any,
}

class Transaction extends Component<Props> {
  transactionHash: string = '';
  nodeId: string = '';

  componentDidMount() {
    const {
      match, actions,
    } = this.props;
    this.transactionHash = match.params.transactionHash;
    this.nodeId = match.params.nodeId;
    actions.getTransaction(this.nodeId, this.transactionHash);
  }

  componentDidUpdate(prevProps: Props) {
    const { match: prevMatch } = prevProps;
    const { match, actions } = this.props;
    const prevTransactionHash = prevMatch.params.transactionHash;
    const currentTransactionHash = match.params.transactionHash;

    if (prevTransactionHash !== currentTransactionHash) {
      this.transactionHash = currentTransactionHash;
      actions.getTransaction(this.nodeId, currentTransactionHash);
    }
  }

  onBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { gettingTransaction } = this.props;
    let { transaction } = this.props;
    if (gettingTransaction) {
      transaction = MOCK_UP_TRANSACTION;
    }

    const {
      hash,
      blockHeight,
      version,
      fee,
      type,
      lockTime,
      sigPubKey,
      sig,
      proof,
      proofDetail,
      metadata,
      customTokenData,
      isPrivacy,
      privacyCustomTokenData,
    } = transaction;

    const fields = [
      {
        title: 'BACK',
        value:
  <Button minimal onClick={this.onBack}>
    <Icon icon="arrow-left" />
  </Button>,
      }, {
        title: 'Transaction',
        value: hash,
        maxWidth: 700,
      },
    ];

    const transactionFields = [
      {
        title: 'Block height',
        value: blockHeight,
      }, {
        title: 'Tx Version',
        value: version,
      }, {
        title: 'Type',
        value: type,
      }, {
        title: 'Fee',
        value: fee,
      }, {
        title: 'Lock time',
        value: lockTime,
      }, {
        title: 'SigPubKey',
        value: sigPubKey,
      }, {
        title: 'Sig',
        value: sig,
      }, {
        title: 'Privacy Transaction',
        value: isPrivacy ? 'true' : 'false',
      }, {
        title: 'Proof (base68ceheck encode)',
        value: <DataScrollable data={proof} />,
      }, {
        title: 'Proof Detail',
        value: <DataScrollable data={proofDetail} />,
      }, {
        title: 'Metadata',
        value: <DataScrollable data={metadata} />,
      }, {
        title: 'Custom Token',
        value: <DataScrollable data={customTokenData} />,
      }, {
        title: 'Privacy Custom Token',
        value: <DataScrollable data={privacyCustomTokenData} />,
      },
    ];

    return (
      <div className="transaction">
        <Information fields={fields} className={gettingTransaction ? 'bp3-skeleton' : ''} />
        <Card className={`no-padding ${gettingTransaction ? 'bp3-skeleton' : ''}`}>
          {transactionFields.map(field => (
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
  transaction: state.TransactionReducer.get('transaction'),
  gettingTransaction: state.TransactionReducer.get('gettingTransaction'),
});

const mapDispatchToProps = (dispatch: any) => ({
  actions: bindActionCreators({
    getTransaction,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
