const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createExpenseCategory,
    getAllExpenseCategories,
    getExpenseCategoryById,
    updateExpenseCategory,
    deleteExpenseCategory,
} = require("../controllers/expenseCategory.controller");

// Create a new expense category
// router.post("/createExpenseCategory", protect, createExpenseCategory);
router.post("/createExpenseCategory", createExpenseCategory);

// Get all expense categories
// router.get("/getAllExpenseCategories", protect, getAllExpenseCategories);
router.get("/getAllExpenseCategories", getAllExpenseCategories);

// Get an expense category by id
// router.get("/getExpenseCategoryById/:id", protect, getExpenseCategoryById);
router.get("/getExpenseCategoryById/:id", getExpenseCategoryById);

// Update an expense category
// router.put("/updateExpenseCategory/:id", protect, updateExpenseCategory);
router.put("/updateExpenseCategory/:id", updateExpenseCategory);

// Delete an expense category
// router.delete("/deleteExpenseCategory/:id", protect, deleteExpenseCategory);
router.delete("/deleteExpenseCategory/:id", deleteExpenseCategory);

module.exports = router;