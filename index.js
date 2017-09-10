require('dotenv').load();
const redash = require('./lib/redash');
const salesforce = require('./lib/salesforce');
const { logger, finished } = require('./lib/handlers');

const env = process.env.NODE_ENV;

(async function init() {
  logger.info('starting upload in', env);
  await salesforce.connect();
  const contactsQuery = await redash.fetchQuery(2928);
  await salesforce.upsertContacts(contactsQuery.data.rows);
  finished();
}());
