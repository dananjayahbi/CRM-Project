const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/supplier.controller");

// Create a new supplier
// router.post("/createSupplier", protect, createSupplier);
router.post("/createSupplier", createSupplier);

// Get all suppliers
// router.get("/getAllSuppliers", protect, getAllSuppliers);
router.get("/getAllSuppliers", getAllSuppliers);

// Get a supplier by id
// router.get("/getSupplierById/:id", protect, getSupplierById);
router.get("/getSupplierById/:id", getSupplierById);

// Update a supplier
// router.put("/updateSupplier/:id", protect, updateSupplier);
router.put("/updateSupplier/:id", updateSupplier);

// Delete a supplier
// router.delete("/deleteSupplier/:id", protect, deleteSupplier);
router.delete("/deleteSupplier/:id", deleteSupplier);

module.exports = router;