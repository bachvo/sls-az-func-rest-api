const utils = require("../utils");
const introHandler = require("./intro");
const contactInfoHandler = require("./contact-info");

module.exports.handler = async function(context) {
  const introPromise = introHandler.fetch();
  const contactInfoPromise = contactInfoHandler.fetch();

  const promiseAll = [
    introPromise, 
    contactInfoPromise,
  ];

  const data = await Promise.all(promiseAll);

  context.res = {
    status: 200,
    body: {
      data: utils.createResultsHash(data),
    }
  };
};
