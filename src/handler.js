const serverless = require('serverless-http');

const app = require('./app');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // you can do other things here
  const result = await handler(event, context);
  // and here
  return result;
};
