'use strict';

module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define('Tournament', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
  })

  Tournament.associate = (models) => {
    Tournament.belongsTo(models.CurrentSeason, { foreignKey: 'current_season' })
    Tournament.belongsTo(models.Category, { foreignKey: 'category' })
  }

  return Tournament;
};