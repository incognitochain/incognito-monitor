const _ = require('lodash');
const utils = require('../utils');
const ConstantRPC = require('../incognitoRpc');

const { logger, timeout } = utils;

async function getChains(node) {
  logger.verbose('Getting chains of', node);
  try {
    const rpc = new ConstantRPC(node.host, node.port);
    const beaconInfo = await Promise.race([rpc.GetBeaconBestState(), timeout(null)]);

    if (!beaconInfo) {
      throw {
        code: 'TIMEOUT',
      };
    }

    const chains = [];

    chains.push({
      name: 'Beacon',
      height: beaconInfo.BeaconHeight,
      hash: beaconInfo.BestBlockHash,
      epoch: beaconInfo.Epoch,
      index: -1,
    });

    await Promise.all(
      _.range(0, beaconInfo.ActiveShards).map(async (shardIndex) => {
        const shard = await rpc.GetShardBestState(shardIndex);
        chains.push({
          name: `Shard ${shardIndex + 1}`,
          height: shard.ShardHeight,
          hash: shard.BestBlockHash,
          epoch: shard.Epoch,
          totalTxs: shard.TotalTxns,
          index: shardIndex,
        });
      })
    );

    logger.verbose('Get chains success', { node, chains });
    return _.orderBy(chains, 'index');
  } catch (error) {
    logger.error(`Get chains failed ${node.host}`, error.message);
    return [];
  }
}

module.exports = {
  getChains,
};
