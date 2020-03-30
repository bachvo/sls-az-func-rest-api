const model = require('../data.json');
const storage = require('azure-storage');
const table = 'https://portfolio-db.table.cosmos.azure.com:443/';
const accountKey = 'eXeZt0qrvSEnAZgKxBzBaaFcZZtlo9hr4DEFQH6dW3HWxtgunYfXUONtsLrthnH0OfF85EACQkVY2wQQphZtuA==';
const accountName = 'portfolio-db';
const protocol = 'https';
const connectionString = `DefaultEndpointsProtocol=${protocol};AccountName=${accountName};AccountKey=${accountKey};TableEndpoint=${table};`;
const storageClient = storage.createTableService(connectionString);

const filterOut = [
  'PartitionKey',
  'RowKey',
  'Timestamp',
  '.metadata',
]

function sanitizeResults(result) {
  const entity = { ...result.entries[0] };
  filterOut.forEach(filterField => {
    delete entity[filterField];
  })

  const entityKeys = Object.keys(entity);
  const finishResult = entityKeys.reduce((obj, data) => {
    obj[data] = entity[data]._
    return obj;
  }, {});

  return finishResult;
}

module.exports.handler = function(context) {
  const query = new storage.TableQuery().where('PartitionKey eq ?', 'profile');
  
  storageClient.queryEntities('portfolio', query, null, function(error, result, response) {
    const _model= { ...model };
    const profileFields = sanitizeResults(result);
  
    Object.assign(_model.profile, profileFields)
    context.res = {
      status: 200,
      body: {
        data: _model
      }
    };
    context.done()
  })
};
