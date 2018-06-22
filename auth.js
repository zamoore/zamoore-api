'use strict';

const { plugin: jwtPlugin } = require('hapi-auth-jwt2');

const baseValidation = {
  key: process.env.JWT_KEY,
  verifyOptions: { algorithms: ['HS256'] }
};
const isAdmin = (credentials) => credentials.role === 'admin';

exports.configureAuth = async (server) => {
  await server.register(jwtPlugin);

  server.auth.strategy('admin', 'jwt', Object.assign({
    validate: (credentials) => ({ isValid: isAdmin(credentials), credentials })
  }, baseValidation));

  server.auth.strategy('author', 'jwt', Object.assign({
    validate: (credentials) => ({
      isValid: isAdmin(credentials) || credentials.role === 'author',
      credentials
    })
  }, baseValidation));

  server.auth.strategy('auth', 'jwt', Object.assign({
    validate: (credentials) => ({ isValid: true, credentials })
  }, baseValidation));

  server.auth.strategy('self', 'jwt', Object.assign({
    validate: (credentials, req) => ({
      isValid: isAdmin(credentials) || credentials.id === parseInt(req.params.userId, 10),
      credentials
    })
  }, baseValidation));
}
