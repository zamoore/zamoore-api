'use strict';

// External modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');
const uuidv4 = require('uuid/v4');

// App modules
const redis = require('../redis');

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
        let { email, password } = request.payload;
        let user = await User.findOne({ where: { email } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
          return Boom.unauthorized('invalid email or password');
        }

        let { role, username, id } = user;

        return jwt.sign({ role, username, id }, process.env.JWT_KEY, {
          algorithm: 'HS256',
          expiresIn: '6h',
          jwtid: uuidv4()
        });
      },
      options: {
        auth: false,
        validate: {
          payload: {
            email: Joi.string().required().email(),
            password: Joi.string().required()
          }
        }
      }
    });

    server.route({
      method: 'DELETE',
      path: rootPath,
      handler: async (request, h) => {
        let { jti, exp } = request.auth.credentials;

        redis.set(`token:${jti}`, exp);

        return h.response().code(200);
      },
      options: {
        auth: 'auth'
      }
    });

    server.route({
      method: 'POST',
      path: '/api/reauth',
      handler: async (request) => {
        let { exp, id: userId, jti } = request.auth.credentials;

        redis.set(`token:${jti}`, exp);

        let user = await User.findById(userId);

        if (!user) {
          return Boom.unauthorized('unable to provide new token');
        }

        let { id, role, username } = user;

        return jwt.sign({ id, role, username }, process.env.JWT_KEY, {
          algorithm: 'HS256',
          expiresIn: '6h',
          jwtid: uuidv4()
        });
      },
      options: {
        auth: 'auth'
      }
    });
  }
};
