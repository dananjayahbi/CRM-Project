const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const PurchaseReturn = sequelize.define(
    "PurchaseReturn",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        purchaseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grandTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: "purchase_returns",
    }
);

module.exports = PurchaseReturn;