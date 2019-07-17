const {
  app, BrowserWindow, ipcMain, dialog,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const path = require('path');
const _ = require('lodash');
const isDev = require('electron-is-dev');
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
} = require('./events');
const utils = require('./utils');
const nodeController = require('./node');
const chainController = require('./chain');
const blockController = require('./block');
const transactionController = require('./transaction');

const { formatter, logger } = utils;

let mainWindow;
let willQuitApp = false;

async function addNode(event, newNode) {
  const result = await nodeController.addNode(newNode);
  event.reply(ADD_NODE, result);
}

async function getNodes(event) {
  const result = await nodeController.getNodes();
  event.reply(GET_NODES, result);
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

async function deleteNode(event, nodeName) {
  const result = await nodeController.deleteNode(nodeName);
  event.reply(DELETE_NODE, result);
}

async function getChains(event, nodeName) {
  const node = nodeController.findNode(nodeName);
  const nodeInfo = await nodeController.getNodeInfo(node);

  nodeInfo.chains = await chainController.getChains(node);
  event.reply(GET_CHAINS, nodeInfo);
}

async function getBlocks(event, { nodeName, shardId }) {
  const node = nodeController.findNode(nodeName);
  const formattedBlocks = await blockController.getBlocks(node, shardId);

  const latestBlock = formattedBlocks[0];
  const chain = {
    name: shardId === -1 ? 'Beacon' : `Shard ${shardId + 1}`,
    totalBlocks: latestBlock.height,
    producer: latestBlock.producer,
    blocks: formattedBlocks,
  };

  event.reply(GET_BLOCKS, chain);
}

async function getBlock(event, { nodeName, blockHash }) {
  const node = nodeController.findNode(nodeName);
  const formattedBlock = await blockController.getBlock(node, blockHash);
  event.reply(GET_BLOCK, formattedBlock);
}

async function searchByHash(host, port, hash) {
  const rpc = new ConstantRPC(host, port);
  const hashType = await rpc.CheckHashValue(hash);

  if (hashType.IsBeaconBlock || hashType.IsBlock) {
    const searchBlockFunction = hashType.isBeaconBlock ? blockController.searchBeaconBlockByHash
      : blockController.searchBlockByHash;
    const block = await searchBlockFunction(host, port, hash);
    const formattedBlock = formatter.formatBlock(block);
    return {
      type: 'block',
      data: formattedBlock,
    };
  } if (hashType.IsTransaction) {
    const transaction = await transactionController.searchTransaction(host, port, hash) || {};
    if (!_.isEmpty(transaction)) {
      const formattedTransaction = formatter.formatTransaction(transaction);
      return {
        type: 'transaction',
        data: formattedTransaction,
      };
    }
  }

  return null;
}

async function search(event, { nodeName, searchValue }) {
  logger.verbose(`Search ${searchValue} in ${nodeName}`);

  try {
    const node = nodeController.findNode(nodeName);
    const { host, port } = node;
    const result = searchByHash(host, port, searchValue);

    if (result) {
      event.reply(SEARCH, result);
      logger.verbose(`Search ${searchValue} in ${nodeName} success`, result);
    } else {
      event.reply(SEARCH, null);
      logger.verbose(`Search ${searchValue} in ${nodeName} Not found`);
    }

    event.reply(SEARCH, null);
    logger.verbose(`Search ${searchValue} in ${nodeName} Not found`);
  } catch (error) {
    event.reply(SEARCH, null);
    logger.error(`Search ${searchValue} in ${nodeName} ${error.message}`);
  }
}

async function getTransaction(event, { nodeName, transactionHash }) {
  const node = nodeController.findNode(nodeName);
  const transaction = await transactionController.getTransaction(node, transactionHash);
  event.reply(GET_TRANSACTION, transaction);
}

async function getCommittees(event, nodeName) {
  const result = await nodeController.getCommittees(nodeName);
  event.reply(GET_COMMITTEES, result);
}

async function getPendingTransactions(event, nodeName) {
  const node = nodeController.findNode(nodeName);
  const transactions = await transactionController.getPendingTransactions(node);

  const nodeInfo = await nodeController.getNodeInfo(node);
  nodeInfo.transactions = transactions;

  event.reply(GET_PENDING_TRANSACTIONS, nodeInfo);
}

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
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`);
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
app.on('before-quit', () => {
  willQuitApp = true;
});
