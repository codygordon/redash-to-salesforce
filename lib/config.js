/* The config objects in this array should be in the order you
  need them to be upserted, i.e. new Contacts should exist before
  new Opportunities with a Contact ref field, etc. */

module.exports = [
  {
    redashQueryId: '123',
    salesforceObject: 'Contacts',
    salesforceExtId: 'sample_ext_id__c',
  },
  // {
  //   salesforceObject: '',
  //   salesforceExtId: '',
  //   redashQueryId: '',
  // },
  // {
  //   salesforceObject: '',
  //   salesforceExtId: '',
  //   redashQueryId: '',
  // },
];
