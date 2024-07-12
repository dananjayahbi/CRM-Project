const sequelize = require("../config/db.config");

const Purchase = require("../models/purchase.model");
const PurchaseItem = require("../models/purchaseItem.model");
sequelize.sync({ force: false });

// Create a new purchase
exports.createPurchase = async (req, res) => {
  const transaction = await Purchase.sequelize.transaction();
  try {
    const { supplier, purchaseDate, status, items, grandTotal } = req.body;

    if (!supplier || !purchaseDate || !status || !items || !grandTotal) {
      return res.status(400).send("All fields are required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send("Items must be a non-empty array");
    }

    // Create the Purchase
    const createdPurchase = await Purchase.create(
      {
        supplier,
        purchaseDate,
        status,
        grandTotal,
      },
      { transaction }
    );

    // Create the PurchaseItems
    for (const item of items) {
      const {
        itemName,
        quantity,
        purchasePrice,
        discount,
        purchaseDate: itemPurchaseDate,
        unitCost,
      } = item;

      if (
        !itemName ||
        !quantity ||
        !purchasePrice ||
        !discount ||
        !itemPurchaseDate ||
        !unitCost
      ) {
        await transaction.rollback();
        return res.status(400).send("All item fields are required");
      }

      await PurchaseItem.create(
        {
          purchaseId: createdPurchase.id,
          itemName,
          quantity,
          purchasePrice,
          discount,
          purchaseDate: itemPurchaseDate,
          unitCost,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).send({
      message: "Purchase created successfully",
      purchase: createdPurchase,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Unable to create purchase:", err);
    res.status(500).send("An error occurred while creating the purchase");
  }
};

// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: PurchaseItem,
    });
    res.status(200).send(purchases);
  } catch (err) {
    console.error("Unable to get purchases:", err);
    res.status(500).send("An error occurred while getting the purchases");
  }
};

// Get a purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: PurchaseItem,
    });

    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    res.status(200).send(purchase);
  } catch (err) {
    console.error("Unable to get purchase:", err);
    res.status(500).send("An error occurred while getting the purchase");
  }
};

// Update a purchase by ID
exports.updatePurchase = async (req, res) => {
  const transaction = await Purchase.sequelize.transaction();
  try {
    const purchase = await Purchase.findByPk(req.params.id);

    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    const { supplier, purchaseDate, status, items, grandTotal } = req.body;

    // Update the Purchase fields if provided
    if (supplier) {
      purchase.supplier = supplier;
    }
    if (purchaseDate) {
      purchase.purchaseDate = purchaseDate;
    }
    if (status) {
      purchase.status = status;
    }
    if (grandTotal) {
      purchase.grandTotal = grandTotal;
    }

    // Save the updated Purchase
    await purchase.save({ transaction });

    // Handle PurchaseItem updates and deletions
    if (items && Array.isArray(items)) {
      const existingItems = await PurchaseItem.findAll({
        where: {
          purchaseId: purchase.id,
        },
        transaction,
      });

      // Process each item in the request
      for (const item of items) {
        const {
          id: itemId,
          itemName,
          quantity,
          purchasePrice,
          discount,
          purchaseDate: itemPurchaseDate,
          unitCost,
          delete: deleteFlag,
        } = item;

        if (itemId) {
          // Update existing item if itemId is provided
          const existingItem = existingItems.find((ei) => ei.id === itemId);
          if (existingItem) {
            if (itemName) {
              existingItem.itemName = itemName;
            }
            if (quantity) {
              existingItem.quantity = quantity;
            }
            if (purchasePrice) {
              existingItem.purchasePrice = purchasePrice;
            }
            if (discount) {
              existingItem.discount = discount;
            }
            if (itemPurchaseDate) {
              existingItem.purchaseDate = itemPurchaseDate;
            }
            if (unitCost) {
              existingItem.unitCost = unitCost;
            }
            await existingItem.save({ transaction });

            // Delete the item if delete flag is set to true
            if (deleteFlag) {
              await existingItem.destroy({ transaction });
            }
          }
        } else {
          // Create new item if itemId is not provided
          if (
            itemName &&
            quantity &&
            purchasePrice &&
            discount &&
            itemPurchaseDate &&
            unitCost
          ) {
            await PurchaseItem.create(
              {
                purchaseId: purchase.id,
                itemName,
                quantity,
                purchasePrice,
                discount,
                purchaseDate: itemPurchaseDate,
                unitCost,
              },
              { transaction }
            );
          }
        }
      }
    }

    await transaction.commit();
    res.status(200).send({
      message: "Purchase updated successfully",
      purchase,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("Unable to update purchase:", err);
    res.status(500).send("An error occurred while updating the purchase");
  }
};

// Delete a purchase by ID
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: PurchaseItem, // Include PurchaseItems to delete them as well
    });

    if (!purchase) {
      return res.status(404).send("Purchase not found");
    }

    // Delete associated PurchaseItems
    if (purchase.PurchaseItems && purchase.PurchaseItems.length > 0) {
      await Promise.all(
        purchase.PurchaseItems.map(async (item) => {
          await item.destroy();
        })
      );
    }

    // Now delete the Purchase itself
    await purchase.destroy();

    res.status(200).send("Purchase and associated items deleted successfully");
  } catch (err) {
    console.error("Unable to delete purchase:", err);
    res.status(500).send("An error occurred while deleting the purchase");
  }
};