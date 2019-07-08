const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const ConstantRPC = require('./incognitoRpc');
const { ADD_NODE, EXPORT_NODES, GET_NODES, IMPORT_NODES } = require('./events');
const logger = require('./logger');

const dataPath = path.join(__dirname, '../data/nodes');

function readNodes() {
  const nodesInString = fs.readFileSync(dataPath) || '[]';
  return JSON.parse(nodesInString);
}

async function nodeWithStatus(node) {
  const rpc = new ConstantRPC(node.host, node.port);
  let status = 'OFFLINE';
  let totalBlocks;
  let beaconHeight;
  try {
    await rpc.GetNetworkInfo();
    totalBlocks = await rpc.GetBlockCount(0);

    const state = await rpc.GetBeaconBestState();
    beaconHeight = state.BeaconHeight;

    status = 'ONLINE';
  } catch (error) {
    logger.error(error.message);
  }
  return {
    ...node,
    status,
    totalBlocks,
    beaconHeight,
  };
}

async function addNode(event, newNode) {
  logger.verbose('Adding node ' + JSON.stringify(newNode, null, 4));

  const nodes = readNodes();
  const newNodes = [...nodes, newNode];

  const err = fs.writeFileSync(dataPath, JSON.stringify(newNodes, null, 4));

  if (err) {
    logger.error(err.message);
  } else {
    const fullNode = await nodeWithStatus(newNode);
    event.reply(ADD_NODE, fullNode);
    logger.info('Add node success ' + JSON.stringify(fullNode, null, 4));
  }
}

async function getNodes(event) {
  logger.verbose('Getting nodes');
  if (fs.existsSync(dataPath)) {
    let nodes = readNodes();
    nodes = await Promise.all(nodes.map(nodeWithStatus));
    event.reply(GET_NODES, nodes);
  } else {
    event.reply(GET_NODES, []);
  }
  logger.verbose('Get nodes success');
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
  }
}

ipcMain.on(ADD_NODE, addNode);
ipcMain.on(GET_NODES, getNodes);
ipcMain.on(EXPORT_NODES, exportNodes);
ipcMain.on(IMPORT_NODES, importNodes);

function start() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.focus();
}

app.on('ready', start);
