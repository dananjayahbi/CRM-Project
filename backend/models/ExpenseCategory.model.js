const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const ExpenseCategory = mongoose.model('ExpenseCategory', expenseCategorySchema);

module.exports = ExpenseCategory;