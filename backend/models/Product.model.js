const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productCode: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    minimumQty: {
        type: Number,
        required: true
    },
    barcode: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    tax: {
        type: String,
        required: true
    },
    taxType: {
        type: String,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    profitMargin: {
        type: Number,
        required: true
    },
    salesPrice: {
        type: Number,
        required: true
    },
    finalPrice: {
        type: Number,
        required: true
    },
    discountType: {
        type: String,
        required: false
    },
    discount: {
        type: Number,
        required: false
    },
    currentOpeningStock: {
        type: Number,
        required: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;