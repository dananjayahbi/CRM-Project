const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createSale,
    getAllSales,
    getSaleById,
    updateSale,
    deleteSale,
} = require("../controllers/sales.controller");

// Create a new sale
// router.post("/createSale", protect, createSale);
router.post("/createSale", createSale);

// Get all sales
// router.get("/getAllSales", protect, getAllSales);
router.get("/getAllSales", getAllSales);

// Get a sale by id
// router.get("/getSaleById/:id", protect, getSaleById);
router.get("/getSaleById/:id", getSaleById);

// Update a sale
// router.put("/updateSale/:id", protect, updateSale);
router.put("/updateSale/:id", updateSale);

// Delete a sale
// router.delete("/deleteSale/:id", protect, deleteSale);
router.delete("/deleteSale/:id", deleteSale);

module.exports = router;