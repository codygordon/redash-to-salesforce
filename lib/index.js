require('dotenv-safe').load(); // eslint-disable-line
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

  /* using for-in loop here because we need to wait for the previous async
    query / salesforce operations to complete before moving to the next */

  for (const configItem of config) {
    const queryResult = await redash.fetchQuery(configItem.redashQueryId);
    await salesforce.upsert(
      queryResult.data.rows,
      configItem.salesforceObject,
      configItem.salesforceExtId,
      configItem.salesforceLookups,
    );
  }

  return finished();
}());
