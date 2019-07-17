const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const os = require('os');

const ConstantRPC = require('../incognitoRpc');
const utils = require('../utils');

const { logger } = utils;

const homedir = os.homedir();

const dataPath = path.join(homedir, 'incognito-data');
const sampleDataPath = path.join(__dirname, '../../data.sample');

function readNodes() {
  const nodesInString = fs.readFileSync(dataPath) || '[]';
  return JSON.parse(nodesInString);
}

/**
 * Find a node in data by node name
 * @param {String} nodeName
 * @returns {Object} node
 */
function findNode(nodeName) {
  const nodes = readNodes();
  return nodes.find(item => item.name === nodeName);
}

async function getFullNodeInfo(node) {
  const rpc = new ConstantRPC(node.host, node.port);
  let status = 'OFFLINE';
  let totalBlocks;
  let beaconHeight;
  let totalShards;
  let epoch;
  let role;
  try {
    await rpc.GetNetworkInfo();
    const beaconInfo = await rpc.GetBeaconBestState();
    totalShards = beaconInfo.ActiveShards;
    const blocks = await Promise.all(_.range(-1, totalShards)
      .map(shardIndex => rpc.GetBlockCount(shardIndex)));
    totalBlocks = blocks.reduce((sum, numBlocks) => sum + numBlocks);

    const state = await rpc.GetBeaconBestState();
    beaconHeight = state.BeaconHeight;
    epoch = beaconInfo.Epoch;

    role = await rpc.GetNodeRole();

    status = 'ONLINE';
  } catch (error) {
    logger.error(error.message);
  }

  return {
    ...node,
    status,
    totalBlocks,
    beaconHeight,
    totalShards,
    epoch,
    role,
  };
}

async function getNodeCommittees(node) {
  const nodeInfo = await getFullNodeInfo(node);
  const rpc = new ConstantRPC(node.host, node.port);
  const committees = {};
  try {
    await rpc.GetNetworkInfo();
    const beaconInfo = await rpc.GetBeaconBestState();

    committees.beacon = beaconInfo.BeaconCommittee;
    committees.shards = beaconInfo.ShardCommittee;
  } catch (error) {
    logger.error(error.message);
  }
  return {
    ...nodeInfo,
    committees,
  };
}

function getNodeInfo(node) {
  return Promise.race([getFullNodeInfo(node), utils.timeout({
    ...node,
    status: 'TIMEOUT',
  })]);
}

async function addNode(newNode) {
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

function deleteNode(nodeName) {
  logger.verbose('Deleting node ', nodeName);

  const nodes = readNodes();
  const newNodes = nodes.filter(node => node.name !== nodeName);

  const err = fs.writeFileSync(dataPath, JSON.stringify(newNodes, null, 4));

  if (err) {
    logger.error('Delete node failure', err.message);

    return null;
  }

  logger.verbose('Delete node success', nodeName);

  return nodeName;
}

async function getCommittees(nodeName) {
  logger.verbose(`Getting committees of node ${nodeName}`);

  const node = findNode(nodeName);
  const nodeInfo = await getNodeCommittees(node);

  logger.verbose(`Getting committees of node ${nodeName} success`, nodeInfo);
  return nodeInfo;
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
