'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cats.hasOne(models.Books)
    }
  };
  Cats.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cats',
  });
  return Cats;
};