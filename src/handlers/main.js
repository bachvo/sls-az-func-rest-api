const utils = require("../utils");
const introHandler = require("./intro");
const profileHandler = require("./profile");
const skillsHandler = require("./skills");
const contactInfoHandler = require("./contact-info");
const workExpHandler = require("./workexp");
const projectsHandler = require("./projects");

module.exports.handler = async function(context) {
  const profilePromise = profileHandler.fetch();
  const introPromise = introHandler.fetch();
  const contactPromiseAll = contactInfoHandler.fetch();
  const skillsPromiseAll = skillsHandler.fetch();
  const workExpCardsPromiseAll = workExpHandler.fetch();
  const projectsCardsPromiseAll = projectsHandler.fetch();

  const promiseAll = [
    introPromise, 
    profilePromise, 
    skillsPromiseAll,
    contactPromiseAll,
    workExpCardsPromiseAll,
    projectsCardsPromiseAll,
  ];

  const data = await Promise.all(promiseAll);
  context.res = {
    status: 200,
    body: {
      data: utils.createResultsHash(data),
    }
  };
};
