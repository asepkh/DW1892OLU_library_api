"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Books", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      publication: {
        type: Sequelize.DATE,
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      CatId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Cats",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      pages: {
        type: Sequelize.INTEGER,
      },
      isbn: {
        type: Sequelize.STRING,
      },
      aboutBook: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("Waiting to be verified", "Approved", "Canceled"),
      },
      thumbnailUrl: {
        type: Sequelize.STRING,
      },
      fileUrl: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Books");
  },
};
