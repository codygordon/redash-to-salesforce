const logger = require('./logger');

exports.fatal = (err) => {
  logger.fatal(err);
  process.exitCode = 0;
};

exports.finished = () => {
  logger.info('finished');
  process.exitCode = 0;
};
