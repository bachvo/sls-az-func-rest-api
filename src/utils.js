/** Gets the param from either the query string
4 * or body of request
5 */
module.exports.getQueryOrBodyParam = (req, param) => {
  const { query, body } = req;
  if (query && query[param]) {
    return query[param];
  }
  if (body && body[param]) {
    return body[param];
  }
};