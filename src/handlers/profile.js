const utils = require("../utils");
const constants = require("../constants");

module.exports.handler = async function(context) {
  const { storage, storageClient } = utils.getAzStorage();
  const PARTITION_KEY = 'profile';
  
  const query = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY);
  const data = await utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, query);

  context.res = {
    status: 200,
    body: {
      data,
    }
  };
};
