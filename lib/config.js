const { fatal } = require('./handlers');

/* the config objects in this array should be in the order you
  need them to be upserted, i.e. new Contacts should exist before
  new Opportunities with a Contact ref field, etc.

  the salesforce api is case-insensitive (even though objects names
  and fields are typically capitalized), so either way will work here */

const config = [
  {
    // redashQueryId: 3072,
    salesforceObject: 'contact',
    salesforceExtId: 'ak_user_id2__c',
  },
  {
    redashQueryId: 3073,
    salesforceObject: 'donation__c',
    salesforceExtId: 'ak_transaction_id__c',
    salesforceLookups: [{
      relationship: 'contact__r',
      extId: 'ak_user_id__c',
    }],
  },
  // {
  //   salesforceObject: '',
  //   salesforceExtId: '',
  //   redashQueryId: '',
  // },
];

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
