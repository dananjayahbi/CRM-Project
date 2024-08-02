const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taxSchema = new Schema({
    taxName: {
        type: String,
        required: true
    },
    taxRate: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;