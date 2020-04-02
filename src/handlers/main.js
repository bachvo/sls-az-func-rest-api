const utils = require("../utils");
const constants = require("../constants");

const CONTACTINFO_PARTITION_KEY = 'contactInfo';
const PROFILE_PARTITION_KEY = 'profile';
const INTRO_PARTITION_KEY = 'intro';
const SKILLS_PARTITION_KEY = 'skills';
const PROJECTS_PARTITION_KEY = 'projects';
const WORKEXP_PARTITION_KEY = 'workExp';
const WORKEXP_CARD_ROW_KEY = 'workCard';
const PROJECTS_CARD_ROW_KEY = 'projectCard';
const CARD_COLLECTION_LENGTH = 4;

module.exports.handler = async function(context) {
  const { storage, storageClient } = utils.getAzStorage();

  const cardsCollection = Array(CARD_COLLECTION_LENGTH).fill('');

  /** query **/
  const queryProfile = new storage.TableQuery().where('PartitionKey eq ?', PROFILE_PARTITION_KEY);
  const queryIntro = new storage.TableQuery().where('PartitionKey eq ?', INTRO_PARTITION_KEY);
  const queryProjects = new storage.TableQuery().where('PartitionKey eq ?', PROJECTS_PARTITION_KEY);
  const queryWorkExp = new storage.TableQuery().where('PartitionKey eq ?', WORKEXP_PARTITION_KEY).and('RowKey eq ?', 'work');

  const emailQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'email');
  const phoneQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'phone');
  const linkedinQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'linkedin');
  const githubQuery = new storage.TableQuery().where('PartitionKey eq ?', CONTACTINFO_PARTITION_KEY).and('RowKey eq ?', 'github');

  const skillsUIQuery = new storage.TableQuery().where('PartitionKey eq ?', SKILLS_PARTITION_KEY).and('RowKey eq ?', 'ui');
  const skillsUXQuery = new storage.TableQuery().where('PartitionKey eq ?', SKILLS_PARTITION_KEY).and('RowKey eq ?', 'ux');
  const skillsDevQuery = new storage.TableQuery().where('PartitionKey eq ?', SKILLS_PARTITION_KEY).and('RowKey eq ?', 'dev');

  /** query entities **/
  const profilePromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, queryProfile).then(data => ({ [PROFILE_PARTITION_KEY]: data }));
  const introPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, queryIntro).then(data => ({ [INTRO_PARTITION_KEY]: data }));
  const projectsPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, queryProjects).then(data => ({ [PROJECTS_PARTITION_KEY]: data }));
  const workExpPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, queryWorkExp).then(data => ({ [WORKEXP_PARTITION_KEY]: data }));

  const emailPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, emailQuery);
  const phonePromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, phoneQuery);
  const linkedinPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, linkedinQuery);
  const githubPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, githubQuery);

  const skillsUIPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsUIQuery);
  const skillsUXPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsUXQuery);
  const skillsDevPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, skillsDevQuery);

  const workExpCardsPromise = cardsCollection.map((_, index) => {
    const query = new storage.TableQuery().where('PartitionKey eq ?', WORKEXP_PARTITION_KEY).and('RowKey eq ?', `${WORKEXP_CARD_ROW_KEY}${index + 1}`);
    return utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, query);
  });

  const projectsCardsPromise = cardsCollection.map((_, index) => {
    const query = new storage.TableQuery().where('PartitionKey eq ?', PROJECTS_PARTITION_KEY).and('RowKey eq ?', `${PROJECTS_CARD_ROW_KEY}${index + 1}`);
    return utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, query);
  });

  const contactInfoCollection = [emailPromise, phonePromise, linkedinPromise, githubPromise];
  const skillsCollection = [skillsUIPromise, skillsUXPromise, skillsDevPromise];

  const skillsPromiseAll = Promise.all(skillsCollection).then(data => ({ [SKILLS_PARTITION_KEY]: data }));
  const contactPromiseAll = Promise.all(contactInfoCollection).then(data => ({ [CONTACTINFO_PARTITION_KEY]: data }));

  const workExpCardsPromiseAll = Promise.all(workExpCardsPromise).then(data => ({ [WORKEXP_CARD_ROW_KEY]: data }));
  const projectsCardsPromiseAll = Promise.all(projectsCardsPromise).then(data => ({ [PROJECTS_CARD_ROW_KEY]: data }));

  const promiseAll = [
    introPromise, 
    profilePromise, 
    skillsPromiseAll, 
    projectsPromise, 
    workExpPromise, 
    contactPromiseAll,
    workExpCardsPromiseAll,
    projectsCardsPromiseAll,
  ];

  await Promise.all(promiseAll).then(data => {
    const _data = utils.createResultsHash(data);
    const workExpCards = _data[WORKEXP_CARD_ROW_KEY].map((card, index) => {
      card.gallery = [];
      card.skills = [];
      return card;
    });
    const projectCards = _data[PROJECTS_CARD_ROW_KEY].map((card, index) => {
      card.gallery = [];
      card.skills = [];
      return card;
    });
    _data.workExp.cards = workExpCards;
    _data.projects.cards = projectCards;

    delete _data[WORKEXP_CARD_ROW_KEY];
    delete _data[PROJECTS_CARD_ROW_KEY];;

    context.res = {
      status: 200,
      body: {
        data: _data,
      }
    };
  })
};
