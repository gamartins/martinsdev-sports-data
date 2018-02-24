'use strict';

module.exports = (sequelize, DataTypes) => {
  var GroupTeam = sequelize.define('GroupTeam', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    }
  });

  GroupTeam.associate = (models) => {
    GroupTeam.belongsTo(models.Group, { foreignKey: 'group_id' })
    GroupTeam.belongsTo(models.Team, { foreignKey: 'team_id' })
  }

  return GroupTeam;
};