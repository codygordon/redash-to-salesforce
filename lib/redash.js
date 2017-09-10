const request = require('axios');
const logger = require('./logger');
const { error: errorHandler } = require('./handlers');

const redashUrl = process.env.REDASH_API_URL;
const apiKey = process.env.REDASH_API_KEY;

exports.fetchQuery = async (queryId) => {
  logger.info('retrieving redash query', { id: queryId });

  const url = `${redashUrl}/${queryId}/results.json?api_key=${apiKey}`;
  const res = await request.get(url)
    .catch(err => errorHandler(err));

  logger.ok({
    rows: res.data.query_result.data.rows.length,
    last_updated: res.data.query_result.retrieved_at,
  });

  return res.data.query_result;
};
