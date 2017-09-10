const jsforce = require('jsforce');
const logger = require('./logger');
const { fatal } = require('./handlers');

const username = process.env.SALESFORCE_USERNAME;
const password = process.env.SALESFORCE_PASSWORD;
const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;
const extId = process.env.SALESFORCE_EXTERNAL_ID;

const sf = new jsforce.Connection();

exports.connect = async () => {
  logger.info('connecting to salesforce');

  const userInfo = await sf.login(username, password + securityToken)
    .catch(err => fatal(err.message));

  logger.ok({ org_id: userInfo.organizationId });
};

exports.upsertContacts = async (data) => {
  logger.info('upserting contacts');

  const res = await sf.sobject('Contact').upsert(data, extId)
    .catch(err => fatal(err.message));

  const errors = [].concat(...res.map(row => row.errors));
  if (errors.length) errors.forEach(err => logger.error(err));

  logger.ok({
    total: res.length,
    new: res.filter(row => row.id).length,
    errors: res.filter(row => !row.success).length,
  });
};
