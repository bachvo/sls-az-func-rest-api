const utils = require("../utils");
const constants = require("../constants");

module.exports.fetch = async function() {
  const { storage, storageClient } = utils.getAzStorage();
  const PARTITION_KEY = 'skills';

  const skillsUIQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'ui');
  const skillsUXQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'ux');
  const skillsDevQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'dev');
  const skillsUIPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsUIQuery);
  const skillsUXPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsUXQuery);
  const skillsDevPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsDevQuery);

  const promises = [skillsUIPromise, skillsUXPromise, skillsDevPromise];
  return Promise.all(promises).then(data => ({ [PARTITION_KEY]: data }));
};
