'use strict';

const Sequelize = require('sequelize');

const { DB_HOST, DB_NAME, DB_PW, DB_USERNAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PW, {
  host: DB_HOST,
  dialect: 'postgres'
});

module.exports = sequelize;
