const logger = require('./logger');

const nodeEnv = process.env.NODE_ENV;

exports.fatal = (err) => {
  const exitCode = nodeEnv === 'development' ? 1 : 0;
  logger.fatal(err);
  process.exit(exitCode);
};

exports.finished = () => {
  logger.info('finished');
  process.exitCode = 0;
};

exports.logger = logger;
