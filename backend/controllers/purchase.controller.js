const sequelize = require("../config/db.config");

const Purchase = require("../models/purchase.model");
const Product = require("../models/products.model");
sequelize.sync({ force: false });

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { supplier, products, purchaseDate, status, grandTotal } = req.body;

    if (!supplier || !products || !purchaseDate || !status || !grandTotal) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the products exist with the provided product codes in the products array
    for (const productCode of products) {
      const product = await Product.findOne({ where: { productCode } });
      if (!product) {
        return res.status(400).json({
          message: `Product with item code ${productCode} does not exist`,
        });
      }
    }

    const purchase = await Purchase.create({
      supplier,
      products,
      purchaseDate,
      status,
      grandTotal,
    });

    res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
