const fetch = require('node-fetch');
const logger = require('./logger');
const { fatal } = require('./handlers');

const redashUrl = process.env.REDASH_BASE_URL;
const apiKey = process.env.REDASH_API_KEY;

exports.fetchQuery = async (queryId) => {
  let url = `${redashUrl}/api/queries/${queryId}/results.json`;

  logger.info('retrieving from', url);

  url += `?api_key=${apiKey}`;

  const res = await fetch(url).catch(err => fatal(err.message));

  if (res.status >= 400) fatal(`status ${res.status} - ${res.statusText}`);

  const data = await res.json();

  logger.ok({
    rows: data.query_result.data.rows.length,
    last_updated: data.query_result.retrieved_at,
  });

  return data.query_result;
};
