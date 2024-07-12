const sequelize = require("../config/db.config");

const Purchase = require("../models/purchase.model");
sequelize.sync({ force: false });

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { supplier, purchaseDate, status, items, grandTotal } = req.body;

    if (!supplier || !purchaseDate || !status || !items || !grandTotal) {
      return res.status(400).send("All fields are required");
    }

    const { itemName, quantity, purchasePrice, discount, unitCost } = items;

    if (!itemName || !quantity || !purchasePrice || !discount || !unitCost) {
      return res.status(400).send("All item fields are required");
    }

    const createdPurchase = await Purchase.create({
      supplier,
      purchaseDate,
      status,
      items,
      grandTotal,
    });

    res.status(201).send({
      message: "Purchase created successfully",
      purchase: createdPurchase,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.status(200).send(purchases);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get a purchase by id
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ where: { id: req.params.id } });
    res.status(200).send(purchase);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a purchase
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier, purchaseDate, status, items, grandTotal } = req.body;

    const purchase = await Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    if (purchase) {
      supplier ? (purchase.supplier = supplier) : purchase.supplier;
      purchaseDate
        ? (purchase.purchaseDate = purchaseDate)
        : purchase.purchaseDate;
      status ? (purchase.status = status) : purchase.status;
      grandTotal ? (purchase.grandTotal = grandTotal) : purchase.grandTotal;

      if (items) {
        const { itemName, quantity, purchasePrice, discount, unitCost } = items;

        if (itemName) {
          purchase.items.itemName = itemName;
        }
        if (quantity) {
          purchase.items.quantity = quantity;
        }
        if (purchasePrice) {
          purchase.items.purchasePrice = purchasePrice;
        }
        if (discount) {
          purchase.items.discount = discount;
        }
        if (unitCost) {
          purchase.items.unitCost = unitCost;
        }
      }

      await purchase.save();

      res.status(200).send({
        message: "Purchase updated successfully",
        purchase: purchase,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete a purchase
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    await purchase.destroy();

    res.status(200).send("Purchase deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
