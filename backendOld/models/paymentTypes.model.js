const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const PaymentType = sequelize.define(
  "PaymentType",
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
  },
  {
    tableName: "payment_types",
  }
);

module.exports = PaymentType;
