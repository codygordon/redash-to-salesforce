const { fatal } = require('./handlers');

/* the config objects in this array should be in the order you
  need them to be upserted, i.e. new Contacts should exist before
  new Opportunities with a Contact ref field, etc.

  the salesforce api is case-insensitive (even though objects names
  and fields are typically capitalized), so either way will work here */

const config = (process.env.QUERYCONFIG
                ? JSON.parse(process.env.QUERYCONFIG):
                [
  // {
  //   redashQueryId: 54,
  //   salesforceObject: 'account',
  //   salesforceExtId: 'your_account_id__c',
  // },
  // {
  //   redashQueryId: 55,
  //   salesforceObject: 'contact',
  //   salesforceExtId: 'your_user_id__c',
  //   salesforceLookups: [{
  //     relationship: 'account__r',
  //     extId: 'your_account_id__c',
  //   }],
  // },
  // {
  //   redashQueryId: 56,
  //   salesforceObject: 'opportunity',
  //   salesforceExtId: 'your_opportunity_id__c',
  //   salesforceLookups: [{
  //     relationship: 'contact__r',
  //     extId: 'your_user_id__c',
  //   }],
  // },
]);

exports.config = config;

exports.validatedConfig = () => { // eslint-disable-line
  try {
    if (!config || !config.length) {
      throw new Error('config object(s) required');
    }
    config.forEach((configItem, i) => {
      if (!Number.isInteger(parseInt(configItem.redashQueryId, 10))) {
        throw new Error(`(config[${i}]) redash redashQueryId should be integer`);
      }
      if (typeof configItem.salesforceObject !== 'string') {
        throw new Error(`(config[${i}]) "salesforceObject" should be string`);
      }
      if (typeof configItem.salesforceExtId !== 'string') {
        throw new Error(`(config[${i}]) "salesforceExtId" should be string`);
      }
      if (configItem.salesforceLookups) {
        if (!Array.isArray(configItem.salesforceLookups)) {
          throw new Error(`(config[${i}]) "salesforceLookups" should be array`);
        }
        configItem.salesforceLookups.forEach((lookupItem, j) => {
          if (typeof lookupItem.relationship !== 'string') {
            throw new Error(`(config[${i}] lookup[${j}]) "relationship" should be string`);
          }
          if (typeof lookupItem.extId !== 'string') {
            throw new Error(`(config[${i}] lookup[${j}]) "salesforceExtId" should be string`);
          }
        });
      }
    });
    return true;
  } catch (err) { fatal(err.message); }
};
