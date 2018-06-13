'use strict';

const { plugin: jwtPlugin } = require('hapi-auth-jwt2');

const { JWT_KEY } = process.env;

const validate = (credentials) => {
  return { isValid: true, credentials };
};

exports.configureAuth = async (server) => {
  await server.register(jwtPlugin);

  server.auth.strategy('admin', 'jwt', {
    key: JWT_KEY,
    validate,
    verifyOptions: { algorithms: ['HS256'] }
  });
}
