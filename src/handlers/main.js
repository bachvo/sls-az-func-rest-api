const model = require("../data.json");

module.exports.handler = async function(context) {
  context.log('JavaScript HTTP trigger function processed a request.');

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      data: model,
    },
  };
};
