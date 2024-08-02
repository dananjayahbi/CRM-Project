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

    // Ensure products is a JSON object and has at least one product object
    if (typeof products !== 'object' || Array.isArray(products) || Object.keys(products).length === 0) {
      return res.status(400).json({ message: "Products must be a JSON object with at least one product" });
    }

    // Check if the product objects have the required fields
    const requiredFields = [
      "productCode",
      "quantity",
      "productName",
      "purchasePrice",
      "discount",
      "tax",
      "taxAmount",
      "unitCost",
      "totalAmount",
    ];

    for (const productCode in products) {
      const product = products[productCode];
      for (const field of requiredFields) {
        if (!product.hasOwnProperty(field)) {
          return res.status(400).json({ message: `Product ${productCode} is missing the field ${field}` });
        }
      }
    }

    // Check if the products exist with the provided product codes in the products JSON object
    const productCodes = Object.keys(products);
    const existingProducts = await Product.findAll({
      where: {
        productCode: productCodes,
      },
    });

    const existingProductCodes = new Set(existingProducts.map(p => p.productCode));
    const invalidProductCodes = productCodes.filter(code => !existingProductCodes.has(code));

    if (invalidProductCodes.length > 0) {
      return res.status(400).json({ message: `Invalid product codes: ${invalidProductCodes.join(", ")}` });
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
