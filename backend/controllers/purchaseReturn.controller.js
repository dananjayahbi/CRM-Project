const PurchaseReturn = require("../models/PurchaseReturn.model");
const Purchase = require("../models/Purchase.model");

// Create a new purchase return
exports.createPurchaseReturn = async (req, res) => {
  try {
    const { purchase, returnDate, products, status, grandTotal } = req.body;

    if (!purchase) {
      return res.status(400).send("Purchase is required");
    }

    const existingPurchase = await Purchase.findById(purchase);
    if (!existingPurchase) {
      return res.status(400).send("Invalid purchase");
    }

    if (!returnDate) {
      return res.status(400).send("Return date is required");
    }

    if (!products || products.length === 0) {
      return res.status(400).send("Products are required");
    }

    // Check that all products are from the same purchase
    const purchaseProductIds = existingPurchase.products.map((p) =>
      p.productObjectId.toString()
    );
    const invalidProducts = products.filter(
      (p) => !purchaseProductIds.includes(p.productObjectId)
    );
    if (invalidProducts.length > 0) {
      return res.status(400).send({
        message: "Invalid products",
        invalidProducts,
        purchaseProductIds,
      });
    }

    if (!grandTotal) {
      return res.status(400).send("Grand total is required");
    }

    const purchaseReturn = new PurchaseReturn({
      purchase,
      returnDate,
      products,
      status,
      grandTotal,
    });

    const createdPurchaseReturn = await purchaseReturn.save();
    res.status(201).send({
      message: "Purchase return created successfully",
      purchaseReturn: createdPurchaseReturn,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    res.status(500).send({
      message: "Some error occurred while creating the purchase return.",
    });
  }
};

// Get all purchase returns
exports.getAllPurchaseReturns = async (req, res) => {
  try {
    const purchaseReturns = await PurchaseReturn.find();
    res.status(200).send(purchaseReturns);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a purchase return by id
exports.getPurchaseReturnById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseReturn = await PurchaseReturn.findById(id);
    res.status(200).send(purchaseReturn);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a purchase return
exports.updatePurchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { purchase, returnDate, products, status, grandTotal } = req.body;

    const purchaseReturn = await PurchaseReturn.findById(id);
    if (!purchaseReturn) {
      return res.status(400).send("Invalid purchase return");
    }

    if (!purchase) {
      return res.status(400).send("Purchase is required");
    }

    const existingPurchase = await Purchase.findById(purchase);
    if (!existingPurchase) {
      return res.status(400).send("Invalid purchase");
    }

    // Check that all products are from the same purchase
    if (products && products.length > 0) {
      const purchaseProductIds = existingPurchase.products.map((p) =>
        p.productObjectId.toString()
      );
      const invalidProducts = products.filter(
        (p) => !purchaseProductIds.includes(p.productObjectId)
      );
      if (invalidProducts.length > 0) {
        return res.status(400).send({
          message: "Invalid products",
          invalidProducts,
          purchaseProductIds,
        });
      }
    } else {
      return res.status(400).send("Products are required");
    }

    // If the products array provides a new product, then add it to the products object array
    products.forEach((newProduct) => {
      const existingProductIndex = purchaseReturn.products.findIndex(
        (p) => p.productObjectId.toString() === newProduct.productObjectId
      );

      if (existingProductIndex === -1) {
        // Add new product
        purchaseReturn.products.push(newProduct);
      } else {
        // Update existing product
        purchaseReturn.products[existingProductIndex] = {
          ...purchaseReturn.products[existingProductIndex].toObject(),
          ...newProduct,
        };
      }
    });

    // If the provided products array misses a product that is in the database, it means that product is deleted
    const updatedProductIds = products.map((p) => p.productObjectId.toString());
    purchaseReturn.products = purchaseReturn.products.filter((p) =>
      updatedProductIds.includes(p.productObjectId.toString())
    );

    // Update other fields
    if (returnDate) purchaseReturn.returnDate = returnDate;
    if (status) purchaseReturn.status = status;
    if (grandTotal) purchaseReturn.grandTotal = grandTotal;

    const updatedPurchaseReturn = await purchaseReturn.save();

    return res.status(200).send({
      message: "Purchase return updated successfully",
      purchaseReturn: updatedPurchaseReturn,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    res.status(500).send({
      message: "Some error occurred while updating the purchase return.",
    });
  }
};

// Delete a purchase return
exports.deletePurchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseReturn = await PurchaseReturn.findById(id);
    if (!purchaseReturn) {
      return res.status(404).send("Purchase return not found");
    }
    await PurchaseReturn.findByIdAndDelete(id);
    res.status(200).send("Purchase return deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
