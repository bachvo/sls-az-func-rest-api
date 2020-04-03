const utils = require("../utils");
const constants = require("../constants");

module.exports.fetch = async function() {
  const { storage, storageClient } = utils.getAzStorage();
  const PARTITION_KEY = 'profile';
  
  const query = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY);
  return utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, query).then(data => ({ [PARTITION_KEY]: data }));
};
