const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Customer = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "customers",
  }
);

module.exports = Customer;
