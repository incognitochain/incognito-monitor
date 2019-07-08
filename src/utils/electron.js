// Import ipcRenderer of electron
// if app is running on electron
let ipc;
if (window.require) {
  const { ipcRenderer } = window.require('electron');
  ipc = ipcRenderer;
}


export default {
  send(channel, data, defaultData) {
    return new Promise((resolve) => {
      if (ipc) {
        ipc.send(channel, data);
        ipc.on(channel, (event, returnData) => {
          resolve(returnData);
        });
      } else {
        setTimeout(() => {
          resolve(defaultData);
        }, 2000);
      }
    });
  },

  sendSync(channel, data, defaultData) {
    if (ipc) {
      return ipc.sendSync(channel, data);
    }

    return defaultData;
  },
};
