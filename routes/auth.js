'use strict';

// External modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Boom = require('boom');
const Joi = require('joi');

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

        if (!user) {
          return Boom.notFound();
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return Boom.unauthorized();
        }

        return jwt.sign({ role: user.role, username: user.username }, process.env.JWT_KEY, {
          algorithm: 'HS256'
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
  }
};
