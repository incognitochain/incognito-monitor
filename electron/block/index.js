const utils = require('../utils');
const ConstantRPC = require('../incognitoRpc');

const { logger, formatter } = utils;

/**
 * Get blocks of a shard
 * @param node
 * @param shardId
 * @returns {Promise<[Object]>}
 */
async function getBlocks(node, shardId) {
  logger.verbose(`Getting blocks of shard ${shardId} of node ${node.host}`);
  const rpc = new ConstantRPC(node.host, node.port);
  const blocks = await rpc.GetBlocks(10, parseInt(shardId, 10));
  const formattedBlocks = blocks.map(formatter.formatBlock);

  logger.verbose('Get blocks success ', formattedBlocks);
  return formattedBlocks;
}

/**
 * Get a block by hash
 * @param {Object} node
 * @param {String} blockHash
 * @returns {Promise<{Object}>} block
 */
async function getBlock(node, blockHash) {
  logger.verbose(`Getting block ${blockHash} of node ${node.host}`);

  const rpc = new ConstantRPC(node.host, node.port);
  const hashType = await rpc.CheckHashValue(blockHash);
  let block;
  let isBeaconBlock;

  if (hashType.IsBeaconBlock) {
    block = await rpc.RetrieveBeaconBlock(blockHash, '1');
    isBeaconBlock = true;
  } else {
    block = await rpc.RetrieveBlock(blockHash, '1');
    isBeaconBlock = false;
  }

  let formattedBlock;
  if (block) {
    formattedBlock = formatter.formatBlock(block, isBeaconBlock);
  } else {
    formattedBlock = {};
  }

  logger.verbose('Get block success', formattedBlock);
  return formattedBlock;
}

/**
 *
 * @param {Object} node
 * @param {Number} height height must be a number
 * @param {Number} shardId shardId must be a number
 * @returns {Promise<{Object}>}
 */
async function getBlockByHeight(node, height, shardId) {
  logger.verbose(`Getting block height ${height} of node ${node.host}`);

  const rpc = new ConstantRPC(node.host, node.port);
  const hash = await rpc.GetBlockHash(shardId, height);
  const block = getBlock(node, hash);

  logger.verbose(`Getting block height ${height} of node ${node.host} success`, block);
  return block;
}

module.exports = {
  getBlocks,
  getBlock,
  getBlockByHeight,
};
