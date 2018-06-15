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
      handler: async () => await Article.findAll()
    });

    server.route({
      method: 'DELETE',
      path: `${rootPath}/{articleId}`,
      handler: async (request, h) => {
        let article = await Article.findById(request.params.articleId);

        if (!article) {
          return Boom.notFound();
        }

        await article.destroy();

        return h.response().code(202);
      }
    });

    server.route({
      method: 'POST',
      path: rootPath,
      handler: async (request, h) => {
        let { title, body, authorId } = request.payload;

        let author = await User.findById(authorId);

        if (!author) {
          return Boom.badData('the author id provided does not correspond to an exiting user')
        }

        let newArticle = await Article.create({ title, body, authorId });

        return h.response(newArticle).code(201);
      },
      options: {
        auth: 'admin',
        validate: {
          payload: {
            title: Joi.string().required(),
            body: Joi.string().optional(),
            authorId: Joi.number().required()
          }
        }
      }
    });
  }
};
