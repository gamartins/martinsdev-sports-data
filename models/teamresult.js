'use strict';

module.exports = (sequelize, DataTypes) => {
  var TeamResult = sequelize.define('TeamResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    }
  });

  TeamResult.associate = (models) => {
    TeamResult.belongsTo(models.Team, { foreignKey: 'team_id' })
    TeamResult.belongsTo(models.Result, { foreignKey: 'result_id' })
  }

  return TeamResult;
};