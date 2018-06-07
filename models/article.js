'use strict';

const Sequelize = require('sequelize');

const db = require('../db');
const User = require('./user');

const { STRING } = Sequelize;

const Article = db.define('Article', {
  title: {
    type: STRING,
    allowNull: false
  },
  body: {
    type: STRING
  }
});

Article.belongsTo(User, {
  as: 'author',
  foreignKey: 'authorId'
})

module.exports = Article;
