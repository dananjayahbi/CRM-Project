const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createPurchaseReturn,
    getAllPurchaseReturns,
    getPurchaseReturnById,
    updatePurchaseReturn,
    deletePurchaseReturn,
} = require("../controllers/purchaseReturn.controller");

// Create a new purchase return
// router.post("/createPurchaseReturn", protect, createPurchaseReturn);
router.post("/createPurchaseReturn", createPurchaseReturn);

// Get all purchase returns
// router.get("/getAllPurchaseReturns", protect, getAllPurchaseReturns);
router.get("/getAllPurchaseReturns", getAllPurchaseReturns);

// Get a purchase return by id
// router.get("/getPurchaseReturnById/:id", protect, getPurchaseReturnById);
router.get("/getPurchaseReturnById/:id", getPurchaseReturnById);

// Update a purchase return
// router.put("/updatePurchaseReturn/:id", protect, updatePurchaseReturn);
router.put("/updatePurchaseReturn/:id", updatePurchaseReturn);

// Delete a purchase return
// router.delete("/deletePurchaseReturn/:id", protect, deletePurchaseReturn);
router.delete("/deletePurchaseReturn/:id", deletePurchaseReturn);

module.exports = router;