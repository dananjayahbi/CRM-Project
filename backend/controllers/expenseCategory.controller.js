const ExpenseCategory = require("../models/ExpenseCategory.model");

// Create a new expense category
exports.createExpenseCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Expense category name is required");
    }

    // Find if any expense category already exists with the provided name
    const expenseCategoryByName = await ExpenseCategory.findOne({ name });
    if (expenseCategoryByName) {
      return res
        .status(400)
        .send("Expense category already exists with the provided name");
    }

    const expenseCategory = new ExpenseCategory({
      name,
      description: description ? description : "",
    });

    const createdExpenseCategory = await expenseCategory.save();
    res.status(201).send({
      message: "Expense category created successfully",
      expenseCategory: createdExpenseCategory,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all expense categories
exports.getAllExpenseCategories = async (req, res) => {
  try {
    const expenseCategories = await ExpenseCategory.find();
    res.status(200).send(expenseCategories);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get an expense category by id
exports.getExpenseCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const expenseCategory = await ExpenseCategory.findById(id);
    res.status(200).send(expenseCategory);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update an expense category
exports.updateExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const expenseCategory = await ExpenseCategory.findById(id);
    if (!expenseCategory) {
      return res.status(404).send("Expense category not found");
    }

    // Find if any expense category already exists with the provided name
    const expenseCategoryByName = await ExpenseCategory.findOne({ name });
    if (expenseCategoryByName && expenseCategoryByName._id.toString() !== id) {
      return res
        .status(400)
        .send("Expense category already exists with the provided name");
    }

    if (expenseCategory) {
      name ? (expenseCategory.name = name) : expenseCategory.name;
      description
        ? (expenseCategory.description = description)
        : expenseCategory.description;

      const updatedExpenseCategory = await expenseCategory.save();

      return res.status(200).send({
        message: "Expense category updated successfully",
        expenseCategory: updatedExpenseCategory,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete an expense category
exports.deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const expenseCategory = await ExpenseCategory.findById(id);
    if (!expenseCategory) {
      return res.status(404).send("Expense category not found");
    }
    await ExpenseCategory.findByIdAndDelete(id);
    res.status(200).send("Expense category deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
