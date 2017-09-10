const winston = require('winston');

const nodeEnv = process.env.NODE_ENV;
const logsPath = process.env.LOGS_PATH;

winston.addColors({
  info: 'cyan',
  ok: 'green',
  error: 'yellow',
  fatal: 'red',
});

const transports = [
  new (winston.transports.File)({
    level: 'fatal',
    filename: `${logsPath}/${Date.now()}.log`,
    json: false,
  }),
];

if (nodeEnv === 'development') {
  transports.push(new (winston.transports.Console)({
    level: 'fatal',
    timestamp: true,
    colorize: true,
  }));
}

module.exports = new (winston.Logger)({
  levels: {
    info: 0,
    ok: 1,
    error: 2,
    fatal: 3,
  },
  transports,
});
