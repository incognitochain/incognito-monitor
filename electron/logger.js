const winston = require('winston');
const LOG_FOLDER_PATH = '~/incognito-logs';

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: `${LOG_FOLDER_PATH}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${LOG_FOLDER_PATH}/combined.log` })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = {
  info: function(message) {
    logger.log({
      level: 'info',
      message,
    });
  },

  verbose: function(message) {
    logger.log({
      level: 'verbose',
      message,
    });
  },

  error: function(message) {
    logger.log({
      level: 'error',
      message,
    });
  },
};
