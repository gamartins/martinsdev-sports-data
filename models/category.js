'use strict';

module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define('Category', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
    name: DataTypes.STRING,
    country_code: DataTypes.STRING
  });

  return Category;
};