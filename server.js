'use strict';

require('dotenv').config();

const Hapi = require('hapi');

const server = Hapi.server({
  port : 3000,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/',
  handler: async () => {
    return 'Yo mama';
  }
});

const init = async () => {
  await server.start();

  console.log(`Server running at ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();

module.exports = server;
