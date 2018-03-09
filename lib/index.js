if (!process.env.NO_ENV_CHANGE) {
  console.log('using dotenv-safe');
  require('dotenv-safe').load(); // eslint-disable-line
}
const logger = require('./logger');
const { config, validatedConfig } = require('./config');
const redash = require('./redash');
const salesforce = require('./salesforce');
const { finished, fatal } = require('./handlers');

const nodeEnv = process.env.NODE_ENV;

exports.start = async() => {
  logger.info('starting in', nodeEnv);

  if (!validatedConfig()) { console.log('config innvalid'); return null; }

  const sfSession = await salesforce.connect().catch(err => fatal(err.message));

  if (!sfSession) { console.log('unable to start salesforce session'); return null; }

  logger.info(`processing ${config.length} queries`);

  /* using for-of loop here because it will await the previous async
    query / salesforce operations before processing the next */

  for (const configItem of config) {
    const queryResult = await redash.fetchQuery(configItem.redashQueryId);

    if (!queryResult) { console.log('no query result, breaking'); break; }

    await salesforce.upsert(
      queryResult.data.rows,
      configItem.salesforceObject,
      configItem.salesforceExtId,
      configItem.salesforceLookups,
    );
  }

  return finished();
};
