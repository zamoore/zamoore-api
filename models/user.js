'use strict';

module.exports = (sequelize, DataTypes) => {
  let { ENUM, STRING } = DataTypes;

  let User = sequelize.define('User', {
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

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'authorId',
      as: 'articles'
    });
  };

  return User;
};
