const { app, BrowserWindow } = require('electron');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({ width: 800, height: 600 });

  win.loadURL('http://localhost:3000/');
}

app.on('ready', createWindow);
