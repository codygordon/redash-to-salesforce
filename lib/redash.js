const fetch = require('node-fetch');
const logger = require('./logger');
const { fatal } = require('./handlers');

const redashUrl = process.env.REDASH_BASE_URL;
const apiKey = process.env.REDASH_API_KEY;

exports.fetchQuery = async (queryId) => {
  let url = `${redashUrl}/api/queries/${queryId}/results.json`;

  logger.info('fetching', url);

  url += `?api_key=${apiKey}`;

  const res = await fetch(url).catch(err => fatal(err.message));

  if (!res) return null;

  if (res.status === 404) {
    return fatal(`response: ${res.status} - check the query id and api key`);
  } else if (res.status > 404) {
    return fatal(`response: ${res.status} - ${res.statusText}`);
  }

  const data = await res.json().catch(err => fatal(err.message));

  logger.ok({
    rows: data.query_result.data.rows.length,
    last_updated: data.query_result.retrieved_at,
  });

  return data.query_result;
};
