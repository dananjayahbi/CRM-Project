const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const ProductsCategory = sequelize.define(
  "ProductsCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "products_categories",
  }
);

module.exports = ProductsCategory;
