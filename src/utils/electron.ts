declare global {
  interface Window { require: any; }
}

// Import ipcRenderer of electron
// if app is running on electron
let ipc: any;
if (window.require) {
  const { ipcRenderer } = window.require('electron');
  ipc = ipcRenderer;
}

export default {
  send(channel: string, data?: any, defaultData?: any) {
    return new Promise((resolve) => {
      if (ipc) {
        ipc.send(channel, data);
        ipc.on(channel, (event: any, returnData: any) => {
          resolve(returnData);
        });
      } else {
        setTimeout(() => {
          resolve(defaultData);
        }, 2000);
      }
    });
  },

  sendSync(channel: string, data?: any, defaultData?: any) {
    if (ipc) {
      return ipc.sendSync(channel, data);
    }

    return defaultData;
  },
};
