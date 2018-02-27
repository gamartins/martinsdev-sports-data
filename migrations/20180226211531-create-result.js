'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      season_id: {
        type: Sequelize.STRING
      },
      scheduled: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      round_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      round_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      match_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      home_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      away_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      home_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      away_score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Results');
  }
};