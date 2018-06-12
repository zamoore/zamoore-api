'use strict';

require('dotenv').config();

const Hapi = require('hapi');

const server = Hapi.server({
  port : 3000,
  host: 'localhost'
});

const init = async () => {
  await server.register(require('./routes/users'));
  await server.register(require('./routes/articles'));

  await server.start();

  console.log(`Server running at ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

module.exports = server;
