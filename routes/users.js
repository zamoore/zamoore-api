'use strict';

const Boom = require('boom');
const Joi = require('joi');

const { User } = require('../models');

const rootPath = '/api/users';

exports.plugin = {
  name: 'userRoutes',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: rootPath,
      handler: async () => {
        let users = await User.findAll();

        return users;
      }
    });

    server.route({
      method: 'POST',
      path: rootPath,
      handler: async () => {
        let newUser = await User.create({
          role: 'admin',
          email: 'test@test.com',
          password: '12345',
          username: 'test'
        });

        return newUser;
      }
    });
  }
};
