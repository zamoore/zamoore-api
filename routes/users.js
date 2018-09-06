'use strict';

// External modules
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');

// App modules
const extractIncludes = require('../middleware/extract-includes');
const redis = require('../redis');

// Model imports
const { Article, User } = require('../models');

const rootPath = '/api/users';

const includeMapping = {
  articles: {
    model: Article,
    as: 'articles'
  }
};

exports.plugin = {
  name: 'userRoutes',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: rootPath,
      handler: async (request) => {
        return await User.findAll({
          include: request.pre.includeArray,
          attributes: { exclude: ['password'] }
        });
      },
      options: {
        pre: [
          {
            method: extractIncludes(includeMapping),
            assign: 'includeArray'
          }
        ]
      }
    });

    server.route({
      method: 'GET',
      path: `${rootPath}/{userId}`,
      handler: async (request, h) => {
        let user = await User.findById(request.params.userId, {
          include: request.pre.includeArray,
          attributes: { exclude: ['password'] }
        });
        return user ? h.response(user).code(200) : Boom.notFound();
      },
      options: {
        pre: [
          {
            method: extractIncludes(includeMapping),
            assign: 'includeArray'
          }
        ],
        validate: {
          params: {
            userId: Joi.number().required()
          }
        }
      }
    });

    server.route({
      method: 'POST',
      path: rootPath,
      handler: async (request, h) => {
        let { email, password, role, username } = request.payload;
        let newUser;

        if (['admin', 'author'].includes(role) && _.get(request, 'auth.credentials.role') !== 'admin') {
          return Boom.forbidden('you do not have the authority to assign admin credentials');
        }

        password = await bcrypt.hash(password, 10);
        newUser = await User.create({ email, password, role, username });

        return h.response().code(201);
      },
      options: {
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid(['basic', 'author', 'admin']).optional(),
            username: Joi.string().required()
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

        if (['admin', 'author'].includes(request.payload.role) && _.get(request, 'auth.credentials.role') !== 'admin') {
          return Boom.forbidden('you do not have the authority to assign admin credentials');
        }

        Object.keys(request.payload).forEach((attr) => {
          let newValue = request.payload[attr];

          user[attr] = attr === 'password'
            ? bcrypt.hashSync(newValue, 10)
            : newValue;
        });

        await user.save();

        redis.set(`token:${request.auth.credentials.jti}`, request.auth.credentials.exp);

        return h.response().code(204);
      },
      options: {
        auth: 'self',
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

        redis.set(`token:${request.auth.credentials.jti}`, request.auth.credentials.exp);

        return h.response().code(202);
      },
      options: {
        auth: 'self',
        validate: {
          params: {
            userId: Joi.number().required()
          }
        }
      }
    });
  }
};
