const sequelize = require("../config/db.config");

const PurchaseReturn = require("../models/purchaseReturn.model");
const PurchaseReturnItem = require("../models/purchaseReturnItem.model");
sequelize.sync({ force: false });

// Create a new purchase return
exports.createPurchaseReturn = async (req, res) => {
  const transaction = await PurchaseReturn.sequelize.transaction();
  try {
    const { purchaseId, supplier, date, status, items, grandTotal } = req.body;

    if (!purchaseId || !supplier || !date || !status || !items || !grandTotal) {
      return res.status(400).send("All fields are required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send("Items must be a non-empty array");
    }

    // Create the PurchaseReturn
    const createdPurchaseReturn = await PurchaseReturn.create(
      {
        purchaseId,
        supplier,
        date,
        status,
        grandTotal,
      },
      { transaction }
    );

    // Create the PurchaseReturnItems
    for (const item of items) {
      const { itemName, quantity, purchasePrice, discount, unitCost } = item;

      if (!itemName || !quantity || !purchasePrice || !discount || !unitCost) {
        await transaction.rollback();
        return res.status(400).send("All item fields are required");
      }

      await PurchaseReturnItem.create(
        {
          purchaseReturnId: createdPurchaseReturn.id,
          itemName,
          quantity,
          purchasePrice,
          discount,
          unitCost,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).send({
      message: "Purchase return created successfully",
      purchaseReturn: createdPurchaseReturn,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Unable to create purchase return:", error);
    res
      .status(500)
      .send("An error occurred while creating the purchase return");
  }
};

// Get all purchase returns
exports.getAllPurchaseReturns = async (req, res) => {
  try {
    const purchaseReturns = await PurchaseReturn.findAll({
      include: PurchaseReturnItem,
    });
    res.status(200).send(purchaseReturns);
  } catch (error) {
    console.error("Unable to get purchase returns:", error);
    res
      .status(500)
      .send("An error occurred while retrieving the purchase returns");
  }
};

// Get a single purchase return
exports.getPurchaseReturn = async (req, res) => {
  try {
    const purchaseReturn = await PurchaseReturn.findByPk(req.params.id, {
      include: PurchaseReturnItem,
    });

    if (!purchaseReturn) {
      return res.status(404).send("Purchase return not found");
    }

    res.status(200).send(purchaseReturn);
  } catch (error) {
    console.error("Unable to get purchase return:", error);
    res
      .status(500)
      .send("An error occurred while retrieving the purchase return");
  }
};

// Update a purchase return
exports.updatePurchaseReturn = async (req, res) => {
  const transaction = await PurchaseReturn.sequelize.transaction();
  try {
    const purchaseReturn = await PurchaseReturn.findByPk(req.params.id);

    if (!purchaseReturn) {
      return res.status(404).send("Purchase return not found");
    }

    const { supplier, date, status, items, grandTotal } = req.body;

    // Update the PurchaseReturn fields if provided
    if (supplier) {
      purchaseReturn.supplier = supplier;
    }
    if (date) {
      purchaseReturn.date = date;
    }
    if (status) {
      purchaseReturn.status = status;
    }
    if (grandTotal) {
      purchaseReturn.grandTotal = grandTotal;
    }

    // Save the updated PurchaseReturn
    await purchaseReturn.save({ transaction });

    // Handle PurchaseReturnItems updates and deletions
    if (items && Array.isArray(items)) {
      const existingItems = await PurchaseReturnItem.findAll({
        where: {
          purchaseReturnId: purchaseReturn.id,
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
          unitCost,
          delete: deleteFlag,
        } = item;

        if (itemId) {
          // Update existing item if itemId is provided
          const existingItem = existingItems.find((i) => i.id === itemId);
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
          // Create a new item if itemId is not provided
          if (itemName && quantity && purchasePrice && discount && unitCost) {
            await PurchaseReturnItem.create(
              {
                purchaseReturnId: purchaseReturn.id,
                itemName,
                quantity,
                purchasePrice,
                discount,
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
      message: "Purchase return updated successfully",
      purchaseReturn,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Unable to update purchase return:", error);
    res
      .status(500)
      .send("An error occurred while updating the purchase return");
  }
};

// Delete a purchase return
exports.deletePurchaseReturn = async (req, res) => {
  try {
    const purchaseReturn = await PurchaseReturn.findByPk(req.params.id, {
      include: PurchaseReturnItem,
    });

    if (!purchaseReturn) {
      return res.status(404).send("Purchase return not found");
    }

    // Delete associated PurchaseReturnItems
    if (
      purchaseReturn.PurchaseReturnItems &&
      purchaseReturn.PurchaseReturnItems.length > 0
    ) {
      await Promise.all(
        purchaseReturn.PurchaseReturnItems.map(async (item) => {
          await item.destroy();
        })
      );
    }

    // Delete the PurchaseReturn itself
    await purchaseReturn.destroy();

    res.status(200).send("Purchase return deleted successfully");
  } catch (error) {
    console.error("Unable to delete purchase return:", error);
    res
      .status(500)
      .send("An error occurred while deleting the purchase return");
  }
};
