'use strict';

module.exports = (sequelize, DataTypes) => {
  var Group = sequelize.define('Group', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: DataTypes.STRING
  });

  Group.associate = (models) => {
    Group.belongsTo(models.CurrentSeason, { foreignKey: 'season_id' })
  }

  return Group;
};