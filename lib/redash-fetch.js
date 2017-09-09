const request = require('axios');
const errorHandler = require('./handlers').error;

const redashUrl = process.env.REDASH_API_URL;
const apiKey = process.env.REDASH_API_KEY;

module.exports = async (queryId) => {
  const url = `${redashUrl}/${queryId}/results.json?api_key=${apiKey}`;
  const res = await request(url).catch(err => errorHandler(err));
  return res.data.query_result;
};
