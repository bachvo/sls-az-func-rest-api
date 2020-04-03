const utils = require("../utils");
const constants = require("../constants");

module.exports.fetch = async function() {
  const { storage, storageClient } = utils.getAzStorage();
  const PARTITION_KEY = 'projects';
  const ROW_KEY = 'projectCard';
  const CARD_COLLECTION_LENGTH = 4;
  const cardsCollection = Array(CARD_COLLECTION_LENGTH).fill('');

  const query = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY);
  const containerPromise = utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, query).then(data => ({ [PARTITION_KEY]: data }));
  const cardsPromiseCollection = cardsCollection.map((_, index) => {
    const query = new storage.TableQuery().where('PartitionKey eq ?', PARTITION_KEY).and('RowKey eq ?', `${ROW_KEY}${index + 1}`);
    return utils.promisfyQueryEntities(storageClient, constants.TABLE_DB, query);
  });
  const cardsPromiseAll = Promise.all(cardsPromiseCollection).then(data => ({ [ROW_KEY]: data }));

  const promiseAll = [
    containerPromise, 
    cardsPromiseAll,
  ];

  return Promise.all(promiseAll).then(data => {
    const _data = utils.createResultsHash(data);
    const workExpCards = _data[ROW_KEY].map((card) => {
      const galleryArray = JSON.parse(card.gallery);
      card.gallery = galleryArray;
      return card;
    });
    _data[PARTITION_KEY].cards = workExpCards;

    delete _data[ROW_KEY];

    return _data;
  })
};
