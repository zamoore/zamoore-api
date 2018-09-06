'use strict';

// External modules
const { plugin: jwtPlugin } = require('hapi-auth-jwt2');

// App modules
const redis = require('./redis');

const baseValidation = {
  key: process.env.JWT_KEY,
  verifyOptions: { algorithms: ['HS256'] },
  errorFunc(errorContext) {
    errorContext.errorType = 'unauthorized';
    errorContext.message = 'token is invalid for that operation';

    return errorContext;
  }
};
const isAdmin = (credentials) => credentials.role === 'admin';

exports.configureAuth = async (server) => {
  await server.register(jwtPlugin);

  server.auth.strategy('admin', 'jwt', Object.assign({
    validate: async (credentials) => {
      let revokedToken = await redis.getAsync(`token:${credentials.jti}`);

      return {
        isValid: !revokedToken && isAdmin(credentials),
        credentials
      };
    }
  }, baseValidation));

  server.auth.strategy('author', 'jwt', Object.assign({
    validate: async (credentials) => {
      let revokedToken = await redis.getAsync(`token:${credentials.jti}`);

      return {
        isValid: !revokedToken && (isAdmin(credentials) || credentials.role === 'author'),
        credentials
      };
    }
  }, baseValidation));

  server.auth.strategy('auth', 'jwt', Object.assign({
    validate: async (credentials) => {
      let revokedToken = await redis.getAsync(`token:${credentials.jti}`);

      return {
        isValid: !revokedToken,
        credentials
      };
    }
  }, baseValidation));

  server.auth.strategy('self', 'jwt', Object.assign({
    validate: async (credentials, req) => {
      let revokedToken = await redis.getAsync(`token:${credentials.jti}`);
      let isUser = credentials.id === parseInt(req.params.userId, 10);

      return {
        isValid: !revokedToken && (isAdmin(credentials) || isUser),
        credentials
      };
    }
  }, baseValidation));
}
