const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
} = require("../controllers/customer.controller");

// Create a new customer
// router.post("/createCustomer", protect, createCustomer);
router.post("/createCustomer", createCustomer);

// Get all customers
// router.get("/getAllCustomers", protect, getAllCustomers);
router.get("/getAllCustomers", getAllCustomers);

// Get a customer by id
// router.get("/getCustomerById/:id", protect, getCustomerById);
router.get("/getCustomerById/:id", getCustomerById);

// Update a customer
// router.put("/updateCustomer/:id", protect, updateCustomer);
router.put("/updateCustomer/:id", updateCustomer);

// Delete a customer
// router.delete("/deleteCustomer/:id", protect, deleteCustomer);
router.delete("/deleteCustomer/:id", deleteCustomer);

module.exports = router;