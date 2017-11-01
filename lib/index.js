if (!process.env.NO_ENV_CHANGE) {
  require('dotenv-safe').load(); // eslint-disable-line
}
const logger = require('./logger');
const { config, validatedConfig } = require('./config');
const redash = require('./redash');
const salesforce = require('./salesforce');
const { finished } = require('./handlers');

const nodeEnv = process.env.NODE_ENV;

(async function start() {
  logger.info('starting in', nodeEnv);

  if (!validatedConfig()) return null;

  const sfSession = await salesforce.connect();

  if (!sfSession) return null;

  logger.info(`processing ${config.length} queries`);

  /* using for-of loop here because it will await the previous async
    query / salesforce operations before processing the next */

  for (const configItem of config) {
    const queryResult = await redash.fetchQuery(configItem.redashQueryId);

    if (!queryResult) break;

    await salesforce.upsert(
      queryResult.data.rows,
      configItem.salesforceObject,
      configItem.salesforceExtId,
      configItem.salesforceLookups,
    );
  }

  return finished();
}());
