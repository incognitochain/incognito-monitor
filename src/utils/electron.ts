import _ from 'lodash';

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

const MAX_ATTEMPS = 10;
const listeners: any = {};
const failedAttemps: any = {};

export default {
  send(channel: string, data?: any, defaultData?: any) {
    return new Promise((resolve, reject) => {
      if (ipc) {
        if (!_.isEqual(_.get(listeners, channel), data)) {
          failedAttemps[channel] = 0;
          listeners[channel] = data;
          ipc.send(channel, data);
          ipc.once(channel, (event: string, returnData: any, data: any) => {
            if (_.isNil(_.get(listeners, channel))) {
              return reject('Request Completed');
            }

            if (!data || _.isEqual(_.get(listeners, channel), data)) {
              listeners[channel] = null;
              return resolve(returnData);
            }

            return reject('Request cancel');
          });
        } else {
          failedAttemps[channel]++;
          reject('Requesting');

          if (failedAttemps[channel] > MAX_ATTEMPS) {
            listeners[channel] = null;
          }
        }
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

  removeListener(channel: string) {
    if (ipc) {
      listeners[channel] = null;
    }
  }
};
