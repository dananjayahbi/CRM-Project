const sequelize = require("../config/db.config");

const Expense = require("../models/expense.model");
sequelize.sync({ force: false });

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { expenseDate, category, expenseFor, amount, note } = req.body;

    if (!expenseDate || !category || !expenseFor || !amount) {
      return res.status(400).send("All fields are required");
    }

    const createdExpense = await Expense.create({
      expenseDate,
      category,
      expenseFor,
      amount,
      note: note ? note : "",
    });

    res.status(201).send(createdExpense);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get an expense by id
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).send("Expense not found");
    }
    res.status(200).send(expense);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update an expense by id
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseDate, category, expenseFor, amount, note } = req.body;

    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).send("Expense not found");
    }

    if (expense) {
      expenseDate ? (expense.expenseDate = expenseDate) : expense.expenseDate;
      category ? (expense.category = category) : expense.category;
      expenseFor ? (expense.expenseFor = expenseFor) : expense.expenseFor;
      amount ? (expense.amount = amount) : expense.amount;
      note ? (expense.note = note) : expense.note;

      await expense.save();

      res.status(200).send({
        message: "Expense updated successfully",
        expense,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete an expense by id
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).send("Expense not found");
    }

    await expense.destroy();
    res.status(200).send("Expense deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};