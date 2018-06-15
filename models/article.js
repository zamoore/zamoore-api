'use strict';

module.exports = (sequelize, DataTypes) => {
  let { STRING } = DataTypes;

  var Article = sequelize.define('Article', {
    title: {
      type: STRING,
      allowNull: false
    },
    body: {
      type: STRING
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
