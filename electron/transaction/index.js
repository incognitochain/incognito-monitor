const _ = require('lodash');
const ConstantRPC = require('../incognitoRpc');
const utils = require('../utils');

const { formatter, logger } = utils;

function getTransactionByHash(host, port, searchValue) {
  const rpc = new ConstantRPC(host, port);
  return rpc.GetTransactionByHash(searchValue);
}

async function getTransaction(node, transactionHash) {
  logger.verbose(`Getting transaction ${transactionHash}`, node);

  const rpc = new ConstantRPC(node.host, node.port);

  const transaction = await rpc.GetTransactionByHash(transactionHash) || {};
  const formattedTransaction = formatter.formatTransaction(transaction);

  logger.verbose(`Get transaction ${transactionHash} success`, formattedTransaction);
  return formattedTransaction;
}

async function getPendingTransactions(node) {
  logger.verbose('Getting pending transactions', node);

  try {
    const rpc = new ConstantRPC(node.host, node.port);
    const mempoolInfo = await rpc.GetMempoolInfo();

    const transactions = (_.get(mempoolInfo, 'ListTxs') || [])
      .map(tx => ({
        lockTime: tx.LockTime,
        hash: tx.TxID,
      }));

    logger.verbose('Get pending transactions success', { node, transactions });
    return transactions;
  } catch (error) {
    logger.error('Get pending transactions error', { node, error });
    return [];
  }
}

module.exports = {
  getTransaction,
  getTransactionByHash,
  getPendingTransactions,
};
