require('dotenv').load();
const logger = require('./logger');
const redash = require('./redash');
const salesforce = require('./salesforce');
const { finished } = require('./handlers');

const env = process.env.NODE_ENV;

(async function start() {
  logger.info('starting upload in', env);
  await salesforce.connect();
  const contactsQuery = await redash.fetchQuery(2928);
  await salesforce.upsertContacts(contactsQuery.data.rows);
  finished();
}());
