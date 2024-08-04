const Purchase = require("../models/Purchase.model");

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { supplier, purchaseDate, status, products, grandTotal } = req.body;

    if (!supplier || !purchaseDate || !status || !products || !grandTotal) {
      return res.status(400).send("All input is required");
    }

    const newPurchase = new Purchase({
      supplier,
      purchaseDate,
      status,
      products,
      grandTotal,
    });

    const createdPurchase = await newPurchase.save();
    res.status(201).send({
      message: "Purchase created successfully",
      purchase: createdPurchase,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    res.status(500).send({
      message: "Some error occurred while creating the purchase.",
    });
  }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).send(purchases);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a purchase by id
exports.getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseById = await Purchase.findById(id);
    res.status(200).send(purchaseById);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a purchase
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier, purchaseDate, status, products, grandTotal } = req.body;

    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).send({
        message: `Purchase not found with id ${id}`,
      });
    }

    // If the products array provides a new product, then add it to the products object array
    products.forEach(newProduct => {
      const existingProductIndex = purchase.products.findIndex(
        p => p.productObjectId.toString() === newProduct.productObjectId
      );

      if (existingProductIndex === -1) {
        // Add new product
        purchase.products.push(newProduct);
      } else {
        // Update existing product
        purchase.products[existingProductIndex] = {
          ...purchase.products[existingProductIndex].toObject(),
          ...newProduct,
        };
      }
    });

    // If the provided products array misses a product that is in the database, it means that product is deleted
    const updatedProductIds = products.map(p => p.productObjectId.toString());
    purchase.products = purchase.products.filter(p =>
      updatedProductIds.includes(p.productObjectId.toString())
    );

    // Update other fields
    if (supplier) purchase.supplier = supplier;
    if (purchaseDate) purchase.purchaseDate = purchaseDate;
    if (status) purchase.status = status;
    if (grandTotal) purchase.grandTotal = grandTotal;

    const updatedPurchase = await purchase.save();

    return res.status(200).send({
      message: "Purchase updated successfully",
      purchase: updatedPurchase,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    res.status(500).send({
      message: "Some error occurred while updating the purchase.",
    });
  }
};

// Delete a purchase
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).send({
        message: `Purchase not found with id ${id}`,
      });
    }
    await Purchase.findByIdAndDelete(id);
    res.status(200).send({
      message: "Purchase deleted successfully",
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
