const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);

module.exports = PaymentType;