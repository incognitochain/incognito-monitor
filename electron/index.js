const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const ConstantRPC = require('./incognitoRpc');

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
    //
  }
  return {
    ...node,
    status,
    totalBlocks,
    beaconHeight,
  };
}

ipcMain.on('new-node', (event, newNode) => {
  const nodes = readNodes();
  const newNodes = [...nodes, newNode];

  const err = fs.writeFileSync(dataPath, newNodes);

  if (err) {
    console.log(err);
  } else {
    event.returnValue = nodeWithStatus(newNode);
  }
});

ipcMain.on('get-nodes', async (event) => {
  const nodesInString = fs.readFileSync(dataPath) || '[]';
  let nodes = JSON.parse(nodesInString);
  nodes = await Promise.all(nodes.map(nodeWithStatus));
  event.returnValue = JSON.stringify(nodes);
});

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
