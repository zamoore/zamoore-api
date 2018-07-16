require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: null,
    database: process.env.DATABASE_NAME,
    host: 'localhost',
    dialect: 'postgres'
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
