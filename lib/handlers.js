const logger = require('./logger');

exports.error = (err) => {
  logger.error(err);
  process.exit(1);
};

exports.finished = () => {
  logger.ok('finished');
  process.exitCode = 0;
};

exports.logger = logger;
