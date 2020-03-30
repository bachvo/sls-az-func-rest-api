const utils = require("../utils");
const constants = require("../constants");

module.exports.handler = async function(context) {
  const { storage, storageClient } = utils.getAzStorage();
  const PARTITION_KEY = 'skills';

  const skillsUIQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'ui');
  const skillsUXQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'ux');
  const skillsDevQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'dev');
  const skillsUIPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsUIQuery);
  const skillsUXPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsUXQuery);
  const skillsDevPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsDevQuery);

  const promises = [skillsUIPromise, skillsUXPromise, skillsDevPromise];
  const resolvedPromises = await Promise.all(promises);

  context.res = {
    status: 200,
    body: {
      data: resolvedPromises,
    }
  };
};
