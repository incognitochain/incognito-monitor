const { autoUpdater } = require('electron-updater');
const { BrowserWindow } = require('electron');
// const log = require('electron-log');

module.exports = (app) => {
  autoUpdater.on('update-available', (info) => {
    const win = new BrowserWindow({ width: 300, height: 150, frame: false, titleBarStyle: 'hidden' });
    win.loadURL(`file://${__dirname}/update.html`);
  });

  // autoUpdater.on('update-downloaded', (info) => {
  //   sendStatusToWindow('Update downloaded');
  // });

  return autoUpdater;
};