const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const purchaseReturnSchema = new Schema(
  {
    purchase: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    returnDate: {
      type: Date,
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
    status: {
      type: String,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PurchaseReturn = mongoose.model("PurchaseReturn", purchaseReturnSchema);

module.exports = PurchaseReturn;
