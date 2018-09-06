'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Articles', 'category', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('Articles', 'preview', {
        type: Sequelize.TEXT
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Articles', 'category'),
      queryInterface.removeColumn('Articles', 'preview')
    ];
  }
};
