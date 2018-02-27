'use strict';

module.exports = (sequelize, DataTypes) => {
  var Result = sequelize.define('Result', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    scheduled: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    round_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    round_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    match_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    home_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    away_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    home_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    away_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Result.associate = (models) => {
    Result.belongsTo(models.CurrentSeason, { foreignKey: 'season_id' })
    Result.belongsTo(models.Team, { as: 'home_team', foreignKey: 'home_id' })
    Result.belongsTo(models.Team, { as: 'away_team', foreignKey: 'away_id' })
  }

  return Result;
};