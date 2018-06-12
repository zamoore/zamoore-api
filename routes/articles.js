'use strict';

const Boom = require('boom');
const Joi = require('joi');

const { Article, User } = require('../models');

const rootPath = '/api/articles';

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
      }
    });
  }
};
