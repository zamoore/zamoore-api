'use strict';

// Environment configuration
require('dotenv').config();

// External modules
const Hapi = require('hapi');

// Internal modules
const { configureAuth } = require('./auth');

// Create the server
const server = Hapi.server({
  routes: {
    cors: true
  },
  port : 8080,
  host: 'localhost',
  debug: { request: ['error'] }
});

// Server bootstrapping function
const init = async () => {
  // Configure authentication plugin
  await configureAuth(server);

  // Register routes
  await server.register([
    require('./routes/auth'),
    require('./routes/users'),
    require('./routes/articles')
  ]);

  // Start the server
  await server.start();

  console.log(`Server running at ${server.info.uri}`);
};

// General error handling
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
