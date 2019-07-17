import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Icon, Card,
} from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Information from 'components/Information';
import { getTransaction } from './actions';
import './index.scss';
import MOCK_UP_TRANSACTION from './test_transaction.json';

class Transaction extends Component {
  componentDidMount() {
    const {
      match, actions,
    } = this.props;
    this.transactionHash = match.params.transactionHash;
    this.nodeName = match.params.nodeName;
    actions.getTransaction(this.nodeName, this.transactionHash);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: prevMatch } = prevProps;
    const { match, actions } = this.props;
    const prevTransactionHash = prevMatch.params.transactionHash;
    const currentTransactionHash = match.params.transactionHash;

    if (prevTransactionHash !== currentTransactionHash) {
      this.transactionHash = currentTransactionHash;
      actions.getTransaction(this.nodeName, currentTransactionHash);
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
        value: <textarea className="data-scrollable">{proof}</textarea>,
      }, {
        title: 'Proof Detail',
        value: <textarea className="data-scrollable">{JSON.stringify(proofDetail, null, 4)}</textarea>,
      }, {
        title: 'Metadata',
        value: <textarea className="data-scrollable">{JSON.stringify(metadata, null, 4)}</textarea>,
      }, {
        title: 'Custom Token',
        value: <textarea className="data-scrollable">{JSON.stringify(customTokenData, null, 4)}</textarea>,
      }, {
        title: 'Privacy Custom Token',
        value: <textarea className="data-scrollable">{JSON.stringify(privacyCustomTokenData, null, 4)}</textarea>,
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

Transaction.propTypes = {
  actions: PropTypes.shape({
    getTransaction: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({}).isRequired,
  transaction: PropTypes.shape({}).isRequired,
  gettingTransaction: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  transaction: state.TransactionReducer.get('transaction'),
  gettingTransaction: state.TransactionReducer.get('gettingTransaction'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    getTransaction,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
