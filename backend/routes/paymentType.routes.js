const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createPaymentType,
    getAllPaymentTypes,
    getPaymentTypeById,
    updatePaymentType,
    deletePaymentType,
} = require("../controllers/paymentType.controller");

// Create a new payment type
// router.post("/createPaymentType", protect, createPaymentType);
router.post("/createPaymentType", createPaymentType);

// Get all payment types
// router.get("/getAllPaymentTypes", protect, getAllPaymentTypes);
router.get("/getAllPaymentTypes", getAllPaymentTypes);

// Get a payment type by id
// router.get("/getPaymentTypeById/:id", protect, getPaymentTypeById);
router.get("/getPaymentTypeById/:id", getPaymentTypeById);

// Update a payment type
// router.put("/updatePaymentType/:id", protect, updatePaymentType);
router.put("/updatePaymentType/:id", updatePaymentType);

// Delete a payment type
// router.delete("/deletePaymentType/:id", protect, deletePaymentType);
router.delete("/deletePaymentType/:id", deletePaymentType);

module.exports = router;