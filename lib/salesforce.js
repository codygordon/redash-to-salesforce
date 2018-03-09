const SalesforceConnection = require('node-salesforce-connection');
const timeout = require('timeout-then');
const chunk = require('lodash.chunk');
const logger = require('./logger');
const { fatal } = require('./handlers');

const hostname = process.env.SALESFORCE_HOSTNAME;
const apiVersion = process.env.SALESFORCE_API_VERSION;
const username = process.env.SALESFORCE_USERNAME;
const password = process.env.SALESFORCE_PASSWORD;
const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;

const sf = new SalesforceConnection();

exports.connect = async () => {
  logger.info('connecting to', hostname);

  const connected = await sf.soapLogin({
    hostname,
    apiVersion,
    username,
    password: password + securityToken,
  }).catch(err => fatal(err.message));

  if (!connected) return null;

  if (connected.userInfo) logger.ok('orgId:', connected.userInfo.organizationId);

  return sf;
};

const batchPoll = async (jobId, batchId) => {
  /* wait 5s before each poll (each request counts as an API call) */

  await timeout(5000);

  const baseUrl = `/services/async/${apiVersion}/job`;

  const batch = await sf.rest(`${baseUrl}/${jobId}/batch/${batchId}`, {
    method: 'get',
    api: 'bulk',
  }).catch(err => fatal(err.message));

  return batch;
};

exports.upsert = async (data, object, extId, lookups) => {
  /* first, map any object lookups into the required nested format */

  let parsedData = [];

  if (lookups) {
    lookups.forEach((lookup) => {
      parsedData = data.map(row => ({
        ...row,
        [lookup.relationship.toLowerCase()]: {
          [lookup.extId.toLowerCase()]: row[lookup.relationship.toLowerCase()],
        },
      }));
    });
  } else parsedData = data;

  /* chunking as each bulk batch can only contain a max of 10,000 records */

  const chunkedData = chunk(parsedData, 10000);

  logger.info('upserting', chunkedData.length, 'data batch(es) into', object, 'object');

  const baseUrl = `/services/async/${apiVersion}/job`;

  const jobInfo = {
    operation: 'upsert',
    object,
    contentType: 'JSON',
    externalIdFieldName: extId,
  };

  /* set up the job once */

  const job = await sf.rest(baseUrl, {
    method: 'post',
    api: 'bulk',
    headers: 'Content-Type: application/json',
    body: jobInfo,
  }).catch(err => fatal(JSON.parse(err.message).exceptionMessage));

  if (!job) return null;

  /* call to abort/close job on failure or success */
  let closeState = 'Closed';
  const closeJob = async () => sf.rest(`${baseUrl}/${job.id}`, {
    method: 'post',
    api: 'bulk',
    headers: 'Content-Type: application/json',
    body: { state: closeState },
  }).catch(err => fatal(JSON.parse(err.message).exceptionMessage));

  const handleBatchError = (err) => {
    closeState = 'Aborted';
    fatal(JSON.parse(err.message).exceptionMessage);
  };

  /* each chunked batch is processed synchronously to avoid concurrency errors */

  let batchIndex = 0;

  for (const batchData of chunkedData) {
    let batch = await sf.rest(`${baseUrl}/${job.id}/batch`, {
      method: 'post',
      api: 'bulk',
      headers: 'Content-Type: application/json',
      body: batchData,
    }).catch(handleBatchError);

    /* poll the batch state until it no longer queued or in progress
      (see possible batch states: https://goo.gl/H6ACx3) */

    while (['Queued', 'InProgress'].includes(batch.state)) {
      batch = await batchPoll(job.id, batch.id);
    }

    /* if any batches fail stop the script */

    if (['Failed', 'Not Processed'].includes(batch.state)) {
      closeState = 'Aborted';
      fatal(
        `batch ${batchIndex + 1}/${chunkedData.length} ${batch.state},`,
        `${batch.numberRecordsFailed}/${batchData.length} records failed:`, batch.stateMessage,
      );
      break;
    }

    const result = await sf.rest(`${baseUrl}/${job.id}/batch/${batch.id}/result`, {
      method: 'get',
      api: 'bulk',
    }).catch(handleBatchError);

    /* log record row errors, if any */

    result.forEach((res, i) => {
      if (!res.success) {
        const id = batchData[i][extId.toLowerCase()];
        res.errors.forEach((error) => {
          logger.error(`record skipped (extId: ${id}):`, error.message);
        });
      }
    });

    const successCount = result.filter(res => res.success).length;

    logger.ok(
      `batch ${batchIndex + 1}/${chunkedData.length}:`,
      `${successCount}/${batchData.length} ${object} records upserted`,
    );

    batchIndex += 1;
  }

  await closeJob();

  return logger.info('all batch(es) processed for', object, 'object');
};
