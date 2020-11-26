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
          name: "UserId",
          onDelete: "CASCADE",
        },
      });
      Books.belongsTo(models.Cats, {
        as: "category",
        foreignKey: {
          name: "CatId",
          onDelete: "CASCADE",
        },
      });
      Books.belongsToMany(models.Users, {
        as: "user_bookmarks",
        through: {
          model: "Bookmarks",
          as: "info",
        },
      });
    }
  }
  Books.init(
    {
      title: DataTypes.STRING,
      publication: DataTypes.DATE,
      UserId: DataTypes.INTEGER,
      CatId: DataTypes.INTEGER,
      pages: DataTypes.INTEGER,
      isbn: DataTypes.STRING,
      aboutBook: DataTypes.TEXT,
      thumbnailUrl: DataTypes.STRING,
      fileUrl: DataTypes.STRING,
      status: DataTypes.ENUM("Waiting to be verified", "Approved", "Canceled"),
    },
    {
      sequelize,
      modelName: "Books",
    }
  );
  return Books;
};
