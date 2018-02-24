'use strict';

module.exports = (sequelize, DataTypes) => {
  var CurrentSeason = sequelize.define('CurrentSeason', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    year: DataTypes.STRING
  });

  return CurrentSeason;
};