const model = require('../data.json');
const utils = require("../utils");
const storage = require('azure-storage');
const table = 'https://portfolio-db.table.cosmos.azure.com:443/';
const accountKey = 'eXeZt0qrvSEnAZgKxBzBaaFcZZtlo9hr4DEFQH6dW3HWxtgunYfXUONtsLrthnH0OfF85EACQkVY2wQQphZtuA==';
const accountName = 'portfolio-db';
const protocol = 'https';
const connectionString = `DefaultEndpointsProtocol=${protocol};AccountName=${accountName};AccountKey=${accountKey};TableEndpoint=${table};`;
const storageClient = storage.createTableService(connectionString);

const TABLE_DB = 'portfolio';
const CONTACTINFO_PARTITION_KEY = 'contactInfo';
const PROFILE_PARTITION_KEY = 'profile';
const INTRO_PARTITION_KEY = 'intro';
const SKILLS_PARTITION_KEY = 'skills';

module.exports.handler = async function(context) {
  /** query **/
  const queryProfile = new storage.TableQuery().where('PartitionKey eq ?', PROFILE_PARTITION_KEY);
  const queryIntro = new storage.TableQuery().where('PartitionKey eq ?', INTRO_PARTITION_KEY);

  const emailQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'email');
  const phoneQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'phone');
  const linkedinQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'linkedin');
  const githubQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'github');

  const skillsUIQuery = new storage.TableQuery().where('PartitionKey eq ?', SKILLS_PARTITION_KEY).and('RowKey eq ?', 'ui');
  const skillsUXQuery = new storage.TableQuery().where('PartitionKey eq ?', SKILLS_PARTITION_KEY).and('RowKey eq ?', 'ux');
  const skillsDevQuery = new storage.TableQuery().where('PartitionKey eq ?', SKILLS_PARTITION_KEY).and('RowKey eq ?', 'dev');

  /** query entities **/
  const profilePromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, queryProfile).then(data => ({ profile: data }));
  const introPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, queryIntro).then(data => ({ intro: data }));

  const emailPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, emailQuery);
  const phonePromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, phoneQuery);
  const linkedinPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, linkedinQuery);
  const githubPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, githubQuery);

  const skillsUIPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, skillsUIQuery);
  const skillsUXPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, skillsUXQuery);
  const skillsDevPromise = utils.promisfyQueryEntities(storageClient, TABLE_DB, skillsDevQuery);

  const contactInfoCollection = [emailPromise, phonePromise, linkedinPromise, githubPromise];
  const skillsCollection = [skillsUIPromise, skillsUXPromise, skillsDevPromise];

  const skillsPromiseAll = Promise.all(skillsCollection).then(data => ({ skills: data }));
  const contactPromiseAll = Promise.all(contactInfoCollection).then(data => ({ contactInfo: data }));

  const promiseAll = [introPromise, profilePromise, skillsPromiseAll, contactPromiseAll];
  await Promise.all(promiseAll).then(data => {
    const _data = utils.createResultsHash(data);
    context.res = {
      status: 200,
      body: {
        data: _data,
      }
    };
  })
};
