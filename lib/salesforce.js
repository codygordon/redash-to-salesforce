const jsforce = require('jsforce');
const errorHandler = require('./handlers').error;

const username = process.env.SALESFORCE_USERNAME;
const password = process.env.SALESFORCE_PASSWORD;
const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;

const sf = new jsforce.Connection();

exports.connect = async () => (
  sf.login(username, password + securityToken).catch(err => errorHandler(err))
);

exports.upsertContacts = async (data) => {
  const res = await sf.sobject('Contact').upsert(data, 'ak_id__c')
    .catch(err => errorHandler(err));

  const results = {
    total: res.length,
    new: res.filter(row => row.id).length,
    errors: res.filter(row => !row.success).length,
  };

  console.log('upserted:', results);
};
