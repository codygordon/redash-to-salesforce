require('dotenv-safe').load(); // eslint-disable-line
const logger = require('./logger');
const redash = require('./redash');
const salesforce = require('./salesforce');
const { finished } = require('./handlers');

const nodeEnv = process.env.NODE_ENV;
const contactsExtId = process.env.SALESFORCE_CONTACTS_EXTERNAL_ID;
const contactsQueryId = process.env.REDASH_CONTACTS_QUERY_ID;

(async function start() {
  logger.info('starting upload in', nodeEnv);
  await salesforce.connect();
  const contactsQuery = await redash.fetchQuery(contactsQueryId);
  await salesforce.upsert({
    data: contactsQuery.data.rows,
    object: 'Contact',
    extId: contactsExtId,
  });
  finished();
}());
