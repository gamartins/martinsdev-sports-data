'use strict';

module.exports = (sequelize, DataTypes) => {
  var Team = sequelize.define('Team', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    country_code: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  });

  return Team;
};