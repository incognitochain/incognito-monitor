const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const os = require('os');
const uuid = require('uuid').v4;

const ConstantRPC = require('../incognitoRpc');
const utils = require('../utils');

const { logger } = utils;

const homedir = os.homedir();

const dataPath = path.join(homedir, 'incognito-data');
const sampleDataPath = path.join(__dirname, '../../data.sample');

function readNodes() {
  const nodesInString = fs.readFileSync(dataPath) || '[]';
  const nodes = JSON.parse(nodesInString);
  let missingId = false;

  const addedIdNodes = nodes.map(node => {
    if (_.isEmpty(node.id)) {
      missingId = true;
      return {
        ...node,
        id: uuid(),
      };
    }

    return node;
  });

  if (missingId) {
    fs.writeFileSync(dataPath, JSON.stringify(addedIdNodes, null, 4));
  }

  return addedIdNodes;
}

/**
 * Find a node in data by node name
 * @param {string} nodeId
 * @returns {Object} node
 */
function findNode(nodeId) {
  const nodes = readNodes();
  return nodes.find(item => item.id === nodeId);
}

/**
 * Get node information
 * @param {Object} node
 * @returns {Promise<Object>} nodeInfo
 */
async function getFullNodeInfo(node) {
  let status = 'OFFLINE';
  let totalBlocks;
  let beaconHeight;
  let totalShards;
  let epoch;
  let role;
  let reward;
  try {
    const rpc = new ConstantRPC(node.host, node.port);
    await rpc.GetNetworkInfo();
    status = 'ONLINE';
    const beaconInfo = await rpc.GetBeaconBestState();
    totalShards = beaconInfo.ActiveShards;
    const blocks = await Promise.all(_.range(-1, totalShards)
      .map(shardIndex => rpc.GetBlockCount(shardIndex)));
    totalBlocks = blocks.reduce((sum, numBlocks) => sum + numBlocks);

    const state = await rpc.GetBeaconBestState();
    reward = await rpc.GetRewardAmount("") || {};

    Object.keys(reward).forEach(key => {
      reward[key] = reward[key] / 1e9;
    });

    beaconHeight = state.BeaconHeight;
    epoch = beaconInfo.Epoch;

    role = await rpc.GetNodeRole();
  } catch (error) {
    logger.error('Get node information failed', { node, error });
  }

  return {
    ...node,
    status,
    totalBlocks,
    beaconHeight,
    totalShards,
    epoch,
    role,
    reward,
  };
}

/**
 * Get node information with timeout
 * @param {Object} node
 * @returns {Promise<Object>}
 */
function getNodeInfo(node) {
  return Promise.race([getFullNodeInfo(node), utils.timeout({
    ...node,
    status: 'TIMEOUT',
  })]);
}

/**
 * Add node to data file
 * @param {Object} newNode
 * @returns {Promise<Object>}
 */
async function addNode(newNode) {
  newNode.id = uuid();
  logger.verbose('Adding node', newNode);

  const nodes = readNodes();
  const newNodes = [...nodes, newNode];

  const err = fs.writeFileSync(dataPath, JSON.stringify(newNodes, null, 4));

  if (err) {
    logger.error(err.message);

    return null;
  }
  const fullNode = await getNodeInfo(newNode);
  logger.verbose('Add node success ', fullNode);

  return fullNode;
}

/**
 * Get nodes store in file
 * @returns {Promise<Object[]>}
 */
async function getNodes() {
  logger.verbose('Getting nodes');
  if (fs.existsSync(dataPath)) {
    let nodes = readNodes();
    nodes = await Promise.all(nodes.map(getNodeInfo));
    logger.verbose('Get nodes success', nodes);
    return nodes;
  }

  return new Promise((resolve) => {
    logger.verbose('Data file does not exist. So we will use sample data file.');
    const stream = fs.createReadStream(sampleDataPath)
      .pipe(fs.createWriteStream(dataPath));

    stream.on('finish', async () => {
      let nodes = readNodes();
      nodes = await Promise.all(nodes.map(getNodeInfo));
      logger.verbose('Get nodes success', nodes);

      return resolve(nodes);
    });
  });
}

/**
 * Export to a file
 * @param {string} savedFilePath
 * @returns {Promise<string>}
 */
function exportNodes(savedFilePath) {
  if (savedFilePath) {
    return new Promise((resolve) => {
      const stream = fs.createReadStream(dataPath)
        .pipe(fs.createWriteStream(savedFilePath));
      stream.on('finish', () => {
        logger.verbose('Export success');

        return resolve('success');
      });
    });
  }

  return Promise.resolve('success');
}

/**
 * Import nodes to data file from a file
 * @param {string} filePath
 * @returns {Promise<string>}
 */
function importNodes(filePath) {
  if (filePath && filePath.length) {
    return new Promise((resolve) => {
      const stream = fs.createReadStream(filePath[0])
        .pipe(fs.createWriteStream(dataPath));
      stream.on('finish', () => {
        logger.verbose('Import success');
        resolve('success');
      });
    });
  }

  return Promise.resolve('cancel');
}

/**
 * Delete a node in data file return nodeId if success otherwise return null
 * @param {string} nodeId
 * @returns {null|*} deletedNodeName
 */
function deleteNode(nodeId) {
  logger.verbose('Deleting node ', nodeId);

  const nodes = readNodes();
  const newNodes = nodes.filter(node => node.id !== nodeId);

  const err = fs.writeFileSync(dataPath, JSON.stringify(newNodes, null, 4));

  if (err) {
    logger.error('Delete node failure', err.message);

    return null;
  }

  logger.verbose('Delete node success', nodeId);

  return nodeId;
}

/**
 * Get committees of a node
 * @param {string} nodeId
 * @returns {Promise<Object>}
 */
async function getCommittees(nodeId) {
  logger.verbose(`Getting committees of node ${nodeId}`);

  const node = findNode(nodeId);
  const nodeInfo = await getFullNodeInfo(node);
  const rpc = new ConstantRPC(node.host, node.port);
  const committees = {};
  try {
    await rpc.GetNetworkInfo();
    const beaconInfo = await rpc.GetBeaconBestState();

    committees.beacon = beaconInfo.BeaconCommittee;
    committees.shards = beaconInfo.ShardCommittee;
    committees.beaconPendings = beaconInfo.BeaconPendingValidator;
    committees.shardPendings = beaconInfo.ShardPendingValidator;
  } catch (error) {
    logger.error(error.message);
  }

  logger.verbose(`Getting committees of node ${nodeId} success`, nodeInfo);
  return {
    ...nodeInfo,
    committees,
  };
}

module.exports = {
  getNodes,
  getCommittees,
  getNodeInfo,
  importNodes,
  exportNodes,
  deleteNode,
  addNode,
  findNode,
};
