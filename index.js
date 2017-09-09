require('dotenv').load();
const redash = require('./lib/redash');
const sf = require('./lib/salesforce');

(async function init() {
  await sf.connect();
  const contactsQuery = await redash.fetchQuery(2928);
  await sf.upsertContacts(contactsQuery.data.rows);
}());
