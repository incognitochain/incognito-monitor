const {
  app, BrowserWindow, ipcMain, dialog,
} = require('electron');
const fs = require('fs');
const util = require('util');
const fixPath = require('fix-path');

fixPath();

const exec = util.promisify(require('child_process').exec);
const shell = require('shelljs');
const path = require('path');
const _ = require('lodash');
const isDev = require('electron-is-dev');
const os = require('os');
const updater = require('./updater');
const ConstantRPC = require('./incognitoRpc');
const {
  ADD_NODE,
  EXPORT_NODES,
  GET_NODES,
  IMPORT_NODES,
  GET_CHAINS,
  GET_BLOCKS,
  GET_BLOCK,
  DELETE_NODE,
  SEARCH,
  GET_TRANSACTION,
  GET_COMMITTEES,
  GET_PENDING_TRANSACTIONS,
  GET_TOKENS,
  CALL_RPC,
  GET_LOCAL_NODE_STATUS,
  START_LOCAL_NODE,
  STOP_LOCAL_NODE,
  CHANGE_CONFIG,
  GET_CONFIG,
} = require('./events');
const utils = require('./utils');
const nodeController = require('./node');
const chainController = require('./chain');
const blockController = require('./block');
const transactionController = require('./transaction');
const tokenController = require('./token');


const homedir = os.homedir();
const appUpdater = updater(ipcMain);
const { logger } = utils;
const SHARD_BLOCK_HEIGHT_REGEX = /^(-1|[1-9][0-9]*):[a-zA-Z0-9]*$/;
const CONFIG_FILE_PATH = path.join(homedir, '.incognito.config');

let config = {};

if (fs.existsSync(CONFIG_FILE_PATH)) {
  try {
    const rawConfig = fs.readFileSync(CONFIG_FILE_PATH)
    config = JSON.parse(rawConfig);
  } catch (error) {
    // Delete config file if error occur
    fs.unlinkSync(CONFIG_FILE_PATH);
  }
}

let mainWindow;

async function addNode(event, newNode) {
  const result = await nodeController.addNode(newNode);
  event.reply(ADD_NODE, result);
}

async function getNodes(event) {
  const result = await nodeController.getNodes();
  event.reply(GET_NODES, result, '');
}

async function exportNodes(event) {
  const savedFilePath = dialog.showSaveDialog({ properties: ['openFile'] });

  // eslint-disable-next-line no-param-reassign
  event.returnValue = await nodeController.exportNodes(savedFilePath);
}

async function importNodes(event) {
  const filePath = dialog.showOpenDialog({ properties: ['openFile'] });

  // eslint-disable-next-line no-param-reassign
  event.returnValue = await nodeController.importNodes(filePath);
}

async function deleteNode(event, nodeId) {
  const result = await nodeController.deleteNode(nodeId);
  event.reply(DELETE_NODE, result);
}

async function getChains(event, nodeId) {
  const node = nodeController.findNode(nodeId);
  const nodeInfo = await nodeController.getNodeInfo(node);

  nodeInfo.chains = await chainController.getChains(node);
  event.reply(GET_CHAINS, nodeInfo, nodeId);
}

async function getBlocks(event, { nodeId, shardId }) {
  const node = nodeController.findNode(nodeId);
  const formattedBlocks = await blockController.getBlocks(node, shardId);

  const latestBlock = formattedBlocks[0];
  const chain = {
    name: shardId === -1 ? 'Beacon' : `Shard ${parseInt(shardId) + 1}`,
    totalBlocks: latestBlock.height,
    producer: latestBlock.producer,
    blocks: formattedBlocks,
  };

  event.reply(GET_BLOCKS, chain);
}

async function getBlock(event, { nodeId, blockHash }) {
  const node = nodeController.findNode(nodeId);
  const formattedBlock = await blockController.getBlock(node, blockHash);
  event.reply(GET_BLOCK, formattedBlock);
}

async function searchByHash(host, port, hash) {
  const rpc = new ConstantRPC(host, port);
  const hashType = await rpc.CheckHashValue(hash);

  if (hashType.IsBeaconBlock || hashType.IsBlock) {
    const block = await blockController.getBlock({ host, port }, hash);
    return {
      type: 'block',
      data: block,
    };
  } if (hashType.IsTransaction) {
    const transaction = await transactionController.getTransaction({ host, port }, hash) || {};
    if (!_.isEmpty(transaction)) {
      return {
        type: 'transaction',
        data: transaction,
      };
    }
  }

  return null;
}

