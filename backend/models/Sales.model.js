const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salesSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    saleDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    products: [
      {
        productObjectId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
        tax: {
          type: String,
          required: true,
        },
        taxAmount: {
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

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
