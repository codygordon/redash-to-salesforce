const winston = require('winston');

winston.addColors({ info: 'yellow', ok: 'green', error: 'red' });

const logger = new (winston.Logger)({
  levels: { info: 0, ok: 1, error: 2 },
  transports: [
    new (winston.transports.Console)({
      level: 'error',
      timestamp: true,
      colorize: true,
    }),
    new (winston.transports.File)({
      level: 'error',
      filename: `logs/${Date.now()}.log`,
      json: false,
    }),
  ],
});

exports.error = (err) => {
  logger.error(err);
  process.exit(1);
};

exports.finished = () => {
  logger.ok('finished');
  process.exitCode = 0;
};

exports.logger = logger;
