const jsforce = require('jsforce');
const errorHandler = require('./handlers').error;

const username = process.env.SALESFORCE_USERNAME;
const password = process.env.SALESFORCE_PASSWORD;
const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;

module.exports = async () => {
  const connection = new jsforce.Connection();
  await connection.login(username, password + securityToken)
    .catch(err => errorHandler(err));
  return connection;
};
