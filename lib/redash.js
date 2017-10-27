const fetch = require('node-fetch');
const logger = require('./logger');
const { fatal } = require('./handlers');

const redashUrl = process.env.REDASH_BASE_URL;
const apiKey = process.env.REDASH_API_KEY;

exports.fetchQuery = async (queryId) => {
  const url = `${redashUrl}/api/queries/${queryId}/results.json`;

  logger.info('fetching', url);

  const res = await fetch(`${url}?api_key=${apiKey}`).catch(err => fatal(err.message));

  if (!res) return null;

  if (res.status >= 404) {
    fatal(`response: ${res.status} - ${res.status === 404
      ? 'check the query id and api key' : res.statusText}`);
    return null;
  }

  const data = await res.json().catch(err => fatal(err.message));

  if (!data || !data.query_result) return null;

  logger.ok({
    rows: data.query_result.data.rows.length,
    last_updated: data.query_result.retrieved_at,
  });

  return data.query_result;
};
