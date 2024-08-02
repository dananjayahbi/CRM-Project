const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createTax,
    getAllTaxes,
    getTaxById,
    updateTax,
    deleteTax,
} = require("../controllers/tax.controller");

// Create a new tax
// router.post("/createTax", protect, createTax);
router.post("/createTax", createTax);

// Get all taxes
// router.get("/getAllTaxes", protect, getAllTaxes);
router.get("/getAllTaxes", getAllTaxes);

// Get a tax by id
// router.get("/getTaxById/:id", protect, getTaxById);
router.get("/getTaxById/:id", getTaxById);

// Update a tax
// router.put("/updateTax/:id", protect, updateTax);
router.put("/updateTax/:id", updateTax);

// Delete a tax
// router.delete("/deleteTax/:id", protect, deleteTax);
router.delete("/deleteTax/:id", deleteTax);

module.exports = router;