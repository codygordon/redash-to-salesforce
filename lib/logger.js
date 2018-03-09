const winston = require('winston');

const nodeEnv = process.env.NODE_ENV;
const logsPath = process.env.LOGS_PATH;

let logger = null


if (logsPath) {
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
  logger = new (winston.Logger)({
    levels: {
      info: 0,
      ok: 1,
      error: 2,
      fatal: 3,
    },
    transports,
  })
} else {
  logger = console;
  logger.ok = function() {
    return console.info.apply(console, arguments)
  }
  logger.fatal = function() {
    return console.error.apply(console, arguments)
  }
}

module.exports = logger;
