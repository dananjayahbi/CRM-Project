const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Expense = sequelize.define(
    "Expense",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        expenseDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expenseFor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "expenses",
    }
);

module.exports = Expense;