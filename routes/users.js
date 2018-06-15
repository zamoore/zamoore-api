'use strict';

// External modules
const bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');

// Model imports
const { User } = require('../models');

const rootPath = '/api/users';

exports.plugin = {
  name: 'userRoutes',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: rootPath,
      handler: async () => await User.findAll()
    });

    server.route({
      method: 'DELETE',
      path: `${rootPath}/{userId}`,
      handler: async (request, h) => {
        let user = await User.findById(request.params.userId);

        if (!user) {
          return Boom.notFound();
        }

        await user.destroy();

        return h.response().code(202);
      }
    });

    server.route({
      method: 'POST',
      path: rootPath,
      handler: async (request, h) => {
        let { email, password, role, username } = request.payload;
        let newUser;

        password = await bcrypt.hash(password, 10);
        newUser = await User.create({ email, password, role, username });

        return h.response(newUser).code(201);
      }
    });
  }
};
