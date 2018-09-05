'use strict';

module.exports = (sequelize, DataTypes) => {
  let { STRING, TEXT } = DataTypes;

  var Article = sequelize.define('Article', {
    title: {
      type: STRING,
      allowNull: false
    },
    body: {
      type: TEXT
    }
  });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE'
    });
  };

  return Article;
};
