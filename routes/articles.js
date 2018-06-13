'use strict';

// External modules
const Boom = require('boom');
const Joi = require('joi');

// Model imports
const { Article, User } = require('../models');

const rootPath = '/api/articles';

// Routes plugin declaration
exports.plugin = {
  name: 'articleRoutes',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: rootPath,
      handler: async () => {
        let articles = await Article.findAll();

        return articles;
      }
    });

    server.route({
      method: 'POST',
      path: rootPath,
      handler: async () => {
        let newArticle = await Article.create({
          title: 'test',
          body: 'This is a test',
          authorId: 1
        });

        return newArticle;
      },
      config: { auth: 'admin' }
    });
  }
};