async function search(event, { nodeId, searchValue }) {
  logger.verbose(`Search ${searchValue} in ${nodeId}`);
  try {
    const node = nodeController.findNode(nodeId);
    let result;
    if (SHARD_BLOCK_HEIGHT_REGEX.test(searchValue)) {
      const shardId = _.toInteger(searchValue.split(':')[0]);
      const blockHeight = _.toInteger(searchValue.split(':')[1]);

      result = await blockController.getBlockByHeight(node, blockHeight, shardId);
      result = {
        type: 'block',
        data: result,
      };
    } else {
      const { host, port } = node;
      result = await searchByHash(host, port, searchValue);
    }

    if (result) {
      event.reply(SEARCH, result);
      logger.verbose(`Search ${searchValue} in ${nodeId} success`, result);
    } else {
      event.reply(SEARCH, null);
      logger.verbose(`Search ${searchValue} in ${nodeId} Not found`);
    }
  } catch (error) {
    event.reply(SEARCH, null);
    logger.error(`Search ${searchValue} in ${nodeId} ${error.message}`);
  }
}

async function getTransaction(event, { nodeId, transactionHash }) {
  const node = nodeController.findNode(nodeId);
  const transaction = await transactionController.getTransaction(node, transactionHash);
  event.reply(GET_TRANSACTION, transaction);
}

async function getCommittees(event, nodeId) {
  const result = await nodeController.getCommittees(nodeId);
  event.reply(GET_COMMITTEES, result);
}

async function getPendingTransactions(event, nodeId) {
  const node = nodeController.findNode(nodeId);
  const transactions = await transactionController.getPendingTransactions(node);

  const nodeInfo = await nodeController.getNodeInfo(node);
  nodeInfo.transactions = transactions;

  event.reply(GET_PENDING_TRANSACTIONS, nodeInfo);
}

async function getTokens(event, nodeId) {
  const node = nodeController.findNode(nodeId);
  const tokens = await tokenController.getTokens(node);

  const nodeInfo = await nodeController.getNodeInfo(node);
  nodeInfo.tokens = tokens;

  event.reply(GET_TOKENS, nodeInfo);
}

async function callRPC(event, { nodeId, method, params }) {
  try {
    const node = nodeController.findNode(nodeId);
    const rpc = new ConstantRPC(node.host, node.port);

    const result = await rpc.call(method, JSON.parse(params));

    event.returnValue = result;
  } catch (error) {
    event.returnValue = error;
  }
}

async function changeConfig(event, newConfig) {
  config = newConfig;
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 4));
  event.returnValue = true;
}

async function startLocalNode(event) {
  try {
    await exec('docker version');
    const shPath = path.join(__dirname, isDev ? '../run.sh' : '../../run.sh');
    let shCommand = fs.readFileSync(shPath, 'utf-8');
    shCommand = shCommand
      .replace('$1', config.privateKey)
      .replace('$2', config.clearDatabase ? 'y' : 'n')
      .replace('$3', homedir);
    shell.exec(shCommand, (code, stdout, stderr) => {
      setTimeout(() => {
        event.returnValue = {
          status: true,
        };
      }, 2000);
    });
  } catch(error) {
    const {stderr} = error;
    event.returnValue = {
      status: false,
      message: stderr,
      error,
    };
  }
}

async function stopLocalNode(event) {
  try {
    await exec('docker stop inc_miner');
    await exec('docker stop inc_geth');
    event.returnValue = {
      status: true,
    };
  } catch(error) {
    const {stderr} = error;
    event.returnValue = {
      status: false,
      stderr
    };
  }
}

async function getLocalNodeStatus(event) {
  try {
    const { stdout } = await exec(`docker inspect -f '{{.State.Running}}' inc_miner`);
    if (stdout.toString().includes('true')) {
      event.returnValue = true;
    }
    event.returnValue = false;
  } catch (error) {
    event.returnValue = false;
  }
  const rpc = new ConstantRPC('127.0.0.1', '9334');
  try {
    await rpc.GetNetworkInfo();
    event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
}

function getConfig(event) {
  event.returnValue = config;
}

// startLocalNode();

ipcMain.on(ADD_NODE, addNode);
ipcMain.on(DELETE_NODE, deleteNode);
ipcMain.on(GET_NODES, getNodes);
ipcMain.on(EXPORT_NODES, exportNodes);
ipcMain.on(IMPORT_NODES, importNodes);
ipcMain.on(GET_CHAINS, getChains);
ipcMain.on(GET_BLOCKS, getBlocks);
ipcMain.on(GET_BLOCK, getBlock);
ipcMain.on(SEARCH, search);
ipcMain.on(GET_TRANSACTION, getTransaction);
ipcMain.on(GET_COMMITTEES, getCommittees);
ipcMain.on(GET_PENDING_TRANSACTIONS, getPendingTransactions);
ipcMain.on(GET_TOKENS, getTokens);
ipcMain.on(CALL_RPC, callRPC);
ipcMain.on(START_LOCAL_NODE, startLocalNode);
ipcMain.on(STOP_LOCAL_NODE, stopLocalNode);
ipcMain.on(GET_LOCAL_NODE_STATUS, getLocalNodeStatus);
ipcMain.on(CHANGE_CONFIG, changeConfig);
ipcMain.on(GET_CONFIG, getConfig);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 600,
    minWidth: 800,
    minHeight: 200,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, isDev ? '../icon.png' : '../../icon.png'),
  });
  mainWindow.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.focus();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  appUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

