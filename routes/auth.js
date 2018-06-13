'use strict';

const jwt = require('jsonwebtoken');
const Boom = require('boom');

// Model imports
const { User } = require('../models');

const rootPath = '/api/auth';

// Routes plugin declaration
exports.plugin = {
  name: 'authRoutes',
  register: async (server, options) => {
    server.route({
      method: 'POST',
      path: rootPath,
      handler: async (request) => {
        let payload = {
          message: 'hello'
        };

        return jwt.sign(payload, process.env.JWT_KEY, {
          algorithm: 'HS256'
        });
      },
      config: { auth: false }
    });
  }
};
