const utils = require("../utils");
const constants = require("../constants");

module.exports.fetch = async function() {
  const { storage, storageClient } = utils.getAzStorage();
  const PARTITION_KEY = 'contactInfo';

  const emailQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'email');
  const phoneQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'phone');
  const linkedinQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'linkedin');
  const githubQuery = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', 'github');
  const emailPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, emailQuery);
  const phonePromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, phoneQuery);
  const linkedinPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, linkedinQuery);
  const githubPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, githubQuery);

  const promises = [emailPromise, phonePromise, linkedinPromise, githubPromise];
  return Promise.all(promises).then(data => ({ [PARTITION_KEY]: data }));
};
