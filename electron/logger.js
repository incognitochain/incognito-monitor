const winston = require('winston');

const logger = winston.createLogger({
  level: 'verbose',
  format: winston.format.json(),
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
