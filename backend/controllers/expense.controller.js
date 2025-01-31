const Expense = require("../models/Expense.model");

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { expenseDate, expenseCategory, expenseFor, amount, note } = req.body;

    if (!expenseDate || !expenseCategory || !expenseFor || !amount) {
      return res.status(400).send("Please provide all required fields");
    }

    const expense = new Expense({
      expenseDate,
      expenseCategory,
      expenseFor,
      amount,
      note: note ? note : "",
    });

    const createdExpense = await expense.save();
    res.status(201).send({
      message: "Expense created successfully",
      expense: createdExpense,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).send(expenses);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get an expense by id
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.status(200).send(expense);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseDate, expenseCategory, expenseFor, amount, note } = req.body;

    // Find the expense
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).send("Expense not found");
    }

    if (expense) {
      expense.expenseDate = expenseDate || expense.expenseDate;
      expense.expenseCategory = expenseCategory || expense.expenseCategory;
      expense.expenseFor = expenseFor || expense.expenseFor;
      expense.amount = amount || expense.amount;
      expense.note = note !== undefined ? note : expense.note;

      const updatedExpense = await expense.save();

      return res.status(200).send({
        message: "Expense updated successfully",
        expense: updatedExpense,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).send("Expense not found");
    }
    await Expense.findByIdAndDelete(id);
    res.status(200).send("Expense deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
