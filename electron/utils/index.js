const _ = require('lodash');
const logger = require('./logger');
const formatter = require('./formatter');

const DEFAULT_TIMEOUT = 10000; // ms

module.exports = {
  isInteger(value) {
    return _.isInteger(_.toNumber(value));
  },

  timeout(TIMEOUT_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TIMEOUT_DATA);
      }, DEFAULT_TIMEOUT);
    });
  },

  logger,
  formatter,
};
