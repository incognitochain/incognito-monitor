const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const isDev = require('electron-is-dev');
const ConstantRPC = require('./incognitoRpc');
const {
  ADD_NODE, EXPORT_NODES, GET_NODES, IMPORT_NODES, GET_CHAINS, GET_BLOCKS, GET_BLOCK, DELETE_NODE,
} = require('./events');
const logger = require('./logger');
const MOCK_UP_EVENT = {
  reply: _.noop,
};
const DEFAULT_TIMEOUT = 5000; //ms
const homedir = require('os').homedir();
const dataPath = path.join(homedir, 'incognito-data');
const sampleDataPath = path.join(__dirname, '../data.sample');
let mainWindow;
let willQuitApp = false;

function readNodes() {
  const nodesInString = fs.readFileSync(dataPath) || '[]';
  return JSON.parse(nodesInString);
}

function timeout(TIMEOUT_DATA) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(TIMEOUT_DATA);
    }, DEFAULT_TIMEOUT);
  })
}

async function getFullNodeInfo(node) {
  const rpc = new ConstantRPC(node.host, node.port);
  let status = 'OFFLINE';
  let totalBlocks;
  let beaconHeight;
  let totalShards;
  let epoch;
  try {
    await rpc.GetNetworkInfo();
    const beaconInfo = await rpc.GetBeaconBestState();
    totalShards = beaconInfo.ActiveShards;
    totalBlocks = await rpc.GetBlockCount(-1);
    for (let i = 0; i < totalShards; i++) {
      totalBlocks += await rpc.GetBlockCount(i);
    }
    const state = await rpc.GetBeaconBestState();
    beaconHeight = state.BeaconHeight;
    epoch = beaconInfo.Epoch;
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
  };
}

function getNodeInfo(node) {
  return Promise.race([getFullNodeInfo(node), timeout({
    ...node,
    status: 'TIMEOUT',
  })])
}

async function addNode(event, newNode) {
  logger.verbose('Adding node ' + JSON.stringify(newNode, null, 4));

  const nodes = readNodes();
  const newNodes = [...nodes, newNode];

  const err = fs.writeFileSync(dataPath, JSON.stringify(newNodes, null, 4));

  if (err) {
    logger.error(err.message);
  } else {
    const fullNode = await getNodeInfo(newNode);
    event.reply(ADD_NODE, fullNode);
    logger.info('Add node success ' + JSON.stringify(fullNode, null, 4));
  }
}

async function getNodes(event) {
  logger.verbose('Getting nodes');
  if (fs.existsSync(dataPath)) {
    let nodes = readNodes();
    nodes = await Promise.all(nodes.map(getNodeInfo));
    event.reply(GET_NODES, nodes);
    logger.verbose('Get nodes success ' + JSON.stringify(nodes, null, 4));
  } else {
    logger.verbose('Data file does not exist. So we will use sample data file.');
    const stream = fs.createReadStream(sampleDataPath)
      .pipe(fs.createWriteStream(dataPath));

    stream.on('finish', async () => {
      let nodes = readNodes();
      nodes = await Promise.all(nodes.map(getNodeInfo));
      event.reply(GET_NODES, nodes);
      logger.verbose('Get nodes success ' + JSON.stringify(nodes, null, 4));
    });
  }
}

function exportNodes(event) {
  const savedFilePath = dialog.showSaveDialog({ properties: ['openFile'] });
  if (savedFilePath) {
    const stream = fs.createReadStream(dataPath)
      .pipe(fs.createWriteStream(savedFilePath));
    stream.on('finish', () => {
      event.returnValue = 'success';
      logger.verbose('Export success');
    });
  } else {
    event.returnValue = 'cancel';
  }
}

function importNodes(event) {
  const filePath = dialog.showOpenDialog({ properties: ['openFile'] });
  if (filePath && filePath.length) {
    const stream = fs.createReadStream(filePath[0])
      .pipe(fs.createWriteStream(dataPath));
    stream.on('finish', () => {
      event.returnValue = 'success';
      logger.verbose('Import success');
    });
  } else {
    event.returnValue = 'cancel';
  }
}

async function getChains(event, nodeName) {
  logger.verbose('Getting chains of ' + nodeName);
  let node;
  try {

    const nodes = readNodes();
    node = nodes.find(item => item.name === nodeName);
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
      _.range(0, beaconInfo.ActiveShards).map(async shardIndex => {
        const shard = await rpc.GetShardBestState(shardIndex);
        chains.push({
          name: `Shard ${shardIndex + 1}`,
          height: shard.ShardHeight,
          hash: shard.BestBlockHash,
          epoch: shard.Epoch,
          totalTxs: shard.TotalTxns,
          index: shardIndex,
        })
      }));

    const nodeInfo = await getNodeInfo(node);
    nodeInfo.chains = _.orderBy(chains, 'index');

    event.reply(GET_CHAINS, nodeInfo);
    logger.verbose('Get chains success ' + JSON.stringify(nodeInfo, null, 4));
  } catch (error) {
    event.reply(GET_CHAINS, {
      ...node,
      status: error.code === 'TIMEOUT' ? 'TIMEOUT' : 'OFFLINE',
      chains: [],
    });
    logger.error(error.message);
  }
}

