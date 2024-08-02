const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Tax = sequelize.define(
    "Tax",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        taxName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        taxRate: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: "taxes",
    }
);

module.exports = Tax;