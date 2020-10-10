'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Books.belongsTo(models.Users, {
        as: "author",
        foreignKey: {
          name: "userId",
          onDelete: "CASCADE",
        },
      });
      Books.belongsTo(models.Cats, {
        as: "category",
        foreignKey: {
          name: "catId",
          onDelete: "CASCADE",
        },
      });
    }
  };
  Books.init({
    title: DataTypes.STRING,
    publication: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    catId: DataTypes.INTEGER,
    pages: DataTypes.INTEGER,
    isbn: DataTypes.STRING,
    aboutBook: DataTypes.STRING,
    status: DataTypes.ENUM("Waiting to be verified", "Approved", "Canceled"),
  }, {
    sequelize,
    modelName: 'Books',
  });
  return Books;
};