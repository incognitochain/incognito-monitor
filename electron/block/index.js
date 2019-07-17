const utils = require('../utils');
const ConstantRPC = require('../incognitoRpc');

const { logger, formatter } = utils;

async function getBlocks(node, shardId) {
  logger.verbose(`Getting blocks of shard ${shardId} of node ${node.host}`);
  const rpc = new ConstantRPC(node.host, node.port);
  const blocks = await rpc.GetBlocks(10, parseInt(shardId, 10));
  const formattedBlocks = blocks.map(formatter.formatBlock);

  logger.verbose('Get blocks success ', formattedBlocks);
  return formattedBlocks;
}

async function getBlock(node, blockHash) {
  logger.verbose(`Getting block ${blockHash} of node ${node.host}`);

  const rpc = new ConstantRPC(node.host, node.port);
  let block = await rpc.RetrieveBlock(blockHash, '1');

  if (!block) {
    block = await rpc.RetrieveBeaconBlock(blockHash, '1');
  }

  let formattedBlock;

  if (block) {
    formattedBlock = formatter.formatBlock(block);
  } else {
    formattedBlock = {};
  }

  logger.verbose('Get block success ', formattedBlock);
  return formattedBlock;
}

/**
 * Search beacon block by block hash
 * @param {String} host
 * @param {String || Number} port
 * @param {String} hash Block hash
 */
function searchBeaconBlockByHash(host, port, hash) {
  const rpc = new ConstantRPC(host, port);
  return rpc.RetrieveBeaconBlock(hash, '1');
}

/**
 * Search block by block hash
 * @param {String} host
 * @param {String || Number} port
 * @param {String} hash Block hash or Block height
 */
async function searchBlockByHash(host, port, hash) {
  const rpc = new ConstantRPC(host, port);
  return rpc.RetrieveBlock(hash, '1');
}

module.exports = {
  getBlocks,
  getBlock,
  searchBlockByHash,
  searchBeaconBlockByHash,
};
