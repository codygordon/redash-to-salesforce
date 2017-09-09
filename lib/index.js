require('dotenv').load();
const salesforceConnect = require('./salesforce-connect');
const redashFetch = require('./redash-fetch');
const upsertContacts = require('./upsert-contacts');

(async function init() {
  const salesforce = await salesforceConnect();
  const redashRes = await redashFetch(2928);
  await upsertContacts(salesforce, redashRes.data.rows);
}());
