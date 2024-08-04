const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;