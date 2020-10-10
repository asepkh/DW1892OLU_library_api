"use strict";
const { Model } = require("sequelize");
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
          name: "authorId",
        },
      });
      Books.belongsTo(models.Category, {
        as: "category",
        foreignKey: {
          name: "categoryId",
        },
      });
    }
  }
  Books.init(
    {
      title: DataTypes.STRING,
      publication: DataTypes.DATE,
      categoryId: DataTypes.INTEGER,
      authorId: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      isbn: DataTypes.STRING,
      aboutBook: DataTypes.TEXT,
      status: DataTypes.ENUM("Waiting to be verified", "Approved", "Canceled"),
    },
    {
      sequelize,
      modelName: "Books",
    }
  );
  return Books;
};
