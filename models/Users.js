'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasOne(models.Books)
    }
  };
  Users.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    gender: DataTypes.ENUM("Male", "Female"),
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    role: DataTypes.ENUM("Guest", "Admin")
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};