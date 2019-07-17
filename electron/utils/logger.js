const fs = require('fs');
const winston = require('winston');
const path = require('path');
const homedir = require('os').homedir();
const LOG_FOLDER_PATH = path.join(homedir, 'incognito-logs');
require('winston-daily-rotate-file');

if(!fs.existsSync((LOG_FOLDER_PATH))) {
  fs.mkdirSync(LOG_FOLDER_PATH);
}

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.json(),
  transports: [
    new (winston.transports.DailyRotateFile)({
      filename: path.join(LOG_FOLDER_PATH, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '3d',
      level: 'error',
    }),
    new (winston.transports.DailyRotateFile)({
      filename: path.join(LOG_FOLDER_PATH, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '3d'
    }),
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
  info: function(message, data) {
    logger.log({
      level: 'info',
      message,
      data,
    });
  },

  verbose: function(message, data) {
    logger.log({
      level: 'verbose',
      message,
      data,
    });
  },

  error: function(message, data) {
    logger.log({
      level: 'error',
      message,
      data,
    });
  },
};