async function getBlocks(event, {nodeName, shardId}) {
  logger.verbose(`Getting blocks of shard ${shardId} of node ${nodeName}`);

  const shardIndex = parseInt(shardId);
  const nodes = readNodes();
  const node = nodes.find(item => item.name === nodeName);
  const rpc = new ConstantRPC(node.host, node.port);
  const blocks = await rpc.GetBlocks(10, shardIndex);
  const formattedBlocks = blocks.map(block => ({
    height: block.Height,
    hash: block.Hash,
    producer: block.BlockProducer,
    tXS: block.Txs || 0,
    fee: block.Fee || 0,
    reward: block.Reward || 0,
    time: block.Time,
  }));


  const latestBlock = formattedBlocks[0];
  const chain = {
    name: shardIndex === -1 ? 'Beacon' : `Shard ${shardIndex + 1}`,
    totalBlocks: latestBlock.height,
    producer: latestBlock.producer,
    blocks: formattedBlocks,
  };

  event.reply(GET_BLOCKS, chain);
  logger.verbose('Get blocks success ' + JSON.stringify(chain, null, 4));
}

async function getBlock(event, {nodeName, blockHash}) {
  logger.verbose(`Getting block ${blockHash} of node ${nodeName}`);

  const nodes = readNodes();
  const node = nodes.find(item => item.name === nodeName);
  const rpc = new ConstantRPC(node.host, node.port);

  let block = await rpc.RetrieveBlock(blockHash,'1');
  let isBeaconBlock = false;

  if (!block) {
    block = await rpc.RetrieveBeaconBlock(blockHash, '1');
    isBeaconBlock = true;
  }

  let formattedBlock;

  if (block) {
    formattedBlock = {
      hash: block.Hash,
      shardId: block.ShardId,
      confirmations: block.Confirmations,
      version: block.Version,
      txRoot: block.TxRoot,
      time: block.Time,
      previousBlockHash: block.PreviousBlockHash,
      nextBlockHash: block.NextBlockHash,
      height: block.Height,
      producer: block.BlockProducer,
      producerSign: block.BlockProducerSign,
      data: block.Data,
      beaconHeight: block.BeaconHeight,
      beaconBlockHash: block.BeaconBlockHash,
      aggregatedSig: block.AggregatedSig,
      r: block.R,
      round: block.Round,
      crossShards: [],
      epoch: block.Epoch,
      txs: block.Txs,
      fee: block.Fee,
      reward: block.Reward,
      isBeaconBlock,
    };
  } else {
    formattedBlock = {};
  }

  event.reply(GET_BLOCK, formattedBlock);
  logger.verbose('Get block success ' + JSON.stringify(formattedBlock, null, 4));
}

async function deleteNode(event, nodeName) {
  logger.verbose('Deleting node ' + nodeName);

  const nodes = readNodes();
  const newNodes = nodes.filter(node => node.name !== nodeName);

  const err = fs.writeFileSync(dataPath, JSON.stringify(newNodes, null, 4));

  if (err) {
    logger.error(err.message);
  } else {
    event.reply(DELETE_NODE, nodeName);
    logger.info('Delete node success ' + nodeName);
  }
}

// getBlocks(MOCK_UP_EVENT, {nodeName: 'Full', shardId: '0'});
// getBlock(MOCK_UP_EVENT, {nodeName: 'Full', blockHash: '810e634ea9b254a25eb444514a9481eedf864a1cb669fec45c4c8df169bd4b4b'});

ipcMain.on(ADD_NODE, addNode);
ipcMain.on(DELETE_NODE, deleteNode);
ipcMain.on(GET_NODES, getNodes);
ipcMain.on(EXPORT_NODES, exportNodes);
ipcMain.on(IMPORT_NODES, importNodes);
ipcMain.on(GET_CHAINS, getChains);
ipcMain.on(GET_BLOCKS, getBlocks);
ipcMain.on(GET_BLOCK, getBlock);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.focus();

  mainWindow.on('close', (e) => {
    if (willQuitApp) {
      /* the user tried to quit the app */
      mainWindow = null;
    } else {
      /* the user only tried to close the window */
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

app.on('ready', createWindow);

/* 'activate' is emitted when the user clicks the Dock icon (OS X) */
app.on('activate', () => mainWindow.show());

/* 'before-quit' is emitted when Electron receives
 * the signal to exit and wants to start closing windows */
app.on('before-quit', () => willQuitApp = true);