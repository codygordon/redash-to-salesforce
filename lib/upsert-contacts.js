const errorHandler = require('./handlers').error;

module.exports = async (salesforce, data) => {
  const res = await salesforce.sobject('Contact').upsert(data, 'ak_id__c')
    .catch(err => errorHandler(err));
  const results = {
    total: res.length,
    new: res.filter(row => row.id).length,
    errors: res.filter(row => !row.success).length,
  };

  console.log('upserted:', results);
};
