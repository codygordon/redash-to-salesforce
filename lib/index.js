require('dotenv-safe').load(); // eslint-disable-line
const logger = require('./logger');
const config = require('./config');
const redash = require('./redash');
const salesforce = require('./salesforce');
const { finished } = require('./handlers');

const nodeEnv = process.env.NODE_ENV;

(async function start() {
  logger.info('starting in', nodeEnv);

  if (!config.length) return logger.fatal('no config object(s) found');

  const sfConnected = await salesforce.connect();

  if (!sfConnected) return finished();

  logger.info(`starting upsert of ${config.length} queries`);

  await Promise.all(config.map(async (query) => {
    const queryResults = await redash.fetchQuery(query.redashQueryId);

    if (queryResults) {
      await salesforce.upsert({
        data: queryResults.data.rows,
        object: query.salesforceObject,
        extId: query.salesforceExtId,
      });
    }
  }));

  return finished();
}());
