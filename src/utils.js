/** 
 * Gets the param from either the query string
 * or body of request
 */
module.exports.getQueryOrBodyParam = (req, param) => {
  const { query, body } = req;
  if (query && query[param]) {
    return query[param];
  }
  if (body && body[param]) {
    return body[param];
  }
};

const FILTER = [
  'PartitionKey',
  'RowKey',
  'Timestamp',
  '.metadata',
]

/**
 * Sanitize the results from raw db query
 *
 * @param {object} result - raw object from db query
 * @return {object} sanitized object from query
 */
function sanitizeResults(result) {
  const entity = { ...result.entries[0] };
  FILTER.forEach(filterField => {
    delete entity[filterField];
  })

  const entityKeys = Object.keys(entity);
  const finishResult = entityKeys.reduce((obj, data) => {
    obj[data] = entity[data]._
    return obj;
  }, {});

  return finishResult;
}

/**
 * Promisfy query entities db query
 *
 * @param {object} storageClient - azure storage
 * @param {string} db - azure database table name
 * @param {object} query - query using TableQuery constructor
 * @return {promise} return sanitized results
 */
module.exports.promisfyQueryEntities = (storageClient, db, query) => {
  return new Promise((resolve) => {
    storageClient.queryEntities(db, query, null, function(error, result, response) {
      resolve(sanitizeResults(result));
    });
  })
}

/**
 * Create results hash from the array of query promises
 *
 * @param {array} collection - collection of results
 * @return {object} same collection data but represented as an object
 */
module.exports.createResultsHash = (collection) => {
  return collection.reduce((result, data) => {
    const key = Object.keys(data)[0];
    result[key] = data[key];
    return result;
  }, {});
}