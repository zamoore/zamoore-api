'use strict';

const Sequelize = require('sequelize');

const db = require('../db');
const Article = require('./article');

const { ENUM, STRING } = Sequelize;

const User = db.define('User', {
  role: {
    type: ENUM,
    allowNull: false,
    values: ['basic', 'author', 'admin'],
    defaultValue: 'basic'
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: STRING,
    allowNull: false
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true
  }
});

User.hasMany(Article, {
  as: 'articles',
  foreignKey: 'authorId'
});

module.exports = User;
