const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createPurchase,
    getAllPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
} = require("../controllers/purchase.controller");

// Create a new purchase
// router.post("/createPurchase", protect, createPurchase);
router.post("/createPurchase", createPurchase);

// Get all purchases
// router.get("/getAllPurchases", protect, getAllPurchases);
router.get("/getAllPurchases", getAllPurchases);

// Get a purchase by id
// router.get("/getPurchaseById/:id", protect, getPurchaseById);
router.get("/getPurchaseById/:id", getPurchaseById);

// Update a purchase by id
// router.put("/updatePurchase/:id", protect, updatePurchase);
router.put("/updatePurchase/:id", updatePurchase);

// Delete a purchase by id
// router.delete("/deletePurchase/:id", protect, deletePurchase);
router.delete("/deletePurchase/:id", deletePurchase);


module.exports = router;