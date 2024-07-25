const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
} = require("../controllers/expense.controller");

// Create a new expense
// router.post("/createExpense", protect, createExpense);
router.post("/createExpense", createExpense);

// Get all expenses
// router.get("/getAllExpenses", protect, getAllExpenses);
router.get("/getAllExpenses", getAllExpenses);

// Get an expense by id
// router.get("/getExpenseById/:id", protect, getExpenseById);
router.get("/getExpense/:id", getExpenseById);

// Update an expense
// router.put("/updateExpense/:id", protect, updateExpense);
router.put("/updateExpense/:id", updateExpense);

// Delete an expense
// router.delete("/deleteExpense/:id", protect, deleteExpense);
router.delete("/deleteExpense/:id", deleteExpense);

module.exports = router;