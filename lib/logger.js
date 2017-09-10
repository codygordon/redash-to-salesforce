const winston = require('winston');

const logsPath = process.env.LOGS_PATH;

winston.addColors({ info: 'yellow', ok: 'green', error: 'red' });

module.exports = new (winston.Logger)({
  levels: { info: 0, ok: 1, error: 2 },
  transports: [
    new (winston.transports.Console)({
      level: 'error',
      timestamp: true,
      colorize: true,
    }),
    new (winston.transports.File)({
      level: 'error',
      filename: `${logsPath}/${Date.now()}.log`,
      json: false,
    }),
  ],
});
