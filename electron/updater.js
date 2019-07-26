const { autoUpdater } = require('electron-updater');
const { BrowserWindow } = require('electron');
const _ = require('lodash');
const log = require('electron-log');

module.exports = (ipcMain) => {
  let win;

  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;

  autoUpdater.on('update-available', () => {
    win = new BrowserWindow({
      width: 450,
      height: 300,
      title: 'Update',
      webPreferences: {
        nodeIntegration: true,
      },
    });
    win.loadURL(`file://${__dirname}/update.html`);
  });


  ipcMain.once('download', function() {
    autoUpdater.downloadUpdate();
  });

  ipcMain.once('update', function() {
    autoUpdater.quitAndInstall();
  });

  ipcMain.once('cancel', function() {
    win.close();
    win = null;
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const percent = `${_.round(_.toInteger(progressObj.percent) , 2)}%`;
    win.webContents.send('download-progress', percent);
  });

  autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('update-downloaded');
  });

  return autoUpdater;
};