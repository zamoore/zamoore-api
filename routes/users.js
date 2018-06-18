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
      method: 'POST',
      path: rootPath,
      handler: async (request, h) => {
        let { email, password, role, username } = request.payload;
        let newUser;

        password = await bcrypt.hash(password, 10);
        newUser = await User.create({ email, password, role, username });

        return h.response(newUser).code(201);
      },
      options: {
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid(['basic', 'author', 'admin']).required(),
            username: Joi.string().required()
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: rootPath,
      handler: async () => await User.findAll()
    });

    server.route({
      method: 'GET',
      path: `${rootPath}/{userId}`,
      handler: async (request, h) => {
        let user = await User.findById(request.params.userId);
        return user ? h.response(user).code(200) : Boom.notFound();
      },
      options: {
        validate: {
          params: {
            userId: Joi.number().required()
          }
        }
      }
    });

    server.route({
      method: 'PATCH',
      path: `${rootPath}/{userId}`,
      handler: async (request, h) => {
        let user = await User.findById(request.params.userId);

        if (!user) {
          return Boom.notFound();
        }

        Object.keys(request.payload).forEach((attr) => {
          let newValue = request.payload[attr];

          user[attr] = attr === 'password'
            ? bcrypt.hashSync(newValue, 10)
            : newValue;
        });

        await user.save();

        return h.response(user).code(200);
      },
      options: {
        validate: {
          params: {
            userId: Joi.number().required()
          },
          payload: {
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(),
            role: Joi.string().valid(['basic', 'author', 'admin']).optional(),
            username: Joi.string().optional()
          }
        }
      }
    })

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
      },
      options: {
        validate: {
          params: {
            userId: Joi.number().required()
          }
        }
      }
    });
  }
};
