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
    use_env_variable: 'DATABASE_URL'
  }
};
