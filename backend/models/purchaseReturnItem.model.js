const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const PurchaseReturn = require("./purchaseReturn.model");

const PurchaseReturnItem = sequelize.define(
  "PurchaseReturnItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseReturnId: {
      type: DataTypes.INTEGER,
      references: {
        model: PurchaseReturn,
        key: "id",
      },
      allowNull: false,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unitCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "purchase_return_items",
  }
);

PurchaseReturn.hasMany(PurchaseReturnItem, { foreignKey: "purchaseReturnId" });
PurchaseReturnItem.belongsTo(PurchaseReturn, {
  foreignKey: "purchaseReturnId",
});

module.exports = PurchaseReturnItem;
