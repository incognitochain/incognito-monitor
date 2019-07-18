const _ = require('lodash');
const utils = require('../utils');
const ConstantRPC = require('../incognitoRpc');

const { logger, formatter } = utils;

/**
 * Get tokens of a node
 * @param {Object} node
 * @returns {Promise<[Object]>}
 */
async function getTokens(node) {
  logger.verbose('Getting tokens of', node);
  const rpc = new ConstantRPC(node.host, node.port);
  try {
    const result = await rpc.ListPrivacyCustomToken();
    const tokens = _.get(result, 'ListCustomToken') || [];
    const formattedTokens = tokens.map(formatter.formatToken);

    logger.verbose('Getting tokens success', { node, formattedTokens });
    return formattedTokens;
  } catch (error) {
    logger.verbose('Getting tokens failed', error);
    return [];
  }
}

module.exports = {
  getTokens,
};
