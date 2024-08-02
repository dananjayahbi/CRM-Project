const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Purchase = sequelize.define(
    "Purchase",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        supplier: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        products: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        grandTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: "purchases",
    }
);

module.exports = Purchase;
