const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Purchase = require("./purchase.model");

const PurchaseItem = sequelize.define(
  "PurchaseItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchaseId: {
      type: DataTypes.INTEGER,
      references: {
        model: Purchase,
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
    discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    unitCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "purchase_items",
  }
);

Purchase.hasMany(PurchaseItem, { foreignKey: "purchaseId" });
PurchaseItem.belongsTo(Purchase, { foreignKey: "purchaseId" });

module.exports = PurchaseItem;
