'use strict';

// External modules
const Boom = require('boom');
const Joi = require('joi');

// App modules
const extractIncludes = require('../middleware/extract-includes');

// Model imports
const { Article, User } = require('../models');

const rootPath = '/api/articles';

const includeMapping = {
  author: {
    model: User,
    as: 'author',
    attributes: { exclude: ['password'] }
  }
};

// Routes plugin declaration
exports.plugin = {
  name: 'articleRoutes',
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: rootPath,
      handler: async (request) => {
        let page = request.query.page || 1;
        let perPage = request.query.perPage || 10;

        return await Article.findAll({
          include: request.pre.includeArray,
          limit: perPage,
          offset: perPage * (page - 1)
        });
      },
      options: {
        pre: [
          {
            method: extractIncludes(includeMapping),
            assign: 'includeArray'
          }
        ],
        validate: {
          query: {
            include: Joi.string().optional(),
            perPage: Joi.number().min(1).optional(),
            page: Joi.number().min(1).optional()
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: `${rootPath}/{articleId}`,
      handler: async (request, h) => {
        let article = await Article.findById(request.params.articleId, {
          include: request.pre.includeArray
        });

        if (!article) {
          throw Boom.notFound();
        }

        return h.response(article).code(200);
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
            articleId: Joi.number().required()
          }
        }
      }
    });

    server.route({
      method: 'POST',
      path: rootPath,
      handler: async (request, h) => {
        let { title, body, authorId } = request.payload;

        let author = await User.findById(authorId);

        if (!author) {
          throw Boom.badData('the author id provided does not correspond to an existing user')
        }

        let newArticle = await Article.create({ title, body, authorId });

        return h.response(newArticle).code(201);
      },
      options: {
        auth: 'author',
        validate: {
          payload: {
            title: Joi.string().required(),
            body: Joi.string().optional(),
            authorId: Joi.number().required()
          }
        }
      }
    });

    server.route({
      method: 'PATCH',
      path: `${rootPath}/{articleId}`,
      handler: async (request, h) => {
        let { credentials } = request.auth;
        let article = await Article.findById(request.params.articleId);

        if (!article) {
          throw Boom.notFound();
        }

        if (credentials.id !== article.authorId && credentials.role !== 'admin') {
          throw Boom.unauthorized('you are not authorized to modify this record');
        }

        for (let attr of Object.keys(request.payload)) {
          let newValue;

          if (attr === 'authorId') {
            let author = await User.findById(request.payload[attr]);

            if (!author) {
              throw Boom.badData('the author id provided does not correspond to an existing user')
            }
          }

          newValue = request.payload[attr];

          article[attr] = newValue;
        };

        await article.save();

        return h.response().code(204);
      },
      options: {
        auth: 'author',
        validate: {
          params: {
            articleId: Joi.number().required()
          },
          payload: {
            title: Joi.string().optional(),
            body: Joi.string().optional(),
            authorId: Joi.number().optional()
          }
        }
      }
    });

    server.route({
      method: 'DELETE',
      path: `${rootPath}/{articleId}`,
      handler: async (request, h) => {
        let { credentials } = request.auth;
        let article = await Article.findById(request.params.articleId);

        if (!article) {
          throw Boom.notFound();
        }

        if (credentials.userId !== article.authorId && credentials.role !== 'admin') {
          throw Boom.unauthorized('you are not authorized to modify this record');
        }

        await article.destroy();

        return h.response().code(202);
      },
      options: {
        auth: 'author',
        validate: {
          params: {
            articleId: Joi.number().required()
          }
        }
      }
    });
  }
};
