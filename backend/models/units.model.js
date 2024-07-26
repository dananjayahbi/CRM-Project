const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Unit = sequelize.define(
  "Unit",
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
    tableName: "units",
  }
);

module.exports = Unit;
