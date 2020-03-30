const model = require("../data");

module.exports.handler = async function(context) {
  context.res = {
    status: 200,
    body: {
      data: model,
    }
  };
};
