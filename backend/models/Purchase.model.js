const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const purchaseSchema = new Schema(
  {
    supplier: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    products: [
      {
        productCode: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        purchasePrice: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
        tax: {
          type: Number,
          required: true,
        },
        taxAmount: {
          type: Number,
          required: true,
        },
        unitCost: {
          type: Number,
          required: true,
        },
        totalAmount: {
          type: Number,
          required: true,
        },
      },
    ],
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
